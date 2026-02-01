import { test, expect } from '../fixtures/baseFixture';

test.describe('Orders - Happy Path', () => {
  test('should create a valid order', async ({ apiClient, testData }) => {
    const order = testData.createSampleOrder();

    const response = await apiClient.post('/orders', order);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('status');
  });

  test('should retrieve a created order', async ({ apiClient, testData }) => {
    const order = testData.createSampleOrder();
    const createResponse = await apiClient.post('/orders', order);
    const orderId = (createResponse.data as { id: string }).id;

    const getResponse = await apiClient.get(`/orders/${orderId}`);

    expect(getResponse.status).toBe(200);
    expect((getResponse.data as { id: string; customerId: string }).id).toBe(orderId);
    expect((getResponse.data as { id: string; customerId: string }).customerId).toBe(order.customerId);
  });

  test('should list all orders', async ({ apiClient, testData }) => {
    const order1 = testData.createSampleOrder();
    const order2 = testData.createSampleOrder();

    await apiClient.post('/orders', order1);
    await apiClient.post('/orders', order2);

    const response = await apiClient.get('/orders');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBeTruthy();
    expect((response.data as unknown[]).length).toBeGreaterThanOrEqual(2);
  });

  test('should update an existing order', async ({ apiClient, testData }) => {
    const order = testData.createSampleOrder();
    const createResponse = await apiClient.post('/orders', order);
    const orderId = (createResponse.data as { id: string }).id;

    const updateResponse = await apiClient.put(`/orders/${orderId}`, {
      status: 'confirmed',
    });

    expect(updateResponse.status).toBe(200);
    expect((updateResponse.data as { status: string }).status).toBe('confirmed');
  });

  test('should delete an order', async ({ apiClient, testData }) => {
    const order = testData.createSampleOrder();
    const createResponse = await apiClient.post('/orders', order);
    const orderId = (createResponse.data as { id: string }).id;

    const deleteResponse = await apiClient.delete(`/orders/${orderId}`);

    expect(deleteResponse.status).toBe(204);

    const getResponse = await apiClient.get(`/orders/${orderId}`);
    expect(getResponse.status).toBe(404);
  });
});
