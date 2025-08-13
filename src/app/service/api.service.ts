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

  async login(data: any) {
    const res = await axios.post(this.url + '/auth/local', data);
    const { jwt, user } = res.data;

    const userRes = await axios.get(this.url + '/users/me?populate[role]=true', {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    return {
      token: jwt,
      user: userRes.data
    };
  }

  async getAlumnos() {
    const res = await axios.get(`${this.url}/alumnos?populate=*`);
    return res.data.data;
  }

  async getAlumnosPaginado(token: string) {
    const headers = { Authorization: `Bearer ${token}` };
    const url = `${this.url}/alumnos?populate[foto]=true&populate[persona_autorizadas][populate][foto]=true&populate[docente][populate][foto]=true`;
    const res = await axios.get(url, { headers });
    return res.data.data;
  }

  async confirmarEntrega(data: any, token: string) {
    const res = await axios.post(`${this.url}/entregases`, {data}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  }

  async getMe(token: string) {
    const res = await axios.get(`${this.url}/users/me?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  }

 

async getEntregas(token: string) {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.get(`${this.url}/entregases?populate=*`, { headers });
    return res.data.data || []; 
    
  } catch (err) {
    console.error('❌ Error al obtener el historial de entregas:', err);
    return [];
  }
}

  
  async getHistorial(token: string): Promise<any[]> {
    return []; 
  }

  async getHistorialPorEstudiante(token: string, estudianteId: string): Promise<any[]> {
    return []; 
  }

  async updateUser(userId: number, userData: any, token: string) {
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.put(`${this.url}/users/${userId}`, userData, { headers });
    return res.data;
  }

  async getAlumnosPorDocente(token: string): Promise<any> {
  try {
    const response = await axios.get(`${this.url}/alumnos`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        // ✅ Se añade el parámetro 'populate' para traer la foto del alumno
        'populate[foto]': true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener alumnos del docente:', error);
    throw error;
  }
}
}
  

