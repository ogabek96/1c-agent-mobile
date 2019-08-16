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
          client TEXT NOT NULL,
          totalCost REAL NOT NULL,
          items TEXT NOT NULL,
        );`, []);
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
        return res.rows.item(0);
      });
  }

  public async findAll(): Promise<Order[]> {
    return this.db.executeSql('SELECT * FROM orders', [])
      .then(res => {
        const orders: Order[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          orders.push(res.rows.item(i));
        }
        return orders;
      });
  }

  public async deleteByPk(id) {
    return this.db.executeSql('DELETE FROM orders WHERE id = ' + id, [])
      .then(res => {
        return res.rows.item(0);
      });
  }

  public async create(order: Order): Promise<Order> {
    return this.db.executeSql(`INSERT INTO orders(client, totalCost, items, date)
     VALUES ("${order.client}", ${order.totalCost}, "${order.items}", "${order.date}")`, [])
      .then(res => {
        return res.rows.item(0);
      });
  }

  public async update(order: Order): Promise<Order> {
    const q = `UPDATE orders SET client = "${order.client}", totalCost = ${order.totalCost},
    date = ${order.date} WHERE id = ${order.id}`;
    return this.db.executeSql(q, [])
      .then(res => {
        return res;
      });
  }
}
