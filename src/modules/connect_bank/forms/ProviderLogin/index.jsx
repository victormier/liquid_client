import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'components/common/Button';
import FormInput from 'components/common/FormInput';
import SelectInput from 'components/common/SelectInput';
import PropTypes from 'prop-types';
import _ from 'lodash';
import baseStyles from 'styles/base/base.scss';

const TextInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="text"
    label={componentProps.label}
  />);

const PasswordInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="password"
    label={componentProps.label}
  />);

const renderSelect = componentProps => (
  <SelectInput {...componentProps.input} label={componentProps.label}>
    {componentProps.children}
  </SelectInput>
);

const SelectField = ({ fieldDescription }) => {
  const options = fieldDescription.field_options.map(option => (
    <option name={option.name} key={option.name} value={option.value}>
      {option.localized_name}
    </option>
  ));

  return (
    <Field component={renderSelect} name={fieldDescription.name} label={fieldDescription.localized_name}>
      <option value={null} />
      {options}
    </Field>
  );
};
SelectField.propTypes = {
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
          label={fieldDescription.localized_name}
        />);
        break;
      case 'select':
        field = <SelectField fieldDescription={fieldDescription} />;
        break;
      case 'text':
      default:
        field = <Field name={fieldDescription.name} component={TextInput} label={fieldDescription.localized_name} />;
        break;
    }
    return (
      <div key={fieldDescription.name} className={baseStyles.baseMarginBottom}>
        { field }
      </div>
    );
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className={baseStyles.baseMarginBottom}>
        { fields }
      </div>
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
