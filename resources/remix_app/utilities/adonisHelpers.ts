import User from "#models/user";
import { AppLoadContext } from "@remix-run/node";

export const getDomainUrl = (request: any): string => {
  const host =
    request.headers().host;

  if (!host) {
    throw new Error("Could not determine domain URL.");
  }

  const protocol =
    host.includes("localhost") || host.includes("127.0.0.1")
      ? "http"
      : "https";
  return `${protocol}://${host}`;
};

export async function getAuthenticatedUser(context: AppLoadContext) {
  const auth = context.http.auth;

  // for non-authenticated routes the logged-in user won't
  // be available until we call auth.check()
  await auth.check();

  // Now we can get attributes of the logged-in user, if any.
  const user: Record<string, any> = auth.user as User;
  // console.log('profile loader', {user})
  return user;
}
