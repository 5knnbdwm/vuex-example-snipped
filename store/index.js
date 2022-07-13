/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */

import Vue from 'vue';
import Vuex from 'vuex';
import { createStore } from 'vuex-extensions';

import Short from 'short-uuid';
import router from '@/router';
import error from '@/functions/errorsHandler';
import notification from '@/functions/snackbarHandler';

import auth from './module/auth';
import email from './module/email';
import news from './module/news';
import org from './module/org';
import product from './module/product';
import tableau from './module/tableau';
import tag from './module/tag';
import user from './module/user';

Vue.use(Vuex);

export default createStore(Vuex.Store, {
  state: {
    menuVisible: 'menuVisible' in localStorage ? localStorage.menuVisible === 'true' : true,
    adminActive: false,
    admin: false,
    loading: false,
    error: null,
    queue: [],
    config: {
      default: '',
      path: '',
      get: { active: false, msg: '' },
      update: { active: false, msg: '' },
      create: { active: false, msg: '' },
      delete: { active: false, msg: '' },
    },
  },
  getters: {
    isMenuVisible: (state) => state.menuVisible,
    isAdminActive: (state) => state.adminActive,
    isAdmin: (state) => state.admin,
  },
  mutations: {
    TOGGLE_MENU_VISIBILITY(state) {
      state.menuVisible = !state.menuVisible;
      localStorage.menuVisible = state.menuVisible;
    },
    SET_ADMIN_ACTIVE(state, payload) {
      state.adminActive = payload;
    },
    SET_ADMIN(state, payload) {
      state.admin = payload;
    },
  },
  actions: {
    SOCKET_ERROR({ dispatch }, payload) {
      if (payload[1].code === 10) {
        dispatch('auth/LOGOUT');
      }
    },
    WHEN_LOGIN({ dispatch, getters }) {
      dispatch('user/GET', { payload: getters['auth/data'].userId });
      dispatch('org/GET', { payload: getters['auth/data'].orgId });
      dispatch('product/GET', {});
      dispatch('tag/GET', {});
      dispatch('news/GET', {});
    },
    WHEN_LOGOUT() {
      this.reset();
    },
    WHEN_LOGIN_ADMIN({ commit, dispatch }) {
      commit('SET_ADMIN', true);
      dispatch('user/GET', {});
      dispatch('org/GET', {});
      dispatch('product/GET', {});
      dispatch('tableau/GET', { payload: true });
      dispatch('tag/GET', {});
      dispatch('news/GET', {});
    },
  },
  mixins: {
    getters: {
      data: (state) => {
        try {
          return state.order.map((item) => state.data[item]);
        } catch {
          return [];
        }
      },
      loading: (state) => state.loading,
      error: (state) => state.error,
      inQueue: (state) => (rid) => (state.queue.findIndex((item) => item.id === rid) !== -1),
      getQueueItem: (state) => (rid) => state.queue.find((item) => item.id === rid),
      isLastQueueItem: (state) => state.queue.length === 1,
      config: (state, _, rootState) => {
        let tmpConfig = state.config;
        if (rootState.admin) tmpConfig = { ...state.config, ...state.config.admin };
        delete tmpConfig.admin;
        return tmpConfig;
      },
    },
    mutations: {
      PUSH_DATA(state, payload) {
        function commitData(element) {
          if (state.order.indexOf(element.id) === -1) { state.order.push(element.id); }
          Vue.set(state.data, element.id, element);
        }

        if (Array.isArray(payload)) {
          for (let i = 0; i < payload.length; i += 1) {
            commitData(payload[i]);
          }
        } else {
          commitData(payload);
        }
      },
      REMOVE_DATA(state, payload) {
        const { data } = state;
        let { order } = state;

        delete data[payload.id];
        order = order.filter((item) => item !== payload.id);

        Vue.set(state, 'data', data);
        Vue.set(state, 'order', order);
      },
      SET_LOADING(state, loading) {
        state.loading = loading;
      },
      ADD_QUEUE(state, { rid, payload = {} }) {
        state.queue.push({ id: rid, ...payload, timestamp: new Date().getTime() });
      },
      REMOVE_QUEUE(state, rid) {
        state.queue = state.queue.filter((item) => item.id !== rid);
      },
      SET_ERROR(state, payload) {
        state.error = payload;
      },
      CLEAR_ERROR(state) {
        state.error = null;
      },
    },
    actions: {
      SOCKET_ERROR({ commit, getters }, payload) {
        if (getters.inQueue(payload[0])) {
          console.log(`[${getters.config.path}] SOCKET_ERROR`, payload);
          commit('SET_ERROR', error(payload[1]));

          if ('error' in getters.config && getters.config.error.active) notification.error(error(payload[1]));

          commit('SET_LOADING', false);
          commit('REMOVE_QUEUE', payload[0]);
        }
      },
      SOCKET_OK({ commit, getters }, payload) {
        if (getters.inQueue(payload[0])) {
          if (process.env.NODE_ENV !== 'production') {
            console.log(`[${getters.config.path}] SOCKET_OK`, payload);
          }

          if ('msg' in getters.getQueueItem(payload[0])) notification.success(getters.getQueueItem(payload[0]).msg);
          if ('rtr' in getters.getQueueItem(payload[0])) router.push({ name: getters.getQueueItem(payload[0]).rtr });

          if (getters.isLastQueueItem) {
            // console.log(`load [${getters.config.path}] pre ${getters.loading}`);
            commit('SET_LOADING', false);
            // console.log(`load [${getters.config.path}] after ${getters.loading}`);
          }
          commit('REMOVE_QUEUE', payload[0]);
        }
      },
      GET({ commit, getters }, { payload = false, multi = false, force = false }) {
        if (getters.config.get.active) {
          if (payload === true) {
            commit('CLEAR_ERROR');

            const rid = Short.uuid();
            commit('ADD_QUEUE', { rid });
            this._vm.$socket.client.emit(`${getters.config.default}_GET${getters.config.append || ''}${multi && getters.config.append ? 'S' : ''}`, rid);

            // eslint-disable-next-line max-len
            // console.log(`GET[${ getters.config.path }]${ getters.config.default }_GET${ getters.config.append || '' } ${ multi && getters.config.append ? 'S' : '' }`, rid, true);

            commit('SET_LOADING', true);
          } else if (payload === false) {
            commit('CLEAR_ERROR');

            const rid = Short.uuid();
            commit('ADD_QUEUE', { rid });
            this._vm.$socket.client.emit(`${getters.config.default}S_GET${getters.config.append || ''}${multi && getters.config.append ? 'S' : ''}`, rid);

            // eslint-disable-next-line max-len
            // console.log(`GET[${ getters.config.path }]${ getters.config.default }S_GET${ getters.config.append || '' } ${ multi && getters.config.append ? 'S' : '' }`, rid, false);

            commit('SET_LOADING', true);
          } else if (!('data' in getters) || !getters.data.find((item) => item.id === payload) || force) {
            commit('CLEAR_ERROR');

            const rid = Short.uuid();
            commit('ADD_QUEUE', { rid });
            this._vm.$socket.client.emit(`${getters.config.default}_GET${getters.config.append || ''}${multi && getters.config.append ? 'S' : ''}`, rid, { id: payload });

            // eslint-disable-next-line max-len
            // console.log(`GET[${ getters.config.path }]${ getters.config.default }_GET${ getters.config.append || '' } ${ multi && getters.config.append ? 'S' : '' } `, rid, { id: payload });
            commit('SET_LOADING', true);
          }
        }
      },
      UPDATE({ commit, getters }, payload) {
        if (getters.config.update.active) {
          commit('CLEAR_ERROR');

          const rid = Short.uuid();
          commit('ADD_QUEUE', { rid, payload: { ...getters.config.update } });
          this._vm.$socket.client.emit(`${getters.config.default}_UPDATE${getters.config.append || ''}`, rid, { ...payload });
          commit('SET_LOADING', true);
        }
      },
      CREATE({ commit, getters }, payload) {
        if (getters.config.create.active) {
          commit('CLEAR_ERROR');

          const rid = Short.uuid();
          commit('ADD_QUEUE', { rid, payload: { ...getters.config.create } });
          this._vm.$socket.client.emit(`${getters.config.default}_CREATE${getters.config.append || ''}`, rid, { ...payload });
          commit('SET_LOADING', true);
        }
      },
      DELETE({ commit, getters }, payload) {
        if (getters.config.delete.active) {
          commit('CLEAR_ERROR');

          commit('REMOVE_DATA', payload);

          const rid = Short.uuid();
          commit('ADD_QUEUE', { rid, payload: { ...getters.config.delete } });
          this._vm.$socket.client.emit(`${getters.config.default}_DELETE${getters.config.append || ''}`, rid, { ...payload });
          commit('SET_LOADING', true);
        }
      },
    },
  },
  modules: {
    auth: { ...auth, namespaced: true },
    email: { ...email, namespaced: true },
    news: { ...news, namespaced: true },
    org: { ...org, namespaced: true },
    product: { ...product, namespaced: true },
    tableau: { ...tableau, namespaced: true },
    tag: { ...tag, namespaced: true },
    user: { ...user, namespaced: true },
  },
  // strict: true,
});
