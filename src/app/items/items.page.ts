import { Component, OnInit } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { ItemsService } from './items.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  barcode = '';
  constructor(private barcodeScanner: BarcodeScanner, private itemsService: ItemsService) { }

  ngOnInit() {
  }
  scanBarcode() {
    this.barcodeScanner.scan()
      .then(barcodeData => {
        if (!barcodeData.cancelled) {
          this.barcode = barcodeData.text;
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
}
