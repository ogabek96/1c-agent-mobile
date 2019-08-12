import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClientsPage } from './clients.page';

import { ClientsService } from './clients.service';

const routes: Routes = [
  {
    path: '',
    component: ClientsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClientsPage],
  providers: [ClientsService]
})
export class ClientsPageModule { }
