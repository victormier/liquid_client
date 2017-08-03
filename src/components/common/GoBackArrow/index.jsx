import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { autobind } from 'core-decorators';
import arrowLeft from 'assets/images/arrowLeft.svg';
import styles from './styles.scss';

class GoBackArrow extends Component {
  @autobind
  handleGoBackClick() {
    if (this.props.to) {
      this.props.router.push(this.props.to);
    } else {
      this.props.router.goBack();
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <a href="#back" onClick={this.handleGoBackClick}>
          <img alt="arrow left" src={arrowLeft} />
        </a>
      </div>
    );
  }
}

GoBackArrow.propTypes = {
  to: PropTypes.string,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(GoBackArrow);
