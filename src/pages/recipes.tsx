import Link from "next/link";
import { trpc } from "../utils/trpc";
import React from "react";
import ListOfRecipesCanUse from "./components/ListOfPossible";
import ListOfRecipesOneAway from "./components/OneIngAway";

const recipesPage = () => {
  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/AllRecipes">
        <a>All Recipes</a>
      </Link>
      <h1>List of possible recipes:</h1>
      <h2>Recipes currently possible with ingredients in database:</h2>
      <div>
        <ListOfRecipesCanUse />
      </div>
      <h2>Recipes Missing only one ingredient!</h2>
      <ListOfRecipesOneAway />
    </div>
  );
};

export default recipesPage;
