import { Component, OnInit } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { EventEmitterService } from '../event-emitter.service';
import { OrdersRepository } from '../providers/orders.repository';
import { Order } from '../models/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})

export class OrdersPage implements OnInit {
  ordersRespository: OrdersRepository;
  ordersList: Order[] = [];
  constructor(private sqlite: SQLite, private eventEmitterService: EventEmitterService) {
    this.ordersRespository = OrdersRepository.getInstance(this.sqlite, this.eventEmitterService);
  }

  ngOnInit() {
    this.eventEmitterService.change.subscribe((val) => {
      this.ordersRespository.findAll()
        .then(orders => {
          this.ordersList = orders;
          console.log(this.ordersList);
        });
    });
  }

  deleteOrder(orderId) {
    return this.ordersRespository.deleteByPk(orderId)
      .then(() => {
        return this.eventEmitterService.dbChange();
      });
  }
}
