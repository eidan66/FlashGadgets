import type { Product } from './Product';

export interface OrderData {
  order_id: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  shipping_address: string;
  country: string;
  items: Array<Product & { quantity: number }>;
  total_amount: number;
  language: "en" | "he";
  created_date: string;
}

export class Order {
  static async create(data: OrderData): Promise<void> {
    // TODO: Implement actual order creation logic
    // This could be an API call to your backend
    console.log('Creating order:', data);
    // Simulate saving to a mock database or local storage
    const orders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    orders.push({ ...data, created_date: new Date().toISOString() });
    localStorage.setItem('mockOrders', JSON.stringify(orders));
  }

  static async getById(orderId: string): Promise<OrderData | undefined> {
    // TODO: Implement actual order fetching logic
    // This could be an API call to your backend
    console.log('Fetching order with ID:', orderId);
    // Simulate fetching from mock database or local storage
    const orders: OrderData[] = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    return orders.find(order => order.order_id === orderId);
  }
}