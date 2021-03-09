/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from 'react';
import api from '../../../api/images';
import Card from './card';

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
    const { tag } = this.props;
    try {
      const data = await api.getImages({ tag });
      this.setState({
        isLoaded: true,
        images: data,
        tag
      });
    } catch (error) {
      this.setState({
        isLoaded: false,
        error
      });
    }
  }

  render() {
    const { error, isLoaded, images, tag } = this.state;
    if (error) {
      return <div className="alert alert-danger">Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <Card />;
    }
    return (
      <div className="row">
        {images.map(image => (
          <div className="col-md-3 component-card" key={image.id}>
            <Card
              href={image.links.self.html}
              hostname={image.attributes.hostname}
              src={image.attributes.url}
              tags={image.attributes.tags}
              tag={tag}
            />
          </div>
        ))}
      </div>
    );
  }
}
