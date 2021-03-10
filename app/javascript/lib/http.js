/* eslint-disable */
import 'whatwg-fetch';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest' // make backwards compatible with rails "request.xhr?"
};

/**
 * @returns {String}
 */
function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.getAttribute('content') : '';
}

/**
 * @param Response response - fetch response
 * @returns {Promise} - JSON-unserialized API data
 */
function respond(response) {
  if(response.status === 204) {
    return Promise.resolve();
  }
  return response.json()
    .then((json) => {
      if (json.error) {
        throw new Error(json.error);
      }
      return json;
    })
    .catch(e => Promise.reject(e))
    .then(json => json.data);
}

/**
 * @param {String} url
 * @returns {Promise<Object>} - JSON-unserialized API data
 */
export function get(url) {
  return fetch(url, {
    headers: Object.assign({ 'X-CSRF-Token': getCsrfToken() }, headers),
  }).then(respond);
}

/**
 * @param {String} url
 * @returns {Promise<Object>} - JSON-unserialized API data
 */
export function destroy(url) {
  return fetch(url, {
    credentials: 'same-origin',
    headers: Object.assign({ 'X-CSRF-Token': getCsrfToken() }, headers),
    method: 'DELETE',
    redirect: 'error',
  }).then(respond);
}

/**
 * @param {String} url
 * @param {String} body
 * @returns {Promise<Object>} - JSON-unserialized API data
 */
export function post(url, body) {
  return fetch(url, {
    body: JSON.stringify(body),
    credentials: 'same-origin',
    headers: Object.assign({ 'X-CSRF-Token': getCsrfToken() }, headers),
    method: 'POST',
    redirect: 'error',
  }).then(respond);
}

/**
 * Serialize objects for GET query parameters or application/x-www-form-urlencoded HTTP POST body
 *
 * @param {Object} parameters
 * @param {Object} options
 * @param {String|null} options.prefix
 * @returns {String}
 */
export function serialize(parameters, { prefix= null } = {}) {
  const parts = [];
  Object.keys(parameters).forEach(key => {
    if (typeof parameters[key] !== 'undefined' && parameters[key] !== null) {
      const param = prefix ? `${prefix}[${key}]` : key;
      const value = parameters[key];
      if (typeof value === 'object') {
        parts.push(serialize(value, { prefix: param }));
      } else {
        parts.push(`${encodeURIComponent(param)}=${encodeURIComponent(value)}`);
      }
    }
  });
  return parts.join('&');
}
