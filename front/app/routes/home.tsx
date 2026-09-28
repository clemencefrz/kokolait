import { Form } from "react-router";
import type { Route } from "./+types/home";
import z from "zod";
import { authenticateUser } from "~/session.server";
import { useOptionalUser } from "~/root";

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

  const responseJson = await response.json();

  const { access_token } = tokenSchema.parse(responseJson);

  return await authenticateUser({ request, userToken: access_token });
}

export default function Home() {
  const user = useOptionalUser();

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <h1 className="text-2xl font-bold">Bonjour {user.firstName} !</h1>
          <p>Tu es connectée avec l'adresse {user.email}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Form method="POST" className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">Connexion</h1>
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
