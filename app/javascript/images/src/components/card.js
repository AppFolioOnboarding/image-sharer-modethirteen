import React, { Component } from 'react';

export default class Card extends Component {
  render() {
    const { href, src, hostname, tags = [] } = this.props;
    if (!src) {
      return (
        <div className="spinner-border">
          <span className="sr-only">
            Loading...
          </span>
        </div>
      );
    }
    const img = (
      <img
        className="card-img-top"
        src={src}
        alt={`Hosted by ${hostname}`}
      />
    );
    return (
      <div className="card mb-3 box-shadow">
        {href ? <a href={href}>{img}</a> : img}
        <div className="card-body">
          <div className="tags">
            {tags.map(tag => (
              <span className="tag badge badge-secondary" key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
