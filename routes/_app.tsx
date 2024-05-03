import type { State } from "../plugins/session.ts";
import { defineApp } from "$fresh/server.ts";
import { Navbar } from "../components/Navbar.tsx";

export default defineApp<State>((_req, ctx) => {
  const { sessionUser } = ctx.state;

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>linkedfolio</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Navbar loggedIn={!!sessionUser} />
        <ctx.Component />
      </body>
    </html>
  );
});
