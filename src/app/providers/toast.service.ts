import { Injectable } from '@angular/core';

import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  async error(message: string) {
    const toast = await this.toastController.create({
      message,
      animated: true,
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

  async success(message: string) {
    const toast = await this.toastController.create({
      message,
      animated: true,
      color: 'dark',
      duration: 2000
    });
    toast.present();
  }
}
