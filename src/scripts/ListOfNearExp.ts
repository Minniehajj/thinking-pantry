import { Prisma } from "@prisma/client";
import getCategory from "./CatFromIng";

function warningIng(
  ingredientData: Prisma.IngredientUncheckedCreateInput[]
): string[] {
  return ingredientData?.map((a) => {
    const dayUseBy = new Date(a.dayAcquired);
    const cat = getCategory(a);

    dayUseBy.setDate(dayUseBy.getDate() + cat.daysGoodFor);
    const diff = Math.floor(
      (Date.UTC(
        a.dayAcquired.getFullYear(),
        a.dayAcquired.getMonth(),
        a.dayAcquired.getDate()
      ) -
        Date.UTC(
          dayUseBy.getFullYear(),
          dayUseBy.getMonth(),
          dayUseBy.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
    if (diff < 3) {
      //if less than 3 days away:
      return `<li>${a.name}  ${a.quantity} ${a.category.name} ${JSON.stringify(
        a.dayAcquired
      ).slice(1, 11)} ${JSON.stringify(dayUseBy).slice(1, 11)}</li>`;
    } else {
      return "";
    }
  });
}
export default warningIng;
