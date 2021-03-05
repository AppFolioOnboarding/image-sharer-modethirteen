/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from 'react';
import api from '../../../api/images';
import Card from './card';

/**
 * @param {string} label
 * @param {object|null} link
 * @return (<li className="page-item" />)
 */
const paginator = (label, link) => {
  if (link) {
    return (
      <li className="page-item">
        <a className="page-link" href={link.html}>{label}</a>
      </li>
    );
  }
  return (
    <li className="page-item disabled">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className="page-link" href="#">{label}</a>
    </li>
  );
};

export default class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      image: null
    };
  }

  async componentDidMount() {
    const { id } = this.props;
    try {
      const data = await api.getImage(id);
      this.setState({
        isLoaded: true,
        image: data
      });
    } catch (error) {
      this.setState({
        isLoaded: false,
        error
      });
    }
  }

  render() {
    const { error, isLoaded, image } = this.state;
    if (error) {
      return <div className="alert alert-danger">Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <Card />;
    }
    return (
      <div className="row">
        <div className="col-md-3 component-card">
          <Card
            hostname={image.attributes.hostname}
            src={image.attributes.url}
            tags={image.attributes.tags}
          />
          <ul className="pagination">
            {paginator('Previous', image.links.previous)}
            {paginator('Next', image.links.next)}
          </ul>
        </div>
      </div>
    );
  }
}
