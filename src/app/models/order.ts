import { Client } from './client';
import { Item } from './item';

export interface Order {
  id?: number;
  client: Client;
  totalCost: number;
  items: Item[];
  date: Date;
}
