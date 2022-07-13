export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'PRODUCT',
      append: '_ROUTE',
      path: 'product/route',
      error: { active: false },
      get: { active: false, msg: '' },
      update: { active: false, msg: 'Tableau Link aktualisiet.' },
      create: { active: false, msg: 'Tableau Link erstellt.' },
      delete: { active: false, msg: 'Tableau Link gelöscht.' },
      admin: {
        error: { active: true },
        get: { active: true, msg: '' },
        update: { active: true, msg: 'Tableau Link aktualisiet.' },
        create: { active: true, msg: 'Tableau Link erstellt.' },
        delete: { active: false, msg: 'Tableau Link gelöscht.' },
      },
    },
  },
  getters: {
    dataByParentId: (state) => (id) => {
      const { routes } = state.data[id] || { routes: [] };
      return routes;
    },
  },
  mutations: {},
  actions: {
    SOCKET_PRODUCT_ROUTES({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_PRODUCT_ROUTES`, payload);
      commit('PUSH_DATA', payload[1]);

      // for (let i = 0; i < payload[1].length; i += 1) {
      //   const element = payload[1][i];

      //   dispatch('product/GET', element.id);
      //   dispatch('sub/GET', element.id);
      //   dispatch('user/GET', element.id);
      // }

      // commit('SET_LOADING', false);
    },
    SOCKET_PRODUCT_ROUTE({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_PRODUCT_ROUTE`, payload);
      commit('PUSH_DATA', payload[1]);

      // dispatch('product/GET', payload[1].id);
      // dispatch('sub/GET', payload[1].id);
      // dispatch('user/GET', payload[1].id);

      // commit('SET_LOADING', false);
    },
  },
};
