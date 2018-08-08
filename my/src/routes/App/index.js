import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { MainWrapper } from '../../components';

class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }
  componentDidMount() {
    if (this.props.location.pathname === '/') {
      this.props.dispatch(routerRedux.push('/home'));
    }
  }
  render() {
    return (
      <MainWrapper>
        {this.props.children}
      </MainWrapper>
    );
  }
}
export default connect(({ home }) => ({ home }))(App);
