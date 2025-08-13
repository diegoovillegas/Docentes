import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlumnosDocentePageRoutingModule } from './alumnos-docente-routing.module';

import { AlumnosDocentePage } from './alumnos-docente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlumnosDocentePageRoutingModule
  ],
  declarations: [AlumnosDocentePage]
})
export class AlumnosDocentePageModule {}
