import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  async showAlert(header, sutitle, message){

    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: sutitle,
      message: message,
      buttons: [
        {
          text: 'Continuar',
          handler: () => {}
        }
      ]
    });
    await alert.present();

  }

  async showToast(message){

    const toast = await this.toastCtrl.create({
      message: message, 
      duration: 300,
      mode: 'ios',
      buttons: [
        {
        text: 'Continuar', handler: () => {}
      }
    ]});
    await toast.present();
  }

  async showLoadig(){
    const loading = await this.loadingCtrl.create({
      message: 'Carregando',
    });
    return loading;
  }

}
