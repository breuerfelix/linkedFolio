export default function Home() {
  return (
    <div
      class="py-20"
      style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
    >
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold mb-2 text-white">
          Create your personal Website in 5 Minutes!
        </h2>
        <h3 class="text-2xl mb-10 text-gray-200">
          All content needed will be populated from your LinkedIn Profile.
        </h3>

        <a href="/login" class="bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider">
          start now
        </a>
      </div>
    </div>
  );
}
