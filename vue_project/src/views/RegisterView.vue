<template>
  <transition name="page-fade" appear>
    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] sm:min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <transition name="card-scale-fade" appear>
        <div class="w-full max-w-md bg-white dark:bg-gray-800 p-6 sm:p-10 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 space-y-7">

          <div class="text-center">
            <div class="flex justify-center mb-5">
              <span class="inline-flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg ring-1 ring-gray-300 dark:ring-gray-600">
                <svg class="h-12 w-12 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </span>
            </div>
            <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
              Create your account
            </h2>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Join ChargerApp today to get started.
            </p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-6">
            <div>
              <label for="reg-username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  id="reg-username"
                  name="username"
                  type="email"
                  v-model="username"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full pl-11 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent sm:text-sm bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100"
                  placeholder="you@gmail.com"
                />
              </div>
            </div>

            <div>
              <label for="reg-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  v-model="password"
                  autocomplete="new-password"
                  required
                  class="appearance-none block w-full pl-11 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent sm:text-sm bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                     <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  v-model="confirmPassword"
                  autocomplete="new-password"
                  required
                  class="appearance-none block w-full pl-11 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent sm:text-sm bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div v-if="error" class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-600 rounded-md">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM10 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-700 dark:text-red-300">
                    {{ error }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="successMessage && !error" class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-400 dark:border-green-600 rounded-md">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                   <svg class="h-5 w-5 text-green-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-700 dark:text-green-300">
                    {{ successMessage }}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full group relative flex justify-center items-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gray-900 hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3" v-if="isLoading">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Registering...' : 'Create Account' }}
            </button>
          </form>

          <p class="!mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <router-link to="/login" class="font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 underline hover:no-underline">
              Sign in
            </router-link>
          </p>

        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      isLoading: false,
      error: null,
      successMessage: '',
    };
  },
  methods: {
    ...mapActions('auth', ['register']),
    async handleRegister() {
      this.error = null;
      this.successMessage = '';

      const trimmedEmail = this.username.trim();
      const gmailRegex = /^[^\s@]+@gmail\.com$/i;

      if (!trimmedEmail || !gmailRegex.test(trimmedEmail)) {
        this.error = 'Incorrect Gmail format. Please use an address like user@gmail.com.';
        return;
      }
      this.username = trimmedEmail;

      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match.';
        return;
      }

      if (!this.password) {
        this.error = 'Password cannot be empty.';
        return;
      }
      if (this.password.length < 8) {
        this.error = 'Password must be at least 8 characters long.';
        return;
      }


      this.isLoading = true;
      try {
        await this.register({ username: this.username, password: this.password });
        
        console.log('Registration successful, redirecting to dashboard...');
        this.$router.push('/dashboard');

      } catch (err) {
        console.error("Registration view error:", err);
        this.error = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.page-fade-enter-active, .page-fade-leave-active {
  transition: opacity 0.3s ease-out;
}
.page-fade-enter-from, .page-fade-leave-to {
  opacity: 0;
}

.card-scale-fade-enter-active {
  transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-delay: 0.1s;
}
.card-scale-fade-leave-active {
  transition: opacity 0.3s ease-in, transform 0.3s ease-in;
}
.card-scale-fade-enter-from,
.card-scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #111827 !important;
}

.dark input:-webkit-autofill,
.dark input:-webkit-autofill:hover,
.dark input:-webkit-autofill:focus,
.dark input:-webkit-autofill:active {
   -webkit-box-shadow: 0 0 0 30px #374151 inset !important;
   -webkit-text-fill-color: #f3f4f6 !important;
}
</style>