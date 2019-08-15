import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { Client } from '../models/client';

import { ItemsService } from '../items/items.service';
import { ToastService } from '../providers/toast.service';

@Component({
  selector: 'app-orders-form',
  templateUrl: './orders-form.page.html',
  styleUrls: ['./orders-form.page.scss'],
})
export class OrdersFormPage implements OnInit {
  selectedClient: Client;
  selectedPrice: number;
  addItemCode: number;
  addItemLoading = false;
  addedItems = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    private itemsService: ItemsService,
    private toastService: ToastService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.selectedClient = this.router.getCurrentNavigation().extras.state.client;
      }
    });
  }

  async ngOnInit() {

  }
  async scanBarcode() {
    this.addItemCode = null;
    await this.barcodeScanner.scan()
      .then(barcodeData => {
        if (!barcodeData.cancelled) {
          this.addItemCode = parseInt(barcodeData.text, 10);
        }
      })
      .catch(e => {
        console.log(e);
      });
    if (this.addItemCode) {
      await this.addItem();
    }
  }
  addItem() {
    this.addItemLoading = true;
    return this.itemsService.getItem(this.addItemCode)
      .then((res) => {
        if (res.code !== 0 || !res.result) {
          this.toastService.error('Товар не найден.');
          return;
        }
        res.result.count = 1;
        const foundItem = this.addedItems.find(item => item.code === res.result.code);
        if (foundItem) {
          foundItem.count++;
        } else {
          this.addedItems.push(res.result);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        this.addItemLoading = false;
      });
  }
  incQnty(item) {
    if ((item.remain[0].qty + item.remain[1].qty) > item.count) {
      item.count++;
    }
  }
  decQnty(item) {
    if (item.count > 1) {
      item.count--;
    }
  }
  deleteItem(item) {
    const index = this.addedItems.indexOf(item);
    this.addedItems.splice(index, 1);
  }
}
