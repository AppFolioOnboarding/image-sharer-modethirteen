/* eslint-env mocha */

import React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import Thumbnails from '../../../images/src/components/thumbnails';
import api from '../../../api/images';

describe('<Thumbnails />', () => {
  afterEach(() => {
    sinon.restore();
  });
  it('should render a loading message', () => {
    sinon.stub(api, 'getImages').resolves([]);
    const wrapper = mount(<Thumbnails />);
    assert.strictEqual(wrapper.text(), 'Loading...');
  });
  it('should render thumbnails', async () => {
    sinon.stub(api, 'getImages').resolves([
      {
        id: 3,
        attributes: {
          url: 'https://baz.com/plugh.png',
          hostname: 'baz.com',
          tags: [
            'fred',
            'waldo'
          ]
        },
        links: {
          self: {
            html: 'https://example.com/3'
          }
        }
      },
      {
        id: 2,
        attributes: {
          url: 'https://xyzzy.com/qux.png',
          hostname: 'xyzzy.com',
          tags: []
        },
        links: {
          self: {
            html: 'https://example.com/2'
          }
        }
      },
      {
        id: 1,
        attributes: {
          url: 'https://foo.com/bar.png',
          hostname: 'foo.com',
          tags: [
            'corge'
          ]
        },
        links: {
          self: {
            html: 'https://example.com/1'
          }
        }
      },
    ]);
    const wrapper = mount(<Thumbnails />);
    await wrapper.instance().componentDidMount();
    wrapper.update();
    const img = wrapper.find('.component-card img');
    assert.strictEqual(img.at(0).props().src, 'https://baz.com/plugh.png');
    assert.strictEqual(img.at(0).props().alt, 'Hosted by baz.com');
    assert.strictEqual(img.at(1).props().src, 'https://xyzzy.com/qux.png');
    assert.strictEqual(img.at(1).props().alt, 'Hosted by xyzzy.com');
    assert.strictEqual(img.at(2).props().src, 'https://foo.com/bar.png');
    assert.strictEqual(img.at(2).props().alt, 'Hosted by foo.com');
    const tags = wrapper.find('.component-card .tags');
    assert.strictEqual(tags.at(0).find('.tag').length, 2);
    assert.strictEqual(tags.at(0).find('.tag').at(0).text(), 'fred');
    assert.strictEqual(tags.at(0).find('.tag').at(0).props().href, '/?tag=fred');
    assert.strictEqual(tags.at(0).find('.tag').at(1).text(), 'waldo');
    assert.strictEqual(tags.at(0).find('.tag').at(1).props().href, '/?tag=waldo');
    assert.strictEqual(tags.at(1).find('.tag').length, 0);
    assert.strictEqual(tags.at(2).find('.tag').length, 1);
    assert.strictEqual(tags.at(2).find('.tag').at(0).text(), 'corge');
    assert.strictEqual(tags.at(2).find('.tag').at(0).props().href, '/?tag=corge');
    sinon.assert.called(api.getImages);
  });
});
