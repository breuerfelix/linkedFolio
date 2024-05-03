// Copyright 2023-2024 the Deno authors. All rights reserved. MIT license.
import {
  OAuth2Client,
  type OAuth2ClientConfig,
  type Tokens,
} from "https://deno.land/x/oauth2_client@v1.0.2/mod.ts";
import { SECOND } from "jsr:@std/datetime@^0.221.0";
import { type Cookie, getCookies, setCookie } from "jsr:@std/http@^0.221.0";
import {
  COOKIE_BASE,
  getCookieName,
  isHttps,
  OAUTH_COOKIE_NAME,
  redirect,
  SITE_COOKIE_NAME,
} from "./http.ts";
import { getAndDeleteOAuthSession, setSiteSession } from "./kv.ts";

export interface HandleCallbackOptions {
  cookieOptions?: Partial<Cookie>;
}

export async function handleCallback(
  request: Request,
  oauthConfig: OAuth2ClientConfig,
  options?: HandleCallbackOptions,
): Promise<{
  response: Response;
  sessionId: string;
  tokens: Tokens;
}> {
  const oauthCookieName = getCookieName(
    OAUTH_COOKIE_NAME,
    isHttps(request.url),
  );
  const oauthSessionId = getCookies(request.headers)[oauthCookieName];
  if (oauthSessionId === undefined) throw new Error("OAuth cookie not found");
  const oauthSession = await getAndDeleteOAuthSession(oauthSessionId);

  // NOTE: this is the only modified file
  const tokens = await new OAuth2Client(oauthConfig)
    .code.getToken(request.url, { ...oauthSession, codeVerifier: "" });

  const sessionId = crypto.randomUUID();
  const response = redirect(oauthSession.successUrl);
  const cookie: Cookie = {
    ...COOKIE_BASE,
    name: getCookieName(SITE_COOKIE_NAME, isHttps(request.url)),
    value: sessionId,
    secure: isHttps(request.url),
    ...options?.cookieOptions,
  };
  setCookie(response.headers, cookie);
  await setSiteSession(
    sessionId,
    cookie.maxAge ? cookie.maxAge * SECOND : undefined,
  );

  return {
    response,
    sessionId,
    tokens,
  };
}
