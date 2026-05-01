import { z } from "zod";
import { publicProcedure, router } from "../index";

const vehicleVersionSchema = z.object({
  name: z.string(),
  engine: z.string(),
  horsepower: z.number(),
  transmission: z.string(),
  fuel: z.string(),
  price: z.number(),
  currency: z.string(),
  country: z.string(),
  source: z.string(),
});

const vehicleModelSchema = z.object({
  name: z.string(),
  startYear: z.number(),
  endYear: z.number().optional(),
});

const vehicleBrandSchema = z.object({
  name: z.string(),
  country: z.string(),
  logo: z.string().optional(),
});

const importVehicleSchema = z.object({
  brand: vehicleBrandSchema,
  model: vehicleModelSchema,
  version: vehicleVersionSchema,
});

export const vehicleRouter = router({
  getExchangeRates: publicProcedure.query(async ({ ctx }) => {
    const rates = await ctx.prisma.exchangeRate.findMany();
    const usd = rates.find((r) => r.currency === "USD");
    const eur = rates.find((r) => r.currency === "EUR");
    const gbp = rates.find((r) => r.currency === "GBP");

    return {
      USD: usd?.rate || 1,
      EUR: eur?.rate || 1,
      GBP: gbp?.rate || 1,
    };
  }),

  getBrands: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.vehicleBrand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { models: true } },
      },
    });
  }),

  getModels: publicProcedure
    .input(z.object({ brandId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.vehicleModel.findMany({
        where: { brandId: input.brandId },
        orderBy: { name: "asc" },
        include: {
          _count: { select: { versions: true } },
        },
      });
    }),

  getVersions: publicProcedure
    .input(z.object({ modelId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.vehicleVersion.findMany({
        where: { modelId: input.modelId },
        orderBy: { price: "asc" },
      });
    }),

  searchVehicles: publicProcedure
    .input(
      z.object({
        brand: z.string().optional(),
        model: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        fuel: z.string().optional(),
        transmission: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};

      if (input.brand) {
        where.model = { brand: { name: { contains: input.brand } } };
      }
      if (input.model) {
        where.model = { ...where.model, name: { contains: input.model } };
      }
      if (input.minPrice || input.maxPrice) {
        where.price = {};
        if (input.minPrice) where.price.gte = input.minPrice;
        if (input.maxPrice) where.price.lte = input.maxPrice;
      }
      if (input.fuel) where.fuel = input.fuel;
      if (input.transmission) where.transmission = input.transmission;

      return ctx.prisma.vehicleVersion.findMany({
        where,
        include: {
          model: { include: { brand: true } },
        },
        take: 50,
        orderBy: { price: "asc" },
      });
    }),

  importVehicle: publicProcedure
    .input(importVehicleSchema)
    .mutation(async ({ ctx, input }) => {
      const { brand, model, version } = input;

      let brandRecord = await ctx.prisma.vehicleBrand.findUnique({
        where: { name: brand.name },
      });

      if (!brandRecord) {
        brandRecord = await ctx.prisma.vehicleBrand.create({
          data: { name: brand.name, country: brand.country, logo: brand.logo },
        });
      }

      let modelRecord = await ctx.prisma.vehicleModel.findUnique({
        where: { brandId_name: { brandId: brandRecord.id, name: model.name } },
      });

      if (!modelRecord) {
        modelRecord = await ctx.prisma.vehicleModel.create({
          data: {
            brandId: brandRecord.id,
            name: model.name,
            startYear: model.startYear,
            endYear: model.endYear,
          },
        });
      }

      const versionRecord = await ctx.prisma.vehicleVersion.create({
        data: {
          modelId: modelRecord.id,
          name: version.name,
          engine: version.engine,
          horsepower: version.horsepower,
          transmission: version.transmission,
          fuel: version.fuel,
          price: version.price,
          currency: version.currency,
          country: version.country,
          source: version.source,
        },
      });

      return versionRecord;
    }),

  importBulk: publicProcedure
    .input(z.array(importVehicleSchema))
    .mutation(async ({ ctx, input }) => {
      const results = [];

      for (const vehicle of input) {
        const { brand, model, version } = vehicle;

        let brandRecord = await ctx.prisma.vehicleBrand.findUnique({
          where: { name: brand.name },
        });

        if (!brandRecord) {
          brandRecord = await ctx.prisma.vehicleBrand.create({
            data: {
              name: brand.name,
              country: brand.country,
              logo: brand.logo,
            },
          });
        }

        let modelRecord = await ctx.prisma.vehicleModel.findUnique({
          where: {
            brandId_name: { brandId: brandRecord.id, name: model.name },
          },
        });

        if (!modelRecord) {
          modelRecord = await ctx.prisma.vehicleModel.create({
            data: {
              brandId: brandRecord.id,
              name: model.name,
              startYear: model.startYear,
              endYear: model.endYear,
            },
          });
        }

        const versionRecord = await ctx.prisma.vehicleVersion.create({
          data: {
            modelId: modelRecord.id,
            name: version.name,
            engine: version.engine,
            horsepower: version.horsepower,
            transmission: version.transmission,
            fuel: version.fuel,
            price: version.price,
            currency: version.currency,
            country: version.country,
            source: version.source,
          },
        });

        results.push(versionRecord);
      }

      return { count: results.length, results };
    }),

  syncPrices: publicProcedure.mutation(async ({ ctx }) => {
    const updatedPrices: Record<string, number> = {
      "Fiat Egea Sedan 1.4 Fire Easy": 1184900,
      "Fiat Egea Cross 1.4 Fire Street": 1270520,
      "Fiat Topolino 6 kW/8 HP": 605900,
      "Dacia Sandero 1.0 TCe Expression": 1313000,
      "Dacia Jogger 1.0 Extreme Eco-G": 1492000,
      "Dacia Duster 1.0 TCe 4x4": 1645000,
      "Togg T10X V1 RWD Standart": 1505000,
      "Togg T10X V2 RWD": 1598000,
      "Togg T10F V1 RWD": 1878000,
      "Renault Clio 1.0 TCE Joy": 1179000,
      "Renault Megane 1.3 TCE Joy": 1399000,
      "Renault Austral 1.2 TCE Mild Hybrid": 1899000,
      "Toyota Corolla 1.5 Hybrid Dream": 1549000,
      "Toyota C-HR 1.8 Hybrid Dream": 1699000,
      "Toyota RAV4 2.0 Hybrid Adventure": 2699000,
      "Volkswagen Polo 1.0 TSI Life": 1299000,
      "Volkswagen Golf 1.5 TSI Life": 1549000,
      "Volkswagen T-Roc 1.5 TSI Life": 1799000,
      "Tesla Model Y RWD": 2394000,
      "Tesla Model Y Long Range": 2994000,
      "Tesla Model 3 RWD": 2194000,
      "Hyundai i20 1.4 MPI Style": 1049000,
      "Hyundai Tucson 1.6 TGDI": 1899000,
      "Peugeot 208 1.2 PureTech Active": 1099000,
      "Peugeot 3008 1.2 PureTech GT": 1899000,
      "Ford Puma 1.0 Titanium": 1514000,
      "Ford Explorer EV Select": 1720000,
      "Skoda Octavia 1.5 TSI Style": 1649000,
      "Skoda Karoq 1.5 TSI": 1749000,
      "Opel Corsa 1.2 Edition": 989000,
      "Opel Astra 1.2 GS": 1349000,
      "BYD Seal U Comfort": 1899000,
      "BYD Dolphin Dynamic": 1299000,
      "Kia Picanto 1.2 AT": 849000,
      "Kia Sportage 1.6 DCT": 1899000,
    };

    let updatedCount = 0;

    for (const [key, newPrice] of Object.entries(updatedPrices)) {
      const parts = key.split(" ");
      const brandName = parts[0];
      const modelName = parts.slice(1, -1).join(" ");
      const versionName = parts.slice(-2).join(" ");

      const version = await ctx.prisma.vehicleVersion.findFirst({
        where: {
          model: {
            brand: { name: brandName },
            name: { contains: modelName },
          },
        },
        include: { model: { include: { brand: true } } },
      });

      if (version && version.price !== newPrice) {
        await ctx.prisma.vehicleVersion.update({
          where: { id: version.id },
          data: { price: newPrice },
        });
        updatedCount++;
      }
    }

    return { success: true, updatedCount, timestamp: new Date() };
  }),
});
