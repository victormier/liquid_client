import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('viewStore') @observer
class ErrorBar extends React.Component {
  render() {
    const { errors } = this.props.viewStore;
    if (!errors.length) return null;

    return (
      <div>
        <ul>
          { errors.map(errorMessage => <li>{errorMessage}</li>) }
        </ul>
      </div>
    );
  }
}

ErrorBar.propTypes = {
  viewStore: PropTypes.shape({
    errors: PropTypes.array,
  }).isRequired,
};

export default ErrorBar;
