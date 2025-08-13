// src/app/pages/login/login.page.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage implements OnInit {
  identifier = '';
  password = '';

  constructor(
    private router: Router,
    private api: ApiService,
    private storage: Storage,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.storage.create();
  }

  async login() {
    if (!this.identifier || !this.password) {
      this.presentAlert('Error', 'Por favor, ingresa tu usuario y contraseña.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    try {
      const res = await this.api.login({
        identifier: this.identifier,
        password: this.password,
      });

      if (res?.token && res?.user) {
        await this.storage.set('token', res);
        
        
        this.router.navigateByUrl('/estudiantes');
        
        
      } else {
        this.presentAlert('Error', 'Token o usuario no recibidos.');
      }

    } catch (error) {
      console.error('Error en login:', error);
      this.presentAlert('Error', 'Usuario o contraseña incorrectos.');
    } finally {
      await loading.dismiss();
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}