export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'ORG',
      append: '_PERMISSION_GROUP',
      path: 'org/group',
      error: { active: false },
      get: { active: false, msg: '' },
      update: { active: false, msg: 'Nutzer aktualisiet.' },
      create: { active: false, msg: 'Nutzer erstellt.' },
      delete: { active: false, msg: 'Nutzer gelöscht.' },
      admin: {
        error: { active: true },
        get: { active: true, msg: '' },
      },
    },
  },
  getters: {
    dataByParentId: (state) => (id) => {
      // eslint-disable-next-line camelcase
      const { permission_groups } = state.data[id] || { permission_groups: [] };
      // eslint-disable-next-line camelcase
      return permission_groups;
    },
  },
  mutations: {},
  actions: {
    SOCKET_ORG_PERMISSION_GROUPS({ commit, dispatch, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_ORG_PERMISSION_GROUPS`, payload);
      commit('PUSH_DATA', payload[1]);

      for (let i = 0; i < payload[1].permission_groups.length; i += 1) {
        dispatch('user/GET', { payload: payload[1].permission_groups[i] }, { root: true });
      }

      commit('REMOVE_QUEUE', payload[0]);
      // commit('SET_LOADING', false);
    },
  },
};
