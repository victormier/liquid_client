import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { graphql, compose } from 'react-apollo';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Button from 'components/common/Button';
import Nav from 'modules/main/components/Nav';
import gridStyles from 'styles/base/grid.scss';
import PercentageRuleForm from 'modules/main/forms/PercentageRule';
import FormInput from 'components/common/FormInput';
import SpinnerBlock from 'components/common/SpinnerBlock';
import ErrorBar from 'components/layout/ErrorBar';
import { queryUser, queryPercentageRule, updatePercentageRule } from 'qql';

@inject(
  'viewStore',
  'sessionStore'
)
export class Settings extends Component {
  onLogout = (e) => {
    e.preventDefault();
    this.props.sessionStore.logout();
    this.props.client.resetStore();
    this.props.viewStore.reset();
    this.props.router.push('/');
  }

  handleUpdatePercentageRule(data) {
    data.minimumAmount = parseFloat(data.minimumAmount);
    data.percentage = parseFloat(data.percentage);

    return this.props.submit(this.props.percentageRuleQuery.percentage_rule.id, data)
      .then(() => {
        this.props.viewStore.addError('Settings updated successfully!');
      })
      .catch(() => {
        this.props.viewStore.addError('There was a problem');
      });
  }

  render() {
    const { userQuery, percentageRuleQuery } = this.props;
    if (userQuery.loading || percentageRuleQuery.loading) return <SpinnerBlock />;
    if (userQuery.error || percentageRuleQuery.error) return <div>Error!</div>;

    return (
      <Grid fluid className={`${gridStyles.mainGrid} ${gridStyles.withBottomNav} ${gridStyles.basePadding}`}>
        <ErrorBar />
        <Row end="xs">
          <Col xs={4}>
            <Button
              id="logoutButton"
              text="Log out"
              color="transparent"
              onClick={this.onLogout}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h1>Account</h1>
            { userQuery &&
            <FormInput
              value={userQuery.user.email}
              type="text"
              placeholder="Email"
              disabled
            />
            }
            <hr />
            {
              percentageRuleQuery.percentage_rule &&
                <div>
                  <h2>Tax settings</h2>
                  <PercentageRuleForm
                    onSubmit={formData => this.handleUpdatePercentageRule(formData)}
                    initialValues={{
                      minimumAmount: percentageRuleQuery.percentage_rule.minimum_amount,
                      percentage: percentageRuleQuery.percentage_rule.percentage,
                      active: percentageRuleQuery.percentage_rule.active.toString(),
                    }}
                  />
                </div>
            }
          </Col>
        </Row>
        <Nav />
      </Grid>
    );
  }
}

Settings.propTypes = {
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
  }),
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  submit: PropTypes.func.isRequired,
  percentageRuleQuery: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    percentage_rule: PropTypes.shape({
      id: PropTypes.string.isRequired,
      minimum_amount: PropTypes.number.isRequired,
      percentage: PropTypes.number.isRequired,
    }),
  }),
  userQuery: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    user: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }),
  }),
};

Settings.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    reset: PropTypes.func.isRequired,
    addError: PropTypes.func.isRequired,
  }).isRequired,
  sessionStore: PropTypes.shape({
    reset: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  }).isRequired,
};

const SettingsWithGraphQL = compose(
  graphql(queryPercentageRule, { name: 'percentageRuleQuery' }),
  graphql(queryUser, { name: 'userQuery' }),
  graphql(updatePercentageRule, {
    props: ({ mutate }) => ({
      submit: (percentageRuleId, { percentage, minimumAmount, active }) => mutate({
        variables: {
          percentageRuleId,
          percentage,
          minimumAmount,
          active: active === 'true',
        },
        update: (store, { data: { updatedPercentageRule } }) => {
          const data = store.readQuery({ query: queryPercentageRule });
          data.percentage_rule = updatedPercentageRule;
          store.writeQuery({ query: queryPercentageRule, data });
        },
      }),
    }),
  })
)(Settings);

export default SettingsWithGraphQL;
