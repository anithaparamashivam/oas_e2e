import Ajv, { ValidateFunction } from 'ajv';
import { test } from '@playwright/test';

const ajv = new Ajv();

export interface SchemaAssertOptions {
  allowAdditionalProperties?: boolean;
}

export class SchemaAssert {
  private schemas: Map<string, ValidateFunction> = new Map();

  /**
   * Register a JSON schema for validation
   */
  registerSchema(schemaId: string, schema: any): void {
    const validate = ajv.compile(schema);
    this.schemas.set(schemaId, validate);
  }

  /**
   * Validate data against a registered schema
   */
  validate(schemaId: string, data: any): { valid: boolean; errors: any[] } {
    const validate = this.schemas.get(schemaId);
    if (!validate) {
      throw new Error(`Schema with id '${schemaId}' not found`);
    }

    const valid = validate(data);
    return {
      valid,
      errors: validate.errors || [],
    };
  }

  /**
   * Assert that data matches a registered schema
   */
  assert(schemaId: string, data: any): void {
    const result = this.validate(schemaId, data);
    if (!result.valid) {
      const errorMessages = result.errors
        .map((error) => `${error.instancePath || 'root'} ${error.message}`)
        .join('\n');
      throw new Error(`Schema validation failed:\n${errorMessages}`);
    }
  }

  /**
   * Assert that data structure matches expected properties (shallow check)
   */
  assertHasProperties(data: any, properties: string[]): void {
    for (const prop of properties) {
      test.expect(data).toHaveProperty(prop);
    }
  }

  /**
   * Assert that array elements match a schema
   */
  assertArrayItems(schemaId: string, data: any[]): void {
    test.expect(Array.isArray(data)).toBeTruthy();
    for (const item of data) {
      this.assert(schemaId, item);
    }
  }

  /**
   * Assert that value matches expected type
   */
  assertType(value: any, expectedType: string): void {
    const actualType = typeof value;
    test.expect(actualType).toBe(expectedType);
  }
}

export const schemaAssert = new SchemaAssert();
