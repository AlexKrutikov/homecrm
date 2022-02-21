import { getDatabase, ref, onValue, update } from "firebase/database";
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
    async updateInfo({ dispatch, commit, getters }, toUpdate) {
      try {
        const uid = await dispatch('getUid')

        const updateData = { ...getters.info, ...toUpdate }
        const updates = {}
        updates[`/users/${uid}/info`] = updateData
        await update(ref(database), updates)
        commit('setInfo', updateData)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchInfo({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')

        var infoRef = ref(database, `/users/${uid}/info`);
        onValue(infoRef, (info) => {
          const data = info.val();
          commit('setInfo', data)
        });

      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  },
  getters: {
    info: s => s.info
  }
}
