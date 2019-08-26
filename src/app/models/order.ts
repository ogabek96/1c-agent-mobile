import { Client } from './client';
import { Item } from './item';

export interface Order {
  id?: number;
  orderNumber?: string;
  client: Client;
  totalCost: number;
  items: Item[];
  date: number;
  priceType: number;
  isUploaded: boolean;
}
