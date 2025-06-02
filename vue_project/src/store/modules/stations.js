import apiClient from '@/services/apiClient';

const state = {
  stations: [],
  isLoading: false,
  error: null,
};

const getters = {
  allStations: (state) => state.stations,
  isLoadingStations: (state) => state.isLoading,
  stationError: (state) => state.error,
};

const mutations = {
  SET_STATIONS(state, stations) {
    state.stations = Array.isArray(stations) ? stations : [];
    
  },
  ADD_STATION(state, station) {
    
    
    
    state.stations.unshift(station);
  },
  UPDATE_STATION(state, updatedStation) {
    const index = state.stations.findIndex((s) => s._id === updatedStation._id);
    if (index !== -1) {
      state.stations[index] = updatedStation;
    }
  },
  REMOVE_STATION(state, stationId) {
    state.stations = state.stations.filter((s) => s._id !== stationId);
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
    if (error) {
      console.error('[Vuex Mutation] SET_ERROR:', error);
    }
  },
};

const actions = {
  async fetchStations({ commit }, filters = {}) {
    
    commit('SET_LOADING', true);
    commit('SET_ERROR', null); 
    try {
      const { data } = await apiClient.get('/stations', { params: filters });
      commit('SET_STATIONS', data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch stations.';
      commit('SET_ERROR', errorMessage);
      commit('SET_STATIONS', []); 
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchStationsNearCoordinates({ commit }, { lat, lng }) {
    console.log('[Vuex Action] fetchStationsNearCoordinates (for CLOSEST) called with (Lat,Lng):', { lat, lng });
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      
      const response = await apiClient.get(`/stations/near/closest`, {
        params: { lat, lng }
      });

      
      
      if (response.data && typeof response.data === 'object' && response.data._id) {
        
        console.log('[Vuex Action] fetchStationsNearCoordinates - API Response Data (closest):', response.data);
        commit('SET_STATIONS', [response.data]); 
      } else {
        
        console.log('[Vuex Action] fetchStationsNearCoordinates - API returned success but no valid station object:', response.data);
        commit('SET_STATIONS', []); 
      }

    } catch (error) {
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch nearest station.';
      console.error('[Vuex Action] fetchStationsNearCoordinates - Error:', errorMessage, error.response ? `Status: ${error.response.status}` : '');
      commit('SET_ERROR', errorMessage);
      commit('SET_STATIONS', []); 
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createStation({ commit, dispatch }, stationData) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const { data } = await apiClient.post('/stations', stationData);
      
      
      return data; 
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create station.';
      commit('SET_ERROR', errorMessage);
      throw err; 
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateStation({ commit, dispatch }, { id, stationData }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const { data } = await apiClient.put(`/stations/${id}`, stationData);
      
      return data; 
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update station.';
      commit('SET_ERROR', errorMessage);
      throw err;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async deleteStation({ commit, dispatch }, stationId) {
    commit('SET_ERROR', null); 
    
    try {
      await apiClient.delete(`/stations/${stationId}`);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete station.';
      
      
      console.error('Delete station error:', errorMessage);
      throw err; 
    } finally {
      
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};