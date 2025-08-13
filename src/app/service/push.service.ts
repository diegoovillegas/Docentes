import { Injectable } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor() {}

  initPush() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      
    });

    PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push recibido', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', action => {
      console.log('Push accionado', action);
    });
  }
}
