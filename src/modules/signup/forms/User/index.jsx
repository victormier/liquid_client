import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'components/common/Button';
import FormInput from 'components/common/FormInput';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { inject } from 'mobx-react';
import { INPUT_SIGNUP_EMAIL } from 'config/mixpanelEvents';
import styles from './styles.scss';

@inject('mixpanel')
class EmailInput extends Component {
  constructor(props) {
    super(props);
    this.state = { changeFired: false };
  }

  @autobind
  handleChange(evt) {
    if (!this.state.changeFired) {
      this.setState({ changeFired: true }, () => {
        this.props.mixpanel.track(INPUT_SIGNUP_EMAIL);
      });
    }
    this.props.input.onChange(evt);
  }

  render() {
    return (<FormInput
      value={this.props.input.value}
      onChange={this.handleChange}
      type="text"
      placeholder="Email"
    />);
  }
}
EmailInput.wrappedComponent.propTypes = {
  mixpanel: PropTypes.shape({
    track: PropTypes.func.isRequired,
  }).isRequired,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
};

const UserForm = (props) => {
  const { handleSubmit, submitting } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" type="text" component={EmailInput} />
      <Row center="xs" className={styles.formRow} >
        <Col xs={8} sm={4}>
          <div className={styles.submitBlock}>
            <Button text="Sign Up" type="submit" disabled={submitting} />
          </div>
        </Col>
      </Row>
    </form>
  );
};

UserForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
};

export default reduxForm({
  form: 'signup',
})(UserForm);
