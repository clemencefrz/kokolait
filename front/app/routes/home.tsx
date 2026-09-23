import { Form } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Kokolait" }];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const jsonData = Object.fromEntries(formData);
  alert(`formData: ${formData}, jsonData: ${jsonData}`);

  const response = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    body: JSON.stringify(jsonData),
  });
  console.log({ response });
  const token = await response.json();
  console.log({ token });
  return null;
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Form method="POST" className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">Formulaire</h1>
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
