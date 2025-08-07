import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
@Component({
  selector: 'app-detalle-estudiante',
  templateUrl: './detalle-estudiante.page.html',
  styleUrls: ['./detalle-estudiante.page.scss'],
  standalone:false
})
export class DetalleEstudiantePage {
  alumno: any;
  confirmado = false;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {}

 async ionViewWillEnter() {
  const id = this.route.snapshot.paramMap.get('id');
  const token = localStorage.getItem('token');
  if (token && id) {
    const res = await this.api.getAlumnoById(token, id);
    this.alumno = res; // Esto contiene { data: { id, attributes: { ... } } }
  }
}


async confirmar() {
  const alumnoId = this.alumno?.data?.id;

  if (!alumnoId) {
    console.error('No se encontró el ID del alumno.');
    return;
  }

  await this.api.confirmarEntrega(alumnoId);
  this.confirmado = true;
}


verHistorial() {
  const estudianteId = this.alumno?.data?.id; // Acceder al ID del alumno
  
  if (estudianteId) {
    this.router.navigate(['/historial'], {
      state: { estudianteId: estudianteId }
    });
  } else {
    console.error('No se encontró el ID del estudiante para ver el historial.');
  }
}

}
