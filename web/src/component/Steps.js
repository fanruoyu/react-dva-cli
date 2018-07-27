import React from 'react';
import { Icon } from 'antd';
import styles from './Steps.css';

class Steps extends React.Component {
  render() {
    let redStr = '';
    if (this.props.step === 1) {
      redStr = '70px';
    } else if (this.props.step === 2) {
      redStr = '200px';
    } else {
      redStr = '280px';
    }
    const arr = ['', '', ''];
    for (let i = 0; i < this.props.step; i++) {
      arr[i] = 'select';
    }
    return (
      <div className={styles.wrap}>
        <p className={arr[0] ? styles.select : ''}>
          <span>1</span>
          <span>购物车</span>
        </p>
        <p className={arr[1] ? styles.select : ''}>
          <span>2</span>
          <span>订单结算</span>
        </p>
        <p className={arr[2] ? styles.select : ''}>
          <span><Icon style={{ fontSize: 14 }} type="check" /></span>
          <span>成功提交</span>
        </p>
        <span className={styles.str} />
        <span style={{ width: redStr }} />
      </div>
    );
  }
}

export default Steps;
