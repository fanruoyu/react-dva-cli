import request from '../utils/request';
import { headersGet, order } from '../utils/Constants';

export async function orderMainNo(params) {
  return request(`${order}/v1/order/detailbyid/${params.id}`, {
    method: 'get',
    headers: headersGet });
}
