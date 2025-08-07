import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  constructor(
    private api: ApiService,
    private storage: Storage,
    private route: Router,
    private alertController: AlertController
  ) {}

  username = "";
  password = "";

  async ngOnInit() {
    await this.storage.create();
  }

  async login() {
    if (!this.username || !this.password) {
      this.presentAlert('Campos incompletos', 'Por favor, ingresa tu nombre de usuario y contraseña.');
      return;
    }

    const data = {
      identifier: this.username,
      password: this.password
    };

    try {
      const jwt = await this.api.login(data);
      console.log('Token recibido:', jwt);
      await this.storage.set('token', jwt); 
      this.route.navigateByUrl('/estudiantes');
    } catch (error) {
      console.error('Error en login:', error);
      this.presentAlert('Error de inicio de sesión', 'Usuario o contraseña incorrectos.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
