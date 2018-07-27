// dev环境
const getValue = (key) => {
  const arr = window.location.hash.split(/[?&]/);
  const obj = {};
  arr.map((item) => {
    if (item.indexOf('=') !== -1) {
      const itemArr = item.split('=');
      obj[itemArr[0]] = itemArr[1];
    }
  });
  return obj[key];
};

export const authkey = getValue('authkey') || '9cc17e4c54bad875.1532660689808';

export const userId = getValue('username') || 'bp0000001';

export const soldToId = getValue('soldToPartnerId') || '0100095356';

export const usertoken = getValue('usertoken');

// 商品页面跳转链接
export const shoppingLink = `http://10.99.124.103/product/index.html?username=${userId}&usertoken=${usertoken}&authkey=${authkey}&soldToPartnerId=${soldToId}`;

// BP页面跳转链接
export const BPLink = `http://10.120.112.94:8888/web/portal/welcome?username=${userId}&usertoken=${usertoken}&authkey=${authkey}&soldToPartnerId=${soldToId}`;


// 特策合同审查链接
export const specialCheck = `http://10.99.124.103:8045/status/ordercheck?usertoken=${usertoken}&authkey=${authkey}&username=${userId}&soldToPartnerId=${soldToId}`;

export const baseParam = {
  dataFrom: 'BPSC，BPS',
  entryType: '1',
  tenant: {
    currencyCode: 'CNY',
    language: 'CN',
    orderSource: '27',
  },
};

const base = document.domain;
if (base.indexOf('lenovo.com.cn') !== -1) {
  window.onload = () => {
    document.domain = 'lenovo.com.cn';
  };
}

let domain = 'https://api-dev.unifiedcloud.lenovo.com';

if (base.indexOf('localhost') !== -1) {
  domain = '/orderEntry';
}

export default domain;

// POST方式的请求头
export const headersPost = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'MSP-AppKey': 'FA0C4B2415AD407691074E49AA892059',
  'MSP-AuthKey': authkey,
  'Access-Control-Max-Age': 86400,
};

// GET方式的请求头
export const headersGet = {
  'MSP-AppKey': 'FA0C4B2415AD407691074E49AA892059',
  'MSP-AuthKey': authkey,
  'Access-Control-Max-Age': 86400,
};

// 调用订单录入中心服务
export const orderEntry = '/pcsd-orderservicecenter-orderentry';

export const apiPrefix = `${domain}${orderEntry}`;

// 调用客户中心服务
export const custom = '/crm-cmd-soldto/v2';

// 调用订单中心拆单服务
export const order = '/pcsd-orderservicecenter-order-bff';

// 调用商品中心服务
export const good = '/lenovo-pcsd-products-query';

// 调用标准商品中心服务
export const products = '/lenovo-pcsd-products-groups';

// 调用特策合同订单服务
export const specialOrder = '/pcsd-orderservicecenter-contract-bff';

