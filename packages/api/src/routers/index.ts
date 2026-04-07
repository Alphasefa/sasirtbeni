import { protectedProcedure, publicProcedure, router } from "../index";
import { dealerRouter } from "./dealer";

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
});
export type AppRouter = typeof appRouter;
