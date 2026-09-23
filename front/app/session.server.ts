import { createCookieSessionStorage } from "react-router";

const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["s3cret1"],
  },
});

export const getUserToken = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("userToken");
};

export const commitUserToken = async ({
  request,
  userToken,
}: {
  request: Request;
  userToken: string;
}) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userToken", userToken);
  return await commitSession(session);
};
