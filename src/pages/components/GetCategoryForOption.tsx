import React from "react";
import { trpc } from "../../utils/trpc";

const GetCategoriesForOption = () => {
  const { data, isLoading } = trpc.useQuery(["ingredient.getAllCategories"]);

  return (
    <>
      {data && (
        <>
          {data.map((cat, key) => {
            return (
              <React.Fragment key={key}>
                <option value={cat.name}>{cat.name}</option>
              </React.Fragment>
            );
          })}
        </>
      )}
    </>
  );
};

export default GetCategoriesForOption;
