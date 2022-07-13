export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'PRODUCT_PERMISSION_GROUP',
      append: '_PERMISSION',
      path: 'product/permission/',
      error: { active: false },
      get: { active: false, msg: '' },
      update: { active: false, msg: 'Produkt Gruppe aktualisiet.' },
      create: { active: false, msg: 'Produkt Gruppe erstellt.' },
      delete: { active: false, msg: 'Produkt Gruppe gelöscht.' },
      admin: {
        error: { active: true },
        get: { active: false, msg: '' },
        update: { active: true, msg: 'Produkt Gruppe aktualisiet.' },
        create: { active: false, msg: 'Produkt Gruppe erstellt.' },
        delete: { active: false, msg: 'Produkt Gruppe gelöscht.' },
      },
    },
  },
  getters: {
    // dataByParentId: (state) => (id) => {
    //   const { routes } = state.data[id] || { routes: [] };
    //   return routes;
    // },
  },
  mutations: {},
  actions: {
    // SOCKET_PRODUCT_PERMISSION_GROUPS({ commit, getters }, payload) {
    //   if (process.env.NODE_ENV !== 'production') {
    //     console.log(`[${getters.config.path}] SOCKET_PRODUCT_PERMISSION_GROUPS`, payload);
    //   }
    //   commit('PUSH_DATA', payload[1]);

    //   // for (let i = 0; i < payload[1].length; i += 1) {
    //   //   const element = payload[1][i];

    //   //   dispatch('product/GET', element.id);
    //   //   dispatch('sub/GET', element.id);
    //   //   dispatch('user/GET', element.id);
    //   // }

    //   commit('SET_LOADING', false);
    // },
    // SOCKET_PRODUCT_PERMISSION_GROUP({ commit, getters }, payload) {
    //   if (process.env.NODE_ENV !== 'production') {
    //     console.log(`[${getters.config.path}] SOCKET_PRODUCT_PERMISSION_GROUP`, payload);
    //   }
    //   commit('PUSH_DATA', payload[1]);

    //   // dispatch('product/GET', payload[1].id);
    //   // dispatch('sub/GET', payload[1].id);
    //   // dispatch('user/GET', payload[1].id);

    //   commit('SET_LOADING', false);
    // },
  },
};
