import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/service/api.service';
import { ModalController, ToastController } from '@ionic/angular';
import { CambiarPasswordPage } from '../cambiar-password/cambiar-password.page';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.page.html',
  styleUrls: ['./estudiantes.page.scss'],
  standalone: false,
})
export class EstudiantesPage implements OnInit {
  alumnos: any[] = [];
  token: string = '';
  usuario: any;
  lastConfirmationDates: { [documentId: string]: string } = {};
  isLoading = true;

  constructor(
    private storage: Storage,
    private api: ApiService,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    console.log('📲 Inicializando EstudiantesPage');

    await this.storage.create();
    
    const tokenData = await this.storage.get('token');

    if (tokenData?.token) {
      this.token = tokenData.token;
      try {
        this.usuario = await this.api.getMe(this.token);
      } catch (error) {
        console.error('❌ Error al obtener el usuario de la API:', error);
        this.router.navigate(['/login']);
        return;
      }
    } else {
      this.router.navigate(['/login']);
      return;
    }

    if (this.usuario.requirePasswordChange) {
      await this.presentPasswordModal();
    }

    this.lastConfirmationDates = await this.storage.get('lastConfirmationDates') || {};

    await this.cargarAlumnos();
  }

  async presentPasswordModal() {
    const modal = await this.modalController.create({
      component: CambiarPasswordPage,
      backdropDismiss: false,
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.passwordChanged) {
      try {
        this.usuario = await this.api.getMe(this.token);
        const updatedTokenData = await this.storage.get('token');
        if (updatedTokenData) {
          this.usuario = updatedTokenData.user;
        }
      } catch (error) {
        console.error('❌ Error al actualizar usuario después de cambiar contraseña:', error);
      }
    }
  }

  async cargarAlumnos() {
    try {
      this.isLoading = true;
      const res = await this.api.getAlumnosPorDocente(this.token);

      const today = new Date().toISOString().split('T')[0];

      this.alumnos = res.filter((alumno: any) => {
        const lastConfirmationDate = this.lastConfirmationDates[alumno.id];
        return lastConfirmationDate !== today;
      });
      
      console.log('✅ Alumnos cargados:', this.alumnos);
      
    } catch (error) {
      console.error('❌ Error obteniendo alumnos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async confirmarLlegada(alumno: any) {
    if (!alumno?.id) {
      console.error('Alumno sin ID');
      return;
    }

    try {
      const docenteId = this.usuario?.docente?.id;
      if (!docenteId) {
        console.error('No se encontró el ID del docente en el usuario.');
        return;
      }

      const llegadaData = {
        horaEntrega: new Date().toISOString(),
        alumno: alumno.id,
        docente: docenteId,
        estado:'Entregado'
      };

      await this.api.postLlegada(llegadaData, this.token);

      this.alumnos = this.alumnos.filter((a) => a.id !== alumno.id);

      const today = new Date().toISOString().split('T')[0];
      this.lastConfirmationDates[alumno.id] = today;
      await this.storage.set('lastConfirmationDates', this.lastConfirmationDates);

      const toast = await this.toastController.create({

        message: `Llegada de ${alumno.nombre} ${alumno.apellido} confirmada con éxito.`,
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      console.error('❌ Error confirmando llegada:', error);
      const toast = await this.toastController.create({
        message: 'Error al confirmar llegada. Inténtalo de nuevo.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
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

  isConfirmationDisabled(alumnoId: string): boolean {
    const lastDate = this.lastConfirmationDates[alumnoId];
    if (!lastDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return lastDate === today;
  }
}