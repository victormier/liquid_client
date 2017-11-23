import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { inject } from 'mobx-react';
// import { Grid, Row, Col } from 'react-flexbox-grid';
// import gridStyles from 'styles/base/grid.scss';
import { updateMirrorAccount, queryAccount } from 'qql';
// import { Link } from 'react-router';
// import SpinnerBlock from 'components/common/SpinnerBlock';
// import GoBackArrow from 'components/common/GoBackArrow';
// import Button from 'components/common/Button';
// import { toCurrency } from 'utils/currencies';
// import baseStyles from 'styles/base/base.scss';
import refresh from 'assets/images/refresh.svg';
import styles from './styles.scss';

@inject('viewStore')
class RefreshButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleClick() {
    this.setState({ loading: true });

    return this.props.submit()
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((er) => {
        this.setState({ loading: false });
        this.props.viewStore.addError('There was a problem refreshing the data');
      });
  }

  render() {
    return (
      <div className={styles.refreshIcon} onClick={e => this.handleClick(e)}>
        <img alt="refresh" src={refresh} className={this.state.loading ? styles.loading : null} />
      </div>
    );
  }
}

RefreshButton.propTypes = {
  accountId: PropTypes.number.isRequired,
};

const RefreshButtonWithGraphQL = graphql(updateMirrorAccount, {
  props: ({ mutate, ownProps }) => ({
    submit: () => mutate({
      variables: { mirrorAccountId: ownProps.accountId },
      refetchQueries: [{
        query: queryAccount,
        variables: {
          id: ownProps.accountId,
        },
      }],
    }),
  }),
})(RefreshButton);

export default RefreshButtonWithGraphQL;
