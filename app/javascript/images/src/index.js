import React from 'react';
import ReactDOM from 'react-dom';
import Image from './components/image';

const imageContainer = document.getElementById('image-container');
if (imageContainer instanceof Element) {
  ReactDOM.render(<Image id={(imageContainer.dataset || {}).imageId} />, imageContainer);
}
