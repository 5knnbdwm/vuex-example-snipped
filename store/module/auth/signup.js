/* eslint-disable no-underscore-dangle */

import Short from 'short-uuid';
import error from '@/functions/errorsHandler';
// import notification from '@/functions/snackbarHandler';

export default {
  state: {
    data: false,
    loading: false,
    error: null,
    queue: [],
    config: {
      default: '',
      path: 'auth/signup',
      get: { active: false, msg: '' },
      update: { active: false, msg: '' },
      delete: { active: false, msg: '' },
      create: { active: false, msg: '' },
    },
  },
  getters: {
    data: (state) => state.data,
  },
  mutations: {
    SET_DATA(state, payload) {
      state.data = payload;
    },
    SET_DATA_CLEAR() {
      this.reset({
        self: false,
        nested: false,
        modules: {
          auth: {
            self: false,
            nested: true,
          },
        },
      });
    },
  },
  actions: {
    SOCKET_ERROR({ commit, getters }, payload) {
      if (getters.inQueue(payload[0])) {
        // const errorMessage = error(payload[1]);
        console.log(`[${getters.config.path}] SOCKET_ERROR`, payload);

        commit('SET_ERROR', error(payload[1]));
        // commit('SET_ERROR', { msg: errorMessage, code: payload[0].code });
        commit('SET_DATA', false);

        commit('REMOVE_QUEUE', payload[0]);
        commit('SET_LOADING', false);
      }
    },
    SOCKET_OK({ commit, getters }, payload) {
      if (getters.inQueue(payload[0])) {
        if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_OK`, payload);

        commit('SET_DATA', true);

        // if ('msg' in getters.getQueueItem(payload[0])) {
        //   notification.success(getters.getQueueItem(payload[0]).msg);
        // }
        // if ('rtr' in getters.getQueueItem(payload[0])) {
        //   router.push(getters.getQueueItem(payload[0]).rtr);
        // }

        commit('REMOVE_QUEUE', payload[0]);
        commit('SET_LOADING', false);
      }
    },
    PUSH({ commit }, payload) {
      commit('CLEAR_ERROR');

      const rid = Short.uuid();
      commit('ADD_QUEUE', { rid });
      this._vm.$socket.client.emit('AUTH_ACTIVATE', rid, payload);
      commit('SET_LOADING', true);
    },
  },
};
