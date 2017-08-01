import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'components/common/Button';
import FormInput from 'components/common/FormInput';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const EmailInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="text"
    placeholder="Email"
    disabled
  />);

const PasswordInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="password"
    placeholder="New Password"
  />);

const PasswordConfirmationInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="password"
    placeholder="Repeat Password"
  />);

const PasswordForm = (props) => {
  const { handleSubmit, submitting } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" type="text" component={EmailInput} disabled />
      <Field name="password" type="password" component={PasswordInput} />
      <Field
        name="password_confirmation"
        type="password"
        component={PasswordConfirmationInput}
      />
      <Row center="xs" className={styles.formRow} >
        <Col xs={4}>
          <div className={styles.submitBlock}>
            <Button text="Next" type="submit" disabled={submitting} />
          </div>
        </Col>
      </Row>
    </form>
  );
};

PasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
};

export default reduxForm({
  form: 'post',
  enableReinitialize: true,
})(PasswordForm);
