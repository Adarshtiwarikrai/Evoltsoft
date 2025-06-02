import apiClient from '@/services/apiClient';

const state = {
  token: localStorage.getItem('charger_app_token') || null,
  user: JSON.parse(localStorage.getItem('charger_app_user')) || null,
  
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  currentUser: (state) => state.user,
  token: (state) => state.token,
  
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    if (token) {
      localStorage.setItem('charger_app_token', token);
    } else {
      localStorage.removeItem('charger_app_token');
    }
  },
  SET_USER(state, user) {
    state.user = user;
    if (user) {
      localStorage.setItem('charger_app_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('charger_app_user');
    }
  },
  
  
  
};

const actions = {
  async login({ commit, dispatch }, credentials) {
    try {
      
      const { data } = await apiClient.post('/users/login', credentials); 
      commit('SET_TOKEN', data.token);
      
      commit('SET_USER', { _id: data._id, username: data.username });
      
      
      return data;
    } catch (error) {
      commit('SET_TOKEN', null); 
      commit('SET_USER', null);
      console.error('Login error in store:', error.response?.data?.message || error.message);
      throw error.response?.data || error;
    }
  },

  async register({ commit }, userData) {
    try {
      
      const { data } = await apiClient.post('/users/register', userData); 
      
      
      
      if (data.token) {
        commit('SET_TOKEN', data.token);
        commit('SET_USER', { _id: data._id, username: data.username });
      }
      return data;
    } catch (error) {
      console.error('Register error in store:', error.response?.data?.message || error.message);
      throw error.response?.data || error;
    }
  },

  logout({ commit }) {
    
    commit('SET_TOKEN', null);
    commit('SET_USER', null);
    
    
  },

  async fetchUserProfile({ commit, state }) {
    if (!state.token) return;
    try {
      const { data } = await apiClient.get('/users/me'); 
      commit('SET_USER', data); 
    } catch (error) {
      console.error('Failed to fetch user profile:', error.response?.data?.message || error.message);
      
    }
  },

  
  
  async initializeAuth({ commit, dispatch, getters }) {
    const token = localStorage.getItem('charger_app_token');
    const user = JSON.parse(localStorage.getItem('charger_app_user'));

    if (token && user) {
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
      
      
      try {
        await dispatch('fetchUserProfile');
        if (!getters.isAuthenticated) { 
            
        }
      } catch (e) {
        
        console.warn("Error re-validating token during auth initialization.");
      }
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};