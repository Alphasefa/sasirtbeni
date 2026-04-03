import { BaseScraper, type VehiclePrice } from "../base/Scraper";

export class TurkeyScraper extends BaseScraper {
  constructor() {
    super("vitrin.com", "TR", { timeout: 30000, retryCount: 3 });
  }

  async getBrands(): Promise<{ id: string; name: string }[]> {
    return this.fetchWithRetry(async () => {
      const response = await this.fetch("https://www.vitrin.com/api/v1/brands");
      const data = await response.json();
      return data.map((item: { slug: string; name: string }) => ({
        id: item.slug,
        name: item.name,
      }));
    });
  }

  async getModels(brandId: string): Promise<{ id: string; name: string }[]> {
    return this.fetchWithRetry(async () => {
      const response = await this.fetch(
        `https://www.vitrin.com/api/v1/brands/${brandId}/models`,
      );
      const data = await response.json();
      return data.map((item: { slug: string; name: string }) => ({
        id: item.slug,
        name: item.name,
      }));
    });
  }

  async getVersions(brandId: string, modelId: string): Promise<VehiclePrice[]> {
    return this.fetchWithRetry(async () => {
      const response = await this.fetch(
        `https://www.vitrin.com/api/v1/search?brand=${brandId}&model=${modelId}`,
      );
      const data = await response.json();
      return this.parseResults(data);
    });
  }

  private parseResults(data: any): VehiclePrice[] {
    if (!data?.ads) return [];

    return data.ads.map((item: any) => ({
      brand: item.brand || "",
      model: item.model || "",
      version: item.version || "",
      engine: item.engine || "",
      horsepower: item.horsepower || 0,
      price: item.price || 0,
      currency: "TRY",
      country: "TR",
      source: "vitrin.com",
    }));
  }
}
