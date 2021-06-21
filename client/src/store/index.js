import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

// no-param-reassign prevents store.isAuthenticated = isAuthenticated
/* eslint-disable no-param-reassign */
export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    adminName: '',
  },
  mutations: {
    setIsAuthenticated(store, isAuthenticated) {
      store.isAuthenticated = isAuthenticated;
    },
    setName(store, admin) {
      store.adminName = admin;
    },
  },
  actions: {
  },
  modules: {
  },
});
