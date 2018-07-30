import request from '../utils/request';
import { headersPost, headersGet } from '../utils/Constants';

// export async function getLoginMsg() {
//   return request('/user/logininfo?src=pc&page=searchresult&time=1532913518156', {
//     method: 'get',
//     headers: headersGet,
//   });
// }
// export async function getLoginMsg() {
//   return request('/data/69xiu/list/?page=0&size=5', {
//     method: 'get',
//     headers: headersGet,
//   });
// }
export async function getLoginMsg(params) {
  return request('/boot/admin/login.json', {
    method: 'post',
    headers: headersPost,
    body: JSON.stringify(params),
  });
}
