import React from "react";
import { trpc } from "../../utils/trpc";

const ListOfRecipesOneAway = () => {
  const { data, isLoading } = trpc.useQuery(["recipe.getRecipesClose"]);
  return (
    <div>
      <div className="grid grid-rows-3 grid-flow-col gap-4 bg-lime-900">
        {data && (
          <>
            {data.map((recipe, key) => {
              return (
                <React.Fragment key={key}>
                  <div className="row-span-6 place-content-center rounded-lg">
                    recipe image
                  </div>
                  <div className="col-span-5 text-center rounded-lg bg-lime-500">
                    {recipe?.name}
                  </div>
                  <div className="pl-3 row-span-5 gap-8 rounded-lg bg-lime-800 col-span-4">
                    {recipe?.description}
                  </div>
                  <div className="row-span-1 text-center rounded-lg col-span-1">
                    {recipe?.difficulty}
                  </div>
                </React.Fragment>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default ListOfRecipesOneAway;
