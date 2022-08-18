import React, { Dispatch, SetStateAction, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import ingredientPage from "../ingredients";

const DynamicIngsIndex = ({
  category: category,
  ingredient: name,
  setIngredientEntry: updateIng,
}: {
  category: string;
  ingredient: string;
  setIngredientEntry: Dispatch<SetStateAction<string>>;
}) => {
  const { data, isLoading } = trpc.useQuery([
    "ingredient.getAllByCat",
    { category: category },
  ]);

  useEffect(() => {
    if (data && data[0]) {
      updateIng(data[0].name);
    }
  }, [data, updateIng]);

  return (
    <>
      <select
        onChange={(e) => {
          updateIng(e.target.value);
        }}
        placeholder="ingredient"
      >
        {data && (
          <>
            {data.map((a, key) => {
              return (
                <React.Fragment key={key}>
                  <option value={a.name} selected={a.name === name}>
                    {a.name}
                  </option>
                </React.Fragment>
              );
            })}
          </>
        )}
      </select>
    </>
  );
};

export default DynamicIngsIndex;
