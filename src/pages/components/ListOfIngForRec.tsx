import React from "react";
import { trpc } from "../../utils/trpc";

const ListOfIngForRecipe = ({ recId }: { recId: string }) => {
  const utils = trpc.useContext();
  const { data, isLoading } = trpc.useQuery([
    "recipe.getIngs",
    { recipeId: recId },
  ]);

  const addOne = trpc.useMutation(["recipe.increaseIngUsed"], {
    async onSuccess() {
      await utils.invalidateQueries(["recipe.getIngs"]);
      await utils.invalidateQueries(["recipe.getMissingIngAm"]);
    },
  });
  const subtractOne = trpc.useMutation(["recipe.reduceIngUsed"], {
    async onSuccess() {
      await utils.invalidateQueries(["recipe.getIngs"]);
      await utils.invalidateQueries(["recipe.getMissingIngAm"]);
    },
  });

  const useIngredientForRecipe = trpc.useMutation(["ingredient.useIngRecipe"], {
    async onSuccess() {
      await utils.invalidateQueries(["recipe.getIngs"]);
      await utils.invalidateQueries(["recipe.getMissingIngAm"]);
    },
  });

  const useTheRecipe = async () => {
    data?.map(async (a) => {
      useIngredientForRecipe.mutate({
        amountUsed: a.IngredientUsed[0]?.amountUsed,
        ingredientId: a.id,
      });
    });
  };
  const adjustP = (
    ingId: { ingredientId: string },
    recipe: { recipeId: string }
  ) => {
    addOne.mutate({
      recipeId: recipe.recipeId,
      ingredientId: ingId.ingredientId,
    });
  };

  const adjustM = (
    ingId: { ingredientId: string },
    recipe: { recipeId: string }
  ) => {
    subtractOne.mutate({
      recipeId: recipe.recipeId,
      ingredientId: ingId.ingredientId,
    });
  };
  console.log(data);
  return (
    <div>
      <div className="grid gap-8 grid-cols-5 max-w-xl">
        {data && (
          <>
            {data.map((ing, key) => {
              console.log(ing);
              return (
                <React.Fragment key={key}>
                  <span>{ing?.name}</span>
                  <span>{ing?.quantity}</span>
                  <button
                    className="m-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                      adjustP({ ingredientId: ing.id }, { recipeId: recId })
                    }
                  >
                    +
                  </button>
                  <span>{ing?.IngredientUsed[0]?.amountUsed}</span>
                  <button
                    className="m-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                      adjustM({ ingredientId: ing.id }, { recipeId: recId })
                    }
                  >
                    -
                  </button>
                </React.Fragment>
              );
            })}
            ;
          </>
        )}
        {/* <button
          className="m-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => useTheRecipe}
        >
          make recipe!
        </button> */}
      </div>
    </div>
  );
};

export default ListOfIngForRecipe;
