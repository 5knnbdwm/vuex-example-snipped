export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'ORG',
      append: '_USER',
      path: 'org/user',
      error: { active: false },
      get: { active: true, msg: '' },
      update: { active: false, msg: 'Nutzer aktualisiet.' },
      create: { active: false, msg: 'Nutzer erstellt.' },
      delete: { active: false, msg: 'Nutzer gelöscht.' },

    },
  },
  getters: {
    dataByParentId: (state) => (id) => {
      const { users } = state.data[id] || { users: [] };
      return users;
    },
  },
  mutations: {},
  actions: {
    SOCKET_ORG_USERS({ commit, dispatch, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_ORG_USERS`, payload);
      commit('PUSH_DATA', payload[1]);

      for (let i = 0; i < payload[1].users.length; i += 1) {
        dispatch('user/GET', { payload: payload[1].users[i] }, { root: true });
      }

      commit('REMOVE_QUEUE', payload[0]);
      // commit('SET_LOADING', false);
    },
  },
};
