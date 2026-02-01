import * as fs from 'fs';
import * as path from 'path';

interface Order {
  id?: string;
  customerId: string;
  items: OrderItem[];
  totalAmount?: number;
  status?: string;
  createdAt?: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface CatalogFixture {
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
}

export class TestData {
  private dataDir = path.join(__dirname, '../data');

  /**
   * Load valid orders from fixture
   */
  loadValidOrders(): Order[] {
    const filePath = path.join(this.dataDir, 'orders.valid.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Load invalid orders from fixture
   */
  loadInvalidOrders(): Order[] {
    const filePath = path.join(this.dataDir, 'orders.invalid.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Load catalog fixture
   */
  loadCatalog(): CatalogFixture {
    const filePath = path.join(this.dataDir, 'catalog.fixture.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Load assembled order schema
   */
  loadAssembledOrderSchema(): any {
    const filePath = path.join(this.dataDir, 'assembled-order.schema.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Generate a random order ID
   */
  generateOrderId(): string {
    return `ORD-${Math.floor(Math.random() * 100000)}`;
  }

  /**
   * Generate a random customer ID
   */
  generateCustomerId(): string {
    return `CUST-${Math.floor(Math.random() * 100000)}`;
  }

  /**
   * Create a sample valid order
   */
  createSampleOrder(overrides?: Partial<Order>): Order {
    const order: Order = {
      id: this.generateOrderId(),
      customerId: this.generateCustomerId(),
      items: [
        {
          productId: 'PROD-001',
          quantity: 1,
          price: 29.99,
        },
      ],
      totalAmount: 29.99,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...overrides,
    };
    return order;
  }

  /**
   * Create a sample order item
   */
  createOrderItem(overrides?: Partial<OrderItem>): OrderItem {
    return {
      productId: 'PROD-001',
      quantity: 1,
      price: 29.99,
      ...overrides,
    };
  }
}

export const testData = new TestData();
