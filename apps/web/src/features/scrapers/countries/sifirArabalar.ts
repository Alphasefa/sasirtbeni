import { BaseScraper, type VehiclePrice } from "../base/Scraper";

interface SifirArabalarCar {
  marka: string;
  model: string;
  versiyon: string;
  yil: number;
  motor: string;
  yakit: string;
  vites: string;
  fiyat: number;
}

export class SifirArabalarScraper extends BaseScraper {
  private baseUrl = "https://www.sifirarabalar.com";

  constructor() {
    super("sifirarabalar.com", "TR", { timeout: 30000, retryCount: 3 });
  }

  async getBrands(): Promise<{ id: string; name: string }[]> {
    return this.fetchWithRetry(async () => {
      const response = await this.fetch(`${this.baseUrl}/markalar`);
      const text = await response.text();
      return this.parseBrands(text);
    });
  }

  async getModels(brandId: string): Promise<{ id: string; name: string }[]> {
    return this.fetchWithRetry(async () => {
      const response = await this.fetch(`${this.baseUrl}/${brandId}`);
      const text = await response.text();
      return this.parseModels(text, brandId);
    });
  }

  async getVersions(brandId: string, modelId: string): Promise<VehiclePrice[]> {
    return this.fetchWithRetry(async () => {
      const response = await this.fetch(
        `${this.baseUrl}/${brandId}/${modelId}`,
      );
      const text = await response.text();
      return this.parseVersions(text);
    });
  }

  private parseBrands(html: string): { id: string; name: string }[] {
    const brands: { id: string; name: string }[] = [];
    const brandRegex = /<a[^>]*href=["']\/marka\/([^"']+)["'][^>]*>([^<]+)/gi;
    let match;
    while ((match = brandRegex.exec(html)) !== null) {
      const slug = match[1];
      const name = match[2].trim();
      if (!brands.find((b) => b.id === slug)) {
        brands.push({ id: slug, name });
      }
    }
    return brands;
  }

  private parseModels(
    html: string,
    brandId: string,
  ): { id: string; name: string }[] {
    const models: { id: string; name: string }[] = [];
    const modelRegex = new RegExp(`/model/${brandId}/([^"]+)`, "gi");
    let match;
    const seen = new Set<string>();
    while ((match = modelRegex.exec(html)) !== null) {
      const slug = match[1];
      if (!seen.has(slug)) {
        seen.add(slug);
        models.push({ id: slug, name: this.slugToName(slug) });
      }
    }
    return models;
  }

  private parseVersions(html: string): VehiclePrice[] {
    const vehicles: VehiclePrice[] = [];

    const priceRegex = /"fiyat":\s*(\d+)/g;
    const nameRegex = /<h3[^>]*class="[^"]*model[^"]*"[^>]*>([^<]+)/gi;
    const versionRegex = /<div[^>]*class="[^"]*versiyon[^"]*"[^>]*>([^<]+)/gi;

    const nameMatches = [...html.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)];
    const priceMatches = [...html.matchAll(/"fiyat"\s*:\s*(\d+)/g)];
    const detailMatches = [...html.matchAll(/<td[^>]*>([^<]+)<\/td>/g)];

    for (
      let i = 0;
      i < Math.min(nameMatches.length, priceMatches.length);
      i++
    ) {
      const title = nameMatches[i]?.[1]?.trim() || "";
      const price = parseInt(priceMatches[i]?.[1] || "0", 10);

      if (title && price > 0) {
        const parts = title.split(" ");
        const brand = parts[0] || "";
        const model = parts.slice(1, -1).join(" ") || "";
        const version = parts[parts.length - 1] || "";

        vehicles.push({
          brand,
          model,
          version,
          engine: "",
          horsepower: 0,
          price,
          currency: "TRY",
          country: "TR",
          source: "sifirarabalar.com",
        });
      }
    }

    return vehicles;
  }

  private slugToName(slug: string): string {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  async scrapeAllPrices(): Promise<VehiclePrice[]> {
    const allVehicles: VehiclePrice[] = [];

    try {
      const brands = await this.getBrands();

      for (const brand of brands.slice(0, 10)) {
        try {
          const models = await this.getModels(brand.id);

          for (const model of models.slice(0, 5)) {
            try {
              const versions = await this.getVersions(brand.id, model.id);
              allVehicles.push(...versions);
            } catch (e) {
              console.error(
                `Error getting versions for ${brand.name} ${model.name}:`,
                e,
              );
            }
          }
        } catch (e) {
          console.error(`Error getting models for ${brand.name}:`, e);
        }
      }
    } catch (e) {
      console.error("Error scraping prices:", e);
    }

    return allVehicles;
  }
}
