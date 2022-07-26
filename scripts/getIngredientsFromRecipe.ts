import { trpc } from "../src/utils/trpc";
import { ingredientRouter } from "/home/aminebady/personalProjects/thinking-pantry/src/server/router/ingredient";
import { recipeRouter } from "../src/server/router/recipe";
import recipesPage from "../src/pages/recipes";
import { Prisma } from "@prisma/client";

async function findIngredientsForRecipe(recipeId: string): Promise<any[]> {
  const ingredientCount = await prisma?.ingredientUsed.findMany({
    where: { recipeId: recipeId }, //return set of all ingredients that match the recipe
  });
  return ingredientCount?.map(async (a) => {
    return await prisma?.ingredient.findFirst({
      where: { id: a.ingredientId },
    });
  });
}

export default findIngredientsForRecipe;
