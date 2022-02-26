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
                description: recordsData[key].description
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
    }
  }
}
