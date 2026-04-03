export interface ScraperOptions {
  useProxy?: boolean;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
}

export interface VehiclePrice {
  brand: string;
  model: string;
  version: string;
  engine: string;
  horsepower: number;
  price: number;
  currency: string;
  country: string;
  source: string;
}

export interface Scraper {
  getBrands(): Promise<{ id: string; name: string }[]>;
  getModels(brandId: string): Promise<{ id: string; name: string }[]>;
  getVersions(brandId: string, modelId: string): Promise<VehiclePrice[]>;
}

export abstract class BaseScraper implements Scraper {
  protected options: ScraperOptions;
  protected source: string;
  protected country: string;

  constructor(source: string, country: string, options: ScraperOptions = {}) {
    this.source = source;
    this.country = country;
    this.options = {
      useProxy: false,
      retryCount: 3,
      retryDelay: 1000,
      timeout: 30000,
      ...options,
    };
  }

  abstract getBrands(): Promise<{ id: string; name: string }[]>;
  abstract getModels(brandId: string): Promise<{ id: string; name: string }[]>;
  abstract getVersions(
    brandId: string,
    modelId: string,
  ): Promise<VehiclePrice[]>;

  protected async fetchWithRetry<T>(
    fn: () => Promise<T>,
    retries: number = this.options.retryCount || 3,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await this.delay(this.options.retryDelay || 1000);
        return this.fetchWithRetry(fn, retries - 1);
      }
      throw error;
    }
  }

  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected async fetch(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.options.timeout || 30000,
    );

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
