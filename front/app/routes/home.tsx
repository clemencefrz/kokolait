import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Kokolait" }];
}

export default function Home() {
  return <h1>Welcome</h1>;
}
