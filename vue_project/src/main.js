// // // // // // frontend/src/main.js

// // // // // 1. Import Vue's createApp function
// // // // import { createApp } from 'vue';

// // // // // 2. Import your root App component
// // // // import App from './App.vue';

// // // // // 3. Import your Vue Router instance
// // // // import router from './router'; // Assumes router/index.js exports the router instance

// // // // // 4. Import your Vuex store instance
// // // // import store from './store';   // Assumes store/index.js exports the store instance
// // // // // For debugging, you can log the store here:
// // // // // console.log("Store instance imported in main.js:", store);

// // // // // 5. Import global CSS (Tailwind CSS in this case)
// // // // import './assets/tailwind.css'; // This should contain your @tailwind directives

// // // // // 6. Import Leaflet CSS (and any icon fixes if needed)
// // // // import "leaflet/dist/leaflet.css";
// // // // import L from 'leaflet'; // Import Leaflet library itself

// // // // // Optional: Leaflet default icon fix (if you find markers are missing)
// // // // delete L.Icon.Default.prototype._getIconUrl;
// // // // L.Icon.Default.mergeOptions({
// // // //   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
// // // //   iconUrl: require('leaflet/dist/images/marker-icon.png'),
// // // //   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// // // // });
// // // // // Note: The `require()` for Leaflet icons might need adjustment in a pure ESM Vite setup.
// // // // // If Vite complains about `require`, you might need to copy these images to your `public`
// // // // // folder and reference them directly, or use a Vite plugin that handles this.
// // // // // A simpler alternative for Vite if `require` is problematic:
// // // // // import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// // // // // import iconUrl from 'leaflet/dist/images/marker-icon.png';
// // // // // import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
// // // // // L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });


// // // // // 7. Create the Vue application instance
// // // // const app = createApp(App);

// // // // // 8. Use plugins (Vuex store and Vue Router)
// // // // // IMPORTANT: The order can matter. Typically, the store is used before the router,
// // // // // especially if router guards depend on the store.
// // // // app.use(store);
// // // // app.use(router);

// // // // // 9. Mount the application to the DOM element with id="app"
// // // // // This element should be in your public/index.html
// // // // app.mount('#app');
// // // // frontend/src/main.js

// // // // 1. Import Vue's createApp function
// // // import { createApp } from 'vue';

// // // // 2. Import your root App component
// // // import App from './App.vue';

// // // // 3. Import your Vue Router instance
// // // import router from './router';

// // // // 4. Import your Vuex store instance
// // // import store from './store';

// // // // 5. Import global CSS (Tailwind CSS)
// // // import './assets/tailwind.css';

// // // // 6. Import Leaflet CSS
// // // import "leaflet/dist/leaflet.css";
// // // import L from 'leaflet'; // Import Leaflet library itself

// // // // --- START OF FIX FOR require ERROR ---
// // // // Import icon assets using ES Module syntax
// // // import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// // // import iconUrl from 'leaflet/dist/images/marker-icon.png';
// // // import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// // // // Leaflet default icon fix
// // // delete L.Icon.Default.prototype._getIconUrl; // Still need this line
// // // L.Icon.Default.mergeOptions({
// // //   iconRetinaUrl: iconRetinaUrl, // Use the imported variable
// // //   iconUrl: iconUrl,             // Use the imported variable
// // //   shadowUrl: shadowUrl,           // Use the imported variable
// // // });
// // // // --- END OF FIX FOR require ERROR ---

// // // // 7. Create the Vue application instance
// // // const app = createApp(App);

// // // // 8. Use plugins
// // // app.use(store);
// // // app.use(router);

// // // // 9. Mount the application
// // // app.mount('#app');
// // import { createApp } from 'vue';
// // import App from './App.vue';
// // import router from './router';
// // import store from './store';

// // // Import Tailwind CSS
// // import './assets/tailwind.css';

// // // Leaflet CSS and Icon Fix
// // import "leaflet/dist/leaflet.css";
// // import L from 'leaflet';

// // // Vite-friendly Leaflet icon asset imports
// // import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// // import iconUrl from 'leaflet/dist/images/marker-icon.png';
// // import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// // delete L.Icon.Default.prototype._getIconUrl; // Still need this line
// // L.Icon.Default.mergeOptions({
// //    iconRetinaUrl: iconRetinaUrl,
// //   iconUrl: iconUrl,
// //   shadowUrl: shadowUrl,
// // });

// // const app = createApp(App);

// // app.use(store);
// // app.use(router);

// // app.mount('#app');
// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router';
// import store from './store';

// // Import Tailwind CSS
// import './assets/tailwind.css';

// // Leaflet CSS and Icon Fix
// import "leaflet/dist/leaflet.css";
// import L from 'leaflet';

// // Vite-friendly Leaflet icon asset imports
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// delete L.Icon.Default.prototype._getIconUrl; // This line is important
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: iconRetinaUrl,
//   iconUrl: iconUrl,
//   shadowUrl: shadowUrl,
//   iconSize: [25, 41], // Default size
//   iconAnchor: [12, 41], // Default anchor
//   popupAnchor: [1, -34], // Default popup anchor
//   shadowSize: [41, 41] // Default shadow size
// });

// const app = createApp(App);

// app.use(store);
// app.use(router);

// // app.mount('#app');
// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router';
// import store from './store';

// // Import Tailwind CSS
// import './assets/tailwind.css';

// // Leaflet CSS and Icon Fix
// import "leaflet/dist/leaflet.css";
// import L from 'leaflet';

// // Vite-friendly Leaflet icon asset imports
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
// import { MotionPlugin } from '@vueuse/motion'
// delete L.Icon.Default.prototype._getIconUrl; // This line is important
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: iconRetinaUrl,
//   iconUrl: iconUrl,
//   shadowUrl: shadowUrl,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// const app = createApp(App);
// app.use(store);
// app.use(MotionPlugin)
// app.use(router);
// app.mount('#app');
// frontend/src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import intersectDirective from './directives/intersect'; // Import the directive
import { MotionPlugin } from '@vueuse/motion'

import './assets/tailwind.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrlFromImport from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrlFromImport from 'leaflet/dist/images/marker-icon.png';
import shadowUrlFromImport from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrlFromImport,
  iconUrl: iconUrlFromImport,
  shadowUrl: shadowUrlFromImport,
  iconSize: [25, 41], iconAnchor: [12, 41],
  popupAnchor: [1, -34], shadowSize: [41, 41]
});

const app = createApp(App);
app.use(MotionPlugin)
app.use(store);
app.use(router);
app.directive('intersect', intersectDirective); // Register the directive globally

app.mount('#app');