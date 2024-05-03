import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import auth from "./plugins/kv_oauth.ts";
import session from "./plugins/session.ts";

export default defineConfig({
  plugins: [tailwind(), auth, session],
});
