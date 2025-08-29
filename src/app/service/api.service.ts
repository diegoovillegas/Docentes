import { Injectable } from '@angular/core';
import axios, { AxiosHeaders } from 'axios';
import { environment } from 'src/environments/environment.prod';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = environment.urlapi;

  constructor(private storage: Storage) { }

  async login(data: any) {
    const res = await axios.post(this.url + '/auth/local', data);
    const { jwt } = res.data;

    const userRes = await axios.get(this.url + '/users/me?populate=*', {
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

  async getMe(token: string) {
    const res = await axios.get(`${this.url}/users/me?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  }

  async getEntregas(token: string): Promise<any[]> {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${this.url}/entregases?populate=*`, { headers });
      return res.data.data || [];
    } catch (err) {
      console.error('❌ Error al obtener historial de entregas:', err);
      return [];
    }
  }

  async getEntregasPorEstudiante(token: string, estudianteId: string): Promise<any[]> {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(
        `${this.url}/entregases?filters[alumno][id][$eq]=${estudianteId}&populate=*`,
        { headers }
      );
      return res.data.data || [];
    } catch (err) {
      console.error('❌ Error al obtener historial del estudiante:', err);
      return [];
    }
  }

    async putToken_push(userId: number, token: any) {
      console.log('este es el usuario',token)
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.put(`${this.url}/docentes/${userId}`, {data: {token_push: token}});
    return res.data;
  }

  async updateUser(userId: number, userData: any, token: string) {
    
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.put(`${this.url}/users/${userId}`, userData, { headers });
    return res.data;
  }

  async getAlumnosByDocente(id: any, token: string) {
    let options = new AxiosHeaders({
      'Authorization': 'Bearer ' + token
    });
    return await axios.get(this.url + `/users/${id}?populate=*`, {headers: options})
    
  }

    updateLlegada(llegadaId: number, data: any, token: string) {
  return axios.put(`${this.url}/llegadas/${llegadaId}`, {data}, {
    headers: { Authorization: `Bearer ${token}` }
  });
}


 async getAlumnosPorDocente(token: string){
    try {
      const user = await this.getMe(token);
      const userId = user.documentId;
      console.log(user)

      const docenteRes = await axios.get(
        `${this.url}/docentes?filters[user][documentId][$eq]=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      

      const docente = docenteRes.data.data[0];
      if (!docente) {
        console.error('❌ No se encontró un docente asociado a este usuario.');
        return [];
      }

      console.log('docente', docente)

      const docenteId = docente.documentId;
      console.log('este es el id',docenteId)
      const alumnosRes = await axios.get(
        `${this.url}/alumnos?filters[docente][documentId][$eq]=${docenteId}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('✅ Alumnos encontrados:', alumnosRes.data);
      return alumnosRes.data.data;
    } catch (error) {
      console.error('❌ Error al obtener alumnos del docente:', error);
      return [];
    }
  }

  async getLlegadas(token: string): Promise<any[]> {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${this.url}/llegadas?populate[alumno]=true&populate[docente]=true&populate[persona_autorizada]=true`, { headers });
      return res.data.data || [];
    } catch (error) {
      console.error('❌ Error obteniendo historial de llegadas:', error);
      return [];
    }
  }

  async postLlegada(data: any, token: string): Promise<any> {
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.post(`${this.url}/llegadas`, { data }, { headers });
    return res.data;
  }

  // Se agregaron estos dos nuevos métodos.
  async getDocentes(token: string): Promise<any[]> {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${this.url}/docentes?populate=*`, { headers });
      return res.data.data || [];
    } catch (error) {
      console.error('❌ Error al obtener la lista de docentes:', error);
      return [];
    }
  }

  async getPersonasAutorizadas(token: string): Promise<any[]> {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${this.url}/persona-autorizadas?populate=*`, { headers });
      return res.data.data || [];
    } catch (error) {
      console.error('❌ Error al obtener la lista de personas autorizadas:', error);
      return [];
    }
  }

  async updateDocenteByDocumentId(documentId: string, data: any, token: string) {
    try {
      const response = await axios.put(
        `${this.url}/docentes/${documentId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Error en updateDocenteByDocumentId:', error);
      throw error;
    }
  }

}