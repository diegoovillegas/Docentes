// src/app/pages/cambiar-password/cambiar-password.page.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
  standalone: false
})
export class CambiarPasswordPage implements OnInit {
  nuevaPassword = '';
  confirmarPassword = '';
  token: string | null = null;
  userId: number | null = null;
  userIdentifier: string | null = null; 
  usuario: any;
  constructor(
    private router: Router,
    private api: ApiService,
    private storage: Storage,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const tokenData = await this.storage.get('token');
    if (tokenData && tokenData.token && tokenData.user) {
      this.token = tokenData.token;
      this.userId = tokenData.user.id;
      this.usuario = tokenData.user
      this.userIdentifier = tokenData.user.username; 
      console.log('este es el usuario',this.usuario)
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  async cambiarPassword() {
  if (!this.nuevaPassword || !this.confirmarPassword) {
    this.presentAlert('Error', 'Por favor, completa ambos campos de contraseña.');
    return;
  }
  if (this.nuevaPassword !== this.confirmarPassword) {
    this.presentAlert('Error', 'Las contraseñas no coinciden. Inténtalo de nuevo.');
    return;
  }

  const loading = await this.loadingController.create({
    message: 'Cambiando contraseña...',
  });
  await loading.present();

  try {
    if (this.token && this.userId && this.userIdentifier) { 
      const userData = {
        password: this.nuevaPassword,
        requirePasswordChange: false,
      };

      await this.api.updateUser(this.userId, userData, this.token);

      // Aquí se destruye el token y se redirige al login
      await this.storage.remove('token');
      this.presentAlert('Éxito', 'Tu contraseña ha sido cambiada correctamente. Por favor, inicia sesión de nuevo.');
      
      // Asegúrate de que el modal se cierre antes de redirigir
      await this.modalController.dismiss();
      this.router.navigateByUrl('/login');
    }
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    this.presentAlert('Error', 'Hubo un problema al cambiar la contraseña. Por favor, inténtalo de nuevo.');
  } finally {
    // Si la operación falla, se cierra el loading.
    // Si tiene éxito, no es necesario cerrarlo aquí porque la página se redirige.
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