import { message } from 'antd';
import { notifyError } from '../services/app.js';
import { getCart, initCart, addProduct, deleteCartItems, modifyGoodNumber, updateItemInfo, updateHeaderInfo, submitOrder, searchSoldAddress, searchGoods } from '../services/settlement';

export default {
  namespace: 'settlement',
  state: {
    cartInfo: [],
    cartKey: '',
    orderPriceInfo: [],
    checkedQuery: '',
    address: [],
    billToInfo: {},
    shipToInfo: {},
    shipToInfoInit: {},
    shipToInfoStr: '',
    addressInfo: [],
    rebateType: '',
    addressCodeArr: [],
    isSubmit: true,
    goodArr: [],
    soldToInfo: {
      productGroup: [],
      channel: '',
      salesOrg: '',
    },
  },
  effects: {
    *submitOrder({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmit',
        payload: false,
      });
      const { data } = yield call(submitOrder, payload);
      if (data.code === '0') {
        message.success('订单已提交!');
        setTimeout(() => {
          window.location.href = `/#/Order?id=${data.data}`;
        }, 3000);
      } else {
        yield put({
          type: 'changeSubmit',
          payload: true,
        });
        notifyError(data.msg);
      }
    },
    *getCart({ payload }, { call, put }) {
      const { data } = yield call(getCart, payload);
      if (data.code === '0') {
        yield put({
          type: 'changeSubmit',
          payload: true,
        });
        if (data.data) {
          yield put({
            type: 'getCartInfo',
            payload: data.data,
          });
        } else {
          yield put({
            type: 'changeCartInfo',
          });
          notifyError('购物车已清空');
        }
      } else {
        yield put({
          type: 'changeCartInfo',
        });
        notifyError(data.msg);
      }
    },
    *initCart({ payload }, { call, put }) {
      const { data } = yield call(initCart, payload);
      if (data.code === '0') {
        yield put({
          type: 'changeSubmit',
          payload: true,
        });
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
    *addProduct({ payload }, { call, put }) {
      const { data } = yield call(addProduct, payload);
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
            type: 'changeCartInfo',
          });
        }
      } else {
        notifyError(data.msg);
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
    *updateHeaderInfo({ payload }, { call }) {
      const { data } = yield call(updateHeaderInfo, payload);
      if (data.code !== '0') {
        notifyError(data.msg);
      }
    },
    *updateItemInfo({ payload }, { call }) {
      const { data } = yield call(updateItemInfo, payload);
      if (data.code !== '0') {
        notifyError(data.msg);
      }
    },
    *searchSoldAddress({ payload }, { call, put }) {
      const { data } = yield call(searchSoldAddress, payload);
      if (data.code === '0') {
        yield put({
          type: 'getAddress',
          payload: data.data,
        });
      } else {
        notifyError(data.msg);
      }
    },
    *searchGoods({ payload }, { call, put }) {
      const { data } = yield call(searchGoods, payload);
      if (data.code === '200') {
        yield put({
          type: 'getGoods',
          payload: data.data.pageList,
        });
      } else {
        notifyError(data.msg);
      }
    },
  },
  reducers: {
    getCartInfo(state, { payload }) {
      const info = payload.shipToInfo;
      const shipToInfoStr = `${info.shipToName} ${info.shipToContact.telePhone ? info.shipToContact.telePhone : ''} ${info.shipToAddress.province}${info.shipToAddress.city}${info.shipToAddress.area}${info.shipToAddress.street}`;
      return { ...state,
        cartInfo: payload.items,
        cartKey: payload.entryKey,
        orderPriceInfo: payload.entryPriceInfo,
        checkedQuery: payload.checkedQuery,
        billToInfo: payload.billToInfo,
        shipToInfo: payload.shipToInfo,
        shipToInfoInit: payload.shipToInfo,
        rebateType: payload.rebateType,
        shipToInfoStr };
    },
    getAddress(state, { payload }) {
      const addressInfo = [];
      const addressCodeArr = [];
      const productGroup = [];
      const channel = [];
      const salesOrg = [];
      payload.shipToPartners.map((item) => {
        // v2的返回信息拼接
        addressInfo.push(`${item.name} ${item.contact.telephone} ${item.address.province}${item.address.city}${item.address.area}${item.address.street}`);
        addressCodeArr.push(item.code);
      });
      payload.salesAreas.map((item) => {
        productGroup.push(item.productGroupId);
        channel.push(item.channel);
        salesOrg.push(item.salesOrg);
      });
      return { ...state,
        address: payload.shipToPartners,
        addressInfo,
        addressCodeArr,
        soldToInfo: {
          productGroup,
          channel,
          salesOrg,
        } };
    },
    getGoods(state, { payload }) {
      return { ...state, goodArr: payload };
    },
    changeSubmit(state, { payload }) {
      return { ...state, isSubmit: payload };
    },
    changeCartInfo(state) {
      return { ...state, cartInfo: [], orderPriceInfo: {}, checkedQuery: '' };
    },
  },
};
