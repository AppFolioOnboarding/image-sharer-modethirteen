/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from 'react';
import api from '../../../api/images';

export default class Thumbnails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      images: []
    };
  }

  async componentDidMount() {
    try {
      const data = await api.getImages();
      this.setState({
        isLoaded: true,
        images: data
      });
    } catch (error) {
      this.setState({
        isLoaded: false,
        error
      });
    }
  }

  render() {
    const { error, isLoaded, images } = this.state;
    if (error) {
      return <div className="alert alert-danger">Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div className="spinner-border">
          <span className="sr-only">
            Loading...
          </span>
        </div>
      );
    }
    return (
      <div className="row">
        {images.map(image => (
          <div className="col-md-3" key={image.id}>
            <a href={image.links.self.html}>
              <div className="card mb-3 box-shadow">
                <img
                  className="card-img-top"
                  src={image.attributes.url}
                  alt={`Hosted by ${image.attributes.hostname}`}
                />
              </div>
            </a>
          </div>
        ))}
      </div>
    );
  }
}
