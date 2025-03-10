// Fix for jest.mock() TypeScript compatibility
declare namespace jest {
  interface MockInstance<T = any, Y extends any[] = any> {
    mockResolvedValue(value: T): this;
    mockRejectedValue(value: any): this;
    mockResolvedValueOnce(value: T): this;
    mockRejectedValueOnce(value: any): this;
  }
}
