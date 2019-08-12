export interface Client {
  name: string;
  agreement: Agreement;
  price: string;
  code: number;
  debit: number;
}

interface Agreement {
  name: string;
  id: string;
}
