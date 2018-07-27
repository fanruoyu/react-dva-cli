/* eslint-disable no-console */
import fetch from 'dva/fetch';
import FileSaver from 'file-saver';
import API_PREFIX from './Constants';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(`${response.status}: ${response.statusText}`);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param apiPrefix Prefix of backend restful API.
 * @return {object}           An object containing either "data" or "err"
 */

export default function request(url, options, apiPrefix = API_PREFIX) {
  const fetchOptions = {
    credentials: 'same-origin',
    ...options,
  };
  const fetchUrl = `${apiPrefix}${url}`;
  return fetch(fetchUrl, fetchOptions).then(checkStatus).then(parseJSON).then((data) => {
    return ({
      data,
    });
  })
  .catch((err) => {
    throw err;
  });
}

export function requestBlob(url, options, apiPrefix = API_PREFIX) {
  const fetchOptions = {
    credentials: 'same-origin',
    ...options,
  };
  const fetchUrl = `${apiPrefix}${url}`;
  return fetch(fetchUrl, fetchOptions).then(checkStatus)
  .then(response => response.blob()).then((data) => {
    const blob = new Blob([data]);
    FileSaver.saveAs(blob, options.fileName);
    return blob;
  })
  .catch((err) => {
    throw err;
  });
}

export const delay = time => new Promise(resolve => setTimeout(resolve, time));
