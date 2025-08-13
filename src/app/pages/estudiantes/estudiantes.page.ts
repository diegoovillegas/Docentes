// src/app/pages/estudiantes/estudiantes.page.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/service/api.service';
import { ModalController } from '@ionic/angular';
import { CambiarPasswordPage } from '../cambiar-password/cambiar-password.page';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.page.html',
  styleUrls: ['./estudiantes.page.scss'],
  standalone: false
})
export class EstudiantesPage implements OnInit {
  alumnos: any[] = [];
  token: string = '';
  usuario: any;
  lastConfirmationDates: { [documentId: string]: string } = {};

  constructor(
    private storage: Storage,
    private api: ApiService,
    private router: Router,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    await this.storage.create();
    
    const tokenData = await this.storage.get('token');
    
    if (tokenData?.token && tokenData?.user) {
      this.token = tokenData.token;
      this.usuario = tokenData.user;
    } else {
      this.router.navigate(['/login']);
      return;
    }

    if (this.usuario.requirePasswordChange) {
      this.presentPasswordModal();
    }
    
    this.lastConfirmationDates = await this.storage.get('lastConfirmationDates') || {};
    await this.cargarAlumnos();
  }

  async presentPasswordModal() {
    const modal = await this.modalController.create({
      component: CambiarPasswordPage,
      backdropDismiss: false 
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.passwordChanged) {
      const updatedTokenData = await this.storage.get('token');
      if (updatedTokenData) {
        this.usuario = updatedTokenData.user;
      }
    }
  }

  async cargarAlumnos() {
    try {
      const res = await this.api.getAlumnosPaginado(this.token);
      
      // Obtiene la fecha actual en el mismo formato
      const today = new Date().toISOString().split('T')[0];
      
      // Filtra la lista de alumnos para excluir a los que ya fueron confirmados hoy
      this.alumnos = res.filter((alumno: any) => {
        const lastConfirmationDate = this.lastConfirmationDates[alumno.documentId];
        return lastConfirmationDate !== today;
      });
      
    } catch (error) {
      console.error('❌ Error obteniendo alumnos:', error);
    }
  }

  async confirmarLlegada(alumno: any) {
    if (!alumno?.documentId) {
      console.error('Alumno sin ID');
      return;
    }

    try {
      const data = {
        nombre_entrega: this.usuario.username,
        descripcion: 'Se entregó el alumno',
        fecha_entrega: new Date(),
        estado: 'Aprobado',
        alumno: alumno.documentId
      };

      await this.api.confirmarEntrega(data, this.token);
      
      this.alumnos = this.alumnos.filter(a => a.documentId !== alumno.documentId);

      const today = new Date().toISOString().split('T')[0];
      this.lastConfirmationDates[alumno.documentId] = today;
      await this.storage.set('lastConfirmationDates', this.lastConfirmationDates);

      const historialEntry = {
        id: alumno.documentId,
        nombre_entrega: this.usuario.username,
        descripcion: 'Se entregó el alumno',
        fecha_entrega: new Date().toISOString(),
        status: 'Aprobado'
      };

      await this.agregarAlHistorial(historialEntry);
    } catch (error) {
      console.error('❌ Error confirmando entrega:', error);
    }
  }

  async agregarAlHistorial(entrada: any) {
    let historial = (await this.storage.get('historial')) || [];
    historial.unshift(entrada);
    await this.storage.set('historial', historial);
  }

  irHistorial(alumno?: any) {
    if (alumno) {
      this.router.navigate(['/historial'], { state: { alumno } });
    } else {
      this.router.navigate(['/historial']);
    }
  }
  
  async logout() {
    await this.storage.remove('token');
    this.router.navigate(['/login']);
  }

  isConfirmationDisabled(alumnoDocumentId: string): boolean {
    const lastDate = this.lastConfirmationDates[alumnoDocumentId];
    if (!lastDate) {
      return false;
    }
    const today = new Date().toISOString().split('T')[0];
    return lastDate === today;
  }
}