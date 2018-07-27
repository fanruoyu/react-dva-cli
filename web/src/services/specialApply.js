import request from '../utils/request';
import { headersPost, headersGet, orderEntry, good, specialOrder, custom } from '../utils/Constants';

// 获取address信息
export async function searchSoldAddress(params) {
  return request(`${custom}/soldtopartners/${params.soldToPartnerId}`, {
    method: 'get',
    headers: headersGet,
  });
}

// 初始化整个合同订单
export async function specialApplyInit(params) {
  return request(`${orderEntry}/v1/specialApply/init`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 获取整个合同订单
export async function getContractApply(params) {
  return request(`${orderEntry}/v1/specialApply/getContractApply`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 修改信息
export async function updateHeaderInfo(params) {
  return request(`${orderEntry}/v1/specialApply/updateHeaderInfo`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 查询商品
export async function searchGood(params) {
  return request(`${good}/v2/product/goodsByParamsCrm?soldtoPartnerId=${params.soldtoPartnerId}&materialNumber=${params.MTMCode}`, {
    method: 'get',
    headers: headersGet,
  });
}

// 添加商品
export async function addGood(params) {
  return request(`${orderEntry}/v1/specialApply/addProducts`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 提交申请
export async function submitApply(params) {
  return request(`${orderEntry}/v1/specialApply/submit`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 修改商品数量
export async function modifyItemQuantity(params) {
  return request(`${orderEntry}/v1/specialApply/modifyItemQuantity`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 修改商品价格
export async function updatePrice(params) {
  return request(`${orderEntry}/v1/specialApply/updatePrice`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}
// 修改信息
export async function updateItemInfo(params) {
  return request(`${orderEntry}/v1/specialApply/updateItemInfo`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 删除商品
export async function deleteItems(params) {
  return request(`${orderEntry}/v1/specialApply/deleteItems`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

// 查询特策合同信息
export async function searchSpecialInfo(params) {
  return request(`${specialOrder}/contract/${params.id}`, {
    method: 'get',
    headers: headersGet,
  });
}


// 根据产品组查询订单原因
export async function searchOrderReason(productGroupNo) {
  return request(`${specialOrder}/orderReason/product/${productGroupNo}`, {
    method: 'get',
    headers: headersGet,
  });
}
