// 特殊政策申请页面
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Radio, Layout, message } from 'antd';
import 'moment/locale/zh-cn';
import moment from 'moment';
import styles from './SpecialApply.css';
import DateSelect from '../component/DateSelect';
import TypeSelect from '../component/TypeSelect';
import AddressModal from './component/AddressModal';
import EditableTable from './component/EditableTable.js';
import BillToInfo from '../component/BillToInfo';
import { baseParam, soldToId, userId, BPLink } from '../utils/Constants';

moment.locale('zh-cn');
const { Content } = Layout;
const RadioGroup = Radio.Group;
const currentDate = new Date().getTime();

let flag = true;
let result = true;

class SpecialApply extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: '',
      deliver: currentDate + 604800000,
      entryStartTime: '',
      entryEndTime: '',
      returnValue: '',
      sendValue: '0',
      AddressVisible: false,
      value: '',
      inputValue: '',
      addressValue: '',
      addressCommon: '',
      addressArr: [],
      visible: false,
      billType: '',
      orderReasonArr: [],
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'specialApply/specialApplyInit',
      payload: {
        baseParam,
        params: {
          userId,
          soldToId,
        },
      },
    });
    this.props.dispatch({
      type: 'specialApply/searchSoldAddress',
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
      addressArr.push(this.props.specialApply.shipToInfoStr);
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
      const info = this.props.specialApply.addressCodeArr[this.state.value];
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
  // 更改地址
  addressChange = (e) => {
    this.setState({
      value: e.target.value,
      addressValue: this.props.specialApply.addressInfo[e.target.value],
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
    const num = this.props.specialApply.addressInfo.indexOf(val.target.value);
    const info = this.props.specialApply.addressCodeArr[num];
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
      entryKey: this.props.specialApply.entryKey,
    }, obj);
    this.props.dispatch({
      type: 'specialApply/updateHeaderInfo',
      payload: {
        baseParam,
        params,
      },
    });
  }
  // 发货日期选择
  dateChange = (date, dateName) => {
    this.setState({
      [dateName]: date,
    });
    this.updateHeaderInfo({
      [dateName]: moment(date).format('YYYYMMDDHHmmssSSS'),
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
  // 送达方式选择
  sendType = (value) => {
    this.setState({
      sendValue: value,
    });
    this.updateHeaderInfo({
      deliverType: value,
    });
  }
  // 提交申请
  submitApply = () => {
    const { entryStartTime, entryEndTime, orderReasonArr } = this.state;
    const { entryKey, contractInfo } = this.props.specialApply;
    const OrderReasonFlag = orderReasonArr.length === contractInfo.length;
    if (contractInfo.length < 1) {
      message.warning('您还未选中商品！');
    } else if (!OrderReasonFlag) {
      message.warning('您还有未选择的订单原因！');
    } else {
      this.props.dispatch({
        type: 'specialApply/submitApply',
        payload: {
          baseParam,
          params: {
            contractEndTime: entryEndTime,
            contractStartTime: entryStartTime,
            entryKey,
          },
        },
      });
    }
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
  // 判断订单原因是否填写
  orderReasonFlag = (ind) => {
    if (this.state.orderReasonArr.indexOf(ind) === -1) {
      result = true;
    }
    if (result) {
      this.setState({
        orderReasonArr: [...this.state.orderReasonArr, ind],
      });
    }
    result = false;
  }
  render() {
    const addressModalInfo = {
      range: 'specialApply',
      visible: this.state.visible,
      value: this.state.value,
      inputValue: this.state.inputValue,
      addressInfo: this.props.specialApply.addressInfo,
      addressArr: this.state.addressArr,
      addressCommontext: this.state.addressCommon,
      shipToInfoStr: this.props.specialApply.shipToInfoStr,
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
    const { billToInfo,
            isUseRebate,
            contractInfo,
            entryKey,
            entryStartTime,
            entryEndTime } = this.props.specialApply;
    let contractItems = [];
    if (contractInfo.length > 0) {
      contractInfo.map((item, ind) => {
        contractItems.push({
          key: ind,
          mtm: item.productInfo.materialNumber,
          name: item.productInfo.goodsName,
          group: item.productInfo.productGroupNo,
          deliverDate: item.deliverDate,
          number: item.quantity,
          price: item.productInfo.unitPrice || 0.00,
          total: `￥${item.totalAmount}`,
          orderReason: item.orderReason,
          comment: item.comment,
          contractItemKey: item.entryItemKey,
        });
      });
    } else {
      contractItems = [];
    }
    const editableTable = {
      contractItems,
      entryKey,
      orderReasonFlag: this.orderReasonFlag,
      dispatch: this.props.dispatch,
    };
    const billInfo = {
      billToInfo,
      billType: this.state.billType,
      billChange: (val) => {
        this.billChange(val);
      },
    };
    return (
      <Layout style={{ padding: '0 60px 40px' }}>
          <Content style={{ padding: '0 24px', minHeight: 280, background: '#fff' }}>
            <h2 className={styles.header}>特殊政策合同订单</h2>
            <Row className={styles.confirm}>
              <Col><span>合同编号：</span>
                <input disabled placeholder="系统自动生成" />
              </Col>
            </Row>
            <Row className={styles.confirm}>
              <Col className={styles.date}>
                <span>合同开始日期：</span>
                <DateSelect
                  time={this.state.entryStartTime || entryStartTime}
                  entryEndTime={this.state.entryEndTime || entryEndTime} dateChange={this.dateChange} dateName="entryStartTime"
                />
              </Col>
              <Col className={styles.date}>
                <span>合同结束日期：</span>
                <DateSelect time={this.state.entryEndTime || entryEndTime} startTime={this.state.entryStartTime || entryStartTime} dateChange={this.dateChange} dateName="entryEndTime" />
              </Col>
            </Row>
            <Row className={styles.confirm}>
              <Col>
                <span>发货方式：</span>
                <TypeSelect
                  typeValue={this.state.sendValue || '0'}
                  deliver={this.sendType}
                />
              </Col>
              <Col style={{ paddingTop: 5 }}>
                <span>是否使用返款：</span>
                <RadioGroup
                  onChange={this.returnMoney}
                  value={this.state.returnValue || isUseRebate}
                >
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </RadioGroup>
                <p style={{ color: 'red', fontSize: '12px' }}>
                  <b style={{ position: 'relative', top: 3, margin: '0 5px', fontSize: 16 }}>*</b>
                  返款使用结果将根据具体产品组下的返款情况决定
                  <b style={{ position: 'relative', top: 3, margin: '0 5px', fontSize: 16 }}>*</b>
                </p>
              </Col>
            </Row>
            {/* 选择地址 */}
            <AddressModal {...addressModalInfo} />
            {/* 发票信息 */}
            <p className={styles.title}>发票信息</p>
            <BillToInfo {...billInfo} />
            {/* 商品信息 */}
            <p className={styles.title}>商品</p>
            <EditableTable {...editableTable} />
            {/* 提交取消按钮 */}
            <Row className={styles.btn}>
              <button
                onClick={() => {
                  window.location.href = BPLink;
                }}
              >取消</button>
              <button
                className={styles.agree}
                onClick={this.submitApply}
                disabled={!this.props.specialApply.isSubmit}
              >{this.props.specialApply.isSubmit}
                {this.props.specialApply.isSubmit ? '提交申请' : '申请提交中...'}
              </button>
            </Row>
          </Content>
        </Layout>
    );
  }
}

export default connect(({ specialApply }) => ({ specialApply }))(SpecialApply);
