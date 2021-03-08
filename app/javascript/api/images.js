import { get, serialize } from '../lib/http';

class Images {
  /**
   * @param {Object} options
   * @param {String} options.baseUri
   */
  constructor({
    baseUri = 'http://localhost:3000'
  } = {}) {
    this.baseUri = baseUri;
  }

  /**
   * @param {Object} options
   * @param {String|null} options.tag - filter images by {tag}
   * @returns {Promise<Object[]>}
   */
  getImages({ tag = null } = {}) {
    let url = `${this.baseUri}/images.json`;
    const parameters = {};
    if (tag) {
      parameters.tag = tag;
    }
    if (Object.keys(parameters).length) {
      url += `?${serialize(parameters)}`;
    }
    return get(url);
  }

  /**
   * @param {Integer} id
   * @returns {Promise<Object>}
   */
  getImage(id = 0) {
    return get(`${this.baseUri}/images/${id}.json`);
  }
}

export default new Images();
