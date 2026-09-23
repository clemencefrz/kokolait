import {
  Form,
  redirect,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import type { Route } from "./+types/home";
import z from "zod";
import { commitUserToken, getUserToken } from "~/session.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Kokolait" }];
}

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const tokenSchema = z.object({
  access_token: z.string(),
});

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<{ isLoggedIn: boolean }> => {
  const userToken = await getUserToken({ request });
  const isLoggedIn = Boolean(userToken);
  return { isLoggedIn };
};

export async function action({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const jsonData = Object.fromEntries(formData);

  const parsedJson = loginSchema.parse(jsonData); // Throws an error if jsonData has not the expected properties.

  const response = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsedJson),
  });

  const { access_token } = tokenSchema.parse(await response.json());
  console.log({ access_token });

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitUserToken({
        request,
        userToken: access_token,
      }),
    },
  });
}

export default function Home() {
  const { isLoggedIn } = useLoaderData<typeof loader>();
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Form method="POST" className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">Formulaire</h1>
        <span>{isLoggedIn ? "Connectée" : "Pas connectée"}</span>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
          className="rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
        >
          Envoyer
        </button>
      </Form>
    </div>
  );
}
