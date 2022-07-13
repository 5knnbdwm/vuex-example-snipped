export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'TAG',
      path: 'tag',
      get: { active: true, msg: '' },
      update: { active: false, msg: '' },
      create: { active: false, msg: '' },
      delete: { active: false, msg: '' },
      admin: {
        get: { active: true, msg: '' },
        update: { active: true, msg: 'Tags aktualisiet.' },
        create: { active: true, msg: 'Tag erstellt.' },
        delete: { active: true, msg: 'Tag gelöscht.' },
      },
    },
  },
  getters: {
    dataById: (state) => (id) => state.data[id],
  },
  mutations: {},
  actions: {
    SOCKET_TAGS({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_TAGS`, payload);
      commit('PUSH_DATA', payload[1]);

      // commit('SET_LOADING', false);
    },
  },
};
