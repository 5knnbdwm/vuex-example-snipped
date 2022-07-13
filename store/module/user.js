export default {
  state: {
    data: {},
    order: [],
    selection: null,
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'USER',
      path: 'user',
      get: { active: true, msg: '' },
      update: { active: true, msg: 'Nutzer aktualisiet.' },
      create: { active: true, msg: 'Nutzer erstellt.', rtr: 'OrgProfile' },
      delete: { active: true, msg: 'Nutzer gelöscht.', rtr: 'OrgProfile' },
      admin: {
        create: { active: true, msg: 'Nutzer erstellt.', rtr: 'AllUsers' },
        delete: { active: true, msg: 'Nutzer gelöscht.', rtr: 'AllUsers' },
      },
    },
  },
  getters: {
    dataById: (state) => (id) => state.data[id],
    me: (state) => {
      if (state.selection !== null) {
        return state.data[state.selection];
      }
      return {};
    },
    isPermited: (state, getters) => (test = '') => {
      if (typeof test === 'object') {
        return (test.indexOf(getters.me.type) > -1);
      }
      return test === getters.me.type;
    },
  },
  mutations: {
    SET_SELECTION(state, payload) {
      state.selection = payload;
    },
  },
  actions: {
    SOCKET_USERS({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_USERS`, payload);
      commit('PUSH_DATA', payload[1]);

      // commit('SET_LOADING', false);
    },
    SOCKET_USER({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_USER`, payload);
      commit('PUSH_DATA', payload[1]);

      // commit('SET_LOADING', false);
    },
  },
};
