/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from 'react';

/**
 * @param {String} type - rails flash message type
 * @returns {String}
 */
function flashClass(type) {
  const classes = {
    error: 'alert-danger',
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning'
  };
  return classes[type] || 'alert-info';
}

export default class Flash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: JSON.parse(props.messages) || []
    };
  }

  render() {
    const { messages } = this.state;
    return (
      <div className="flash-messages">
        {messages.map(m => (
          <div key={m.id} className={`alert ${flashClass(m.type)}`}>
            <button className='close' onClick={() => this.removeMessage(m)}>
              &times;
            </button>
            <span className="message">
              {m.text}
            </span>
          </div>))}
      </div>
    );
  }

  /**
   * @param {Object} message - rails flash message object
   */
  removeMessage(message) {
    const index = this.state.messages.indexOf(message);
    if (index >= 0) {
      this.state.messages.splice(index, 1);
      this.setState(this.state.messages);
    }
  }
}
