import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { trpc } from "../../utils/trpc";
import { prisma } from "../../server/db/client";
import ListOfIngMiss from "../components/ListOfMissingIng";
import ListOfIngForRecipe from "../components/ListOfIngForRec";

export default function Recipe({ data }: { data: string }) {
  const name = data.replaceAll("_", " ");
  const recipe = trpc.useQuery([
    "recipe.getRecipeByName",
    { recipeName: name },
  ]);

  return (
    <>
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
  console.log(slug);
  return {
    props: {
      data: slug[0],
    },
  };
};
