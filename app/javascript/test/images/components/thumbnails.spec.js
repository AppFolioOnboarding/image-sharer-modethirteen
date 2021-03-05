/* eslint-env mocha */

import React from 'react';
import { shallow, mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import Thumbnails from '../../../images/src/components/thumbnails';
import api from '../../../api/images';

describe('<Thumbnails />', () => {
  afterEach(() => {
    sinon.restore();
  });
  it('should render a loading message', () => {
    sinon.stub(api, 'getImages').resolves();
    const wrapper = shallow(<Thumbnails />);
    assert.strictEqual(wrapper.text(), 'Loading...');
  });
  it('should render thumbnails', async () => {
    sinon.stub(api, 'getImages').resolves([
      {
        attributes: {
          id: 3,
          url: 'https://baz.com/plugh.png',
          hostname: 'baz.com'
        },
        links: {
          self: {
            html: 'https://example.com/3'
          }
        }
      },
      {
        attributes: {
          id: 2,
          url: 'https://xyzzy.com/qux.png',
          hostname: 'xyzzy.com'
        },
        links: {
          self: {
            html: 'https://example.com/2'
          }
        }
      },
      {
        attributes: {
          id: 1,
          url: 'https://foo.com/bar.png',
          hostname: 'foo.com'
        },
        links: {
          self: {
            html: 'https://example.com/1'
          }
        }
      },
    ]);
    const wrapper = mount(<Thumbnails />);
    /* NOTE (andy.vaughn@appfolio.com, 20210305): hacky workaround for async component mounting, do not replicate */
    await wrapper.instance().componentDidMount();
    wrapper.setProps();
    /**/
    const img = wrapper.find('img');
    assert.strictEqual(img.at(0).props().src, 'https://baz.com/plugh.png');
    assert.strictEqual(img.at(0).props().alt, 'Hosted by baz.com');
    assert.strictEqual(img.at(1).props().src, 'https://xyzzy.com/qux.png');
    assert.strictEqual(img.at(1).props().alt, 'Hosted by xyzzy.com');
    assert.strictEqual(img.at(2).props().src, 'https://foo.com/bar.png');
    assert.strictEqual(img.at(2).props().alt, 'Hosted by foo.com');
    sinon.assert.called(api.getImages);
  });
});
