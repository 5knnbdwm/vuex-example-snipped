import token from './tableau/token';

export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'TABLEAU',
      append: '_USERS',
      path: 'tableau',
      get: { active: false, msg: '' },
      update: { active: false, msg: '' },
      create: { active: false, msg: '' },
      delete: { active: false, msg: '' },
      admin: {
        get: { active: true, msg: '' },
        update: { active: true, msg: 'Tableau Nutzer aktualisiet.' },
      },
    },
  },
  getters: {
  },
  mutations: {},
  actions: {
    SOCKET_TABLEAU_USERS({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_TABLEAU_USERS`, payload);
      commit('PUSH_DATA', payload[1]);

      // commit('SET_LOADING', false);
    },
  },
  modules: {
    token: { ...token, namespaced: true },
  },
};
