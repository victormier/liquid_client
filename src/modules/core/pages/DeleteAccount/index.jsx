import React, { Component } from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { queryUser, killUser } from 'qql';
import { Grid, Row, Col } from 'react-flexbox-grid';
import GoBackArrow from 'components/common/GoBackArrow';
import { Link } from 'react-router';
import SpinnerBlock from 'components/common/SpinnerBlock';
import Button from 'components/common/Button';
import gridStyles from 'styles/base/grid.scss';
import baseStyles from 'styles/base/base.scss';
import ErrorBar from 'components/layout/ErrorBar';

@inject('viewStore')
class DeleteAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDeleted: false,
    };
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    return this.props.mutate()
      .then(() => {
        debugger;
        this.props.client.resetStore();
        this.props.viewStore.reset();
        this.props.route.logout();
        this.props.router.push('/');
      })
      .catch(() => {
        this.props.viewStore.addError('There was a problem deleting the account. Please contact us.');
      });
  }

  render() {
    const { data } = this.props;
    if (data.loading) return <SpinnerBlock />;
    if (data.error) return <div>Error!</div>;

    return (
      <Grid fluid className={`${gridStyles.mainGrid} ${gridStyles.emptyHeader}`}>
        <ErrorBar />
        <GoBackArrow to="/settings" />
        <Row>
          <Col xs={12}>
            <h1>Remove saltedge account</h1>
            <div className={baseStyles.baseMarginBottomLarge}>
              <p>Are you sure you want to delete your saltedge account? You will loose access to all your data. We will delete all data after 30 days.</p>
            </div>
            <Button text={`Yes, delete my account: ${data.user.email}`} color="red" onClick={(e) => { this.handleClick(e); }} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

DeleteAccount.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    user: PropTypes.arrayOf(
      PropTypes.shape({
        email: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

const DeleteAccountWithGraphQL = compose(
  graphql(queryUser),
  graphql(killUser),
  withApollo
)(DeleteAccount);

export default DeleteAccountWithGraphQL;
