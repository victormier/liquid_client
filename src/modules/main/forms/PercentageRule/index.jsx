import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'components/common/Button';
import FormInput from 'components/common/FormInput';
import PropTypes from 'prop-types';
import formStyles from 'styles/base/form.scss';

const MinimumAmountInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="number"
    placeholder="Minimum Amount"
  />);

const PercentageInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="number"
    placeholder="Percentage"
  />);

const PercentageRuleForm = (props) => {
  const { handleSubmit, submitting } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field name="minimumAmount" type="text" component={MinimumAmountInput} />
      <Field name="percentage" type="text" component={PercentageInput} />
      <div>
        <div>
          <label htmlFor="percentageRuleActiveTrue">
            <Field
              id="percentageRuleActiveTrue"
              name="active"
              component="input"
              type="radio"
              value="true"
            />{' '}
            Active
          </label>
          <label htmlFor="percentageRuleActiveFalse">
            <Field
              id="percentageRuleActiveFalse"
              name="active"
              component="input"
              type="radio"
              value="false"
            />{' '}
            Inactive
          </label>
        </div>
      </div>

      <Row center="xs" className={formStyles.submitBlock}>
        <Col xs={4}>
          <Button text="Save" type="submit" disabled={submitting} />
        </Col>
      </Row>
    </form>
  );
};

PercentageRuleForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};

export default reduxForm({
  form: 'percentageRule',
})(PercentageRuleForm);
