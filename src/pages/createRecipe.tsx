import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";
import DynamicIngs from "./components/DynamicIngsSelect";
import GetCategoriesForOption from "./components/GetCategoryForOption";

const CreateRecipePage = () => {
  const utils = trpc.useContext();
  const makeRecipe = trpc.useMutation(["recipe.createRecipe"], {
    async onSuccess() {
      await utils.invalidateQueries(["recipe.getIngs"]);
      await utils.invalidateQueries(["recipe.getMissingIng"]);
      await utils.invalidateQueries(["recipe.getMissingIngAm"]);
    },
  });
  const getIngId = trpc.useQuery(["ingredient.getIdByName"]);
  const addIngredient = trpc.useMutation(["recipe.addIngredientToNewRec"]);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [instruction, setInstructions] = React.useState("");
  const [ingredientEntry, setIngredientEntry] = React.useState("");
  const [ingredientAmount, setIngredientAmount] = React.useState<number>(0);
  const [difficulty, setDifficulty] = React.useState<number>(0);
  const [cookTime, setCookTime] = React.useState<number>(0);
  const [season, setSeason] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [ingredientNames, setIngredientNames] = React.useState<
    { ingName: string }[]
  >([]);
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
      ingredients: ingredients,
    });

    // if (ingredients.length > 0) {
    //   ingredients.map(async (a) => {
    //     addIngredient.mutate({
    //       recipe: name,
    //       ingredientId: a.ingredientEntry,
    //       amountUsed: a.ingredientAmount,
    //     });
    //   });
    // }
  };

  return (
    <>
      <Link href="/AllRecipes">
        <a>List of All Recipes</a>
      </Link>
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

        <select
          onChange={(e) => setSeason(e.target.value)}
          placeholder="season"
        >
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
          <option value="fall">Fall</option>
          <option value="spring">Spring</option>
        </select>
        <button type="submit">
          make recipe (press this when ingredients all added)
        </button>
      </form>
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

          setIngredientAmount(0);
        }}
      >
        <select
          onChange={(e) => setCategory(e.target.value)}
          placeholder="category"
        >
          <GetCategoriesForOption />
        </select>
        {/* <select
          onChange={(e) => setIngredientEntry(e.target.value)}
          placeholder="ingredient"
        > */}
        <DynamicIngs
          ingredient={ingredientEntry}
          setIngredientEntry={setIngredientEntry}
          category={category}
        ></DynamicIngs>
        {/* </select> */}
        <input
          type="number"
          onChange={(e) => {
            console.log(e);
            setIngredientAmount(Number(e.target.value));
          }}
          defaultValue="0"
          placeholder="quantity Of Ingredient"
        />

        <button type="submit">Add Ingredient To Recipe</button>
        <span>
          <ul>
            {ingredients && (
              <>
                {ingredients.map((ingre, key) => {
                  return (
                    <React.Fragment key={key}>
                      <li>
                        {ingre.ingredientEntry} {ingre.ingredientAmount}
                      </li>
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </ul>
        </span>
      </form>
    </>
  );
};

export default CreateRecipePage;
