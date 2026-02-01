import { test as base } from '@playwright/test';
import { ApiClient } from '../utils/apiClient';
import { SQSClient } from '../utils/sqsClient';
import { SchemaAssert, schemaAssert } from '../utils/schemaAssert';
import { TestData, testData } from '../utils/testData';

type BaseFixtures = {
  apiClient: ApiClient;
  sqsClient: SQSClient;
  schemaAssert: SchemaAssert;
  testData: TestData;
};

/**
 * Base fixture that provides common utilities for all tests
 */
export const test = base.extend<BaseFixtures>({
  apiClient: async ({}, use) => {
    const client = new ApiClient();
    await use(client);
  },

  sqsClient: async ({}, use) => {
    const client = new SQSClient();
    await use(client);
  },

  schemaAssert: async ({}, use) => {
    // Register schemas
    const assembledOrderSchema = testData.loadAssembledOrderSchema();
    schemaAssert.registerSchema('assembled-order', assembledOrderSchema);

    await use(schemaAssert);
  },

  testData: async ({}, use) => {
    await use(testData);
  },
});

export { expect } from '@playwright/test';
