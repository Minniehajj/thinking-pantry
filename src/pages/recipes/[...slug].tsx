import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { trpc } from "../../utils/trpc";
import { prisma } from "../../server/db/client";
import ListOfIngMiss from "../components/ListOfMissingIng";
import ListOfIngForRecipe from "../components/ListOfIngForRec";
import Link from "next/link";

export default function Recipe({ data }: { data: string }) {
  const utils = trpc.useContext();
  const name = data.replaceAll("_", " ");
  const recipe = trpc.useQuery([
    "recipe.getRecipeByName",
    { recipeName: name },
  ]);

  const cookRecipe = trpc.useMutation(["recipe.cookRecipe"], {
    async onSuccess() {
      await utils.invalidateQueries(["recipe.getIngs"]);
      await utils.invalidateQueries(["recipe.getMissingIng"]);
      await utils.invalidateQueries(["recipe.getMissingIngAm"]);
    },
  });

  const cook = (
    recId: void | { recipeId?: string | null | undefined } | null | undefined
  ) => {
    cookRecipe.mutate(recId);
  };

  return (
    <>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/AllRecipes">
        <a>List of All Recipes</a>
      </Link>
      <Link href="/ingredients">
        <a>List of Ingredients</a>
      </Link>
      <div>
        <h1>{recipe.data?.name}</h1>
      </div>
      <div>
        <h2>{recipe.data?.description}</h2>
      </div>
      <div>
        <h2>{recipe.data?.instructions}</h2>
      </div>
      <h1>List of Ingredients:</h1>
      <ListOfIngForRecipe recId={recipe?.data?.id ?? ""} />
      <h1>List of Ingredients Missing:</h1>
      <div className="grid gap-6 grid-cols-5 max-w-xl">
        <></>
      </div>
      <ListOfIngMiss recId={recipe?.data?.id ?? ""} />
      <button
        className="m-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={async () => cook({ recipeId: recipe.data?.id })}
      >
        make recipe!
      </button>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await prisma?.recipe.findMany();

  const slugs = data?.map((a) => {
    return {
      params: {
        slug: [a?.name?.replaceAll(" ", "_")],
      },
    };
  });

  return {
    paths: slugs ?? [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const slug = context?.params?.slug || [];
  return {
    props: {
      data: slug[0],
    },
  };
};
