<template>
  <div class="flex flex-col items-center justify-center text-center py-20 px-4">
    <svg class="w-32 h-32 text-blue-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 16H9.01M15 16H15.01M12 8V8.01"></path></svg>
    <h1 class="text-5xl sm:text-6xl font-extrabold text-gray-800 mb-3">404</h1>
    <p class="text-2xl font-semibold text-gray-600 mb-6">Page Not Found</p>
    <p class="text-gray-500 max-w-md mx-auto mb-8">
      Sorry, we couldn't find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.
    </p>
    <router-link to="/"
                 class="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out">
      Go to Homepage
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView',
};
</script>