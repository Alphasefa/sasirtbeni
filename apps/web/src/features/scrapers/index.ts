export {
  BaseScraper,
  type Scraper,
  type ScraperOptions,
  type VehiclePrice,
} from "./base/Scraper";
export { GermanyScraper } from "./countries/germany";
export { TurkeyScraper } from "./countries/turkey";

export const scrapers = {
  DE: () => import("./countries/germany").then((m) => new m.GermanyScraper()),
  TR: () => import("./countries/turkey").then((m) => new m.TurkeyScraper()),
};

export async function getScraper(country: "DE" | "TR") {
  const scraperFn = scrapers[country];
  if (!scraperFn) {
    throw new Error(`No scraper for country: ${country}`);
  }
  return scraperFn();
}
