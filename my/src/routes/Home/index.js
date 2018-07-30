import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input } from 'antd';
// import { routerRedux } from 'dva/router';
// this.props.dispatch(routerRedux.push('/StandardOrder')); // 路由跳转

class Home extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
    };
  }
  changeMyName() {
    this.props.dispatch({
      type: 'home/saveUserMsg',
      payload: {
        userName: this.state.userName,
      },
    });
  }
  loginMsg() {
    this.props.dispatch({
      type: 'home/saveLoginMsg',
      payload: {
        userName: 'admin',
        passWord: '123456',
      },
    });
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}>
        <p style={{ width: '100px', margin: '10px 10px' }}>
          <Input placeholder="请输入用户名称" value={this.state.userName} onChange={(e) => {
            this.setState({
              userName: e.target.value,
            });
          }}
          />
          <Button onClick={this.changeMyName.bind(this)} >参数</Button>
          <Button onClick={this.loginMsg.bind(this)} >Login</Button>
        </p>
      </div>
    );
  }
}

export default connect(({ home }) => ({ home }))(Home);
