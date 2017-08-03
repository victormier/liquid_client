import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

@inject('viewStore') @observer
class ErrorBar extends React.Component {
  render() {
    const { errors } = this.props.viewStore;
    if (!errors.length) return null;

    return (
      <div className={styles.errorContainer} >
        <ul className={styles.errorList} >
          {
            errors.map(errorMessage => (
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
  viewStore: PropTypes.shape({
    errors: PropTypes.array,
  }).isRequired,
};

export default ErrorBar;
