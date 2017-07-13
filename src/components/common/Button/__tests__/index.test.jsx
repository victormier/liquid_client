import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Button from '../index';


describe('component', () => {
  it('renders', () => {
    const container = shallow(
      <Button text="test me" />
    );

    expect(shallowToJson(container)).toMatchSnapshot();
  });
});
