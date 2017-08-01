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

const ResetPassword = (props) => {
  const { handleSubmit, submitting } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" type="text" component={EmailInput} />
      <Row center="xs">
        <Col xs={8}>
          <div className={styles.submitBlock}>
            <Button
              text="Request Password Reset"
              type="submit"
              disabled={submitting}
            />
          </div>
        </Col>
      </Row>
    </form>
  );
};

ResetPassword.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
};

export default reduxForm({
  form: 'post',
})(ResetPassword);
