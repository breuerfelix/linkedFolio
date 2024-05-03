import type { Plugin } from "$fresh/server.ts";
import { createHelpers } from "jsr:@deno/kv-oauth";
import { handleCallback } from "./oauth/handle_callback.ts";
import type { User } from "../utils/types.ts";
import { createUser, getUser, updateUserSession } from "../utils/db.ts";

function getRequiredEnv(key: string): string {
  const value = Deno.env.get(key);
  if (value === undefined) {
    throw new Error(`"${key}" environment variable must be set`);
  }
  return value;
}

async function fetchLinkedInUser(token: string): Promise<User> {
  const res = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Error fetching linkedin User: ${res.body}`);
  }

  const {
    sub,
    email,
    name,
  } = await res.json();

  return {
    id: sub,
    name,
    email,
  };
}

const clientId = getRequiredEnv("CLIENT_ID");
const clientSecret = getRequiredEnv("CLIENT_SECRET");
const redirectUri = Deno.env.get("REDIRECT_URI") ||
  "http://localhost:8000/callback";

const client = {
  clientId,
  // clientSecret not needed here
  authorizationEndpointUri: "https://www.linkedin.com/oauth/v2/authorization",
  tokenUri: "https://www.linkedin.com/oauth/v2/accessToken",
  // TODO: read in from env and change to production url
  redirectUri,
  defaults: {
    requestOptions: {
      body: {
        client_id: clientId,
        client_secret: clientSecret,
        code_verifier: "",
      },
    },
    scope: ["openid", "email", "profile"],
  },
};

const { signIn, signOut, getSessionId } = createHelpers(client);
export { getSessionId };

export default {
  name: "kv-oauth",
  routes: [
    {
      path: "/login",
      handler: signIn,
    },
    {
      path: "/callback",
      async handler(req) {
        const {
          response,
          sessionId,
          tokens: {
            accessToken,
          },
        } = await handleCallback(req, client);
        const user = await fetchLinkedInUser(accessToken);
        const existingUser = await getUser(user.id);

        if (!existingUser) {
          await createUser(user, sessionId);
        } else {
          await updateUserSession(existingUser, sessionId);
        }

        return response;
      },
    },
    {
      path: "/logout",
      // NOTE: in the future also remove the session from store
      handler: signOut,
    },
  ],
} as Plugin;
