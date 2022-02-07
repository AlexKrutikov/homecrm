import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

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
const auth = getAuth();
const database = getDatabase();

export default {
  actions: {
    async login({ dispatch, commit }, { email, password }) {
      try {
        await signInWithEmailAndPassword(auth, email, password)
      } catch (e) {
        commit('setError', e)
        throw e
      }

    },
    async register({ dispatch, commit }, { email, password, name }) {
      try {
        await createUserWithEmailAndPassword(auth, email, password)
        const uid = await dispatch('getUid')
        await set(ref(database, `/users/${uid}/info`), {
          bill: 10000,
          name
        })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    getUid() {
      const user = auth.currentUser
      return user ? user.uid : null
    },
    async logout() {
      await signOut(auth)
    }
  }
}
