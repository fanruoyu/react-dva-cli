import React from 'react';
import { connect } from 'dva';
import { Table, Button, message, Icon } from 'antd';
import 'moment/locale/zh-cn';
import moment from 'moment';

import DateSelect from '../component/DateSelect';
import MoreAddress from './component/MoreAddress';
import Dismantle from './component/Dismantle';
import Settlement from './component/Settlement';
import CartInput from '../component/CartInput';
import MTM from './component/MTM';
import { userId, soldToId } from '../utils/Constants';

moment.locale('zh-cn');
let flag = true;

class QuickOrder extends React.Component {
  constructor() {
    super();
    this.columns = [{
      title: '商品MTM',
      dataIndex: 'mtm',
      width: 150,
      render: (text, record) => <MTM record={record} dispatch={this.props.dispatch} goodArr={this.props.settlement.goodArr} soldToInfo={this.props.settlement.soldToInfo} noRender={() => { flag = !flag; }} />,
    }, {
      title: '商品名称',
      dataIndex: 'goodName',
    }, {
      title: '产品组',
      dataIndex: 'group',
      width: 60,
    }, {
      title: '需求到货日期',
      dataIndex: 'deliverDate',
      width: 120,
      render: (text, record) => (
        <DateSelect
          width="100px"
          disableDate
          dateName="deliverDate"
          time={text}
          dateChange={time => text && this.updateItemInfo({
            deliverDate: moment(time).format('YYYYMMDDHHmmssSSS'),
            entryItemKeys: [record.cartItemKey],
          })}
        />
      ),
    }, {
      title: '数量',
      dataIndex: 'number',
      width: 80,
      render: (text, record) => {
        return (
          <div>
            {
              text ?
                <CartInput
                  text={text}
                  inputChange={val => this.modifyGoodNumber(val, record.cartItemKey)}
                /> :
                <CartInput
                  text={text}
                  disable
                  inputChange={val => this.modifyGoodNumber(val, record.cartItemKey)}
                />
            }
          </div>
        );
      },
    }, {
      title: '单价',
      dataIndex: 'price',
      width: 80,
    }, {
      title: '政策折扣',
      dataIndex: 'discount',
      width: 90,
    }, {
      title: '小计',
      dataIndex: 'count',
      width: 130,
    }, {
      title: '是否多地址',
      dataIndex: 'moreAddress',
      width: 60,
      render: (text, record) => (
        <MoreAddress
          text={text} record={record} updateItemInfo={val => this.updateItemInfo(val)}
        />
      ),
    }, {
      title: '是否按数量拆单',
      dataIndex: 'dismantle',
      width: 190,
      render: (text, record) => (
        <Dismantle
          text={text} record={record} updateItemInfo={(val) => {
            if (record.goodName) {
              this.updateItemInfo(val);
            }
          }}
        />
        ),
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 40,
      render: (text, record) => {
        return (
          <span
            style={{ cursor: 'pointer', color: '#F05249' }}
            onClick={() => this.onDelete(record.key, record.cartItemKey)}
          >删除</span>
        );
      },
    }];
    this.state = {
      dataSource: [{
        key: '0',
      }],
      count: 1,
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'settlement/initCart',
      payload: {
        soldToId,
        userId,
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    const data = [];
    if (nextProps.settlement.cartInfo.length > 0 && flag) {
      nextProps.settlement.cartInfo.map((item, ind) => {
        data.push({
          key: ind,
          mtm: item.productInfo.materialNumber,
          goodName: item.productInfo.goodsName,
          group: item.productInfo.productGroupNo,
          price: `￥${item.productInfo.unitPrice}`,
          number: item.quantity,
          discount: item.totalPolicyDiscountAmount ? `￥${item.totalPolicyDiscountAmount}` : `￥${0}`,
          count: `￥${item.actualPayAmount}`,
          moreAddress: item.isMultiAddressDeliver,
          deliverDate: item.deliverDate,
          cartItemKey: item.entryItemKey,
          splitThresholdNum: item.splitThresholdNum,
          splitOrderBase: item.splitOrderBase,
          isQuantitySplit: item.isQuantitySplit,
          splitOrderQuantity: item.splitOrderQuantity,
        });
      });
      this.setState({
        dataSource: data,
        count: data.length + 1,
      });
    } else if (flag) {
      this.setState({
        dataSource: [{
          key: 0,
        }],
        count: 1,
      });
    }
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
  // 添加商品行向
  handleAdd = () => {
    const { dataSource, count } = this.state;
    this.setState({
      count: count + 1,
      dataSource: [...dataSource, { key: count }],
    });
  }
  // 加减数量
  modifyGoodNumber = (number, cartItemKey) => {
    const { cartKey } = this.props.settlement;
    if (parseInt(number, 10) > 0 && parseInt(number, 10) <= 999999) {
      this.props.dispatch({
        type: 'settlement/modifyGoodNumber',
        payload: {
          entryItemKey: cartItemKey,
          entryKey: cartKey,
          quantity: parseInt(number, 10),
        },
      });
    } else {
      message.warning('您选中商品的数量已超限！');
    }
  }
  // 删除一栏商品
  onDelete = (key, itemKey) => {
    const dataSource = [...this.state.dataSource];
    if (dataSource.length === 1) {
      this.setState({ dataSource: [{ key: 0 }] });
    } else {
      this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    }
    if (itemKey) {
      this.props.dispatch({
        type: 'settlement/deleteCartItems',
        payload: {
          entryItemKeys: [itemKey],
          entryKey: this.props.settlement.cartKey,
        },
      });
    }
  }
  render() {
    const props = {
      settlement: this.props.settlement,
      dispatch: this.props.dispatch,
    };
    return (
      <Settlement {...props}>
        <p style={{ borderBottom: '3px solid #eee', margin: '0 0 10px' }} />
        {/* <Button type="primary" onClick={this.handleAdd}>
          添加商品
        </Button> */}
        <Table
          style={{ borderTop: '3px solid #fff' }}
          columns={this.columns}
          dataSource={this.state.dataSource}
          pagination={false}
          bordered
        />
        <Button onClick={this.handleAdd} style={{ width: '100%', height: 50, position: 'relative', top: '-1px' }}>
          <Icon type="plus" style={{ fontSize: 26 }} />
        </Button>
      </Settlement>
    );
  }
}

export default connect(({ settlement }) => ({ settlement }))(QuickOrder);
