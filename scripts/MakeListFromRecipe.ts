import { trpc } from "../src/utils/trpc";
import { recipeRouter } from "../src/server/router/recipe";
import { ingredientRouter } from "../src/server/router/ingredient";

function fillRecipeList(recipeData: any[]): string[] {
  
  return recipeData?.map((a) => {
    return `<li>${a.name} ${a.description} ${a.time} ${a.difficulty}</li>`;
  });
}

export default fillRecipeList;
