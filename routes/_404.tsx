import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div
        class="py-20"
        style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
      >
        <div class="container mx-auto px-6">
          <h2 class="text-4xl font-bold mb-10 text-white">404 - Not Found</h2>
          <a
            href="/"
            class="bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider"
          >
            home
          </a>
        </div>
      </div>
    </>
  );
}
