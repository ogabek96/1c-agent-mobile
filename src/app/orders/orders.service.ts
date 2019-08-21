import { Injectable } from '@angular/core';

import { ApiService } from '../providers/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private apiService: ApiService) {
  }
  saveOrder(data) {
    return this.apiService.request({
      url: '/docs',
      method: 'post',
      data
    });
  }
}
