/* eslint-env mocha */

import React from 'react';
import { shallow, mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import Image from '../../../images/src/components/image';
import api from '../../../api/images';

describe('<Image />', () => {
  afterEach(() => {
    sinon.restore();
  });
  it('should render a loading message', () => {
    sinon.stub(api, 'getImage').resolves();
    const wrapper = shallow(<Image />);
    assert.strictEqual(wrapper.text(), 'Loading...');
  });
  it('should render an image', async () => {
    sinon.stub(api, 'getImage').resolves({
      attributes: {
        id: 2,
        url: 'https://example.com/foo.png',
        hostname: 'example.com'
      },
      links: {
        previous: null,
        next: null
      }
    });
    const wrapper = mount(<Image id={2} />);
    /* NOTE (andy.vaughn@appfolio.com, 20210305): hacky workaround for async component mounting, do not replicate */
    await wrapper.instance().componentDidMount();
    wrapper.setProps();
    /**/
    const img = wrapper.find('img');
    assert.strictEqual(img.props().src, 'https://example.com/foo.png');
    assert.strictEqual(img.props().alt, 'Hosted by example.com');
    sinon.assert.calledWith(api.getImage, sinon.match(2));
  });
  it('should render an image with active pagination', async () => {
    sinon.stub(api, 'getImage').resolves({
      attributes: {
        id: 2,
        url: 'https://example.com/foo.png',
        hostname: 'example.com'
      },
      links: {
        previous: {
          html: 'https://folio.io/images/3'
        },
        next: {
          html: 'https://folio.io/images/1'
        }
      }
    });
    const wrapper = mount(<Image id={2} />);
    /* NOTE (andy.vaughn@appfolio.com, 20210305): hacky workaround for async component mounting, do not replicate */
    await wrapper.instance().componentDidMount();
    wrapper.setProps();
    /**/
    const paginators = wrapper.find('ul.pagination li');
    assert.strictEqual(paginators.length, 2);
    const previous = paginators.at(0);
    assert.strictEqual(previous.hasClass('disabled'), false);
    assert.strictEqual(previous.find('a').props().href, 'https://folio.io/images/3');
    const next = paginators.at(1);
    assert.strictEqual(next.hasClass('disabled'), false);
    assert.strictEqual(next.find('a').props().href, 'https://folio.io/images/1');
    sinon.assert.calledWith(api.getImage, sinon.match(2));
  });
  it('should render an image with disabled pagination', async () => {
    sinon.stub(api, 'getImage').resolves({
      attributes: {
        id: 2,
        url: 'https://example.com/foo.png',
        hostname: 'example.com'
      },
      links: {
        previous: null,
        next: null
      }
    });
    const wrapper = mount(<Image id={2} />);
    /* NOTE (andy.vaughn@appfolio.com, 20210305): hacky workaround for async component mounting, do not replicate */
    await wrapper.instance().componentDidMount();
    wrapper.setProps();
    /**/
    const paginators = wrapper.find('ul.pagination li');
    assert.strictEqual(paginators.length, 2);
    const previous = paginators.at(0);
    assert(previous.hasClass('disabled'));
    assert.strictEqual(previous.find('a').props().href, '#');
    const next = paginators.at(1);
    assert(next.hasClass('disabled'));
    assert.strictEqual(next.find('a').props().href, '#');
    sinon.assert.calledWith(api.getImage, sinon.match(2));
  });
});
