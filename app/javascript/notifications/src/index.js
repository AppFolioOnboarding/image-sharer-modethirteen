import React from 'react';
import ReactDOM from 'react-dom';
import Flash from './components/flash';

const flashContainer = document.getElementById('flash-container');
if (flashContainer instanceof Element) {
  ReactDOM.render(<Flash messages={(flashContainer.dataset || {}).messages} />, flashContainer);
}
