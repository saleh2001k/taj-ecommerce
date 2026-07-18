/**
 * Mock order history for the Orders screen. Dates are display strings (data,
 * not translatable copy); items reference real catalog products.
 */
import { getProduct, type Product } from './products';

export type OrderStatus = 'delivered' | 'shipped' | 'processing';

export type Order = {
  /** Human order number, shown as-is. */
  id: string;
  /** Display date. */
  date: string;
  status: OrderStatus;
  /** Product ids — resolved against the catalog. */
  items: string[];
  total: number;
};

export const ORDERS: Order[] = [
  {
    id: 'A-1047',
    date: 'Jul 14, 2026',
    status: 'processing',
    items: ['wool-overcoat', 'wool-beanie'],
    total: 276,
  },
  {
    id: 'A-1032',
    date: 'Jun 28, 2026',
    status: 'shipped',
    items: ['raw-denim', 'oxford-tee', 'runner-low'],
    total: 280,
  },
  {
    id: 'A-0989',
    date: 'May 9, 2026',
    status: 'delivered',
    items: ['linen-shirt'],
    total: 68,
  },
];

/** Items resolved to products (missing ids dropped defensively). */
export function orderProducts(order: Order): Product[] {
  return order.items.map(getProduct).filter((p): p is Product => p !== undefined);
}
