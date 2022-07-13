export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'ORG',
      append: '_PRODUCT',
      path: 'org/products',
      error: { active: false },
      get: { active: true, msg: '' },
      update: { active: false, msg: '' },
      create: { active: false, msg: '' },
      delete: { active: false, msg: '' },
      admin: {
        error: { active: true },
        update: { active: true, msg: 'Organisation aktualisiert.' },
      },
    },
  },
  getters: {
    dataByParentId: (state) => (id) => {
      const { products } = state.data[id] || { products: [] };
      return products;
    },
  },
  mutations: {},
  actions: {
    SOCKET_ORG_PRODUCTS({ commit, dispatch, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_ORG_PRODUCTS`, payload);
      commit('PUSH_DATA', payload[1]);

      for (let i = 0; i < payload[1].products.length; i += 1) {
        dispatch('product/GET', { payload: payload[1].products[i] }, { root: true });
      }

      commit('REMOVE_QUEUE', payload[0]);
      // commit('SET_LOADING', false);
    },
  },
};
