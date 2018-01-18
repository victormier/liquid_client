import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'components/common/Button';
import FormInput from 'components/common/FormInput';
import PropTypes from 'prop-types';
import formStyles from 'styles/base/form.scss';

const NameInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="text"
    placeholder="Account Name (Taxes, Summer Trip, Savings...)"
  />);

const AccountForm = (props) => {
  const { handleSubmit, submitting, onCancel } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field name="name" type="text" component={NameInput} />
      <Row center="xs" className={formStyles.submitBlock}>
        <Col xs={4}>
          <Button
            text="Cancel"
            disabled={submitting}
            color="blue"
            onClick={onCancel}
          />
        </Col>
        <Col xs={4}>
          <Button text="Create" type="submit" disabled={submitting} />
        </Col>
      </Row>
    </form>
  );
};

AccountForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'account',
})(AccountForm);
