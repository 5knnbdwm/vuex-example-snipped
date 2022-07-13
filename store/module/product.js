import group from './product/group';
import nav from './product/nav';
import navFlat from './product/navFlat';
import org from './product/org';
import route from './product/route';

export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'PRODUCT',
      path: 'product',
      get: { active: true, msg: '' },
      update: { active: false, msg: 'Produkt aktualisiert.' },
      create: { active: false, msg: 'Produkt erstellt.' },
      delete: { active: false, msg: 'Produkt gelöscht.' },
      admin: {
        get: { active: true, msg: '' },
        update: { active: false, msg: 'Produkt aktualisiert.' },
        create: { active: false, msg: 'Produkt erstellt.' },
        delete: { active: false, msg: 'Produkt gelöscht.' },
      },
    },
  },
  getters: {
    dataById: (state) => (id) => state.data[id],
  },
  mutations: {},
  actions: {
    SOCKET_PRODUCTS({ commit, dispatch, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_PRODUCTS`, payload);
      commit('PUSH_DATA', payload[1]);

      for (let i = 0; i < payload[1].length; i += 1) {
        const element = payload[1][i];

        dispatch('group/GET', { payload: element.id, multi: true });
        dispatch('nav/GET', { payload: element.id });
        dispatch('navFlat/GET', { payload: element.id });
        dispatch('org/GET', { payload: element.id, multi: true });
        dispatch('route/GET', { payload: element.id, multi: true });
      }

      // commit('SET_LOADING', false);
    },
    SOCKET_PRODUCT({ commit, dispatch, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_PRODUCT`, payload);
      commit('PUSH_DATA', payload[1]);

      dispatch('group/GET', { payload: payload[1].id, multi: true });
      dispatch('nav/GET', { payload: payload[1].id });
      dispatch('navFlat/GET', { payload: payload[1].id });
      dispatch('org/GET', { payload: payload[1].id, multi: true });
      dispatch('route/GET', { payload: payload[1].id, multi: true });

      // commit('SET_LOADING', false);
    },
  },
  modules: {
    group: { ...group, namespaced: true },
    nav: { ...nav, namespaced: true },
    navFlat: { ...navFlat, namespaced: true },
    org: { ...org, namespaced: true },
    route: { ...route, namespaced: true },
  },
};
