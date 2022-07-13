export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'PRODUCT',
      append: '_NAV',
      path: 'product/nav',
      error: { active: false },
      get: { active: true, msg: '' },
      update: { active: false, msg: '' },
      create: { active: false, msg: '' },
      delete: { active: false, msg: '' },
    },
  },
  getters: {
    dataByParentId: (state) => (id) => {
      const { nav } = state.data[id] || { nav: [] };
      // const { nav } = state.data[id] || { nav: [] };
      return nav;
    },
  },
  mutations: {},
  actions: {
    SOCKET_PRODUCT_NAV({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_PRODUCT_NAV`, payload);
      commit('PUSH_DATA', payload[1]);

      commit('REMOVE_QUEUE', payload[0]);
      // commit('SET_LOADING', false);
    },
  },
};
