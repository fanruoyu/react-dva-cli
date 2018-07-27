import React from 'react';
import { Row, Col, Radio } from 'antd';
import styles from '../routes/SpecialApply.css';

const RadioGroup = Radio.Group;

class BillToInfo extends React.Component {
  render() {
    const { billToInfo, billType, billChange } = this.props;
    return (
      <Row className={styles.confirm}>
        <Col className={styles.billDiv}>
          <div>
            <span>发票抬头</span>：
            <span className={styles.bill}>{billToInfo.invoiceName}</span>
          </div>
          <div>
            <span>发票地址</span>：
            <span className={styles.bill}>{billToInfo.invoiceAddress}</span>
          </div>
          {
            (billType || billToInfo.invoiceType) === 'Z' ?
              <div className={styles.billDiv}>
                <div>
                  <span>开户行</span>：
                  <span className={styles.bill}>{billToInfo.bankName}</span>
                </div>
                <div>
                  <span>账号</span>：
                  <span className={styles.bill}>{billToInfo.bankAccount}</span>
                </div>
              </div> : null
          }
        </Col>
        <Col className={styles.billDiv}>
          <div style={{ margin: '5px 0 14px' }}>
            <span>发票类型</span>：
            {
              (billToInfo.invoiceType === 'Z' ? '增专发票' : '增普发票')
            }
          </div>
          <div>
            <span>税号</span>：
            <span className={styles.bill}>{billToInfo.taxNo}</span>
          </div>
          {
            (billType || billToInfo.invoiceType) === 'Z' ?
              <div className={styles.billDiv}>
                <div>
                  <span>电话</span>：
                  <span className={styles.bill}>{billToInfo.invoicePhone}</span>
                </div>
              </div> : null
          }
        </Col>
      </Row>
    );
  }
}

export default BillToInfo;
