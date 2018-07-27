// 特殊政策确认页面
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Layout, Icon, Spin, message } from 'antd';
import 'moment/locale/zh-cn';
import moment from 'moment';
import styles from './SpecialApply.css';
import BillToInfo from '../component/BillToInfo';
import { specialCheck } from '../utils/Constants';

moment.locale('zh-cn');
const { Content } = Layout;
let count = 0;

class SpecialConfirm extends React.Component {
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
        message.warn('未查询到此订单！');
      } else {
        this.props.dispatch({
          type: 'specialApply/searchSpecialInfo',
          payload: {
            id: this.props.location.query.id,
          },
        });
        count++;
      }
    }, 500);
  }
  // 同意
  submitApply = () => {
    window.location.href = specialCheck;
  }
  render() {
    const confirm = this.props.specialApply.specialInfo;
    const addressStr = JSON.stringify(confirm) === '{}' ? '' : `${confirm.shiptoName}    ${confirm.shiptoTelephone}    ${confirm.shiptoProvince}${confirm.shiptoCity}${confirm.shiptoArea}${confirm.shiptoStreet}`;
    const columns = [{
      title: '合同编号',
      dataIndex: 'contractNumber',
    }, {
      title: '代理编号',
      dataIndex: 'proxyNumber',
    }, {
      title: '产品组',
      dataIndex: 'group',
    }, {
      title: '需求到货日期',
      dataIndex: 'deliverDate',
    }, {
      title: '数量',
      dataIndex: 'number',
      width: '13%',
    }, {
      title: '价格',
      dataIndex: 'price',
      width: '13%',
    }, {
      title: '总价',
      dataIndex: 'total',
    }];
    if (!this.props.specialApply.loading) {
      clearInterval(this.timer);
    }
    const dataSource = [];
    if (JSON.stringify(confirm) !== '{}') {
      const data = confirm.contractSubDTO;
      data.map((item, index) => {
        const obj = {
          contractNumber: item.contractSubNo,
          proxyNumber: item.soldtoCode,
        };
        item.contractItemDTO.map((val, ind) => {
          dataSource.push(Object.assign({}, obj, {
            key: index * item.contractItemDTO.length + ind,
            group: val.productGroupNo,
            number: val.quantity,
            price: `￥${val.unitPrice}`,
            total: `￥${val.totalAmount}`,
            deliverDate: new Date(val.deliverDate).toLocaleDateString().replace(/\//g, '-'),
          }));
        });
      });
    }
    return (
      <Layout style={{ padding: '0 60px 40px', minHeight: '100%' }}>
        <Spin
          spinning={this.state.loading === false ? this.state.loading : this.props.specialApply.loading}
          delay={500}
          size="large"
          tip="加载中……"
        >
          <Content style={{ padding: '0 24px 20px', minHeight: '280px', background: '#fff' }}>
            <h2 className={styles.header}>特殊政策合同订单</h2>
            {
            this.state.loading === false && this.props.specialApply.loading === true ?
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 100, height: '100%' }}>
                <div style={{ paddingTop: 5, paddingRight: 10 }}>
                  <Icon type="close-circle" style={{ color: '#F05249', fontSize: 30 }} />
                </div>
                <div>
                  <p style={{ color: '#F05249', fontSize: 20 }}>{this.props.specialApply.specialInfoMsg || '未查询到此订单！'}</p>
                </div>
              </div> :
              <div>
                <Row className={styles.confirm}>
                  <Col><span>合同编号：</span>
                    <p>{confirm.contractMainNo}</p>
                  </Col>
                  <Col>
                    <span>合同开始日期：</span>
                    <p>{new Date(confirm.contractStartTime).toLocaleDateString().replace(/\//g, '-')}</p>
                  </Col>
                </Row>
                <Row className={styles.confirm}>
                  <Col>
                    <span>发货方式：</span>
                    <p>{confirm.deliverType === 0 ? '联想标准运输' : '自提'}</p>
                  </Col>
                  <Col>
                    <span>合同结束日期：</span>
                    <p>{new Date(confirm.contractEndTime).toLocaleDateString().replace(/\//g, '-')}</p>
                  </Col>
                </Row>
                <Row className={styles.confirm}>
                  <div className={styles.addressP}>
                    <span>收货地址：</span>
                    <p>{addressStr}</p>
                  </div>
                  <Col>
                    <span>是否使用返款：</span>
                    <p>{confirm.isUseRebate === 0 ? '否' : '是'}</p>
                  </Col>
                </Row>
                {/* 发票信息 */}
                <p className={styles.title}>发票信息</p>
                <BillToInfo billToInfo={confirm} />
                {/* 商品信息 */}
                <p className={styles.title}>商品</p>
                <Table bordered dataSource={dataSource} columns={columns} pagination={false} />
              </div>
          }
            {/* 提交取消按钮 */}
            <Row className={styles.btn}>
              <button>数字签名</button>
              <button>打印申请表</button>
              <button onClick={this.submitApply}>进入合同列表</button>
            </Row>
          </Content>
        </Spin>
      </Layout>
    );
  }
}

export default connect(({ specialApply }) => ({ specialApply }))(SpecialConfirm);
