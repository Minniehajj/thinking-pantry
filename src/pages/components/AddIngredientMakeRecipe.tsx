import React from "react";
import DynamicIngs from "./DynamicIngsSelect";

const AddIngredientToNewRecipe = () => {
  const [category, setCategory] = React.useState("Dairy");
  const [name, setName] = React.useState("");
  const [numberUsed, setNumberUsed] = React.useState(0);

  return (
    <>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="Dairy">Dairy</option>
        <option value="Raw Meat">Raw Meat</option>
        <option value="Bread">Bread</option>
        <option value="Vegetable">Vegetable</option>
      </select>

      <select onChange={(e) => setName(e.target.value)}>
        <DynamicIngs category={category}></DynamicIngs>
      </select>
      <button
        className="m-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setNumberUsed(numberUsed + 1)}
      >
        +
      </button>
      <span>{numberUsed}</span>
      <button
        className="m-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setNumberUsed(Math.max(0, numberUsed - 1))}
      >
        -
      </button>
      </>
    
    
  );
};

export default AddIngredientToNewRecipe;
