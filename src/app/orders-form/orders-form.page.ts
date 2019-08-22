import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { SQLite } from '@ionic-native/sqlite/ngx';

import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { Client } from '../models/client';

import { ItemsService } from '../items/items.service';
import { ToastService } from '../providers/toast.service';
import { EventEmitterService } from '../event-emitter.service';
import { OrdersService } from '../orders/orders.service';
import { ClientsService } from '../clients/clients.service';

import { OrdersRepository } from '../providers/orders.repository';
import { Order } from '../models/order';

@Component({
  selector: 'app-orders-form',
  templateUrl: './orders-form.page.html',
  styleUrls: ['./orders-form.page.scss'],
})
export class OrdersFormPage implements OnInit {
  progressBarVisible = true;
  ordersRespository: OrdersRepository;
  orderId;
  isEdit = false;
  isView = false;
  selectedClient: Client;
  selectedPriceType: number = undefined;
  priceTypes: [];
  addItemCode: number;
  addItemLoading = false;
  addedItems = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    public loadingController: LoadingController,
    private itemsService: ItemsService,
    private toastService: ToastService,
    private ordersService: OrdersService,
    private clientService: ClientsService,
    private sqlite: SQLite,
    private eventEmitterService: EventEmitterService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.selectedClient = this.router.getCurrentNavigation().extras.state.client;
      }
    });
    this.ordersRespository = OrdersRepository.getInstance(this.sqlite, this.eventEmitterService);
  }

  async ngOnInit() {
    this.orderId = this.route.snapshot.queryParams.orderId;
    if (this.orderId) {
      await this.fillForm(this.orderId);
    }
    await this.clientService.getPriceTypes()
      .then(res => {
        this.priceTypes = res;
      });
    this.progressBarVisible = false;
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
          this.addItemCode = null;
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
  async saveOrder() {
    switch (true) {
      case !this.selectedClient:
        await this.toastService.error('Клиент не выбран.');
        return;
      case !this.selectedPriceType === undefined:
        await this.toastService.error('Тип цены не выбран.');
        return;
      case this.addedItems.length < 1:
        await this.toastService.error('Вы не добавили товар.');
        return;
    }
    const loading = await this.loadingController.create({
      message: 'Сохранение данных'
    });
    await loading.present();
    return this.ordersService.saveOrder({
      type: 'sale',
      client: this.selectedClient.code,
      stock: null,
      details: this.addedItems.map(itm => {
        return {
          code: itm.code,
          qty: itm.count,
          total: this.totalCost
        };
      })
    })
      .then(() => {
        return this.ordersRespository.create({
          client: this.selectedClient,
          totalCost: this.totalCost,
          items: this.addedItems,
          date: new Date().getTime() / 1000,
          priceType: this.selectedPriceType,
          isUploaded: true
        })
          .then(async () => {
            if (this.isEdit) {
              await this.ordersRespository.deleteByPk(this.orderId);
            }
            this.router.navigateByUrl('/orders');
            this.eventEmitterService.dbChange();
            await this.toastService.message('Заказ успешно создан.', 'success', 'middle');
          });
      })
      .catch(async () => {
        await this.loadingController.dismiss();
        await this.toastService.error('Ошибка в сохранении данных.Повторите попытку.');
      })
      .finally(async () => {
        await this.loadingController.dismiss();
      });
  }
  get totalCost() {
    return this.addedItems.reduce((total, itm) => {
      return total + itm.count * itm.prices[this.selectedPriceType].price;
    }, 0).toFixed(2);
  }
  async saveAsDraft() {
    switch (true) {
      case !this.selectedClient:
        await this.toastService.error('Клиент не выбран.');
        return;
      case this.selectedPriceType === undefined:
        await this.toastService.error('Тип цены не выбран.');
        return;
      case this.addedItems.length < 1:
        await this.toastService.error('Вы не добавили товар.');
        return;
    }
    const loading = await this.loadingController.create({
      message: 'Сохранение данных'
    });
    await loading.present();
    return this.ordersRespository.create({
      client: this.selectedClient,
      totalCost: this.totalCost,
      items: this.addedItems,
      date: new Date().getTime() / 1000,
      priceType: this.selectedPriceType,
      isUploaded: false
    })
      .then(async () => {
        this.router.navigateByUrl('/orders');
        this.eventEmitterService.dbChange();
        await this.toastService.message('Заказ успешно сохранен в черновик.', 'dark', 'middle');
      })
      .catch(e => {
        console.log(e);
      })
      .finally(async () => {
        await loading.dismiss();
      });
  }
  async fillForm(orderId) {
    await this.ordersRespository.findByPk(orderId)
      .then((order: Order) => {
        this.selectedClient = order.client;
        this.selectedPriceType = order.priceType;
        this.addedItems = order.items;
        if (order.isUploaded) {
          this.isView = true;
        } else {
          this.isEdit = true;
        }
      });
  }
}
