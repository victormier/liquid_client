import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

@observer @inject('viewStore')
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
  viewStore: PropTypes.shape({
    errors: PropTypes.array,
  }).isRequired,
  errors: PropTypes.array,
};

export default ErrorBar;
