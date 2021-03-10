/* eslint-env mocha */

import React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import Image from '../../../images/src/components/image';
import api from '../../../api/images';

describe('<Image />', () => {
  afterEach(() => {
    sinon.restore();
  });
  it('should render a loading message', () => {
    sinon.stub(api, 'getImage').resolves({
      attributes: {
        id: 2,
        url: 'https://example.com/foo.png',
        hostname: 'example.com',
        tags: []
      },
      links: {
        previous: null,
        next: null
      }
    });
    const wrapper = mount(<Image id={2} />);
    assert.strictEqual(wrapper.text(), 'Loading...');
  });
  it('should render an image', async () => {
    sinon.stub(api, 'getImage').resolves({
      attributes: {
        id: 2,
        url: 'https://example.com/foo.png',
        hostname: 'example.com',
        tags: []
      },
      links: {
        previous: null,
        next: null
      }
    });
    const wrapper = mount(<Image id={2} />);
    await wrapper.instance().componentDidMount();
    wrapper.update();
    const img = wrapper.find('img');
    assert.strictEqual(img.props().src, 'https://example.com/foo.png');
    assert.strictEqual(img.props().alt, 'Hosted by example.com');
    sinon.assert.calledWith(api.getImage, sinon.match(2));
  });
  it('should render an image with tags', async () => {
    sinon.stub(api, 'getImage').resolves({
      attributes: {
        id: 2,
        url: 'https://example.com/foo.png',
        hostname: 'example.com',
        tags: [
          'corge',
          'waldo',
          'xyzzy'
        ]
      },
      links: {
        previous: null,
        next: null
      }
    });
    const wrapper = mount(<Image id={2} />);
    await wrapper.instance().componentDidMount();
    wrapper.update();
    const tags = wrapper.find('.component-card .tags').first();
    assert.strictEqual(tags.find('.tag').length, 3);
    assert.strictEqual(tags.find('.tag').at(0).text(), 'corge');
    assert.strictEqual(tags.find('.tag').at(0).props().href, '/?tag=corge');
    assert.strictEqual(tags.find('.tag').at(1).text(), 'waldo');
    assert.strictEqual(tags.find('.tag').at(1).props().href, '/?tag=waldo');
    assert.strictEqual(tags.find('.tag').at(2).text(), 'xyzzy');
    assert.strictEqual(tags.find('.tag').at(2).props().href, '/?tag=xyzzy');
    sinon.assert.calledWith(api.getImage, sinon.match(2));
  });
  it('should render an image with active pagination', async () => {
    sinon.stub(api, 'getImage').resolves({
      attributes: {
        id: 2,
        url: 'https://example.com/foo.png',
        hostname: 'example.com',
        tags: []
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
    await wrapper.instance().componentDidMount();
    wrapper.update();
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
        hostname: 'example.com',
        tags: []
      },
      links: {
        previous: null,
        next: null
      }
    });
    const wrapper = mount(<Image id={2} />);
    await wrapper.instance().componentDidMount();
    wrapper.update();
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
  it('should delete an image', async () => {
    sinon.stub(api, 'getImage').resolves({
      id: 2,
      attributes: {
        url: 'https://example.com/foo.png',
        hostname: 'example.com',
        tags: []
      },
      links: {
        previous: null,
        next: null
      }
    });
    sinon.stub(api, 'destroyImage').resolves();
    sinon.stub(window, 'confirm').returns(true);
    sinon.stub(window.location, 'replace');
    const wrapper = mount(<Image id={2} />);
    await wrapper.instance().componentDidMount();
    wrapper.update();
    wrapper.find('.delete').simulate('click');
    await Promise.resolve();
    sinon.assert.calledWith(api.destroyImage, sinon.match(2));
    sinon.assert.calledWith(window.location.replace, sinon.match('/'));
  });
});
