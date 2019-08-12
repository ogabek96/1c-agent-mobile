import { Injectable, OnInit } from '@angular/core';

import { ApiService } from '../providers/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersFormService implements OnInit {

  constructor(private apiService: ApiService) { }

  async ngOnInit() {

  }
}
