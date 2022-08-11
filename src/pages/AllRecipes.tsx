import Link from "next/link";
import ListOfRecipes from "./components/ListOfRecipes";

const recipesPage = () => {
  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/ingredients">
        <a>Ingredients</a>
      </Link>
      <Link href="/createRecipe">
        <a>Make Recipe</a>
      </Link>
      <div className="w-screen min-h-screen flex flex-col items-center p-4 overflow-y-scroll m-auto">
        <h1>List of all recipes:</h1>
        <div>
          <ListOfRecipes />
        </div>
      </div>
    </div>
  );
};

export default recipesPage;
