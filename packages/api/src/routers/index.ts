import { protectedProcedure, publicProcedure, router } from "../index";
import { dealerRouter } from "./dealer";
import { vehicleRouter } from "./vehicle";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  dealer: dealerRouter,
  vehicle: vehicleRouter,
});
export type AppRouter = typeof appRouter;
