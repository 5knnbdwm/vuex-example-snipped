import group from './org/group';
import product from './org/product';
import sub from './org/sub';
import user from './org/user';

export default {
  state: {
    data: {},
    order: [],
    selection: null,
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'ORG',
      path: 'org',
      get: { active: true, msg: '' },
      update: { active: true, msg: 'Organization aktualisiet.' },
      create: { active: false, msg: 'Organization erstellt.', rtr: 'OrgProfile' },
      delete: { active: false, msg: 'Organization gelöscht.', rtr: 'OrgProfile' },
      admin: {
        get: { active: true, msg: '' },
        update: { active: true, msg: 'Organization aktualisiet.' },
        create: { active: true, msg: 'Organization erstellt.', rtr: 'AllOrgs' },
        delete: { active: true, msg: 'Organization gelöscht.', rtr: 'AllOrgs' },
      },
    },
  },
  getters: {
    dataById: (state) => (id) => state.data[id],
    me: (state) => {
      if (state.selection !== null) {
        return state.data[state.selection];
      }
      return {};
    },
  },
  mutations: {
    SET_SELECTION(state, payload) {
      state.selection = payload;
    },
  },
  actions: {
    SOCKET_ORGS({ commit, dispatch, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_ORGS`, payload);
      commit('PUSH_DATA', payload[1]);

      for (let i = 0; i < payload[1].length; i += 1) {
        const element = payload[1][i];

        dispatch('group/GET', { payload: element.id, multi: true });
        dispatch('product/GET', { payload: element.id, multi: true });
        dispatch('sub/GET', { payload: element.id, multi: true });
        dispatch('user/GET', { payload: element.id, multi: true });
      }

      // commit('SET_LOADING', false);
    },
    SOCKET_ORG({ commit, dispatch, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_ORG`, payload);
      commit('PUSH_DATA', payload[1]);

      dispatch('group/GET', { payload: payload[1].id, multi: true });
      dispatch('product/GET', { payload: payload[1].id, multi: true });
      dispatch('sub/GET', { payload: payload[1].id, multi: true });
      dispatch('user/GET', { payload: payload[1].id, multi: true });

      // commit('SET_LOADING', false);
    },
  },
  modules: {
    group: { ...group, namespaced: true },
    product: { ...product, namespaced: true },
    sub: { ...sub, namespaced: true },
    user: { ...user, namespaced: true },
  },
};
