import { Form, Link, useActionData } from "react-router";
import type { Route } from "./+types/register";
import { z } from "zod";
import { authenticateUser } from "~/session.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Inscription - Kokolait" }];
}

const registerSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
  firstName: z.string(),
});

const tokenSchema = z.object({
  access_token: z.string().optional(),
  message: z.string().optional(),
  error: z.boolean().optional(),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const jsonData = Object.fromEntries(formData);

  const parsedJson = registerSchema.parse(jsonData); // Throws an error if jsonData has not the expected properties.

  const response = await fetch("http://localhost:8000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsedJson),
  });

  const responseJson = await response.json();

  console.log("responseJson", responseJson);

  const { access_token, error, message } = tokenSchema.parse(responseJson);

  if (error || !access_token) {
    return { error, message };
  }

  return await authenticateUser({ request, userToken: access_token });
}

export default function Register() {
  const actionData = useActionData<typeof action>();

  console.log(
    "actionData?.error",
    actionData?.error,
    "actionData?.message",
    actionData?.message,
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Form method="POST" className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">Inscription</h1>
        {actionData?.error && (
          <p className="text-sm text-red-600">{actionData.message}</p>
        )}
        <input
          type="text"
          name="firstName"
          placeholder="Prénom"
          className="rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700"
        />
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
          Créer mon compte
        </button>
        <p className="text-sm">
          Déjà un compte ?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </Form>
    </div>
  );
}
