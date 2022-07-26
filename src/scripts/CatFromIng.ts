import { Prisma } from "@prisma/client";

async function getCategory(ingredient: Prisma.IngredientUncheckedCreateInput) {
  return prisma?.category.findFirst({
    where: { id: ingredient.categoryId },
  });
}

export default getCategory;
