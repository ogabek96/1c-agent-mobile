import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Order } from '../models/order';

export class OrdersRepository {
  private static instance: OrdersRepository;
  private DB_NAME = 'data.db';
  private db: SQLiteObject;

  private constructor(private sqlite: SQLite, private eventEmitterService) {

    this.sqlite.create({
      name: this.DB_NAME,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.db = db;
        return db.executeSql(`
          CREATE TABLE IF NOT EXISTS orders(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderNumber TEXT NOT NULL,
          client TEXT NOT NULL,
          totalCost REAL NOT NULL,
          items TEXT NOT NULL,
          date INTEGER NOT NULL,
          priceType INTEGER NOT NULL,
          isUploaded BOOLEAN NOT NULL);`, []);
      })
      .then(() => {
        this.eventEmitterService.dbReady();
      });
  }

  static getInstance(sqlite: SQLite, eventEmitterService): OrdersRepository {
    if (!OrdersRepository.instance) {
      OrdersRepository.instance = new OrdersRepository(sqlite, eventEmitterService);
    }
    return OrdersRepository.instance;
  }

  public async findByPk(id): Promise<Order> {
    return this.db.executeSql('SELECT * FROM orders WHERE id = ' + id, [])
      .then(res => {
        const order = res.rows.item(0);
        order.client = JSON.parse(order.client);
        order.items = JSON.parse(order.items);
        return order as Order;
      });
  }

  public async findAll(): Promise<Order[]> {
    return this.db.executeSql('SELECT * FROM orders', [])
      .then(res => {
        let orders = [];
        for (let i = 0; i < res.rows.length; i++) {
          orders.push(res.rows.item(i));
        }
        orders = orders.map(order => {
          order.client = JSON.parse(order.client);
          order.items = JSON.parse(order.items);
          return order;
        });
        return orders as Order[];
      });
  }

  public async deleteByPk(id) {
    return this.db.executeSql('DELETE FROM orders WHERE id = ' + id, [])
      .then(res => {
        return res.rows.item(0);
      });
  }

  public async create(order: Order): Promise<Order> {
    return this.db.executeSql(`INSERT INTO orders(orderNumber ,client, totalCost, items, date, priceType, isUploaded)
     VALUES ("${order.orderNumber}", '${JSON.stringify(order.client)}', ${order.totalCost}, '${JSON.stringify(order.items)}',
     "${order.date}", "${order.priceType}", ${order.isUploaded})`, [])
      .then(res => {
        return order;
      });
  }

  public async update(order: Order): Promise<Order> {
    const q = `UPDATE orders SET
    orderNumber = "${order.orderNumber}",
    client = "${order.client}",
    totalCost = ${order.totalCost},
    date = ${order.date},
    priceType = ${order.priceType},
    isUploaded = ${order.isUploaded}
    WHERE id = ${order.id}`;
    return this.db.executeSql(q, [])
      .then(res => {
        return res;
      });
  }
}
