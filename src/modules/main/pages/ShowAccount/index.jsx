import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import { queryAccount } from 'qql';
import { Link } from 'react-router';
import moment from 'node-moment';
import SpinnerBlock from 'components/common/SpinnerBlock';
import GoBackArrow from 'components/common/GoBackArrow';
import Button from 'components/common/Button';
import ErrorBar from 'components/layout/ErrorBar';
import { toCurrency } from 'utils/currencies';
import baseStyles from 'styles/base/base.scss';
import RefreshButton from '../../components/RefreshButton';
import TransactionList from '../../components/TransactionList';
import styles from './styles.scss';

const checkPolling = (props) => {
  if (!props.data.loading && !props.data.error) {
    if (props.data.account.is_refreshing) {
      props.data.startPolling(5000);
    } else {
      props.data.stopPolling();
    }
  }
};

class ShowAccount extends Component {
  componentDidMount() {
    checkPolling(this.props);
  }

  componentWillReceiveProps(newProps) {
    checkPolling(newProps);
  }

  render() {
    const { data } = this.props;
    if (data.loading && !data.account) return <SpinnerBlock />;
    if (data.error) return <div>Error!</div>;

    let updatingMessage;
    if (data.account.is_refreshing) {
      updatingMessage = (<span>
        <br />
        <small>Syncing account...It might take 2 min.</small>
      </span>);
    } else if (data.account.is_mirror_account && data.account.last_updated) {
      updatingMessage = (<span>
        <br />
        <small>Updated {moment.unix(data.account.last_updated).fromNow()}</small>
      </span>);
    }

    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <ErrorBar />
        <Row className={baseStyles.topNav}>
          <Col xs={6}>
            <GoBackArrow to="/accounts" />
          </Col>
          <Col xs={2}>
            {
              data.account.is_mirror_account &&
                <div className={baseStyles.floatRight}>
                  <RefreshButton accountId={data.account.id} />
                </div>
            }
          </Col>
          <Col xs={4} className={baseStyles.textRight}>
            <Link to={`/transactions/new/${data.account.id}`}>
              <Button text="Transfer" color="transparent" />
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <h2 className={styles.accountName}>
              { data.account.name }
              { updatingMessage }
            </h2>
          </Col>
          <Col xs={6}>
            <h2 className={baseStyles.textRight}>
              { toCurrency(data.account.balance, data.account.currency_code) }
            </h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <TransactionList
              items={data.account.transactions}
              currencyCode={data.account.currency_code}
              accountId={data.account.id}
            />
          </Col>
        </Row>
      </Grid>);
  }
}

ShowAccount.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    account: PropTypes.shape({
      name: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
      currency_code: PropTypes.string.isRequired,
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          category: PropTypes.string.isRequired,
          made_on: PropTypes.number.isRequired,
          created_at: PropTypes.number.isRequired,
        })
      ),
    }),
  }),
};

const ShowAccountWithGraphQL = graphql(queryAccount, {
  options: ownProps => ({
    variables: {
      id: ownProps.params.accountId,
    },
  }),
})(ShowAccount);

export default withApollo(ShowAccountWithGraphQL);
