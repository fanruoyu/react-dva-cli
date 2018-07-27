import React from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import 'moment/locale/zh-cn';
import moment from 'moment';

import DateSelect from '../component/DateSelect';
import MoreAddress from './component/MoreAddress';
import Dismantle from './component/Dismantle';
import styles from './Cart.css';
import Settlement from './component/Settlement';
import { userId, soldToId } from '../utils/Constants';

moment.locale('zh-cn');

class StandardOrder extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'settlement/getCart',
      payload: {
        cartKey: '',
        soldToId,
        userId,
      },
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
  render() {
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
      title: '是否按数量拆单',
      dataIndex: 'dismantle',
      width: 190,
      render: (text, record) => (
        <Dismantle
          text={text} record={record} updateItemInfo={this.updateItemInfo}
        />
        ),
    }];
    const data = [];
    if (this.props.settlement.cartInfo.length > 0) {
      this.props.settlement.cartInfo.map((item, ind) => {
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
            splitAverageNum: item.splitOrderBase,
          });
        }
      });
    }
    const props = {
      settlement: this.props.settlement,
      dispatch: this.props.dispatch,
    };
    return (
      <Settlement {...props}>
        <Table
          className={styles.tabs}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </Settlement>
    );
  }
}

export default connect(({ settlement }) => ({ settlement }))(StandardOrder);