import { trpc } from "../src/utils/trpc";
import { ingredientRouter } from "/home/aminebady/personalProjects/thinking-pantry/src/server/router/ingredient";

function fillIngredientList(ingredientData: any[]): string[] {
  return ingredientData?.map((a) => {
    const dayUseBy = new Date(a.dayAcquired);
    dayUseBy.setDate(dayUseBy.getDate() + a.category.daysGoodFor);
    return `<li>${a.name}  ${a.quantity} ${a.category.name} ${JSON.stringify(
      a.dayAcquired
    ).slice(1, 11)} ${JSON.stringify(dayUseBy).slice(1, 11)}</li>`;
  });
}
export default fillIngredientList;

