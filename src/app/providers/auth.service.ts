import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

import { LoginCredentials } from '../models/login-credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HTTP) { }

  async checkCredentials(loginCredentials: LoginCredentials) {
    this.http.useBasicAuth(loginCredentials.username, loginCredentials.password);
    return this.http.post(loginCredentials.ip + ':' + loginCredentials.port + '/' + loginCredentials.database + '/hs/api/client', {
      username: loginCredentials.username
    }, {});
  }
}
