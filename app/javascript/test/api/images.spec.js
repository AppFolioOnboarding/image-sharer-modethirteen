/* eslint-env mocha */
import assert from 'assert';
// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import api from '../../api/images';

describe('Images API', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  it('should destroy an image', async () => {
    const scope = nock('http://localhost:3000')
      .delete('/images/123.json')
      .reply(204);
    await api.destroyImage(123);
    assert(scope.isDone());
  });
  it('should handle a destroy error', async () => {
    const scope = nock('http://localhost:3000')
      .delete('/images/123.json')
      .reply(404, { error: 'foo' });
    try {
      await api.destroyImage(123);
    } catch (e) {
      assert.strictEqual('foo', e.message);
    }
    assert(scope.isDone());
  });
});
