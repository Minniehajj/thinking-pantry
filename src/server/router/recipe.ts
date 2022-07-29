import { createRouter } from "./context";
import { boolean, date, z } from "zod";

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

      const recipeMeetingCrit = Promise.all(
        recipesA.map(async (a) => {
          const ingredientCount = await ctx.prisma.ingredientUsed.findMany({
            where: { recipeId: a.id },
          });

          const ingArr = Promise.all(
            ingredientCount.map(async (b) => {
              const ingredientGood =
                await ctx.prisma.ingredient.findFirstOrThrow({
                  where: { id: b.ingredientId },
                });
              console.log(ingredientGood?.quantity >= b.amountUsed);

              return ingredientGood?.quantity >= b.amountUsed;
            })
          );
          console.log((await ingArr).entries);
          //res is an array of true or false based on whether there is enough for the recipe
          //if (await ingArr.every(Boolean)) {
          //adjust this to see if how man //if all true then return the recipe
          if ((await ingArr).every(Boolean)) {
            return a;
          }

          //}
        })
      );

      return recipeMeetingCrit;
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      const recipes = await ctx.prisma.recipe.findMany();
      return recipes;
    },
  })
  .query("getRecipeByName", {
    input: z.object({
      recipeName: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.recipe.findFirstOrThrow({
        where: { name: input?.recipeName },
      });
    },
  })
  .query("getRecipesClose", {
    async resolve({ ctx }) {
      const recipesA = await ctx.prisma.recipe.findMany({});

      const recipesMeetingCriterea = Promise.all(
        recipesA.map(async (a) => {
          const ingredientCount = await ctx.prisma.ingredientUsed.findMany({
            where: { recipeId: a.id },
          });

          const ingArr = Promise.all(
            ingredientCount.map(async (b) => {
              const ingredientGood =
                await ctx.prisma.ingredient.findFirstOrThrow({
                  where: { id: b.ingredientId },
                });
              return ingredientGood?.quantity >= b.amountUsed;
            })
          );
          let count = 0;
          (await ingArr).forEach(async function (value) {
            if (value == false) {
              count++;
            }
          });

          if (count == 1) {
            return a;
          }
        })
      );

      return recipesMeetingCriterea;
    },
  })
  .query("getMissingIng", {
    input: z
      .object({
        recipeId: z.string().nullish(),
      })
      .nullish(),
    async resolve({ input, ctx }) {
      const recipeId = input?.recipeId;
      const ingredientCount = await ctx.prisma.ingredientUsed.findMany({
        where: { recipeId: recipeId },
      });
      const missingIngs = ingredientCount.map(async (a) => {
        const ing = await ctx.prisma.ingredient.findFirstOrThrow({
          where: { id: a.ingredientId },
        });
        if (ing?.quantity < a.amountUsed) {
          return ing;
        }
      });
      return { missingIngs };
    },
  })
  .query("getMissingIngAm", {
    input: z
      .object({
        recipeId: z.string().nullish(),
      })
      .nullish(),
    async resolve({ input, ctx }) {
      const recipeId = input?.recipeId;
      const ingredientCount = await ctx.prisma.ingredientUsed.findMany({
        where: { recipeId: recipeId },
      });
      const missingIngs = Promise.all(
        ingredientCount.map(async (a) => {
          const ing = await ctx.prisma.ingredient.findFirstOrThrow({
            where: { id: a.ingredientId },
            select: {
              quantity: true,
              name: true,
              id: true,
              IngredientUsed: { select: { amountUsed: true } },
            },
          });
          if (ing?.quantity < a.amountUsed) {
            return ing;
          }
        })
      );
      return missingIngs;
    },
  })
  .query("getIngs", {
    input: z
      .object({
        recipeId: z.string().nullish(),
      })
      .nullish(),
    async resolve({ input, ctx }) {
      const recipeId = input?.recipeId;
      const ingredientCount = await ctx.prisma.ingredientUsed.findMany({
        where: { recipeId: recipeId },
      });
      const ingredients = Promise.all(
        ingredientCount.map(async (a) => {
          const ing = await ctx.prisma.ingredient.findFirstOrThrow({
            where: { id: a.ingredientId },
            select: {
              quantity: true,
              name: true,
              id: true,
              IngredientUsed: { select: { amountUsed: true } },
            },
          });

          return ing;
        })
      );
      return ingredients;
    },
  });
