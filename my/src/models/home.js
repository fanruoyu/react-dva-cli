import { notifyError } from '../services/app.js';
import { getLoginMsg, } from '../services/home';

export default {
  namespace: 'home',
  state: {
    userName: '',
    password: '',
  },
  effects: {
    *saveUserMsg({ payload }, { call, put }) {
      // const { data } = yield call(getCart, payload);
      yield put({
        type: 'changeUserMsg',
        payload: { ...payload },
      });
    },
    *saveLoginMsg({ payload }, { call, put }) {
      const { data } = yield call(getLoginMsg, payload);
      console.log(data, '============');
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
