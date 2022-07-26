import Link from "next/link";
import { trpc } from "../utils/trpc";
import React from "react";
import fillRecipeList from "../scripts/MakeListFromRecipe";

const recipesPage = () => {
  const ReciData = trpc.useQuery(["example.getRecipesAble"]);
  const theList = fillRecipeList(ReciData.data);

  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <h1>List of possible recipes:</h1>
      <h2>Recipes currently possible with ingredients in database:</h2>
      <ul dangerouslySetInnerHTML={{ __html: theList.toString() }}></ul>
    </div>
  );
};

export default recipesPage;
