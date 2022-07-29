import React from "react";
import { trpc } from "../../utils/trpc";

const ListOfIngUseSoon = () => {
  const { data, isLoading } = trpc.useQuery(["ingredient.getIngByDate"]);
  return (
    <div>
      <div className="grid gap-8 grid-cols-5 max-w-xl">
        {data && (
          <>
            {data.map((ingredient, key) => {
              const dayUseBy = new Date(ingredient.dayAcquired);
              const currDate = new Date();
              dayUseBy.setDate(
                dayUseBy.getDate() + ingredient.category.daysGoodFor
              );
              const diff = Math.floor(
                (Date.UTC(
                  dayUseBy.getFullYear(),
                  dayUseBy.getMonth(),
                  dayUseBy.getDate()
                ) -
                  Date.UTC(
                    currDate.getFullYear(),
                    currDate.getMonth(),
                    currDate.getDate()
                  )) /
                  (1000 * 60 * 60 * 24)
              );
              if (diff < 3) {
                return (
                  <React.Fragment key={key}>
                    <span>{ingredient.name}</span>
                    <span>{ingredient.quantity}</span>
                    <span>{ingredient.category.name}</span>
                    <span>
                      {ingredient.dayAcquired.toString().slice(0, 15)}
                    </span>
                    <span>{dayUseBy.toString().slice(0, 15)}</span>
                  </React.Fragment>
                );
              }
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default ListOfIngUseSoon;
