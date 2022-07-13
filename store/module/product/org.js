export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'PRODUCT',
      append: '_ORG',
      path: 'product/org',
      error: { active: false },
      get: { active: false, msg: '' },
      update: { active: false, msg: '' },
      create: { active: false, msg: '' },
      delete: { active: false, msg: '' },
      admin: {
        error: { active: true },
        get: { active: true, msg: '' },
        update: { active: true, msg: '' },
        create: { active: true, msg: '' },
        delete: { active: false, msg: '' },
      },
    },
  },
  getters: {
    dataByParentId: (state) => (id) => {
      const { organisations } = state.data[id] || { organisations: [] };
      return organisations;
    },
  },
  mutations: {},
  actions: {
    SOCKET_PRODUCT_ORGS({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_PRODUCT_ORGS`, payload);
      commit('PUSH_DATA', payload[1]);

      // for (let i = 0; i < payload[1].products.length; i += 1) {
      //   dispatch('org/GET', { payload: payload[1].products[i] }, { root: true });
      // }

      commit('REMOVE_QUEUE', payload[0]);
      // commit('SET_LOADING', false);
    },
  },
};
