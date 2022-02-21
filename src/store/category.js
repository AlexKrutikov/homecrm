import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, push, update, child } from "firebase/database";

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
const database = getDatabase();

export default {
  actions: {
    async fetchCategories({ commit, dispatch }) {
      try {

        const cats = []
        const uid = await dispatch('getUid')
        var categoriesData = {}
        const dbRef = ref(database);
        await get(child(dbRef, `/users/${uid}/categories`)).then((snapshot) => {

          if (snapshot.exists()) {
            const categoriesData = snapshot.val() || {}

            Object.keys(categoriesData).forEach(key => {
              cats.push({
                id: key,
                title: categoriesData[key].title,
                limit: categoriesData[key].limit
              })
            })

          }
        }).catch((error) => {
          commit('setError', error)
          throw error
        });

        return cats
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateCategory({ commit, dispatch }, { title, limit, id }) {
      try {
        const uid = await dispatch('getUid')

        const postData = {
          title: title,
          limit: limit
        }

        await set(ref(database, `/users/${uid}/categories/${id}/`), postData)
          .then(() => {
            // console.log("data was updated");
          })
          .catch((error) => {
            // console.log("no data updated");
            commit('setError', error)
            throw error
          });

      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async createCategory({ commit, dispatch }, { title, limit }) {
      try {
        const uid = await dispatch('getUid')
        const categoryRef = ref(database, `/users/${uid}/categories`)
        const NewCategory = await push(categoryRef)
        await set(NewCategory, { title, limit })

        return { title, limit, id: NewCategory.key }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}
