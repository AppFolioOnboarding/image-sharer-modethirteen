import React from 'react';
import ReactDOM from 'react-dom';
import Image from './components/image';
import Thumbnails from './components/thumbnails';

const imageContainer = document.getElementById('image-container');
if (imageContainer instanceof Element) {
  ReactDOM.render(<Image id={(imageContainer.dataset || {}).imageId} />, imageContainer);
}
const thumbnailsContainer = document.getElementById('thumbnails-container');
if (thumbnailsContainer instanceof Element) {
  ReactDOM.render(<Thumbnails tag={(thumbnailsContainer.dataset || {}).tag} />, thumbnailsContainer);
}
