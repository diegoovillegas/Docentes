// src/app/pages/alumnos-docente/alumnos-docente.page.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-alumnos-docente',
  templateUrl: './alumnos-docente.page.html',
  styleUrls: ['./alumnos-docente.page.scss'],
  standalone: false
})
export class AlumnosDocentePage implements OnInit {
  alumnos: any[] = [];
  token: string = '';
  isLoading = true;

  constructor(
    private storage: Storage,
    private api: ApiService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.storage.create();
    
    const tokenData = await this.storage.get('token');
    
    if (tokenData?.token) {
      this.token = tokenData.token;
      await this.cargarAlumnos();
    } else {
      this.router.navigate(['/login']);
    }
  }

    async cargarAlumnos() {
    try {
      this.isLoading = true;
      const res = await this.api.getAlumnosPorDocente(this.token); 
      
      // ✅ Corrected: Access the 'data' property of the response object
      this.alumnos = res.data;
      
    } catch (error) {
      console.error('❌ Error obteniendo alumnos del docente:', error);
      this.alumnos = [];
    } finally {
      this.isLoading = false; 
    }
  }

  logout() {
    this.storage.remove('token');
    this.router.navigate(['/login']);
  }
}