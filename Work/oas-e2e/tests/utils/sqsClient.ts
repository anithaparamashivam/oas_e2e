import { SQS, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand, GetQueueUrlCommand, PurgeQueueCommand, QueueAttributeName } from '@aws-sdk/client-sqs';

export interface QueueMessage {
  MessageId: string;
  ReceiptHandle: string;
  Body: string;
  Attributes?: Record<string, string>;
}

export class SQSClient {
  private sqs: SQS;

  constructor() {
    this.sqs = new SQS({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
      endpoint: process.env.AWS_SQS_ENDPOINT || 'http://localhost:4566',
    });
  }

  async sendMessage(queueUrl: string, messageBody: any): Promise<string> {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(messageBody),
    };

    const result = await this.sqs.send(new SendMessageCommand(params));
    return result.MessageId || '';
  }

  async receiveMessages(queueUrl: string, maxMessages: number = 10): Promise<QueueMessage[]> {
    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: maxMessages,
      WaitTimeSeconds: 5,
      AttributeNames: [QueueAttributeName.All],
    };

    const result = await this.sqs.send(new ReceiveMessageCommand(params));
    return (result.Messages || [])
      .filter(
        (msg): msg is Required<Pick<QueueMessage, 'MessageId' | 'ReceiptHandle' | 'Body'>> & { Attributes?: Record<string, string> } =>
          typeof msg.MessageId === 'string' &&
          typeof msg.ReceiptHandle === 'string' &&
          typeof msg.Body === 'string'
      )
      .map((msg) => ({
        MessageId: msg.MessageId!,
        ReceiptHandle: msg.ReceiptHandle!,
        Body: msg.Body!,
        Attributes: msg.Attributes as Record<string, string> | undefined,
      }));
  }

  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    const params = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    };

    try {
  // Waits for the deletion to finish before proceeding
  await this.sqs.send(new DeleteMessageCommand(params));
  console.log("Message deleted successfully");
} catch (err) {
  console.error("Error deleting message", err);
}
  }

  async getQueueUrl(queueName: string): Promise<string> {
    const params = {
      QueueName: queueName,
    };

    const result = await this.sqs.getQueueUrl(params);
    return result.QueueUrl || '';
  }

  async purgeQueue(queueUrl: string): Promise<void> {
    const params = {
      QueueUrl: queueUrl,
    };

    await this.sqs.send(new PurgeQueueCommand(params));
  }
}
