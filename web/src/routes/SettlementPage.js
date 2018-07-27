import React from 'react';
import { Table, Radio, Col } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import 'moment/locale/zh-cn';
import moment from 'moment';
import styles from './Cart.css';
import Steps from '../component/Steps';
import TypeSelect from '../component/TypeSelect';
import DateSelect from '../component/DateSelect';
import AddressModal from './component/AddressModal';
import BillToInfo from '../component/BillToInfo';
import MoreAddress from './component/MoreAddress';
import Dismantle from './component/Dismantle';
import { userId, soldToId } from '../utils/Constants';

moment.locale('zh-cn');
let flag = true;
const RadioGroup = Radio.Group;

class Settlement extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      inputValue: '',
      addressValue: '',
      addressCommon: '',
      addressArr: [],
      visible: false,
      deDate: new Date().getTime() + 604800000,
      deType: '',
      returnValue: '',
      billType: '',
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'settlement/getCart',
      payload: {
        cartKey: '',
        soldToId,
        userId,
      },
    });
    this.props.dispatch({
      type: 'settlement/searchSoldAddress',
      payload: {
        soldToPartnerId: soldToId,
      },
    });
  }
  // 查询地址弹框打开
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  // 关闭弹框
  hideModal = () => {
    const addressArr = this.state.addressArr;
    const addressValue = this.state.addressValue || this.state.value;
    if (flag) {
      addressArr.push(this.props.settlement.shipToInfoStr);
      flag = !flag;
    }
    if (addressArr.indexOf(addressValue) === -1 && addressValue !== '') {
      if (addressArr.length >= 3) {
        addressArr.pop();
      }
      addressArr.push(addressValue);
      this.setState({
        addressArr,
        addressCommon: addressValue,
      });
    }
    if (this.state.value !== '') {
      const info = this.props.settlement.addressCodeArr[this.state.value];
      this.updateHeaderInfo({
        shipToCode: info,
        soldToCode: soldToId,
      });
    }
    this.setState({
      visible: false,
      addressCommon: addressValue,
    });
  }
  // 更改配送方式
  deliver = (value) => {
    this.setState({
      deType: value,
    });
    this.updateHeaderInfo({
      deliverType: value,
    });
  }
  // 更改地址
  addressChange = (e) => {
    this.setState({
      value: e.target.value,
      addressValue: this.props.settlement.addressInfo[e.target.value],
    });
  }
  // 查询地址
  searchAddress = (val) => {
    this.setState({
      inputValue: val,
    });
  }
  // 取消弹框
  hideModals = () => {
    this.setState({
      visible: false,
    });
  }
  // 页面显示的地址数组
  addressCommon = (val) => {
    const num = this.props.settlement.addressInfo.indexOf(val.target.value);
    const info = this.props.settlement.addressCodeArr[num];
    this.setState({
      addressCommon: val.target.value,
    });
    this.updateHeaderInfo({
      shipToCode: info,
      soldToCode: soldToId,
    });
  }
  // 更新信息
  updateHeaderInfo = (obj) => {
    const params = Object.assign({}, {
      entryKey: this.props.settlement.cartKey,
    }, obj);
    this.props.dispatch({
      type: 'settlement/updateHeaderInfo',
      payload: params,
    });
  }
  // 更新行向上的信息
  updateItemInfo = (obj) => {
    const params = Object.assign({}, {
      entryKey: this.props.settlement.cartKey,
    }, obj);
    this.props.dispatch({
      type: 'settlement/updateItemInfo',
      payload: params,
    });
  }
  // 是否返款选择
  returnMoney = (e) => {
    this.setState({
      returnValue: e.target.value,
    });
    this.updateHeaderInfo({
      rebateType: e.target.value,
    });
  }
  // 改变发票类型
  billChange = (val) => {
    this.setState({
      billType: val.target.value,
    });
    this.updateHeaderInfo({
      invoiceType: val.target.value,
    });
  }
  // 提交订单
  submit = () => {
    this.props.dispatch({
      type: 'settlement/submitOrder',
      payload: {
        entryKey: this.props.settlement.cartKey,
      },
    });
  }
  render() {
    const { cartInfo,
            orderPriceInfo,
            checkedQuery,
            billToInfo,
            shipToInfo,
            addressInfo,
            rebateType } = this.props.settlement;
    const columns = [{
      title: '商品',
      dataIndex: 'good',
      render: (text, record) => (<dl className={styles.dl}>
        <dt><img src={require(`../assets/product${record.key % 2}.png`)} alt="这是一张商品展示图" /></dt>
        <dd><span>{text}</span></dd>
      </dl>),
    }, {
      title: '单价',
      dataIndex: 'price',
    }, {
      title: '数量',
      dataIndex: 'number',
    }, {
      title: '前返折扣',
      dataIndex: 'discount',
    }, {
      title: '小计',
      dataIndex: 'count',
    }, {
      title: '到货日期',
      dataIndex: 'deliverDate',
      render: (text, record) => (
        <DateSelect
          width="100px"
          disableDate
          dateName="deliverDate"
          time={text}
          dateChange={time => this.updateItemInfo({
            deliverDate: moment(time).format('YYYYMMDDHHmmssSSS'),
            entryItemKeys: [record.cartItemKey],
          })}
        />
    ),
    }, {
      title: '是否多地址',
      dataIndex: 'moreAddress',
      render: (text, record) => (
        <MoreAddress text={text} record={record} updateItemInfo={this.updateItemInfo} />
    ),
    }, {
      title: '按数量拆分',
      dataIndex: 'dismantle',
      render: (text, record) => (
        <Dismantle
          record={record}
          dismantle={val => this.updateItemInfo({
            splitAverageNum: val,
            entryItemKeys: [record.cartItemKey],
          })}
        />
      ),
    }];
    const data = [];
    if (cartInfo.length > 0) {
      cartInfo.map((item, ind) => {
        if (item.isChecked) {
          data.push({
            key: ind,
            good: item.productInfo.goodsName,
            price: `￥${item.productInfo.unitPrice}`,
            number: item.quantity,
            discount: item.totalPolicyDiscountAmount ? `￥${item.totalPolicyDiscountAmount}` : `￥${0}`,
            count: `￥${item.actualPayAmount}`,
            moreAddress: item.isMultiAddressDeliver,
            deliverDate: item.deliverDate,
            cartItemKey: item.entryItemKey,
            splitThresholdNum: item.splitThresholdNum,
            splitAverageNum: item.splitAverageNum,
          });
        }
      });
    }
    const addressModalInfo = {
      addressInfo,
      range: 'settlement',
      visible: this.state.visible,
      value: this.state.value,
      inputValue: this.state.inputValue,
      addressArr: this.state.addressArr,
      addressCommontext: this.state.addressCommon,
      shipToInfoStr: this.props.settlement.shipToInfoStr,
      hideModal: () => {
        this.hideModal();
      },
      hideModals: () => {
        this.hideModals();
      },
      searchAddress: (val) => {
        this.searchAddress(val);
      },
      addressChange: (e) => {
        this.addressChange(e);
      },
      addressCommon: (e) => {
        this.addressCommon(e);
      },
      showModal: () => {
        this.showModal();
      },
    };
    const billInfo = {
      billToInfo,
      billType: this.state.billType,
      billChange: (val) => {
        this.billChange(val);
      },
    };
    return (
      <div style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', background: '#f8f8f8', padding: '5px 20px' }}>
          <Steps step={2} />
        </div>
        <div style={{ padding: '30px 60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Col>
              <b>配送方式：</b>
              <TypeSelect
                typeValue={this.state.deType || shipToInfo.deliverType || '0'}
                deliver={this.deliver}
              />
            </Col>
            <Col>
              <span>是否使用返款：</span>
              <RadioGroup
                onChange={this.returnMoney}
                value={this.state.returnValue || rebateType}
              >
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </RadioGroup>
            </Col>
          </div>
          <AddressModal {...addressModalInfo} />
          <div style={{ marginTop: 20 }}>
            <p style={{ borderBottom: '3px solid #eee', lineHeight: '30px', marginBottom: 10 }}><b>发票信息：</b></p>
            <BillToInfo {...billInfo} />
          </div>
          <div style={{ marginTop: 20 }}>
            <p style={{ lineHeight: '30px' }}><b>商品列表：</b></p>
            <Table
              className={styles.tabs}
              columns={columns}
              dataSource={data}
              pagination={false}
            />
            <p style={{ display: 'flex', justifyContent: 'space-between', lineHeight: '40px' }}>
              <span
                onClick={() => {
                  this.props.dispatch(routerRedux.push('/Cart'));
                }}
                style={{ cursor: 'pointer' }}
              >返回购物车</span>
              <span><b style={{ color: '#F05249' }}>{checkedQuery || 0}</b>件商品，商品总金额：￥{orderPriceInfo.originalTotalPrice || '0.00'}</span>
            </p>
            <p style={{ textAlign: 'right', lineHeight: '40px' }}>前返折扣：￥{orderPriceInfo.policyDiscountAmount || 0}</p>
            <p style={{ textAlign: 'right', lineHeight: '40px' }}>实付金额：<b style={{ color: '#F05249' }}>￥{orderPriceInfo.totalPrice || '0.00'}</b></p>
            <p style={{ textAlign: 'right', lineHeight: '40px' }}>
              <button
                style={{ width: 150, height: 40, color: '#fff', border: 0, background: '#F05249', fontSize: 18, lineHeight: '40px', textAlign: 'center', marginLeft: 10, cursor: 'pointer' }}
                onClick={this.submit}
                disabled={!this.props.settlement.isSubmit}
              >
                {this.props.settlement.isSubmit ? '提交订单' : '订单提交中...'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ settlement }) => ({ settlement }))(Settlement);
