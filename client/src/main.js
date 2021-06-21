import Vue from 'vue';
import io from 'socket.io-client';
import firebase from 'firebase';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAkTlHAe7x9_M9EoPtmvTDT_SXGORHiKz0',
  authDomain: 'intnet-1715d.firebaseapp.com',
  projectId: 'intnet-1715d',
  storageBucket: 'intnet-1715d.appspot.com',
  messagingSenderId: '251824042648',
  appId: '1:251824042648:web:aed873e052809965d916ed',
  measurementId: 'G-9PSW0Y6GTW',
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

console.log('firebase:');
console.log(firebase);
(async () => {
  // Find out if the user is already logged in
  const { isAuthenticated } = await fetch('/api/isAuthenticated')
    .then(resp => resp.json())
    .catch(console.error);
  store.commit('setIsAuthenticated', isAuthenticated);

  new Vue({
    router,
    store,
    render: h => h(App),
    data: {
      socket: io().connect(),
    },
  }).$mount('#app');
})();
