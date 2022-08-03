import React from "react";
import { trpc } from "../../utils/trpc";

const ListOfIngMiss = ({ recId }: { recId: string }) => {
  const { data, isLoading } = trpc.useQuery([
    "recipe.getMissingIngAm",
    { recipeId: recId },
  ]);

  return (
    <div>
      <div className="grid gap-8 grid-cols-5 max-w-xl">
        {data && (
          <>
            {data.map((ing, key) => {
              return (
                <React.Fragment key={key}>
                  <span>{ing?.name}</span>
                  <span>{ing?.quantity}</span>
                  <span>{ing?.IngredientUsed[0]?.amountUsed}</span>
                </React.Fragment>
              );
            })}
            ;
          </>
        )}
      </div>
    </div>
  );
};

export default ListOfIngMiss;
