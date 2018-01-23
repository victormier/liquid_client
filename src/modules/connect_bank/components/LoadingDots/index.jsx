import React, { Component } from 'react';
import { autobind } from 'core-decorators';

class LoadingDots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingDots: '...',
      intervalId: null,
    };
  }

  componentWillMount() {
    const intervalId = setInterval(this.loadingDots, 500);
    this.setState({ intervalId });
  }

  @autobind
  loadingDots() {
    const loadingDots = (this.state.loadingDots.length < 3) ? `${this.state.loadingDots}.` : '';
    this.setState({ loadingDots });
  }

  render() {
    return <span>{ this.state.loadingDots }</span>;
  }
}

export default LoadingDots;
