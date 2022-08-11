import React from "react";
import { trpc } from "../../utils/trpc";

const DynamicIngs = ({ category }: { category: string }) => {
  const { data, isLoading } = trpc.useQuery([
    "ingredient.getAllByCat",
    { category: category },
  ]);

  return (
    <>
      {data && (
        <>
          {data.map((a, key) => {
            return (
              <React.Fragment key={key}>
                <option value={a.name}>{a.name}</option>
              </React.Fragment>
            );
          })}
        </>
      )}
    </>
  );
};

export default DynamicIngs;
