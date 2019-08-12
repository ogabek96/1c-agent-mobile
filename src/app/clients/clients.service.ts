import { Injectable } from '@angular/core';

import { ApiService } from '../providers/api.service';

import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private apiService: ApiService) { }

  async getClients(): Promise<Client[]> {
    return this.apiService.request({
      url: '/client',
      method: 'post'
    })
      .then((res) => {
        return JSON.parse(res.data) as Client[];
      });
  }
}
