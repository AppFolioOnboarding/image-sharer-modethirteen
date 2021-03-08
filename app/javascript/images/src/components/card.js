import React, { Component } from 'react';
import { serialize } from '../../../lib/http';

export default class Card extends Component {
  render() {
    const { href, src, hostname, tags = [], tag } = this.props;
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
            {tags.map((t) => {
              const badgeClassName = typeof tag !== 'undefined' && tag === t ? 'badge-info' : 'badge-secondary';
              return <a href={`/?${serialize({ tag: t })}`} className={`tag badge ${badgeClassName}`} key={t}>{t}</a>;
            })}
          </div>
        </div>
      </div>
    );
  }
}
