import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true, // <-- Corrected: Set to 'true'
  imports: [
    CommonModule, // <-- Corrected: Added CommonModule for pipes like 'date'
    IonHeader,    // <-- Corrected: Imported all required Ionic components
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class HistorialPage {
  historial: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  async ionViewWillEnter() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state;

    const estudianteId = state?.['estudianteId'];
    const token = localStorage.getItem('token');

    if (token && estudianteId) {
      this.historial = await this.api.getHistorialPorEstudiante(token, estudianteId);
    }
  }
}