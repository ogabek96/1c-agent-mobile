import { Injectable } from '@angular/core';

import { ApiService } from '../providers/api.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  constructor(private apiService: ApiService) { }

  async getItems(code) {
    this.apiService.request({
      url: '/prod',
      method: 'post',
      data: code.length >= 8 ? { barcode: code } : { code }
    });
  }
}
