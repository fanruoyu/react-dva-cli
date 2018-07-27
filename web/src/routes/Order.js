import React from 'react';
import { connect } from 'dva';
import { Icon, Spin, message } from 'antd';
import Steps from '../component/Steps';
import styles from './Order.css';
import { shoppingLink, usertoken, soldToId, authkey } from '../utils/Constants';

let count = 0;

class Order extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: '',
    };
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      if (count > 4) {
        clearInterval(this.timer);
        this.setState({
          loading: false,
        });
      } else {
        this.getOrderInfo();
        count++;
      }
    }, 500);
  }
  // 查询订单是否存在
  getOrderInfo = () => {
    const id = this.props.location.query.id;
    this.props.dispatch({
      type: 'order/orderMainNo',
      payload: { id },
    });
  }
  render() {
    const flex = {
      display: 'flex',
      justifyContent: 'space-between',
      lineHeight: '30px',
    };
    const childOrder = {
      borderBottom: '1px solid #fff',
      padding: 10,
      background: '#f8f8f8',
    };
    const { orderInfo } = this.props.order;
    const orderMsg = this.props.order.orderMsg || '未查询到此订单！';
    if (!this.props.order.loading) {
      clearInterval(this.timer);
    }
    return (
      <div className={styles.order}>
        <Spin
          spinning={this.state.loading === false ? this.state.loading : this.props.order.loading}
          delay={500}
          size="large"
          tip="加载中……"
        >
          {
            this.state.loading === false && this.props.order.loading === true ?
              <div>
                <div className={styles.header}>
                  <div />
                  <Steps step={3} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
                  <div style={{ paddingTop: 5, paddingRight: 10 }}>
                    <Icon type="close-circle" style={{ color: '#4DDE5D', fontSize: 30 }} />
                  </div>
                  <div>
                    <p style={{ color: '#4DDE5D', fontSize: 20 }}>{orderMsg}</p>
                  </div>
                </div>
              </div> :
              <div>
                <div className={styles.header}>
                  <div className={styles.top}>
                    <div style={{ paddingTop: 10, paddingRight: 10 }}>
                      <Icon type="check-circle" style={{ color: '#4DDE5D', fontSize: 30 }} />
                    </div>
                    <div>
                      <p style={{ color: '#4DDE5D', fontSize: 20 }}>订单提交成功！</p>
                      <p>订单编号：{orderInfo.orderMainNo}，订单总金额：<b style={{ color: '#F05249' }}>{`￥${orderInfo.actualPayAmount}`}</b></p>
                    </div>
                  </div>
                  <Steps step={3} />
                </div>
                <div style={{ width: 660, margin: '0 auto' }}>
                  <h3 style={{ lineHeight: '65px' }}>根据联想产品拆分为以下子订单：</h3>
                  {
                    orderInfo.orderSubList && orderInfo.orderSubList.length > 0 ?
                      orderInfo.orderSubList.map((item, ind) => (
                        <div key={ind} style={childOrder}>
                          <p style={flex}>
                            <span><b>子订单号：{item.orderSubNo}</b></span>
                            <span>订单金额：<b>￥{item.actualPayAmount}</b></span>
                          </p>
                          {
                            item.orderItemList.length > 0 && item.orderItemList.map((val, index) =>
                            (<p key={index}>商品名称：{val.goodsName}</p>))
                          }
                        </div>
                      )) : null
                  }
                  <p style={{ margin: '10px 0' }}><b>收货信息：</b>
                    {orderInfo.shiptoName}
                    {orderInfo.shiptoTelephone}
                    {orderInfo.shiptoProvince}
                    {orderInfo.shiptoCity}
                    {orderInfo.shiptoArea}
                    {orderInfo.shiptoStreet}
                  </p>
                  <p>
                    <b>发票信息：</b>
                    {orderInfo.invoiceName} {orderInfo.taxNo}
                    <span style={{ padding: '0 13px' }}>{
                    orderInfo.invoiceType && (orderInfo.invoiceType === 'Z' ? 'Z(增专)' : 'P(增普)')}</span>
                    {orderInfo.invoiceAddress}
                  </p>
                </div>
              </div>
          }
          <p style={{ width: 660, margin: '0 auto', textAlign: 'center', marginTop: 20 }}>
            <span
              className={styles.myOrder}
              onClick={() => {
                window.location.href = `http://tstfis.lenovo.com.cn:8081/OrderMonitoring/T-Model/Query.aspx?usertoken=${usertoken}&authkey=${authkey}&soldToPartnerId=${soldToId}`;
              }}
            >查看我的订单</span>
            <span
              className={styles.shop}
              onClick={() => {
                window.location.href = shoppingLink;
              }}
            >购买其他商品</span>
          </p>
        </Spin>
      </div>
    );
  }
}

export default connect(({ order }) => ({ order }))(Order);
