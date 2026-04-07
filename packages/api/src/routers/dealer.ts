import { z } from "zod";
import { publicProcedure, router } from "../index";

export const dealerRouter = router({
  getDealersWithStock: publicProcedure
    .input(
      z.object({
        brandName: z.string(),
        modelName: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const dealers = await ctx.prisma.dealer.findMany({
        where: {
          stocks: {
            some: {
              version: {
                model: {
                  brand: {
                    name: input.brandName,
                  },
                  name: input.modelName,
                },
              },
            },
          },
        },
        include: {
          stocks: {
            where: {
              version: {
                model: {
                  brand: {
                    name: input.brandName,
                  },
                  name: input.modelName,
                },
              },
            },
            include: {
              version: true,
              campaigns: {
                where: {
                  isActive: true,
                  endDate: {
                    gte: new Date(),
                  },
                },
              },
            },
          },
        },
      });

      return dealers.map((dealer) => ({
        ...dealer,
        stocks: dealer.stocks.map((stock) => ({
          ...stock,
          finalPrice: stock.price,
          hasCampaign: stock.campaigns.length > 0,
        })),
      }));
    }),

  getAllDealers: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.dealer.findMany({
      orderBy: { city: "asc" },
    });
  }),
});
