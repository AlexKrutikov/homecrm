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
    async createRecord({ dispatch, commit }, record) {
      try {
        const uid = await dispatch('getUid')
        const recordRef = ref(database, `/users/${uid}/records`)
        const newRecord = await push(recordRef)
        await set(newRecord, record)
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
    async fetchRecords({ dispatch, commit }) {
      try {
        const recs = []
        const uid = await dispatch('getUid')
        var recordsData = {}
        const dbRef = ref(database);
        await get(child(dbRef, `/users/${uid}/records`)).then((snapshot) => {

          if (snapshot.exists()) {
            const recordsData = snapshot.val() || {}

            Object.keys(recordsData).forEach(key => {
              recs.push({
                id: key,
                amount: recordsData[key].amount,
                categoryId: recordsData[key].categoryId,
                type: recordsData[key].type,
                description: recordsData[key].description,
                date: recordsData[key].date
              })
            })

          }
        }).catch((error) => {
          commit('setError', error)
          throw error
        });

        return recs

      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchRecordById({ dispatch, commit }, id) {
      try {

        const uid = await dispatch('getUid')
        var record = {}
        const dbRef = ref(database);
        await get(child(dbRef, `/users/${uid}/records/${id}`)).then((snapshot) => {

          if (snapshot.exists()) {
            record = snapshot.val() || {}
          }
        }).catch((error) => {
          commit('setError', error)
          throw error
        });

        return { ...record, id }

      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}
