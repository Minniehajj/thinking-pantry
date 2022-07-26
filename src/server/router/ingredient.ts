import { createRouter } from "./context";
import { date, z } from "zod";
import { Prisma } from "@prisma/client";

export const ingredientRouter = createRouter()
  .query("hello", {
    input: z.object({
      text: z.string(),
    }),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.ingredient.findMany();
    },
  })
  .mutation("createIngredient", {
    //create ingredient call{allIngredients.data}
    input: z.object({
      name: z.string(),
      quanity: z.number(),
      canBeUsedUp: z.boolean(),
      category: z.string(),
    }),
    async resolve({ input }) {
      const { name, quanity, canBeUsedUp, category } = input;
      let date = new Date();
      name.toLowerCase();
      const catId = await prisma?.category.findFirstOrThrow({
        where: { name: category },
      });

      console.log("categoryId");
      const existing = await prisma?.ingredient.findFirst({
        where: { name: name },
      });
      console.log(existing);
      if (existing === null) {
        return 0;
      }

      try {
        await prisma?.category.update({
          where: { id: catId?.id },
          data: {
            Ingredient: {
              update: {
                where: { id: existing?.id },
                data: {
                  quantity: quanity + existing?.quantity, //updates quantity and day
                  dayAcquired: date,
                },
              },
            },
          },
        });
      } catch {}

      return 1;
    },
  })
  .query("getSortedIng", {
    async resolve({ ctx }) {
      return await ctx.prisma.ingredient.findMany({
        where: { quantity: { gt: 0 } },
        orderBy: { categoryId: "asc" },
        select: {
          name: true,
          quantity: true,
          dayAcquired: true,
          category: { select: { name: true, daysGoodFor: true } },
        },
      });
    },
  })
  .query("getIngByDate", {
    async resolve({ ctx }) {
      return await ctx.prisma.ingredient.findMany({
        where: { quantity: { gt: 0 } },
        orderBy: { dayAcquired: "asc" },
        select: {
          name: true,
          quantity: true,
          dayAcquired: true,
          category: { select: { name: true, daysGoodFor: true } },
        },
      });
    },
  });
