import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import GoBackArrow from '../index';

describe('component', () => {
  it('renders', () => {
    const container = shallow(
      <GoBackArrow />
    );

    expect(shallowToJson(container)).toMatchSnapshot();
  });
});
