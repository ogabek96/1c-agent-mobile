import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { Client } from '../models/client';

@Component({
  selector: 'app-orders-form',
  templateUrl: './orders-form.page.html',
  styleUrls: ['./orders-form.page.scss'],
})
export class OrdersFormPage implements OnInit {
  selectedClient: Client;
  addItemCode: number;
  constructor(private route: ActivatedRoute, private router: Router, private barcodeScanner: BarcodeScanner) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.selectedClient = this.router.getCurrentNavigation().extras.state.client;
      }
    });
  }

  async ngOnInit() {

  }
  scanBarcode() {
    this.barcodeScanner.scan()
      .then(barcodeData => {
        if (!barcodeData.cancelled) {
          this.addItemCode = parseInt(barcodeData.text, 10);
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
  addItem() {

  }
}
