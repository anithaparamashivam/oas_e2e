import { test, expect } from '../fixtures/baseFixture';

test.describe('Orders - Negative Cases', () => {
  test('should reject invalid order - missing customerId', async ({ apiClient }) => {
    const invalidOrder = {
      items: [
        {
          productId: 'PROD-001',
          quantity: 1,
          price: 29.99,
        },
      ],
    };

    const response = await apiClient.post('/orders', invalidOrder);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('error');
  });

  test('should reject invalid order - empty items array', async ({ apiClient, testData }) => {
    const invalidOrder = testData.createSampleOrder({ items: [] });

    const response = await apiClient.post('/orders', invalidOrder);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('error');
  });

  test('should reject invalid order - negative quantity', async ({ apiClient, testData }) => {
    const invalidOrder = testData.createSampleOrder({
      items: [
        {
          productId: 'PROD-001',
          quantity: -1,
          price: 29.99,
        },
      ],
    });

    const response = await apiClient.post('/orders', invalidOrder);

    expect(response.status).toBe(400);
  });

  test('should reject invalid order - negative price', async ({ apiClient, testData }) => {
    const invalidOrder = testData.createSampleOrder({
      items: [
        {
          productId: 'PROD-001',
          quantity: 1,
          price: -29.99,
        },
      ],
    });

    const response = await apiClient.post('/orders', invalidOrder);

    expect(response.status).toBe(400);
  });

  test('should return 404 for non-existent order', async ({ apiClient }) => {
    const response = await apiClient.get('/orders/ORD-999999');

    expect(response.status).toBe(404);
  });

  test('should reject update with invalid data', async ({ apiClient, testData }) => {
    const order = testData.createSampleOrder();
    const createResponse = await apiClient.post('/orders', order);
    const orderId = (createResponse.data as { id: string }).id;

    const updateResponse = await apiClient.put(`/orders/${orderId}`, {
      status: 'invalid_status',
    });

    expect(updateResponse.status).toBe(400);
  });

  test('should return 400 for malformed request', async ({ apiClient }) => {
    const response = await apiClient.post('/orders', 'invalid json');

    expect(response.status).toBe(400);
  });
});
