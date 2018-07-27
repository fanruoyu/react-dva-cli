import { orderMainNo } from '../services/order';

export default {
  namespace: 'order',
  state: {
    loading: true,
    orderInfo: {},
    orderMsg: '',
  },
  effects: {
    *orderMainNo({ payload }, { call, put }) {
      const { data } = yield call(orderMainNo, payload);
      if (parseInt(data.code, 10) === 0) {
        yield put({
          type: 'orderInfo',
          payload: data.data,
        });
      } else {
        yield put({
          type: 'orderMsg',
          payload: data.msg,
        });
      }
    },
  },
  reducers: {
    orderInfo(state, { payload }) {
      return { ...state, loading: false, orderInfo: payload };
    },
    orderMsg(state, { payload }) {
      return { ...state, orderMsg: payload };
    },
  },
};
