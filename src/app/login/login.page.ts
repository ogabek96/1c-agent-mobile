import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { AuthService } from '../providers/auth.service';
import { ToastService } from '../providers/toast.service';

import { LoginCredentials } from '../models/login-credentials';

import { Router } from '@angular/router';

import { StorageService } from '../providers/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

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

  async ngOnInit() {
  }

  async signIn() {
    // TODO: sign in
    const loading = await this.loadingController.create({
      message: 'Проверка данных'
    });
    await loading.present();
    try {
      const checkCredentials = await this.authService.checkCredentials(this.loginCredentials);
      if (checkCredentials.status === 200) {
        await this.storageService.save('loginCredentials', this.loginCredentials);
        this.router.navigateByUrl('/orders');
      }
    } catch (e) {
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
}
