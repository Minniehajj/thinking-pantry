import { Prisma } from "@prisma/client";

function fillRecipeList(
  recipeData: Prisma.RecipeUncheckedCreateInput[]
): string[] {
  return recipeData?.map((a) => {
    return `<li>${a.name} ${a.description} ${a.time} ${a.difficulty}</li>`;
  });
}

export default fillRecipeList;
