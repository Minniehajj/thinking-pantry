import { Prisma } from "@prisma/client";
import { AsyncReturnType, trpc } from "../utils/trpc";

const ingData = trpc.useQuery(["ingredient.getSortedIng"]);



function fillIngredientList(ingredientData) {
  return ingredientData?.map((a) => {
    const dayUseBy = new Date(a.dayAcquired);
    dayUseBy.setDate(dayUseBy.getDate() + a.category.daysGoodFor);
    return `<li>${a.name}  ${a.quantity} ${a.category.name} ${JSON.stringify(
      a.dayAcquired
    ).slice(1, 11)} ${JSON.stringify(dayUseBy).slice(1, 11)}</li>`;
  });
}
export default fillIngredientList;
