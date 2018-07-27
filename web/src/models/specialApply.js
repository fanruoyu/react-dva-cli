import { message } from 'antd';
import { notifyError } from '../services/app.js';
import { searchSoldAddress, specialApplyInit, getContractApply, updateHeaderInfo, searchGood, addGood, submitApply, modifyItemQuantity, updatePrice, updateItemInfo, deleteItems, searchSpecialInfo, searchOrderReason } from '../services/specialApply';

export default {
  namespace: 'specialApply',
  state: {
    address: [],
    shipToInfoStr: '',
    billToInfo: {},
    shipToInfoInit: {},
    shipCodeInit: '',
    addressInfo: [],
    addressCodeArr: [],
    contractInfo: [],
    entryKey: '',
    isUseRebate: '',
    goodArr: [],
    specialInfo: {},
    specialInfoMsg: '',
    isSubmit: true,
    loading: true,
    group: [],
  },
  effects: {
    // 初始化
    *specialApplyInit({ payload }, { call, put }) {
      const { data } = yield call(specialApplyInit, payload);
      yield put({
        type: 'changeSubmit',
        payload: true,
      });
      if (data.code === '0') {
        yield put({
          type: 'applyInit',
          payload: data.data,
        });
      } else {
        notifyError(data.msg);
      }
    },
    // 更新信息
    *updateHeaderInfo({ payload }, { call }) {
      const { data } = yield call(updateHeaderInfo, payload);
      if (data.code !== '0') {
        notifyError(data.msg);
      }
    },
    // 获取合同订单信息
    *getContractApply({ payload }, { call }) {
      const { data } = yield call(getContractApply, payload);
      if (data.code !== '0') {
        notifyError(data.msg);
      }
    },
    // 获取客户的地址组
    *searchSoldAddress({ payload }, { call, put }) {
      const { data } = yield call(searchSoldAddress, payload);
      if (data.code === '0') {
        yield put({
          type: 'getAddress',
          payload: data.data.shipToPartners,
        });
      } else {
        notifyError(data.msg);
      }
    },
    // 查询商品
    *searchGood({ payload }, { call, put }) {
      const { data } = yield call(searchGood, payload);
      if (data.code === '0') {
        if (data.data.goodsDetail === null) {
          message.warning('未查询到此商品！');
        } else {
          yield put({
            type: 'getGood',
            payload: data.data.goodsDetail,
          });
        }
      } else {
        notifyError(data.msg);
      }
    },
    // 添加商品
    *addGood({ payload }, { call, put }) {
      const { data } = yield call(addGood, payload);
      if (data.code === '0') {
        yield put({
          type: 'getContractInfo',
          payload: data.data,
        });
        message.success('商品已添加成功！');
      } else {
        notifyError(data.msg);
      }
    },
    // 修改商品数量
    *modifyItemQuantity({ payload }, { call, put }) {
      const { data } = yield call(modifyItemQuantity, payload);
      if (data.code === '0') {
        yield put({
          type: 'getContractInfo',
          payload: data.data,
        });
      } else {
        notifyError(data.msg);
      }
    },
    // 修改商品送达日期
    *updateItemInfo({ payload }, { call }) {
      const { data } = yield call(updateItemInfo, payload);
      if (data.code !== '0') {
        notifyError(data.msg);
      }
    },
    // 修改商品数量
    *updatePrice({ payload }, { call, put }) {
      const { data } = yield call(updatePrice, payload);
      if (data.code === '0') {
        yield put({
          type: 'getContractInfo',
          payload: data.data,
        });
      } else {
        notifyError(data.msg);
      }
    },
    // 删除商品
    *deleteItems({ payload }, { call, put }) {
      const { data } = yield call(deleteItems, payload);
      if (data.code === '0') {
        yield put({
          type: 'getContractInfo',
          payload: data.data,
        });
      } else {
        notifyError(data.msg);
      }
    },
    // 提交申请
    *submitApply({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmit',
        payload: false,
      });
      const { data } = yield call(submitApply, payload);
      if (data.code !== '0') {
        yield put({
          type: 'changeSubmit',
          payload: true,
        });
        notifyError(data.msg);
      } else {
        message.success('订单已提交!');
        setTimeout(() => {
          window.location.href = `/#/SpecialConfirm?id=${data.data}`;
        }, 3000);
      }
    },
    // 查询特策合同信息
    *searchSpecialInfo({ payload }, { call, put }) {
      const { data } = yield call(searchSpecialInfo, payload);
      if (data.code === 0) {
        yield put({
          type: 'getSpecialInfo',
          payload: data.data,
        });
      } else {
        yield put({
          type: 'getSpecialInfoMsg',
          payload: data.msg,
        });
      }
    },
    // 查询特策合同信息
    *searchOrderReason({ payload }, { call, put }) {
      const { data } = yield call(searchOrderReason, payload);
      if (data.code === 0) {
        yield put({
          type: 'getGroup',
          payload: data.data[0],
        });
      } else {
        notifyError(data.msg);
      }
    },
  },
  reducers: {
    applyInit(state, { payload }) {
      const info = payload.shipToInfo;
      const shipToInfoStr = `${info.shipToName} ${info.shipToContact.telePhone ? info.shipToContact.telePhone : ''} ${info.shipToAddress.province}${info.shipToAddress.city}${info.shipToAddress.area}${info.shipToAddress.street}`;
      return { ...state,
        shipCodeInit: info.shipToCode,
        contractInfo: payload.items,
        entryKey: payload.entryKey,
        billToInfo: payload.billToInfo,
        shipToInfoInit: payload.shipToInfo,
        isUseRebate: payload.rebateType,
        entryStartTime: payload.entryStartTime,
        entryEndTime: payload.entryEndTime,
        shipToInfoStr };
    },
    getAddress(state, { payload }) {
      const addressInfo = [];
      const addressCodeArr = [];
      payload.map((item) => {
        // v2的返回信息拼接
        addressInfo.push(`${item.name} ${item.contact.telephone} ${item.address.province}${item.address.city}${item.address.area}${item.address.street}`);
        addressCodeArr.push(item.code);
      });
      return { ...state, address: payload, addressInfo, addressCodeArr };
    },
    getGood(state, { payload }) {
      return { ...state, goodArr: payload };
    },
    getContractInfo(state, { payload }) {
      return { ...state,
        contractInfo: payload.items };
    },
    getSpecialInfo(state, { payload }) {
      return { ...state,
        specialInfo: payload,
        loading: false };
    },
    getSpecialInfoMsg(state, { payload }) {
      return { ...state,
        specialInfoMsg: payload };
    },
    changeSubmit(state, { payload }) {
      return { ...state, isSubmit: payload };
    },
    getGroup(state, { payload }) {
      return { ...state, group: payload };
    },
  },
};
