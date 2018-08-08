import React, { Component } from 'react';

class MainWrapper extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
        {this.props.children}
      </div>
    );
  }
}
export default MainWrapper;
