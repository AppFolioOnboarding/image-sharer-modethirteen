import { get } from './http';

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
   * @returns {Promise<Object[]>}
   */
  getImages() {
    return get(`${this.baseUri}/images.json`);
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
