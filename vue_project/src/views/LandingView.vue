<template>
  <section 
    class="landing-hero-section min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden"
  >
    <div class="absolute inset-0 -z-10 opacity-5 dark:opacity-[0.03]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="subtleGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#subtleGrid)"/>
      </svg>
    </div>
    
    <transition name="content-swoop-fade-up" appear>
      <div class="max-w-3xl relative z-10">
        <div class="mb-8">
          <span class="inline-flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg ring-1 ring-gray-300 dark:ring-gray-600">
            <svg class="h-12 w-12 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </span>
        </div>

        <h1 
          class="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter mb-6 text-gray-900 dark:text-gray-50 min-h-[3rem] sm:min-h-[3.75rem] md:min-h-[4.5rem]"
        >
          {{ displayedHeroText }}<span class="typing-cursor" v-if="heroTypingActive"></span>
        </h1>
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Effortlessly locate, manage, and navigate to EV charging stations.
          Power up your journey with ChargerApp.
        </p>
        <div class="space-y-4 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row justify-center">
          <button
            @click="goToRegister"
            class="group relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gray-900 rounded-xl shadow-xl hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-gray-500/50 dark:focus:ring-gray-300/70 overflow-hidden"
          >
            <span class="absolute w-0 h-0 transition-all duration-300 ease-out bg-white dark:bg-gray-600 rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
            <span class="relative">Get Started Free</span>
          </button>
          <button
            @click="goToLogin"
            class="w-full sm:w-auto text-gray-700 dark:text-gray-300 font-semibold py-4 px-10 rounded-xl text-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    </transition>
  </section>

  <section class="landing-features-section py-20 sm:py-28 relative border-t border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 sm:mb-20">
        <h2 
          ref="featuresTitleContainerRef" 
          class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 min-h-[2.25rem] sm:min-h-[2.5rem] lg:min-h-[3rem]"
        >
           {{ displayedFeaturesText }}<span class="typing-cursor" v-if="featuresTypingActive"></span>
        </h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          ChargerApp provides a seamless experience for every EV owner.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        <transition-group name="card-swoop-fade-up" tag="div" class="contents" appear>
          <div 
            v-for="(feature, index) in features" 
            :key="feature.title" 
            class="feature-card group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-2 hover:border-black dark:hover:border-black"
            :style="{ 'transition-delay': `${index * 0.1}s` }"
          >
            <div class="mb-6 flex justify-center">
              <component 
                :is="feature.icon" 
                class="h-12 w-12 text-gray-600 dark:text-gray-400 transition-all duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 group-hover:scale-110"
                aria-hidden="true" />
            </div>
            <h3 class="text-xl sm:text-2xl font-semibold mb-3 text-center text-gray-800 dark:text-gray-100 transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-50">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-base text-center leading-relaxed">{{ feature.description }}</p>
          </div>
        </transition-group>
      </div>
    </div>
  </section>

  <section class="landing-cta-section bg-gray-100 dark:bg-gray-800 py-16 sm:py-20 border-t border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <transition name="content-swoop-fade-up" appear> 
        <div>
          <h2 
            ref="ctaTitleContainerRef"
            class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 min-h-[2.25rem] sm:min-h-[2.5rem]"
          >
            {{ displayedCtaText }}<span class="typing-cursor" v-if="ctaTypingActive"></span>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            Join thousands of EV drivers who trust ChargerApp. Get started today for free!
          </p>
          <button
            @click="goToRegister"
            class="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gray-900 rounded-xl shadow-xl hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-gray-500/50 dark:focus:ring-gray-300/70 overflow-hidden"
          >
            <span class="absolute w-0 h-0 transition-all duration-300 ease-out bg-white dark:bg-gray-600 rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
            <span class="relative">Create Your Account</span>
          </button>
        </div>
      </transition>
    </div>
  </section>

  <footer class="landing-footer-section py-12 sm:py-16 text-center border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <p class="text-gray-500 dark:text-gray-400 text-sm">
      © {{ new Date().getFullYear() }} ChargerApp. Powering your EV adventures.
    </p>
  </footer>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, shallowRef, onMounted, onUnmounted } from 'vue';

const IconMapPin = { 
  name: 'IconMapPin',
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>` 
};
const IconCogSettings = { 
  name: 'IconCogSettings',
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.142.854.108 1.204l.527.738c.32.447.27.96-.12 1.45l-.773.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.93l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-.96.27-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.272.806.108-1.204-.165-.397-.505.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.764-.383.93-.78.164-.398.142-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773c.39-.39.902-.44 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.893z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`
};
const IconShieldCheck = { 
  name: 'IconShieldCheck',
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.306-.222-2.56-.623-3.751A11.959 11.959 0 0112 2.75c-2.175 0-4.206.633-5.998 1.714z" /></svg>`
};

export default {
  name: 'LandingView',
  components: {
    IconMapPin, IconCogSettings, IconShieldCheck
  },
  setup() {
    const router = useRouter();

    const features = ref([
      { title: 'Live Station Map', description: 'Visualize charger availability with our interactive map, updated in real-time.', icon: shallowRef(IconMapPin) },
      { title: 'Personalized Management', description: 'Save favorite stations, add private chargers, and tailor your charging experience.', icon: shallowRef(IconCogSettings) },
      { title: 'Secure & User-Friendly', description: 'Robust authentication and an intuitive design make managing your EV needs simple and safe.', icon: shallowRef(IconShieldCheck) },
    ]);

    const goToLogin = () => router.push('/login');
    const goToRegister = () => router.push('/register');

    
    const typingSpeed = 75; 
    
    
    const displayedHeroText = ref('');
    const fullHeroText = "Find Your Next Charge";
    let heroCharIndex = 0;
    const heroTypingActive = ref(false);
    let heroTimeoutId = null;

    function typeHero() {
      if (heroCharIndex < fullHeroText.length) {
        displayedHeroText.value += fullHeroText.charAt(heroCharIndex);
        heroCharIndex++;
        heroTimeoutId = setTimeout(typeHero, typingSpeed);
      } else {
        heroTypingActive.value = false; 
      }
    }

    
    const featuresTitleContainerRef = ref(null);
    const displayedFeaturesText = ref('');
    const fullFeaturesText = "Everything You Need, All In One Place";
    let featuresCharIndex = 0;
    const featuresTypingActive = ref(false);
    let featuresTypingInitiated = false;
    let featuresTimeoutId = null;
    let featuresObserver = null;

    function typeFeatures() {
      if (featuresCharIndex < fullFeaturesText.length) {
        displayedFeaturesText.value += fullFeaturesText.charAt(featuresCharIndex);
        featuresCharIndex++;
        featuresTimeoutId = setTimeout(typeFeatures, typingSpeed);
      } else {
        featuresTypingActive.value = false;
      }
    }

    
    const ctaTitleContainerRef = ref(null);
    const displayedCtaText = ref('');
    const fullCtaText = "Ready to Power Up Your Journey?";
    let ctaCharIndex = 0;
    const ctaTypingActive = ref(false);
    let ctaTypingInitiated = false;
    let ctaTimeoutId = null;
    let ctaObserver = null;

    function typeCta() {
      if (ctaCharIndex < fullCtaText.length) {
        displayedCtaText.value += fullCtaText.charAt(ctaCharIndex);
        ctaCharIndex++;
        ctaTimeoutId = setTimeout(typeCta, typingSpeed);
      } else {
        ctaTypingActive.value = false;
      }
    }
    
    onMounted(() => {
      
      heroTypingActive.value = true;
      heroTimeoutId = setTimeout(typeHero, 500); 

      
      if (featuresTitleContainerRef.value) {
        featuresObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !featuresTypingInitiated) {
              featuresTypingInitiated = true;
              featuresTypingActive.value = true; 
              featuresTimeoutId = setTimeout(typeFeatures, 300); 
              if (featuresObserver && featuresTitleContainerRef.value) {
                featuresObserver.unobserve(featuresTitleContainerRef.value); 
              }
            }
          },
          { threshold: 0.2 } 
        );
        featuresObserver.observe(featuresTitleContainerRef.value);
      }

      
      if (ctaTitleContainerRef.value) {
        ctaObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !ctaTypingInitiated) {
              ctaTypingInitiated = true;
              ctaTypingActive.value = true;
              ctaTimeoutId = setTimeout(typeCta, 300);
              if (ctaObserver && ctaTitleContainerRef.value) {
                ctaObserver.unobserve(ctaTitleContainerRef.value);
              }
            }
          },
          { threshold: 0.2 }
        );
        ctaObserver.observe(ctaTitleContainerRef.value);
      }
    });

    onUnmounted(() => {
      clearTimeout(heroTimeoutId);
      clearTimeout(featuresTimeoutId);
      clearTimeout(ctaTimeoutId);

      if (featuresObserver) {
        featuresObserver.disconnect();
      }
      if (ctaObserver) {
        ctaObserver.disconnect();
      }
    });

    return {
      features,
      goToLogin,
      goToRegister,
      displayedHeroText,
      heroTypingActive,
      featuresTitleContainerRef,
      displayedFeaturesText,
      featuresTypingActive,
      ctaTitleContainerRef,
      displayedCtaText,
      ctaTypingActive,
    };
  },
};
</script>

<style scoped>
.content-swoop-fade-up-enter-active,
.content-swoop-fade-up-leave-active {
  transition: opacity 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55), transform 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  transition-delay: 0.1s;
}
.content-swoop-fade-up-enter-from,
.content-swoop-fade-up-leave-to {
  opacity: 0;
  transform: translateY(60px) scale(0.95);
}


.landing-cta-section .content-swoop-fade-up-enter-active,
.landing-cta-section .content-swoop-fade-up-leave-active {
  transition-delay: 0s; 
}

.card-swoop-fade-up-enter-active,
.card-swoop-fade-up-leave-active {
  transition: opacity 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55), transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.card-swoop-fade-up-enter-from,
.card-swoop-fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}

.feature-card svg {
  display: inline-block;
}


.typing-cursor {
  display: inline-block;
  width: 3px; 
  height: 1em; 
  background-color: currentColor; 
  animation: blink 1s step-end infinite;
  margin-left: 0.1em; 
  vertical-align: text-bottom; 
}

@keyframes blink {
  0%, 100% { background-color: currentColor; }
  50% { background-color: transparent; }
}
</style>