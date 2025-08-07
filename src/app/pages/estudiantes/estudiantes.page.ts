import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.page.html',
  styleUrls: ['./estudiantes.page.scss'],
  standalone:false
})
export class EstudiantesPage {
  alumnos: any[] = [];
  token: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private storage: Storage
  ) {}

  // 🚀 Cuando entra a la vista
  async ionViewWillEnter() {
    await this.storage.create();
    this.token = await this.storage.get('token');

    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const res = await this.api.getAlumnosPaginado(this.token);
      this.alumnos = res;
      console.log('Alumnos cargados:', this.alumnos);
    } catch (error) {
      console.error('❌ Error obteniendo alumnos:', error);
    }
  }

  // 📌 Ver detalle del alumno seleccionado
  verDetalle(alumno: any) {
    this.router.navigate(['/detalle-alumno'], {
      state: { alumno }
    });
  }

  // 📌 Navegar al historial
  irHistorial() {
    this.router.navigate(['/historial']);
  }

  // 📌 Cerrar sesión
  logout() {
    this.storage.remove('token');
    this.router.navigate(['/login']);
  }
}
