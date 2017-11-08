import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { autobind } from 'core-decorators';
import { mixpanelEventProps, SELECT_BANK } from 'config/mixpanelEvents';
import { Link } from 'react-router';
import styles from './styles.scss';

@inject('mixpanel')
class BankItem extends Component {
  @autobind
  trackEvent() {
    const { saltedgeProvider } = this.props;
    const bankIdentifier = `${saltedgeProvider.name} [${saltedgeProvider.country_code}] [${saltedgeProvider.id}]`;
    const eventProps = {
      ...mixpanelEventProps(SELECT_BANK),
      'Bank country': saltedgeProvider.country_code,
      'Bank name': saltedgeProvider.name,
    };
    this.props.mixpanel.track(SELECT_BANK, { 'Bank selected': bankIdentifier });
    this.props.mixpanel.register(eventProps);
    this.props.mixpanel.people.set(eventProps);
  }

  render() {
    return (
      <li className={styles.bankItem}>
        <Link to={`/connect/providers/${this.props.saltedgeProvider.id}`} onClick={this.trackEvent}>
          { this.props.saltedgeProvider.name }
        </Link>
      </li>
    );
  }
}
BankItem.propTypes = {
  saltedgeProvider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};
BankItem.wrappedComponent.propTypes = {
  mixpanel: PropTypes.shape({
    track: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    identify: PropTypes.func.isRequired,
    people: PropTypes.shape({
      set: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

export default BankItem;
