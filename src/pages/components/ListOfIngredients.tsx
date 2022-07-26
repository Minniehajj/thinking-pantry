import { AsyncReturnType, trpc } from "../../utils/trpc";

const ListOfIngredients = () => {
  const { data, isLoading } = trpc.useQuery(["ingredient.getSortedIng"]);
  return (
    <div>
      <ul>
        {data && (
          <>
            {data.map((ingredient, key) => {
              const dayUseBy = new Date(ingredient.dayAcquired);
              dayUseBy.setDate(
                dayUseBy.getDate() + ingredient.category.daysGoodFor
              );
              return (
                <li key={key}>
                  <>
                    {ingredient.name}
                    {ingredient.quantity}
                    {ingredient.category.name}
                    {ingredient.dayAcquired.toString()}
                    {dayUseBy.toString()}
                  </>
                </li>
              );
            })}
          </>
        )}
      </ul>
    </div>
  );
};

export default ListOfIngredients;
