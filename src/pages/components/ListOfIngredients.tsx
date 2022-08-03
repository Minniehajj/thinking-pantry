import React from "react";
import { AsyncReturnType, trpc } from "../../utils/trpc";

const ListOfIngredients = () => {
  const utils = trpc.useContext();
  const { data, isLoading } = trpc.useQuery(["ingredient.getSortedIng"]);
  const addOne = trpc.useMutation(["ingredient.increaseIng"], {
    async onSuccess() {
      await utils.invalidateQueries(["ingredient.getSortedIng"]);
    },
  });
  const subtractOne = trpc.useMutation(["ingredient.reduceIng"], {
    async onSuccess() {
      await utils.invalidateQueries(["ingredient.getSortedIng"]);
    },
  });

  const adjustIngP = (ingId: { ingredientId: string }) => {
    addOne.mutate(ingId);
  };

  const adjustIngM = (ingId: { ingredientId: string }) => {
    subtractOne.mutate(ingId);
  };

  return (
    <div>
      <div className="grid gap-8 grid-cols-7 max-w-xl">
        {data && (
          <>
            {data.map((ingredient, key) => {
              const dayUseBy = new Date(ingredient.dayAcquired);
              dayUseBy.setDate(
                dayUseBy.getDate() + ingredient.category.daysGoodFor
              );
              return (
                <React.Fragment key={key}>
                  <span>{ingredient.name}</span>
                  <button
                    className="m-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => adjustIngP({ ingredientId: ingredient.id })}
                  >
                    +
                  </button>
                  <span>{ingredient.quantity}</span>
                  <button
                    className="m-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => adjustIngM({ ingredientId: ingredient.id })}
                  >
                    -
                  </button>
                  <span>{ingredient.category.name}</span>
                  <span>{ingredient.dayAcquired.toString().slice(0, 15)}</span>
                  <span>{dayUseBy.toString().slice(0, 15)}</span>
                </React.Fragment>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default ListOfIngredients;
