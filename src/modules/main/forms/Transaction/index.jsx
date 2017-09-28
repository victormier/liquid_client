import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'components/common/Button';
import FormInput from 'components/common/FormInput';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import formStyles from 'styles/base/form.scss';
import Account from '../../components/Account';

const AmountInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="text"
    placeholder="$0.00"
  />);

const DestinationAccountOption = props => (
  <Account account={props.account} onClick={() => { props.onSelect(props.account.id); }} />
);

DestinationAccountOption.propTypes = {
  onSelect: PropTypes.func.isRequired,
  account: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

class TransactionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      destinationAccount: null,
    };
  }

  @autobind
  handleSelect(destinationAccountId) {
    const destinationAccount = _.find(this.props.accounts, ['id', destinationAccountId]);
    this.setState({ destinationAccount });
    this.props.change('destinationAccountId', destinationAccountId);
  }

  render() {
    const { handleSubmit, submitting, onCancel, originAccount, accounts } = this.props;

    const accountOptions = accounts.map(account => (
      <DestinationAccountOption account={account} onSelect={this.handleSelect} />
    ));

    return (
      <form onSubmit={handleSubmit}>
        <h2>Origin account</h2>
        <FormInput name="originAccountName" value={originAccount.name} type="text" disabled />
        <Field name="originAccountId" type="hidden" component="input" />
        {
          this.state.destinationAccount ?
            <div>
              <h2>Destination account</h2>
              <FormInput name="destinationAccountName" value={this.state.destinationAccount.name} type="text" disabled />
              <Field name="destinationAccountId" type="hidden" component="input" />
              <h2>Amount</h2>
              <Field name="amount" type="text" component={AmountInput} />
            </div> :
            <div>
              <h2>Select destination account</h2>
              {accountOptions}
            </div>
        }

        <Row center="xs" className={formStyles.submitBlock}>
          <Col xs={4}>
            <Button text="Cancel" disabled={submitting} color="blue" onClick={onCancel} />
          </Col>
          <Col xs={4}>
            <Button text="Create" type="submit" disabled={submitting} />
          </Col>
        </Row>
      </form>
    );
  }
}

TransactionForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  originAccount: PropTypes.shape({
    id: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
  accounts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })),
  change: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'transaction',
})(TransactionForm);
