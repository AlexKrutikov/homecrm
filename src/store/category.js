import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, push, update, child } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
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
