const base = document.domain;
let domain = 'http://114.112.96.62:8080';
if (base.indexOf('localhost') !== -1) {
  domain = '/boot';
}
export default domain;
// POST方式的请求头
export const headersPost = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Max-Age': 86400,
};

// GET方式的请求头
export const headersGet = {
  'Access-Control-Max-Age': 86400,
};

