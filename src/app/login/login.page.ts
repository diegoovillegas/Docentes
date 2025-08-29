// src/app/pages/login/login.page.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController, LoadingController } from '@ionic/angular';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  identifier = '';
  password = '';
  token_push: any;

  constructor(
    private router: Router,
    private api: ApiService,
    private storage: Storage,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private platform: Platform
  ) {
    if (this.platform.is('capacitor')) this.initpush()
   }

  async ngOnInit() {
    
    await this.storage.create();
    await this.getTokenFcm();
    await this.initpush()
  }

  async getTokenFcm(){
    this.token_push =  await this.storage.get('token_FCM');
    console.log(this.token_push)
  }

    async login(){
    if (!this.identifier || !this.password) {
      this.presentAlert('Campos incompletos', 'Por favor, ingresa tu nombre de usuario y contraseña.');
      return; 
    }
    const data = {
      identifier:this.identifier,
      password: this.password
    }

    this.api.login(data).then( (res:any) =>{
        console.log(res);
        this.storage.set('token', res)
        const documentId = res.user?.docente?.documentId
        
      this.api.putToken_push(documentId, this.token_push).then((res) => {
        console.log(res)
      }).catch((error) => {
        console.log(error)
      })
        this.router.navigateByUrl('/estudiantes')
      }).catch((error)=>{
        console.log(error);
        this.presentAlert('Campos incompletos', 'Por favor, ingresa tu nombre de usuario y contraseña.');
      })
  }

// async login() {
//   if (!this.identifier || !this.password) {
//     this.presentAlert('Error', 'Por favor, ingresa tu usuario y contraseña.');
//     return;
//   }

//   const loading = await this.loadingController.create({
//     message: 'Iniciando sesión...',
//   });
//   await loading.present();

//   try {
//     console.log(this.identifier, this.password)
//     const res = await this.api.login({
//       identifier: this.identifier,
//       password: this.password,
//     });
//     const documentId = res.user?.docente?.documentId
//     console.log('este es el resultado',res)

//       await this.api.putToken_push(documentId, this.token_push).then((res) => {
//         console.log(res)
//       }).catch((error) => {
//         console.log(error)
//       })

//     if (res?.token && res?.user) {
//       const tokenAuth = res.token; 
//       await this.storage.set('token', tokenAuth);
//       await this.storage.set('user', res.user);

//       const documentId = res.user?.docente?.documentId;

//         this.router.navigateByUrl('/estudiantes');

      

//     } else {
//       this.presentAlert('Error', 'Token o usuario no recibidos.');
//     }

//   } catch (error) {
//     console.error('Error en login:', error);
//     this.presentAlert('Error', 'Usuario o contraseña incorrectos.');
//   } finally {
//     await loading.dismiss();
//   }
// }

initpush() {
  // Solo ejecutar si es iOS o Android
  const platform = Capacitor.getPlatform();
  if (platform === 'ios' || platform === 'android') {
    console.log('Initializing HomePage (mobile)');

    // Solicitar permisos para notificaciones push
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.log('Permiso denegado para notificaciones push');
      }
    });

    // Registro exitoso
    PushNotifications.addListener('registration', (token: Token) => {
      this.token_push = token.value;
    });

    // Error en registro
    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    // Notificación recibida
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      alert(
        `📩 Nueva Notificación\n` +
        `---------------------------\n` +
        `Título: ${notification.title || 'Llegando'}\n` +
        `Cuerpo: ${notification.body || 'Sin contenido'}`
      );
    });

    // Acción al tocar la notificación
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      alert('Push action performed: ' + JSON.stringify(notification));
    });
  } else {
    console.log('Push notifications solo disponibles en móvil, no en web.');
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