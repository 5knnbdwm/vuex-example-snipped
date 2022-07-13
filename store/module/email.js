import Short from 'short-uuid';

export default {
  state: {
    data: {},
    order: [],
    loading: false,
    error: null,
    queue: [],
    config: {
      default: 'EMAIL',
      path: 'email',
      get: { active: false, msg: '' },
      update: { active: false, msg: '' },
      create: { active: false, msg: '' },
      delete: { active: false, msg: '' },
      admin: {
        // get: { active: false, msg: '' },
        // update: { active: false, msg: '' },
        // create: { active: false, msg: '' },
        // delete: { active: false, msg: '' },
      },
    },
  },
  getters: {
    dataById: (state) => (id) => state.data[id],
  },
  mutations: {},
  actions: {
    ACTIVATE({ commit, getters }, payload) {
      commit('CLEAR_ERROR');

      const rid = Short.uuid();
      commit('ADD_QUEUE', { rid, payload: { ...getters.config.create, msg: 'Nutzer wurde erstellt. Der Nutzer hat noch keine Aktivierungs E-Mail bekommen' } });
      // eslint-disable-next-line no-underscore-dangle
      this._vm.$socket.client.emit(`${getters.config.default}_SEND_ACTIVATION`, rid, { ...payload });
      commit('SET_LOADING', true);
    },
  },
};
