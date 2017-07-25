import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import FormInput from '../index';


describe('component', () => {
  it('renders', () => {
    const container = shallow(
      <FormInput
        type="text"
        value="test me"
        placeHolder="test"
      />
    );

    expect(shallowToJson(container)).toMatchSnapshot();
  });
});
