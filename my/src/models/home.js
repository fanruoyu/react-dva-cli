import { notifyError, notifySuccess } from '../services/app.js';
import { getLoginMsg } from '../services/home';

export default {
  namespace: 'home',
  state: {
    userName: '',
    password: '',
  },
  effects: {
    *saveUserMsg({ payload, callback }, { call, put }) {
      // const { data } = yield call(getCart, payload);
      callback && callback();
      yield put({
        type: 'changeUserMsg',
        payload: { ...payload },
      });
    },
    *saveLoginMsg({ payload, callback }, { call, put }) {
      const { data } = yield call(getLoginMsg, payload);
      console.log(data, '============');
      callback && callback();
      yield put({
        type: 'changeLoginMsg',
        payload: data,
      });
    },
  },
  reducers: {
    changeUserMsg(state, { payload }) {
      return { ...state, userName: payload.userName };
    },
    changeLoginMsg(state, { payload }) {
      return { ...state, password: payload.password };
    },
  },
};
