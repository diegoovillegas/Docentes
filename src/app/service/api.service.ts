import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = environment.urlapi;

  constructor(private storage: Storage) {}

  // Login del usuario
  async login(data: any): Promise<string> {
    const res = await axios.post(`${this.url}/auth/local`, data);
    return res.data.jwt;
  }

  // Obtener todos los alumnos (sin paginar)
  async getAlumnos() {
    const res = await axios.get(`${this.url}/alumnos?populate=*`);
    return res.data.data;
  }

  // Obtener alumnos con paginación y relaciones
  async getAlumnosPaginado(token: string) {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const url = `${this.url}/alumnos?populate[foto]=true&populate[persona_autorizadas][populate][foto]=true&populate[docente][populate][foto]=true`;
    const res = await axios.get(url, { headers });
    return res.data.data;
  }

  // Obtener un alumno por ID (con relaciones)
  async getAlumnoById(token: string, id: string) {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const url = `${this.url}/alumnos/${id}?populate[foto]=true&populate[persona_autorizadas][populate][foto]=true&populate[docente][populate][foto]=true`;
    const res = await axios.get(url, { headers });
    return res.data.data;
  }

  // Confirmar entrega (crear nueva entrega)
  async confirmarEntrega(alumnoId: string) {
    const res = await axios.post(`${this.url}/entregas`, {
      data: { alumno: alumnoId }
    });
    return res.data;
  }

  // Obtener historial general
  async getHistorial(token: string): Promise<any[]> {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      const res = await axios.get(`${this.url}/historial`, { headers });
      return res.data;
    } catch (err) {
      console.error('Error al obtener historial:', err);
      return [];
    }
  }

async getHistorialPorEstudiante(token: string, estudianteId: string): Promise<any[]> {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const url = `${this.url}/historial/estudiante/${estudianteId}?populate=*`;
    const res = await axios.get(url, { headers });
    return res.data.data;
  } catch (err) {
    console.error('Error al obtener historial por estudiante:', err);
    return [];
  }
}
}
