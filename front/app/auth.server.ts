import z from "zod";
import { getUserToken, logout } from "./session.server";

const getAuthenticatedUserSchema = z.object({
  email: z.string(),
  firstName: z.string(),
});

export const getOptionalUser = async ({ request }: { request: Request }) => {
  const userToken = await getUserToken({ request });

  if (userToken === undefined) {
    return null;
  }
  try {
    const response = await fetch("http://localhost:8000/auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    const data = await response.json();

    const user = getAuthenticatedUserSchema.parse(data);

    return user;
  } catch (error) {
    throw await logout({ request });
  }
};
