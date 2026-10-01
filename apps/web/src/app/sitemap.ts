import type { MetadataRoute } from "next";
import vehicleData from "@/shared/data/vehicles.json";
import dealersData from "@/shared/data/dealers.json";

const baseUrl = "https://biyardimet.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const { brands, models } = vehicleData as {
    brands: { id: string }[];
    models: Record<string, { id: string }[]>;
  };
  const { dealers } = dealersData as { dealers: { id: string }[] };

  const staticRoutes = [
    "",
    "/compare",
    "/dealers",
    "/electric-hybrid",
    "/hizmetler",
    "/satilik-araclar",
    "/hikayemiz",
    "/ipucclari",
    "/iletisim",
    "/kvkk",
    "/gizlilik-politikasi",
    "/mesafeli-satis-sozlesmesi",
    "/kullanim-sartlari",
  ].map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date() }));

  const brandRoutes = brands.map((b) => ({
    url: `${baseUrl}/compare/${b.id}`,
    lastModified: new Date(),
  }));

  const modelRoutes = Object.entries(models).flatMap(([brandId, brandModels]) =>
    brandModels.map((m) => ({
      url: `${baseUrl}/compare/${brandId}/${m.id}`,
      lastModified: new Date(),
    })),
  );

  const dealerRoutes = dealers.map((d) => ({
    url: `${baseUrl}/dealers/${d.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...brandRoutes, ...modelRoutes, ...dealerRoutes];
}
