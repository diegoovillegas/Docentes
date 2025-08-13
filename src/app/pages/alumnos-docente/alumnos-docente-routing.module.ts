import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlumnosDocentePage } from './alumnos-docente.page';

const routes: Routes = [
  {
    path: '',
    component: AlumnosDocentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlumnosDocentePageRoutingModule {}
