import { Injectable } from '@angular/core';

import { HTTP } from '@ionic-native/http/ngx';

import { StorageService } from './storage.service';
import { LoginCredentials } from '../models/login-credentials';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  loginCredentials: LoginCredentials;
  constructor(private http: HTTP, private storageService: StorageService) { }

  async request({ url, method, data = {} }) {
    await this.storageService.read('loginCredentials')
      .then((val: LoginCredentials) => {
        this.loginCredentials = val;
      });

    this.http.useBasicAuth(this.loginCredentials.username, this.loginCredentials.password);
    this.http.setDataSerializer('json');
    return this.http.sendRequest(this.loginCredentials.ip + ':'
      + this.loginCredentials.port + '/' + this.loginCredentials.database + '/hs/api' + url, {
        method,
        data,
        timeout: 5000
      })
      .then(res => {
        res.data = res.data.slice(1); // fix bug with ﻿ this symbol at the beginning
        return res;
      });
  }
}
