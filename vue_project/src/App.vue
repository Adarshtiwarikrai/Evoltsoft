<template>
  <template v-if="isLandingPage">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transitionName || 'fade-landing'" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </template>

  <template v-else>
    <div 
      id="app-container-layout" 
      class="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-slate-200"
    >
      <Navbar />

      <main class="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transitionName || 'fade-app'" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <footer 
        class="bg-gray-800 dark:bg-slate-950 text-white dark:text-slate-300 text-center p-4 text-sm print:hidden border-t border-gray-700 dark:border-slate-700"
      >
        <p>© {{ new Date().getFullYear() }} Charging Station Finder</p>
      </footer>
    </div>
  </template>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { mapActions } from 'vuex';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const isLandingPage = computed(() => route.name === 'Landing');

    return {
      isLandingPage,
    };
  },
  methods: {
    ...mapActions('auth', ['fetchUserProfile'])
  },
  created() {
    if (this.$store.getters['auth/isAuthenticated']) { 
      this.fetchUserProfile().catch(err => {
        console.warn("App.vue created: Session potentially expired or user not found on refresh during fetchUserProfile.", err);
      });
    }
  }
};
</script>

<style>
.fade-landing-enter-active,
.fade-landing-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-landing-enter-from,
.fade-landing-leave-to {
  opacity: 0;
}

.fade-app-enter-active,
.fade-app-leave-active {
  transition: opacity 0.25s ease-out;
}
.fade-app-enter-from,
.fade-app-leave-to {
  opacity: 0;
}

</style>