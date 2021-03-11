/* eslint-env mocha */

import React from 'react';
import { shallow } from 'enzyme';
import assert from 'assert';
import Flash from '../../../notifications/src/components/flash';

describe('<Flash />', () => {
  it('should render an error flash message', () => {
    const messages = [
      { id: 123, type: 'error', text: 'foo' }
    ];
    const wrapper = shallow(<Flash messages={JSON.stringify(messages)} />);
    assert.strictEqual(wrapper.find('.message').text(), 'foo');
    assert(wrapper.find('.alert').hasClass('alert-danger'));
  });
  it('should render an info flash message', () => {
    const messages = [
      { id: 123, type: 'info', text: 'plugh' }
    ];
    const wrapper = shallow(<Flash messages={JSON.stringify(messages)} />);
    assert.strictEqual(wrapper.find('.message').text(), 'plugh');
    assert(wrapper.find('.alert').hasClass('alert-info'));
  });
  it('should render a success flash message', () => {
    const messages = [
      { id: 123, type: 'success', text: 'bar' }
    ];
    const wrapper = shallow(<Flash messages={JSON.stringify(messages)} />);
    assert.strictEqual(wrapper.find('.message').text(), 'bar');
    assert(wrapper.find('.alert').hasClass('alert-success'));
  });
  it('should render a warning flash message', () => {
    const messages = [
      { id: 123, type: 'warning', text: 'qux' }
    ];
    const wrapper = shallow(<Flash messages={JSON.stringify(messages)} />);
    assert.strictEqual(wrapper.find('.message').text(), 'qux');
    assert(wrapper.find('.alert').hasClass('alert-warning'));
  });
  it('should close a flash message', () => {
    const messages = [
      { id: 123, type: 'warning', text: 'fred' },
      { id: 456, type: 'success', text: 'xyzzy' },
      { id: 789, type: 'error', text: 'baz' }
    ];
    const wrapper = shallow(<Flash messages={JSON.stringify(messages)} />);
    let alerts = wrapper.find('.alert');
    assert.strictEqual(3, alerts.length);
    assert.strictEqual('123', alerts.at(0).key());
    assert.strictEqual('456', alerts.at(1).key());
    assert.strictEqual('789', alerts.at(2).key());
    alerts.at(1).find('.close').simulate('click');
    alerts = wrapper.find('.alert');
    assert.strictEqual(2, alerts.length);
    assert.strictEqual('123', alerts.at(0).key());
    assert.strictEqual('789', alerts.at(1).key());
  });
});
