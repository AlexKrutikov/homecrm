import { getDatabase, ref, onValue } from "firebase/database";
const database = getDatabase();

export default {
  state: {
    info: {}
  },
  mutations: {
    setInfo(state, info) {
      state.info = info
    },
    clearInfo(state) {
      state.info = {}
    }
  },
  actions: {
    async fetchInfo({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')

        var infoRef = ref(database, `/users/${uid}/info`);
        onValue(infoRef, (info) => {
          const data = info.val();
          commit('setInfo', data)
        });

      } catch (e) {

      }
    }
  },
  getters: {
    info: s => s.info
  }
}
