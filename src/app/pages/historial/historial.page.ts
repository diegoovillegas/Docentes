import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Storage } from '@ionic/storage-angular';

interface HistorialItem {
  id: number;
  nombre_entrega: string;
  descripcion: string;
  fecha_entrega: string; 
  status: string;
  alumno: {
    documentId: number;
    nombre: string;
    apellido: string;
  };
}

interface Alumno {
  documentId: number;
  nombre: string;
  apellido: string;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false
})
export class HistorialPage implements OnInit {
  historial: HistorialItem[] = [];
  filteredHistorial: HistorialItem[] = []; // Nuevo array para mostrar resultados de búsqueda
  alumnosMap: Map<number, string> = new Map();
  isLoading = true;
  token: string = '';
  searchTerm: string = ''; // Nueva variable para el término de búsqueda

  constructor(private storage: Storage, private api: ApiService) {}

  async ngOnInit() {
    await this.storage.create();
    const tokenData = await this.storage.get('token');
    
    if (tokenData?.token) {
      this.token = tokenData.token;
      
      try {
        const alumnos: Alumno[] = await this.api.getAlumnosPaginado(this.token);
        if (alumnos) {
          alumnos.forEach((alumno: Alumno) => {
            this.alumnosMap.set(alumno.documentId, `${alumno.nombre} ${alumno.apellido}`);
          });
        }

        const entregas: HistorialItem[] = await this.api.getEntregas(this.token);
        this.historial = entregas || [];
        this.filteredHistorial = this.historial; // Inicialmente, la lista filtrada es toda la lista
      } catch (error) {
        console.error('❌ Error al cargar el historial:', error);
      }
    }
    
    this.isLoading = false;
  }

  getAlumnoNombre(id: number): string {
    return this.alumnosMap.get(id) || 'Alumno desconocido';
  }

  // Método para filtrar el historial basado en el término de búsqueda
  filterHistorial() {
    if (this.searchTerm.trim() === '') {
      this.filteredHistorial = this.historial;
    } else {
      this.filteredHistorial = this.historial.filter(item => {
        const nombreCompleto = this.getAlumnoNombre(item.alumno.documentId).toLowerCase();
        return nombreCompleto.includes(this.searchTerm.toLowerCase());
      });
    }
  }
}