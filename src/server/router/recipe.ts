import { createRouter } from "./context";
import { date, z } from "zod";
import { Prisma } from "@prisma/client";
import { isBigInt64Array } from "util/types";
import findIngredientsForRecipe from "../../../scripts/getIngredientsFromRecipe";

export const recipeRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getRecipesAble", {
    async resolve({ ctx }) {
      const recipesA = await ctx.prisma.recipe.findMany({});

      const recipeIngNum = Promise.all(
        recipesA.map(async (a) => {
          const ingredientCount = await ctx.prisma.ingredientUsed.findMany({
            where: { recipeId: a.id },
          });

          const ingArr = ingredientCount.map(async (b) => {
            const ingredientGood = await ctx.prisma.ingredient.findFirst({
              where: { id: b.ingredientId, quantity: { gte: b.amountUsed } },
            });
            if (ingredientGood !== null) {
              return true;
            } else {
              return false;
            }
          });
          //res is an array of true or false based on whether there is enough for the recipe
          if (ingArr.every(Boolean)) {
            //adjust this to see if how man
            //if all true then return the recipe
            return a;
          }
        })
      );

      return recipeIngNum;
    },
  });
