import Link from "next/link";
import React from "react";
import ListOfIngredients from "./components/ListOfIngredients";
import ListOfIngUseSoon from "./components/ListOfUseSoon";

const ingredientPage = () => {
  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center p-4 overflow-y-scroll m-auto">
      <Link href="/">
        <a>Home</a>
      </Link>
      <h1>List of Ingredients:</h1>

      <div className="grid gap-6 grid-cols-5 max-w-xl">
        <>
          <span>name: </span>
          <span>quantity: </span>
          <span>category: </span>
          <span>day acquired: </span>
          <span>day use by: </span>
        </>
      </div>
      <div>
        <ListOfIngredients />
      </div>
      <h2>List of ing to be used soon!</h2>
      <div>
        <ListOfIngUseSoon />
      </div>
    </div>
  );
};

export default ingredientPage;
