import { Injectable } from '@angular/core';

import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';

import { StorageService } from './storage.service';
import { LoginCredentials } from '../models/login-credentials';

import { ToastService } from '../providers/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  loginCredentials: LoginCredentials;
  constructor(private http: HTTP, private storageService: StorageService, private toastService: ToastService) { }

  async request({ url, method, data = {} }) {
    await this.storageService.read('loginCredentials')
      .then((val: LoginCredentials) => {
        this.loginCredentials = val;
      });
    const newData = Object.assign({ username: this.loginCredentials.username }, data);
    this.http.useBasicAuth(this.loginCredentials.username, this.loginCredentials.password);
    this.http.setDataSerializer('json');
    return this.http.sendRequest(this.loginCredentials.ip + ':'
      + this.loginCredentials.port + '/' + this.loginCredentials.database + '/hs/api' + url, {
        method,
        data: newData,
        timeout: 5000
      })
      .then(res => {
        res.data = res.data.slice(1); // fix bug with ﻿ this symbol at the beginning
        return res;
      })
      .catch((e) => {
        this.toastService.error('Ошибка соединение с сервером.Проверьте настройки или подключение к сети.Код ошибки: ' + e.status);
        return e;
      });
  }
}
