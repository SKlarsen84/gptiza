import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { openAiRouter } from "./routers/openAi";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  openAI: openAiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
