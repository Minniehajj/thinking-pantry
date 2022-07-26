import React from "react";
import { AsyncReturnType, trpc } from "../../utils/trpc";

const ListOfIngredients = () => {
  const { data, isLoading } = trpc.useQuery(["ingredient.getSortedIng"]);
  return (
    <div>
      <div className="grid gap-8 grid-cols-5 max-w-xl">
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
                  <span>{ingredient.quantity}</span>
                  <span>{ingredient.category.name}</span>
                  <span>{ingredient.dayAcquired.toString()}</span>
                  <span>{dayUseBy.toString()}</span>
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
