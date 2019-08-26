import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { AuthService } from '../providers/auth.service';
import { ToastService } from '../providers/toast.service';

import { LoginCredentials } from '../models/login-credentials';

import { Router } from '@angular/router';

import { StorageService } from '../providers/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    public loadingController: LoadingController,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private storageService: StorageService) { }

  loginCredentials: LoginCredentials = {
    ip: '',
    port: '',
    database: '',
    username: '',
    password: ''
  };
  saveButtonEnabled = false;
  async ngOnInit() {
    await this.storageService.read('loginCredentials')
      .then((val: LoginCredentials) => {
        if (val) {
          this.loginCredentials = val;
          this.saveButtonEnabled = true;
        }
      });
  }
  async checkCredentials() {
    // TODO: sign in
    const loading = await this.loadingController.create({
      message: 'Проверка данных'
    });
    await loading.present();
    try {
      const checkCredentials = await this.authService.checkCredentials(this.loginCredentials);
      if (checkCredentials.status === 200) {
        this.toastService.success('Подключения к базе данных успешна.Вы можете сохранить настройки.');
        this.saveButtonEnabled = true;
      }
    } catch (e) {
      console.log(e);
      switch (e.status) {
        case -1:
          this.toastService.error('Ошибка в подключения к интернету.Проверте доступ к интернету.');
          break;
        case 401:
          this.toastService.error('Логин или пароль неправильно.');
          break;
        case 502:
          this.toastService.error('Ошибка в сервере. Код ошибки: ' + e.status);
          break;
        default:
          this.toastService.error('Неизвестная ошибка. Код ошибки: ' + e.status);
      }
    } finally {
      loading.dismiss();
    }
  }

  onChange() {
    this.saveButtonEnabled = false;
  }

  async save() {
    this.storageService.save('loginCredentials', this.loginCredentials);
    this.router.navigateByUrl('/orders');
    this.toastService.success('Успешна сохранена.');
  }
}

