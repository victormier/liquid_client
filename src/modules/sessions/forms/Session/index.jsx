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
  />);

const PasswordInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="password"
    placeholder="Password"
  />);

const SessionForm = (props) => {
  const { handleSubmit, submitting } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" type="text" component={EmailInput} />
      <Field name="password" type="password" component={PasswordInput} />
      <Row center="xs" className={styles.formRow} >
        <Col xs={4}>
          <div className={styles.submitBlock}>
            <Button text="Log In" type="submit" disabled={submitting} />
          </div>
        </Col>
      </Row>
    </form>
  );
};

SessionForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
};

export default reduxForm({
  form: 'post',
})(SessionForm);
