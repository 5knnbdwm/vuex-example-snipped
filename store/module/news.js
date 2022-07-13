/* eslint-disable max-len */

export default {
  state: {

    data: {},
    // order: [0, 1],
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'NEW',
      path: 'news',
      get: { active: true, msg: '' },
      update: { active: false, msg: '' },
      create: { active: false, msg: '' },
      delete: { active: false, msg: '' },
    },
  },
  getters: {
    dataById: (state) => (id) => state.data[id],
  },
  mutations: {},
  actions: {
    SOCKET_NEWS({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_NEWS`, payload);
      commit('PUSH_DATA', payload[1]);

      // commit('SET_LOADING', false);
    },
  },
};
