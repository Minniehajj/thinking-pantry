import { trpc } from "../utils/trpc";
import { recipeRouter } from "../server/router/recipe";
import recipesPage from "../pages/recipes";
import { Prisma } from "@prisma/client";

async function findIngredientsForRecipe(recipeId: string) {
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
