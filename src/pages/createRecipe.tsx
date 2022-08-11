import React from "react";
import { trpc } from "../utils/trpc";
import AddIngredientToNewRecipe from "./components/AddIngredientMakeRecipe";
import DynamicIngs from "./components/DynamicIngsSelect";

const CreateRecipePage = () => {
  const makeRecipe = trpc.useMutation(["recipe.createRecipe"]);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [instruction, setInstructions] = React.useState("");
  const [ingredientEntry, setIngredientEntry] = React.useState("");
  const [ingredientAmount, setIngredientAmount] = React.useState<number>(0);
  const [difficulty, setDifficulty] = React.useState<number>(0);
  const [cookTime, setCookTime] = React.useState<number>(0);
  const [season, setSeason] = React.useState("");
  const [category, setCategory] = React.useState("Dairy");
  const [ingredients, setIngredients] = React.useState<
    {
      ingredientEntry: string;
      ingredientAmount: number;
    }[]
  >([]);

  const submitForm = () => {
    makeRecipe.mutate({
      recipeName: name,
      recipeDesc: description,
      recipeInstructions: instruction,
      recipeTime: cookTime,
      recipeDiff: difficulty,
      season: season,
    });

    if (ingredients.length > 0) {
    }
  };

  return (
    <>
      <form onSubmit={submitForm}>
        <input
          type="text"
          className="border p-2"
          name="Name"
          placeholder="Name of Recipe"
          onChange={(e) => setName(e.target.value)}
        ></input>
        <input
          type="text"
          className="border p-2"
          name="Name"
          placeholder="Description of Recipe"
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <input
          type="text"
          className="border p-2"
          name="Name"
          placeholder="Recipe Instructions"
          onChange={(e) => setInstructions(e.target.value)}
        ></input>

        <input
          type="number"
          className="border p-2"
          name="Name"
          placeholder="Recipe difficulty (1-5)"
          onChange={(e) =>
            setDifficulty(Math.max(0, Math.min(5, parseInt(e.target.value))))
          }
        ></input>
        <input
          type="number"
          className="border p-2"
          name="Name"
          placeholder="Recipe time"
          onChange={(e) => setCookTime(parseInt(e.target.value))}
        ></input>

        <select onChange={(e) => setSeason(e.target.value)}>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
          <option value="fall">Fall</option>
          <option value="spring">Spring</option>
        </select>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (ingredients?.length > 0) {
              setIngredients([
                ...ingredients,
                { ingredientEntry, ingredientAmount },
              ]);
            } else {
              setIngredients([{ ingredientEntry, ingredientAmount }]);
            }
            setIngredientEntry("");
          }}
        >
          <select onChange={(e) => setCategory(e.target.value)}>
            <option value="Dairy">Dairy</option>
            <option value="Raw Meat">Raw Meat</option>
            <option value="Bread">Bread</option>
            <option value="Vegetable">Vegetable</option>
          </select>
          <select onChange={(e) => setIngredientEntry(e.target.value)}>
            <DynamicIngs category={category}></DynamicIngs>
          </select>
          <input
            type="number"
            onChange={(e) => setIngredientAmount(Number(e.target.value))}
          >
            <button
              className="m-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIngredientAmount(ingredientAmount + 1)}
            >
              +
            </button>
            <span>{ingredientAmount}</span>
            <button
              className="m-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() =>
                setIngredientAmount(Math.max(0, ingredientAmount - 1))
              }
            >
              -
            </button>
          </input>

          <button type="submit">Add Ingredient To Recipe</button>
        </form>
      </form>
    </>
  );
};

export default CreateRecipePage;
