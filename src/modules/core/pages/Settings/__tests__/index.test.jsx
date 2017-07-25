import React from 'react';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';
import { Settings } from '../index';
// import { MemoryRouter } from 'react-router';
// import sessionStore from 'stores/SessionStore';
// import viewStore from 'stores/ViewStore';

describe('component', () => {
  let mocks;
  let component;

  beforeEach(function () {
    mocks = {
      sessionStore: { reset: sinon.spy() },
      viewStore: { reset: sinon.spy() },
      client: { resetStore: sinon.spy() },
      router: { push: sinon.spy() },
    };
    component = (<Settings
      sessionStore={mocks.sessionStore}
      viewStore={mocks.viewStore}
      client={mocks.client}
      router={mocks.router}
    />);
  });

  it('renders', function () {
    const container = shallow(component);
    expect(shallowToJson(container)).toMatchSnapshot();
  });

  describe('logout', function () {
    it('logs user out', function () {
      window.localStorage = {
        setItem: sinon.spy(),
        removeItem: sinon.spy(),
      };

      const container = mount(component);
      container.find('button').simulate('click');

      expect(mocks.client.resetStore.called).toBe(true);
      expect(mocks.sessionStore.reset.called).toBe(true);
      expect(mocks.viewStore.reset.called).toBe(true);
      expect(window.localStorage.removeItem.calledWith('auth_token'));
      expect(mocks.router.push.calledWith('/'));
    });
  });
});
