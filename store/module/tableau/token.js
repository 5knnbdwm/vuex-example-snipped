export default {
  state: {
    data: null,
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'TABLEAU_TOKEN',
      append: '',
      path: 'tableau/token',
      get: { active: true, msg: '' },
      update: { active: false, msg: '' },
      create: { active: false, msg: '' },
      delete: { active: false, msg: '' },
    },
  },
  getters: {
    data: (state) => state.data,
  },
  mutations: {
    SET_DATA(state, payload) {
      state.data = payload;
    },
  },
  actions: {
    SOCKET_TABLEAU_TOKEN({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_TABLEAU_TOKEN`, payload);
      commit('SET_DATA', payload[1]);

      // commit('SET_LOADING', false);
    },
  },
};
