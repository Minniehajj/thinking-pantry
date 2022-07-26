// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { recipeRouter } from "./recipe";
import { ingredientRouter } from "./ingredient";

import fillIngredientList from "/home/aminebady/personalProjects/thinking-pantry/scripts/ListOfIngredients";
import  warningIng  from "/home/aminebady/personalProjects/thinking-pantry/scripts/ListOfNearExp";


export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", recipeRouter)
  .merge("ingredient.", ingredientRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
