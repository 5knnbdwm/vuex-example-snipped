/* eslint-disable no-underscore-dangle */

import Short from 'short-uuid';
// eslint-disable-next-line import/no-cycle
import router from '@/router';

import signup from './auth/signup';
import passwordReset from './auth/passwordReset';
import passwordRequest from './auth/passwordRequest';
import passwordChange from './auth/passwordChange';

export default {
  state: {
    data: {
      userId: null,
      orgId: null,
    },
    loggedIn: false,
    loading: false,
    error: null,
    queue: [],
    config: {
      default: '',
      path: 'auth',
      error: { active: false },
      get: { active: false, msg: '' },
      update: { active: false, msg: '' },
      delete: { active: false, msg: '' },
      create: { active: false, msg: '' },
    },
  },
  getters: {
    data: (state) => state.data,
    loggedIn: (state) => state.loggedIn,
  },
  mutations: {
    PUSH_DATA(state, payload) {
      state.data = payload;
    },
    SET_TOKEN(state, payload) {
      if (localStorage.auth_remember === 'true') {
        delete localStorage.auth_token;
        localStorage.auth_token = payload.token;

        delete localStorage.auth_expire;
        localStorage.auth_expire = payload.expires_at;
      } else {
        delete sessionStorage.auth_token;
        sessionStorage.auth_token = payload.token;
      }
    },
    CLEAR_TOKEN() {
      delete localStorage.auth_token;
      delete localStorage.auth_expire;
      delete sessionStorage.auth_token;
    },
    SET_STORAGE_REMEMBER(state, remember) {
      delete localStorage.auth_remember;
      localStorage.auth_remember = remember;
    },
    SET_LOGGED_IN(state, loggedIn) {
      state.loggedIn = loggedIn;
    },
  },
  actions: {
    SOCKET_OK({ commit, getters }, payload) {
      if (getters.inQueue(payload[0])) {
        if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_OK`, payload);

        // if ('msg' in getters.getQueueItem(payload[0])) {
        //   notification.success(getters.getQueueItem(payload[0]).msg);
        // }
        // if ('rtr' in getters.getQueueItem(payload[0])) {
        //   router.push({ name: getters.getQueueItem(payload[0]).rtr });
        // }

        // commit('REMOVE_QUEUE', payload[0]);
        commit('SET_LOADING', false);
      }
    },
    SOCKET_FORCE_LOGOUT({ dispatch, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_FORCE_LOGOUT`, payload);
      dispatch('LOGOUT');
    },
    SOCKET_AUTH_TOKEN({ commit, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_AUTH_TOKEN`, payload);

      commit('SET_LOGGED_IN', true);
      commit('SET_TOKEN', payload[1]);

      commit('SET_LOADING', false);
    },
    SOCKET_AUTH_LOGIN({ commit, dispatch, getters }, payload) {
      if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_AUTH_LOGIN`, payload);
      dispatch('GET', payload[1].user_id);

      commit('REMOVE_QUEUE', payload[0]);
    },
    SOCKET_USER({ commit, dispatch, getters }, payload) {
      if (getters.inQueue(payload[0])) {
        if (process.env.NODE_ENV !== 'production') console.log(`[${getters.config.path}] SOCKET_USER`, payload);

        commit('PUSH_DATA', { userId: payload[1].id, orgId: payload[1].org_id });
        commit('user/SET_SELECTION', payload[1].id, { root: true });
        commit('org/SET_SELECTION', payload[1].org_id, { root: true });

        if (payload[1].type === 'admin') {
          dispatch('WHEN_LOGIN_ADMIN', null, { root: true });
        } else {
          dispatch('WHEN_LOGIN', null, { root: true });
        }

        const redirectParams = new URLSearchParams(window.location.search);

        if (redirectParams.has('redirect')) {
          router.push({ path: redirectParams.get('redirect') });
        } else {
          router.push({ name: 'Home' });
        }

        commit('REMOVE_QUEUE', payload[0]);
        commit('SET_LOADING', false);
      }
    },
    GET({ commit }, payload) {
      const rid = Short.uuid();
      commit('ADD_QUEUE', { rid });
      this._vm.$socket.client.emit('USER_GET', rid, { id: payload });
    },
    LOGIN({ commit }, payload) {
      commit('SET_LOADING', true);
      commit('CLEAR_ERROR');

      if ('remember' in payload) {
        commit('SET_STORAGE_REMEMBER', payload.remember);
      } else {
        commit('SET_STORAGE_REMEMBER', true);
      }

      const rid = Short.uuid();
      commit('ADD_QUEUE', { rid });
      this._vm.$socket.client.emit('AUTH_LOGIN', rid, { email: payload.email, password: payload.password });
    },
    PRE_LOGIN({ commit }) {
      if ('auth_expire' in localStorage && localStorage.auth_expire > new Date().getTime()) {
        if ('auth_remember' in localStorage && localStorage.auth_remember === 'true' && 'auth_token' in localStorage) {
          const rid = Short.uuid();
          commit('ADD_QUEUE', { rid });
          this._vm.$socket.client.emit('AUTH_LOGIN', rid, { token: localStorage.auth_token });
        } else if ('auth_remember' in localStorage && localStorage.auth_remember === 'false' && 'auth_token' in sessionStorage) {
          const rid = Short.uuid();
          commit('ADD_QUEUE', { rid });
          this._vm.$socket.client.emit('AUTH_LOGIN', rid, { token: sessionStorage.auth_token });
        }
      }
    },
    LOGOUT({ commit, dispatch }) {
      const rid = Short.uuid();
      commit('ADD_QUEUE', { rid });
      this._vm.$socket.client.emit('AUTH_LOGOUT', rid);
      commit('SET_LOGGED_IN', false);
      commit('CLEAR_TOKEN');
      // router.push({ name: 'Login' });
      dispatch('WHEN_LOGOUT', null, { root: true });
    },
  },
  modules: {
    signup: { ...signup, namespaced: true },
    passwordChange: { ...passwordChange, namespaced: true },
    passwordReset: { ...passwordReset, namespaced: true },
    passwordRequest: { ...passwordRequest, namespaced: true },
  },
};
