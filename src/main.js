import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import messagePlugin from './utils/message.plugin'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'firebase/database'

Vue.config.productionTip = false
Vue.use(messagePlugin)
Vue.use(Vuelidate)
Vue.filter('date', dateFilter)

const firebaseConfig = {
  apiKey: "AIzaSyBWe1ZN01AK5XL8349z-LuldEO9hQmAF8Y",
  authDomain: "vue-homecrm.firebaseapp.com",
  databaseURL: "https://vue-homecrm-default-rtdb.firebaseio.com",
  projectId: "vue-homecrm",
  storageBucket: "vue-homecrm.appspot.com",
  messagingSenderId: "1063356846319",
  appId: "1:1063356846319:web:b2abdf7c74dcf94b044b1a",
  measurementId: "G-J6MMLWNP4G"
};
const firebase = initializeApp(firebaseConfig);

let app;
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
});
