import Link from "next/link";
import { ingredientRouter } from "../server/router/ingredient";
import { AsyncReturnType, trpc } from "../utils/trpc";
import React from "react";
import fillIngredientList from "../scripts/ListOfIngredients";
import warningIng from "../scripts/ListOfNearExp";

const ingredientPage = async () => {
  const ingData = trpc.useQuery(["ingredient.getSortedIng"]);

  const ingWarnData = trpc.useQuery(["ingredient.getIngByDate"]);
  type QueryRet = AsyncReturnType<typeof ingData.data>;
  const warningList = warningIng(ingWarnData?.data);
  const theList = fillIngredientList(ingData?.data);

  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <h1>List of Ingredients:</h1>
      <h2>
        name: quanity: date acquired: day to be used by: days still good for:
      </h2>
      <ul dangerouslySetInnerHTML={{ __html: theList.toString() }}></ul>
    </div>
  );
};

export default ingredientPage;
