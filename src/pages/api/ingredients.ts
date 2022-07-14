// src/pages/api/ingredients.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const ingredients = async (req: NextApiRequest, res: NextApiResponse) => {
  const ingredient = await prisma.ingredient.findMany();
  res.status(200).json(ingredient);
};

export default ingredients;
