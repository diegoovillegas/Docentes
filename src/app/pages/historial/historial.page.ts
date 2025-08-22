import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Storage } from '@ionic/storage-angular';

interface Alumno {
  documentId: number;
  nombre: string;
  apellido: string;
}

interface Docente {
  documentId: number;
  nombre: string;
  apellido: string;
}

interface PersonaAutorizada {
  documentId: number;
  nombre: string;
  apellido: string;
}


interface Llegada {
  documentId: number;
  horaLlegada: string;
  horaEntrega: string;
  alumno: {
    documentId: number;
  } | null;
  docente: {
    documentId: number;
  } | null;
  persona_autorizada: {
    documentId: number;
  } | null;
  estado: string;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false
})
export class HistorialPage implements OnInit {
  historial: Llegada[] = [];
  filteredHistorial: Llegada[] = [];
  alumnosMap: Map<number, string> = new Map();
  docentesMap: Map<number, string> = new Map();
  personasAutorizadasMap: Map<number, string> = new Map();
  isLoading = true;
  token: string = '';
  searchTerm: string = '';

  constructor(private storage: Storage, private api: ApiService) {}

  async ngOnInit() {
    await this.storage.create();
    const tokenData = await this.storage.get('token');

    if (tokenData?.token) {
      this.token = tokenData.token;

      try {
        await this.loadCatalogs();
        const llegadas: Llegada[] = await this.api.getLlegadas(this.token);
        this.historial = llegadas || [];
        this.filteredHistorial = [...this.historial];
      } catch (error) {
        console.error('❌ Error al cargar el historial de llegadas:', error);
      }
    }

    this.isLoading = false;
  }

  async loadCatalogs() {
    const alumnos: Alumno[] = await this.api.getAlumnosPaginado(this.token);
    if (alumnos) {
      alumnos.forEach((alumno: Alumno) => {
        this.alumnosMap.set(alumno.documentId, `${alumno.nombre} ${alumno.apellido}`);
      });
    }

    const docentes: Docente[] = await this.api.getDocentes(this.token);
    if (docentes) {
      docentes.forEach((docente: Docente) => {
        this.docentesMap.set(docente.documentId, `${docente.nombre} ${docente.apellido}`);
      });
    }

    const personas: PersonaAutorizada[] = await this.api.getPersonasAutorizadas(this.token);
    if (personas) {
      personas.forEach((persona: PersonaAutorizada) => {
        this.personasAutorizadasMap.set(persona.documentId, `${persona.nombre} ${persona.apellido}`);
      });
    }
  }

  getNombre(map: Map<number, string>, documentId: number | undefined): string {
    if (documentId === null || documentId === undefined) {
      return 'Desconocido';
    }
    return map.get(documentId) || 'Desconocido';
  }

  filterHistorial() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term === '') {
      this.filteredHistorial = [...this.historial];
    } else {
      this.filteredHistorial = this.historial.filter(item => {
        // ✅ CORRECCIÓN: Se agrega ?. para evitar errores si la relación es nula.
        const alumnoNombre = this.getNombre(this.alumnosMap, item.alumno?.documentId).toLowerCase();
        const docenteNombre = this.getNombre(this.docentesMap, item.docente?.documentId).toLowerCase();
        const personaNombre = this.getNombre(this.personasAutorizadasMap, item.persona_autorizada?.documentId).toLowerCase();
        const estado = item.estado.toLowerCase();

        return alumnoNombre.includes(term) || docenteNombre.includes(term) || personaNombre.includes(term) || estado.includes(term);
      });
    }
  }
}