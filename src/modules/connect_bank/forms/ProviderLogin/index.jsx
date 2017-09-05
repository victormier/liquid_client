import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'components/common/Button';
import FormInput from 'components/common/FormInput';
import PropTypes from 'prop-types';
import _ from 'lodash';

const TextInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="text"
  />);

const PasswordInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="password"
  />);

const SelectInput = ({ fieldDescription }) => {
  const options = fieldDescription.field_options.map(option => (
    <option name={option.name} key={option.name} value={option.value}>
      {option.localized_name}
    </option>
  ));
  return (
    <Field component="select" name={fieldDescription.name}>
      {options}
    </Field>
  );
};
SelectInput.propTypes = {
  fieldDescription: PropTypes.shape({
    field_options: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        localized_name: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    name: PropTypes.string,
  }),
};

const ProviderLoginForm = (props) => {
  const { handleSubmit, submitting, fieldsDescription } = props;
  const ordererdFieldsDescription = _.orderBy(fieldsDescription, ['position']);

  const fields = ordererdFieldsDescription.map((fieldDescription) => {
    let field;
    switch (fieldDescription.nature) {
      case 'password':
        field = (<Field
          name={fieldDescription.name}
          component={PasswordInput}
        />);
        break;
      case 'select':
        field = <SelectInput fieldDescription={fieldDescription} />;
        break;
      case 'text':
      default:
        field = <Field name={fieldDescription.name} component={TextInput} />;
        break;
    }
    return (
      <div key={fieldDescription.name}>
        <label htmlFor={fieldDescription.name}>
          {fieldDescription.localized_name}
        </label>
        { field }
      </div>
    );
  });

  return (
    <form onSubmit={handleSubmit}>
      { fields }
      <Row center="xs" >
        <Col xs={4}>
          <div>
            <Button text="Connect" type="submit" disabled={submitting} />
          </div>
        </Col>
      </Row>
    </form>
  );
};

ProviderLoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  fieldsDescription: PropTypes.arrayOf(
    PropTypes.shape({
      nature: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      position: PropTypes.number.isRequired,
      localized_name: PropTypes.string.isRequired,
      optional: PropTypes.boolean,
      field_options: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          option_value: PropTypes.string.isRequired,
          selected: PropTypes.bool,
        })
      ),
    })
  ),
};

export default reduxForm({
  form: 'providerLoginForm',
  enableReinitialize: true,
})(ProviderLoginForm);
