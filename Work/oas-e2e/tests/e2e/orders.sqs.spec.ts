import { test, expect } from '../fixtures/baseFixture';

test.describe('Orders - SQS Integration', () => {
  const ORDERS_QUEUE = process.env.SQS_ORDERS_QUEUE || 'orders-queue';
  const ENRICHMENT_QUEUE = process.env.SQS_ENRICHMENT_QUEUE || 'enrichment-queue';

  test.beforeEach(async ({ sqsClient }) => {
    // Purge queues before each test
    try {
      const ordersQueueUrl = await sqsClient.getQueueUrl(ORDERS_QUEUE);
      await sqsClient.purgeQueue(ordersQueueUrl);

      const enrichmentQueueUrl = await sqsClient.getQueueUrl(ENRICHMENT_QUEUE);
      await sqsClient.purgeQueue(enrichmentQueueUrl);
    } catch (error) {
      console.log('Queue cleanup skipped - queues may not exist yet');
    }
  });

  test('should send order to SQS queue', async ({ sqsClient, testData }) => {
    const order = testData.createSampleOrder();
    const queueUrl = await sqsClient.getQueueUrl(ORDERS_QUEUE);

    const messageId = await sqsClient.sendMessage(queueUrl, order);

    expect(messageId).toBeTruthy();
  });

  test('should receive order from SQS queue', async ({ sqsClient, testData }) => {
    const order = testData.createSampleOrder();
    const queueUrl = await sqsClient.getQueueUrl(ORDERS_QUEUE);

    await sqsClient.sendMessage(queueUrl, order);

    const messages = await sqsClient.receiveMessages(queueUrl, 1);

    expect(messages.length).toBeGreaterThan(0);
    const message = messages[0];
    const body = JSON.parse(message.Body);
    expect(body.customerId).toBe(order.customerId);
  });

  test('should delete message from queue', async ({ sqsClient, testData }) => {
    const order = testData.createSampleOrder();
    const queueUrl = await sqsClient.getQueueUrl(ORDERS_QUEUE);

    await sqsClient.sendMessage(queueUrl, order);

    const messages = await sqsClient.receiveMessages(queueUrl, 1);
    expect(messages.length).toBeGreaterThan(0);

    await sqsClient.deleteMessage(queueUrl, messages[0].ReceiptHandle);

    const messagesAfterDelete = await sqsClient.receiveMessages(queueUrl, 1);
    expect(messagesAfterDelete.length).toBe(0);
  });

  test('should handle enrichment queue workflow', async ({ sqsClient, testData }) => {
    const order = testData.createSampleOrder();
    const ordersQueueUrl = await sqsClient.getQueueUrl(ORDERS_QUEUE);
    const enrichmentQueueUrl = await sqsClient.getQueueUrl(ENRICHMENT_QUEUE);

    // Send order to orders queue
    await sqsClient.sendMessage(ordersQueueUrl, {
      type: 'ORDER_CREATED',
      data: order,
    });

    // Verify message in orders queue
    const ordersMessages = await sqsClient.receiveMessages(ordersQueueUrl, 1);
    expect(ordersMessages.length).toBeGreaterThan(0);

    // Simulate enrichment worker: receive from orders, send to enrichment
    const enrichmentMessage = {
      type: 'ENRICHMENT_REQUIRED',
      orderId: order.id,
      originalOrder: JSON.parse(ordersMessages[0].Body),
    };

    await sqsClient.sendMessage(enrichmentQueueUrl, enrichmentMessage);
    await sqsClient.deleteMessage(ordersQueueUrl, ordersMessages[0].ReceiptHandle);

    // Verify message in enrichment queue
    const enrichmentMessages = await sqsClient.receiveMessages(enrichmentQueueUrl, 1);
    expect(enrichmentMessages.length).toBeGreaterThan(0);
  });

  test('should handle batch message processing', async ({ sqsClient, testData }) => {
    const queueUrl = await sqsClient.getQueueUrl(ORDERS_QUEUE);

    // Send multiple messages
    const orders = [testData.createSampleOrder(), testData.createSampleOrder(), testData.createSampleOrder()];

    for (const order of orders) {
      await sqsClient.sendMessage(queueUrl, order);
    }

    // Receive batch
    const messages = await sqsClient.receiveMessages(queueUrl, 10);

    expect(messages.length).toBe(orders.length);

    // Process all
    for (const message of messages) {
      const body = JSON.parse(message.Body);
      expect(body).toHaveProperty('customerId');
      await sqsClient.deleteMessage(queueUrl, message.ReceiptHandle);
    }

    // Queue should be empty
    const remainingMessages = await sqsClient.receiveMessages(queueUrl, 1);
    expect(remainingMessages.length).toBe(0);
  });
});
