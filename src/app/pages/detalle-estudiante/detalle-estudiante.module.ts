import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleEstudiantePageRoutingModule } from './detalle-estudiante-routing.module';

import { DetalleEstudiantePage } from './detalle-estudiante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleEstudiantePageRoutingModule
  ],
  declarations: [DetalleEstudiantePage]
})
export class DetalleEstudiantePageModule {}
