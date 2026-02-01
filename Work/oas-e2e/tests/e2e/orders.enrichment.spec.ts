import { test, expect } from '../fixtures/baseFixture';

test.describe('Orders - Enrichment', () => {
  test('should enrich order with product catalog data', async ({ apiClient, testData, schemaAssert }) => {
    const order = testData.createSampleOrder();

    const createResponse = await apiClient.post('/orders', order);
    expect(createResponse.status).toBe(201);

    const orderId = (createResponse.data as { id: string }).id;

    // Trigger enrichment
    const enrichResponse = await apiClient.post(`/orders/${orderId}/enrich`, {});
    expect(enrichResponse.status).toBe(200);

    // Get enriched order
    const getResponse = await apiClient.get(`/orders/${orderId}`);
    expect(getResponse.status).toBe(200);

    const enrichedOrder = getResponse.data as {
      items: Array<{ name: string; category: string; sku: string; [key: string]: any }>;
      status: string;
      [key: string]: any;
    };

    // Verify enrichment
    expect(enrichedOrder.items[0]).toHaveProperty('name');
    expect(enrichedOrder.items[0]).toHaveProperty('category');
    expect(enrichedOrder.items[0]).toHaveProperty('sku');
    expect(enrichedOrder.status).toBe('enriched');

    // Validate against schema
    schemaAssert.assert('assembled-order', enrichedOrder);
  });

  test('should enrich order with multiple items', async ({ apiClient, testData, schemaAssert }) => {
    const order = testData.createSampleOrder({
      items: [
        { productId: 'PROD-001', quantity: 2, price: 29.99 },
        { productId: 'PROD-002', quantity: 1, price: 99.99 },
      ],
      totalAmount: 159.97,
    });

    const createResponse = await apiClient.post('/orders', order);
    const orderId = (createResponse.data as { id: string }).id;

    await apiClient.post(`/orders/${orderId}/enrich`, {});

    const getResponse = await apiClient.get(`/orders/${orderId}`);
    const enrichedOrder = getResponse.data as {
      items: Array<{ name: string; [key: string]: any }>;
      [key: string]: any;
    };

    expect(enrichedOrder.items.length).toBe(2);
    expect(enrichedOrder.items[0]).toHaveProperty('name');
    expect(enrichedOrder.items[1]).toHaveProperty('name');

    schemaAssert.assert('assembled-order', enrichedOrder);
  });

  test('should handle enrichment of order with unknown product', async ({ apiClient, testData }) => {
    const order = testData.createSampleOrder({
      items: [{ productId: 'PROD-UNKNOWN', quantity: 1, price: 50.00 }],
    });

    const createResponse = await apiClient.post('/orders', order);
    const orderId = (createResponse.data as { id: string }).id;

    const enrichResponse = await apiClient.post(`/orders/${orderId}/enrich`, {});

    // Depending on business logic, this could be 400 or 200 with partial enrichment
    expect([200, 400, 422]).toContain(enrichResponse.status);
  });

  test('should mark order as enriched after successful enrichment', async ({ apiClient, testData }) => {
    const order = testData.createSampleOrder();

    const createResponse = await apiClient.post('/orders', order);
    const orderId = (createResponse.data as { id: string }).id;

    const getBeforeResponse = await apiClient.get(`/orders/${orderId}`);
    const beforeOrder = getBeforeResponse.data as { status: string; [key: string]: any };
    expect(beforeOrder.status).not.toBe('enriched');

    await apiClient.post(`/orders/${orderId}/enrich`, {});

    const getAfterResponse = await apiClient.get(`/orders/${orderId}`);
    const afterOrder = getAfterResponse.data as { status: string; enrichedAt?: string; [key: string]: any };
    expect(afterOrder.status).toBe('enriched');
    expect(afterOrder).toHaveProperty('enrichedAt');
  });
});
