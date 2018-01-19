import React from 'react';
import { inject, observer, PropTypes } from 'mobx-react';
import ReactPropTypes from 'prop-types';
import styles from './styles.scss';

@inject('viewStore') @observer
class ErrorBar extends React.Component {
  render() {
    const { errors } = this.props.viewStore;
    const propErrors = this.props.errors || [];
    const allErrors = propErrors.length ? propErrors : errors;

    return (
      <div className={styles.errorContainer} >
        <ul className={styles.errorList} >
          {
            allErrors.map(errorMessage => (
              <li className={styles.errorListItem} key={errorMessage.id} >
                {errorMessage.message}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

ErrorBar.wrappedComponent.propTypes = {
  viewStore: ReactPropTypes.shape({
    errors: PropTypes.observableArray,
  }).isRequired,
  errors: ReactPropTypes.array,
};

export default ErrorBar;
