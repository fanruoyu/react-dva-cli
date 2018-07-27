import request from '../utils/request';
import { headersPost, headersGet, orderEntry, custom, products, userId } from '../utils/Constants';

// 初始化快速下单页面
export async function initCart(params) {
  return request(`${orderEntry}/v2/cart/init`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}


// 获取购物车信息
export async function getCart(params) {
  return request(`${orderEntry}/v2/cart/getCart`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 选择商品
export async function searchGoods(params) {
  return request(`${products}/v2/crmPrice/pageByCustomer?materialNumber=${params.materialNumber}&customer=${userId}&distribChnls=${params.distribChnls}&productGroups=${params.productGroups}&salesOrgs=${params.salesOrgs}`, {
    method: 'get',
    headers: headersGet,
  });
}

// 添加商品
export async function addProduct(params) {
  return request(`${orderEntry}/v2/cart/addProduct`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 删除商品
export async function deleteCartItems(params) {
  return request(`${orderEntry}/v2/cart/deleteItems`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 更改数量
export async function modifyGoodNumber(params) {
  return request(`${orderEntry}/v2/cart/modifyItemQuantity`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 修改行向上的信息
export async function updateItemInfo(params) {
  return request(`${orderEntry}/v2/cart/updateItemInfo`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}
// 提交信息
export async function submitOrder(params) {
  return request(`${orderEntry}/v2/cart/submitOrder`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}
// 更新头部信息
export async function updateHeaderInfo(params) {
  return request(`${orderEntry}/v2/cart/updateHeaderInfo`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}
// 获取address信息
export async function searchSoldAddress(params) {
  return request(`${custom}/soldtopartners/${params.soldToPartnerId}`, {
    method: 'get',
    headers: headersGet,
  });
}
