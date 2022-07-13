export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'PRODUCT',
      append: '_NAV_FLAT',
      path: 'product/nav',
      error: { active: false },
      get: { active: true, msg: '' },
      update: { active: false, msg: '' },
      create: { active: false, msg: '' },
      delete: { active: false, msg: '' },
    },
  },
  getters: {
    dataById: (state) => (id) => state.data[id],
    dataByParentId: (state, getters) => (id) => getters.data
      .filter((item) => item.productId === id),
  },
  mutations: {},
  actions: {
    SOCKET_PRODUCT_NAV_FLAT({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_PRODUCT_NAV_FLAT`, payload);

      function transformNavFlat(productNav) {
        const arr = [];

        for (let i = 0; i < productNav.nav.length; i += 1) {
          const element = productNav.nav[i];
          element.productId = productNav.id;

          arr.push(element);
        }
        return arr;
      }

      const transformedPayload = transformNavFlat(payload[1]);
      for (let i = 0; i < transformedPayload.length; i += 1) {
        const element = transformedPayload[i];
        commit('PUSH_DATA', element);
      }

      commit('REMOVE_QUEUE', payload[0]);
      // commit('SET_LOADING', false);
    },
  },
};
