import request from '../utils/request';
import { headersPost, orderEntry } from '../utils/Constants';

export async function getCart(params) {
  return request(`${orderEntry}/v2/cart/getCart`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

export async function modifyGoodNumber(params) {
  return request(`${orderEntry}/v2/cart/modifyItemQuantity`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

export async function deleteCartItems(params) {
  return request(`${orderEntry}/v2/cart/deleteItems`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

export async function activeItems(params) {
  return request(`${orderEntry}/v2/cart/activeItems`, {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}

