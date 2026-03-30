/// <reference types="jest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveProperty(propertyName: string, value?: any): R;
    }
  }
}

export {};
