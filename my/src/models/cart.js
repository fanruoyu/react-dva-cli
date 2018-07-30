import { notifyError } from '../services/app.js';
import { getCart, modifyGoodNumber, deleteCartItems, activeItems } from '../services/cart';

export default {
  namespace: 'cart',
  state: {
    cartInfo: [],
    cartKey: '',
    orderPriceInfo: [],
    checkedQuery: '',
    empty: true,
  },
  effects: {
    *getCart({ payload }, { call, put }) {
      const { data } = yield call(getCart, payload);
      if (data.code === '0') {
        if (data.data.items.length > 0) {
          yield put({
            type: 'getCartInfo',
            payload: data.data,
          });
        } else {
          yield put({
            type: 'changeEmpty',
            payload: false,
          });
          yield put({
            type: 'changeCartInfo',
          });
        }
      } else {
        yield put({
          type: 'changeCartInfo',
        });
        yield put({
          type: 'changeEmpty',
          payload: false,
        });
      }
    },
    *modifyGoodNumber({ payload }, { call, put }) {
      const { data } = yield call(modifyGoodNumber, payload);
      if (data.code === '0') {
        if (data.data) {
          yield put({
            type: 'getCartInfo',
            payload: data.data,
          });
        }
      } else {
        notifyError(data.msg);
      }
    },
    *deleteCartItems({ payload }, { call, put }) {
      const { data } = yield call(deleteCartItems, payload);
      if (data.code === '0') {
        if (data.data) {
          yield put({
            type: 'getCartInfo',
            payload: data.data,
          });
        } else {
          yield put({
            type: 'changeEmpty',
            payload: false,
          });
          yield put({
            type: 'changeCartInfo',
          });
        }
      } else {
        notifyError(data.msg);
      }
    },
    *activeItems({ payload }, { call, put }) {
      const { data } = yield call(activeItems, payload);
      if (data.code === '0') {
        if (data.data) {
          yield put({
            type: 'getCartInfo',
            payload: data.data,
          });
        }
      } else {
        notifyError(data.msg);
      }
    },
  },
  reducers: {
    getCartInfo(state, { payload }) {
      return { ...state,
        cartInfo: payload.items,
        cartKey: payload.entryKey,
        orderPriceInfo: payload.entryPriceInfo,
        checkedQuery: payload.checkedQuery };
    },
    changeEmpty(state, { payload }) {
      return { ...state, empty: payload };
    },
    changeCartInfo(state) {
      return { ...state, cartInfo: [] };
    },
  },
};
