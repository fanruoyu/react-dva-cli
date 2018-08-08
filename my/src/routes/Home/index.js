import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Progress } from 'antd';
import { routerRedux } from 'dva/router';
import Highcharts from 'highcharts';
import { MainWrapper } from '../../components';
import './home.css';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
    };
  }
  componentDidMount() {
    const colors = ['#168fff'];
    Highcharts.getOptions().colors = Highcharts.map(colors, (color) => {
      return {
        radialGradient: { cx: 0.3, cy: -0.1, r: 2 },
        stops: [[0, color], [2, Highcharts.Color(color).brighten(14).get('rgb')], // darken
        ],
      };
    });
    // 折线图
    Highcharts.chart('container', {
      title: {
        text: '客户分析',
        align: 'left',
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        categories: ['高层', '中层', '基层', '其他'], // x轴
      },
      yAxis: {
        title: '',
        tickPositions: [0, 100, 200, 300, 400, 500, 600], // 指定竖轴坐标点的值
      },
      series: [{ // 数值
        name: '人员',
        data: [150, 240, 405, 176],
      }],
    });
    // 柱状图
    Highcharts.chart('containerT', {
      chart: {
        type: 'column',
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      title: {
        text: '上传录音信息分析',
        align: 'left',
      },
      xAxis: {
        categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      },
      yAxis: {
        title: null,
        tickPositions: [0, 100, 200, 300, 400, 500, 600], // 指定竖轴坐标点的值
      },
      series: [{
        name: '小张',
        data: [120, 190, 300, 380, 293, 409, 500, 222, 331, 129,240, 400],
      }],
      plotOptions: {
        series: {
          marker: {
            enabled: false,
          },
        },
      },
    });
  }
  loginMsg() {
    this.props.dispatch({
      type: 'home/saveLoginMsg',
      payload: {
        userName: '2111100149',
        passWord: '111111',
      },
    });
  }
  changeMyName() {
    this.props.dispatch({
      type: 'home/saveUserMsg',
      payload: {
        userName: this.state.userName,
      },
      callback: () => {
        console.log(0);
      },
    });
  }
  render() {
    return (
      <MainWrapper>
        <div style={{ width: '100px', margin: '10px 10px' }}>
          <Input
            placeholder="请输入用户名称" value={this.state.userName} onChange={(e) => {
              this.setState({
                userName: e.target.value,
              });
            }}
          />
          <Button onClick={this.changeMyName.bind(this)}type="primary" >参数</Button>
          <Button onClick={this.loginMsg.bind(this)} >Login</Button>
          <Button
            onClick={() => {
              this.props.dispatch(routerRedux.push({
                pathname: '/main',
                query: {
                  page: 2,
                },
              }));
            }}
          >跳路由</Button>

          <Progress type="circle" percent={30} width={80} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div id="container" style={{ height: 400 }} />
          <div id="containerT" style={{ height: 400 }} />
        </div>
      </MainWrapper>
    );
  }
}

export default connect(({ home }) => ({ home }))(Home);
