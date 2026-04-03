import { BaseScraper, type VehiclePrice } from "../base/Scraper";

export class GermanyScraper extends BaseScraper {
  constructor() {
    super("mobile.de", "DE", { timeout: 30000, retryCount: 3 });
  }

  async getBrands(): Promise<{ id: string; name: string }[]> {
    return [
      { id: "vw", name: "Volkswagen" },
      { id: "bmw", name: "BMW" },
      { id: "mercedes", name: "Mercedes-Benz" },
      { id: "audi", name: "Audi" },
      { id: "toyota", name: "Toyota" },
    ];
  }

  async getModels(brandId: string): Promise<{ id: string; name: string }[]> {
    const brandModels: Record<string, { id: string; name: string }[]> = {
      vw: [
        { id: "golf", name: "Golf" },
        { id: "passat", name: "Passat" },
        { id: "polo", name: "Polo" },
        { id: "t-roc", name: "T-Roc" },
        { id: "tiguan", name: "Tiguan" },
      ],
      bmw: [
        { id: "1er", name: "1 Serisi" },
        { id: "3er", name: "3 Serisi" },
        { id: "5er", name: "5 Serisi" },
        { id: "x1", name: "X1" },
        { id: "x3", name: "X3" },
      ],
    };

    return brandModels[brandId] || [];
  }

  async getVersions(brandId: string, modelId: string): Promise<VehiclePrice[]> {
    return this.fetchWithRetry(async () => {
      const url = `https://api.mobile.de/api/v1/search?brand=${brandId}&model=${modelId}`;
      const response = await this.fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      return this.parseResults(data);
    });
  }

  private parseResults(data: any): VehiclePrice[] {
    if (!data?.results) return [];

    return data.results.map((item: any) => ({
      brand: item.brand || "",
      model: item.model || "",
      version: item.modelVariant || "",
      engine: item.engine || "",
      horsepower: item.powerInKW ? item.powerInKW * 1.36 : 0,
      price: item.price || 0,
      currency: "EUR",
      country: "DE",
      source: "mobile.de",
    }));
  }
}
