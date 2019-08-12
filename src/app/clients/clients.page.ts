import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { Client } from '../models/client';
import { ClientsService } from './clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {
  progressBarVisible = true;
  clientsList: Client[] = [];
  clientsSearchList: Client[] = [];
  constructor(private router: Router, private clientsService: ClientsService) { }

  ngOnInit() {
    this.clientsService.getClients()
      .then(clients => {
        this.clientsList = clients;
        this.clientsSearchList = clients;
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        this.progressBarVisible = false;
      });
  }
  selectClient(client) {
    const navigationExtras: NavigationExtras = {
      state: {
        client
      }
    };
    this.router.navigate(['/orders-form'], navigationExtras);
  }
  search(event) {
    this.clientsSearchList = this.clientsList.filter(data => data.name.toLocaleLowerCase().includes(event.target.value.toLowerCase()));
  }
}
