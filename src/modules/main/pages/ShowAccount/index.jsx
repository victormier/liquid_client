import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import { queryAccount } from 'qql';
import { Link } from 'react-router';
import moment from 'node-moment';
import Header from 'components/common/Header';
import QueryLoading from 'components/common/QueryLoading';
import Button from 'components/common/Button';
import ErrorBar from 'components/layout/ErrorBar';
import { toCurrency } from 'utils/currencies';
import RefreshButton from '../../components/RefreshButton';
import TransactionList from '../../components/TransactionList';

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
    const { data, params } = this.props;
    const contentIsReady = !data.loading && !data.error && data.account;

    let title = 'Account';
    let subtitle;
    let rightButtonSecondary;
    let titleRight;

    if (contentIsReady) {
      if (data.account.is_refreshing) {
        subtitle = 'Syncing account...It might take 2 min.';
      } else if (data.account.is_mirror_account && data.account.last_updated) {
        subtitle = `Updated ${moment.unix(data.account.last_updated).fromNow()}`;
      }
      title = data.account.name;
      if (data.account.is_mirror_account) rightButtonSecondary = <RefreshButton accountId={data.account.id} />;
      titleRight = toCurrency(data.account.balance, data.account.currency_code);
    }

    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <ErrorBar />
        <Header
          title={title}
          subtitle={subtitle}
          backTo="/accounts"
          rightButtonSecondary={rightButtonSecondary}
          rightButton={<Link to={`/transactions/new/${params.accountId}`}>
            <Button text="Transfer" color="transparent" />
          </Link>}
          titleRight={titleRight}
        />
        <Row>
          <Col xs={12}>
            { contentIsReady ?
              <TransactionList
                items={data.account.transactions}
                currencyCode={data.account.currency_code}
                accountId={data.account.id}
              /> :
              <QueryLoading error={data.error} />
            }
          </Col>
        </Row>
      </Grid>);
  }
}

ShowAccount.propTypes = {
  params: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
  }),
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
