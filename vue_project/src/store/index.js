// frontend/src/store/index.js
import { createStore } from 'vuex';
import auth from './modules/auth';
import stations from './modules/stations';

export default createStore({
  modules: {
    auth,
    stations,
  },
 
});