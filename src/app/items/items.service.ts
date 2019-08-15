import { Injectable } from '@angular/core';

import { ApiService } from '../providers/api.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  constructor(private apiService: ApiService) { }

  async getItem(code) {
    return this.apiService.request({
      url: '/prod',
      method: 'post',
      data: code.length >= 8 ? { barcode: code } : { code }
    })
      .then((res) => {
        return JSON.parse(res.data);
      });
  }
}
