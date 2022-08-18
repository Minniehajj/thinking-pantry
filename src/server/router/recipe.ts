import { createRouter } from "./context";
import { boolean, date, number, string, z } from "zod";
import { PrismaPromise } from "@prisma/client";
import ingredients from "../../pages/api/ingredients";

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

              return ingredientGood?.quantity >= b.amountUsed;
            })
          );

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
              IngredientUsed: {
                where: { ingredientId: a.ingredientId, recipeId: recipeId },
                select: { amountUsed: true },
              },
            },
          });

          return ing;
        })
      );
      return ingredients;
    },
  })
  .mutation("cookRecipe", {
    input: z
      .object({
        recipeId: z.string().nullish(),
      })
      .nullish(),
    async resolve({ input, ctx }) {
      const recipeId = input?.recipeId;
      const ingredientCount = await ctx.prisma.ingredientUsed.findMany({
        where: { recipeId: recipeId },
        select: {
          ingredientId: true,
          amountUsed: true,
          ingredient: { select: { quantity: true } },
        },
      });

      const queries = ingredientCount.map((a) => {
        return ctx.prisma.ingredient.update({
          where: { id: a.ingredientId },
          data: {
            quantity: Math.max(0, a.ingredient.quantity - a.amountUsed),
          },
        });
      });
      await ctx.prisma.$transaction([...queries]);
    },
  })
  .mutation("reduceIngUsed", {
    input: z.object({
      ingredientId: z.string(),
      recipeId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const ingId = input?.ingredientId;
      const recId = input?.recipeId;
      const ingUsed = await ctx.prisma.ingredientUsed.findFirstOrThrow({
        where: { ingredientId: ingId, recipeId: recId },
      });
      await ctx.prisma.ingredientUsed.update({
        where: { id: ingUsed.id },
        data: {
          amountUsed: Math.max(0, ingUsed.amountUsed - 1),
        },
      });
    },
  })
  .mutation("increaseIngUsed", {
    input: z.object({
      ingredientId: z.string(),
      recipeId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const ingId = input?.ingredientId;
      const recId = input?.recipeId;
      const ingUsed = await ctx.prisma.ingredientUsed.findFirstOrThrow({
        where: { ingredientId: ingId, recipeId: recId },
      });
      await ctx.prisma.ingredientUsed.update({
        where: { id: ingUsed.id },
        data: {
          amountUsed: Math.max(0, ingUsed.amountUsed + 1),
        },
      });
    },
  })
  .mutation("changeRecipeDesc", {
    input: z.object({
      recipeDesc: z.string(),
      recipeId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const recDesc = input?.recipeDesc;
      const recId = input?.recipeId;
      const edited = await ctx.prisma.recipe.update({
        where: { id: recId },
        data: { description: recDesc },
      });
    },
  })
  .mutation("changeRecipeInstructions", {
    input: z.object({
      recipeInst: z.string(),
      recipeId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const recInst = input?.recipeInst;
      const recId = input?.recipeId;
      const edited = await ctx.prisma.recipe.update({
        where: { id: recId },
        data: { instructions: recInst },
      });
    },
  })
  .mutation("createRecipe", {
    input: z
      .object({
        recipeName: z.string().nullish(),
        recipeDesc: z.string().nullish(),
        recipeInstructions: z.string().nullish(),
        recipeTime: z.number().nullish(),
        recipeDiff: z.number().nullish(),
        season: z.string(),
        ingredients: z.array(
          z.object({
            ingredientEntry: z.string(),
            ingredientAmount: z.number(),
          })
        ),
      })
      .nullish(),
    async resolve({ input, ctx }) {
      const rec = await ctx.prisma.recipe.create({
        data: {
          name: input?.recipeName ?? "",
          description: input?.recipeDesc ?? "",
          instructions: input?.recipeInstructions ?? "",
          difficulty: input?.recipeDiff ?? 0,
          time: input?.recipeTime ?? 0,
          season: input?.season ?? "",
        },
        select: { id: true },
      });

      const queries = input?.ingredients.map((a) => {
        return ctx.prisma.ingredientUsed.create({
          data: {
            amountUsed: a.ingredientAmount ?? 0,
            ingredient: { connect: { id: a.ingredientEntry } },
            Recipe: { connect: { id: rec.id } },
          },
        });
      });

      return await ctx.prisma?.$transaction([...(queries ?? [])]);
    },
  })
  .mutation("addIngredientToNewRec", {
    input: z
      .object({
        recipe: z.string().nullish(),
        ingredientId: z.string().nullish(),
        amountUsed: z.number().nullish(),
      })
      .nullish(),
    async resolve({ input, ctx }) {
      const rec = await ctx.prisma.recipe.findFirstOrThrow({
        where: { name: input?.recipe ?? "" },
        select: { id: true },
      });

      const ing = await ctx.prisma.ingredient.findFirstOrThrow({
        where: { name: input?.ingredientId ?? "" },
        select: { id: true },
      });
      await ctx.prisma.ingredientUsed.create({
        data: {
          amountUsed: input?.amountUsed ?? 0,
          ingredient: { connect: { id: ing.id } },
          Recipe: { connect: { id: rec.id } },
        },
      });
    },
  })
  .mutation("deleteRecipe", {
    input: z.object({
      recipeId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const recId = input?.recipeId;
      await ctx.prisma.recipe.delete({
        where: { id: recId },
      });
    },
  });
