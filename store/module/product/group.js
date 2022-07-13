export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'PRODUCT',
      append: '_PERMISSION_GROUP',
      path: 'product/group',
      error: { active: false },
      get: { active: false, msg: '' },
      update: { active: false, msg: 'Produkt Gruppe aktualisiet.' },
      create: { active: false, msg: 'Produkt Gruppe erstellt.' },
      delete: { active: false, msg: 'Produkt Gruppe gelöscht.' },
      admin: {
        error: { active: true },
        get: { active: true, msg: '' },
        update: { active: false, msg: 'Produkt Gruppe aktualisiet.' },
        create: { active: true, msg: 'Produkt Gruppe erstellt.' },
        delete: { active: false, msg: 'Produkt Gruppe gelöscht.' },
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
    SOCKET_PRODUCT_PERMISSION_GROUPS({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_PRODUCT_PERMISSION_GROUPS`, payload);
      commit('PUSH_DATA', payload[1]);

      // for (let i = 0; i < payload[1].length; i += 1) {
      //   const element = payload[1][i];

      //   dispatch('product/GET', element.id);
      //   dispatch('sub/GET', element.id);
      //   dispatch('user/GET', element.id);
      // }

      // commit('SET_LOADING', false);
    },
    SOCKET_PRODUCT_PERMISSION_GROUP({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_PRODUCT_PERMISSION_GROUP`, payload);
      commit('PUSH_DATA', payload[1]);

      // dispatch('product/GET', payload[1].id);
      // dispatch('sub/GET', payload[1].id);
      // dispatch('user/GET', payload[1].id);

      // commit('SET_LOADING', false);
    },
  },
};
