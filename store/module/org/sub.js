export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'ORG',
      append: '_SUB',
      path: 'org/sub',
      error: { active: false },
      get: { active: false, msg: '' },
      update: { active: false, msg: 'Nutzer aktualisiet.' },
      create: { active: false, msg: 'Nutzer erstellt.' },
      delete: { active: false, msg: 'Nutzer gelöscht.' },
      admin: {
        get: { active: true, msg: '' },
      },
    },
  },
  getters: {
    dataByParentId: (state) => (id) => {
      const { subs } = state.data[id] || { subs: [] };
      return subs.map((item) => item.id);
    },
  },
  mutations: {},
  actions: {
    SOCKET_ORG_SUBS({ commit, dispatch, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_ORG_SUBS`, payload);
      commit('PUSH_DATA', payload[1]);

      for (let i = 0; i < payload[1].subs.length; i += 1) {
        dispatch('org/GET', { payload: payload[1].subs[i].id }, { root: true });
      }

      commit('REMOVE_QUEUE', payload[0]);
      // commit('SET_LOADING', false);
    },
  },
};
