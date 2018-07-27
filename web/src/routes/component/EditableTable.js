import React from 'react';
import { Table, message } from 'antd';
import 'moment/locale/zh-cn';
import moment from 'moment';
import EditableCell from './EditableCell';
import SelectGood from './SelectGood';
import { baseParam } from '../../utils/Constants';
import DateSelect from '../../component/DateSelect';
import OrderReason from './OrderReason';
import UploadSOW from './UploadSOW';
import Comment from './Comment';

moment.locale('zh-cn');

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '商品MTM',
      dataIndex: 'mtm',
      width: 80,
    }, {
      title: '商品名称',
      dataIndex: 'name',
      width: 85,
    }, {
      title: '产品组',
      dataIndex: 'group',
      width: '5%',
    }, {
      title: '到货日期',
      dataIndex: 'deliverDate',
      width: 115,
      render: (text, record) => {
        return (
          <DateSelect
            width="100px"
            disableDate
            dateName="deliverDate"
            time={text}
            dateChange={(val, name) => this.onCellChange(val, name, record.contractItemKey)}
          />
        );
      },
    }, {
      title: '数量',
      dataIndex: 'number',
      width: '8%',
      render: (text, record) => (
        <EditableCell
          value={text}
          onChange={val => this.onCellChange(val, 'number', record.contractItemKey)}
        />
      ),
    }, {
      title: '单价',
      dataIndex: 'price',
      width: 100,
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {
            text ? '￥' : ''
          }
          <EditableCell
            value={text}
            onChange={val => this.onCellChange(val, 'price', record.contractItemKey)}
          />
        </div>
        ),
    }, {
      title: '总价',
      dataIndex: 'total',
      width: '10%',
    }, {
      title: '订单原因',
      dataIndex: 'orderReason',
      width: 100,
      render: (text, record) => {
        return (<OrderReason
          text={text}
          record={record}
          orderReasonFlag={() => { this.props.orderReasonFlag(record.key); }}
          onChange={val => this.onCellChange(val, 'orderReason', record.contractItemKey)}
        />);
      },
    }, {
      title: '备注',
      dataIndex: 'comment',
      width: 120,
      render: (text, record) => {
        return (<Comment
          value={text}
          onChange={val => this.onCellChange(val, 'comment', record.contractItemKey)}
        />);
      },
    }, {
      title: '上传SOW附件',
      dataIndex: 'sow',
      width: 115,
      render: (text, record) => {
        return (<UploadSOW
          onChange={val => this.onCellChange(val, 'sow', record.contractItemKey)}
          entryItemKeys={record.contractItemKey}
          entryKey={this.props.entryKey}
        />);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 40,
      render: (text, record) => {
        return (
          <span
            style={{ cursor: 'pointer', color: '#F05249' }}
            onClick={() => this.onDelete(record.key, record.contractItemKey)}
          >删除</span>
        );
      },
    }];
    this.state = {
      dataSource: this.props.contractItems,
      count: this.props.contractItems.length + 1,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: nextProps.contractItems,
      count: nextProps.contractItems.length + 1,
    });
  }
  onCellChange = (key, dataIndex, contractItemKey) => {
    if (!contractItemKey) {
      message.warning('您还没有所属商品项');
    } else if (dataIndex === 'number') {
      this.props.dispatch({
        type: 'specialApply/modifyItemQuantity',
        payload: {
          baseParam,
          params: {
            entryItemKey: contractItemKey,
            entryKey: this.props.entryKey,
            quantity: parseInt(key, 10),
          },
        },
      });
    } else if (dataIndex === 'price') {
      if (!(Number(key) > 0)) {
        message.warning('您输入的价格有误！');
      }
      const price = Number(key) > 0 ? parseFloat(key) : 0;
      this.props.dispatch({
        type: 'specialApply/updatePrice',
        payload: {
          baseParam,
          params: {
            entryItemKey: contractItemKey,
            entryKey: this.props.entryKey,
            newPrice: price.toFixed(2),
          },
        },
      });
    } else if (dataIndex === 'sow') {
      console.log(key);
      this.props.dispatch({
        type: 'specialApply/uploadItemFile',
        payload: {
          entryItemKeys: [contractItemKey],
          entryKey: this.props.entryKey,
          file: key,
        },
      });
    } else {
      let params = {
        [dataIndex]: key,
      };
      if (dataIndex === 'deliverDate') {
        params = {
          [dataIndex]: moment(key).format('YYYYMMDDHHmmssSSS'),
        };
      } else if (dataIndex === 'orderReason') {
        params = key;
      }
      this.props.dispatch({
        type: 'specialApply/updateItemInfo',
        payload: {
          baseParam,
          params: {
            ...params,
            entryItemKeys: [contractItemKey],
            entryKey: this.props.entryKey,
          },
        },
      });
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
        type: 'specialApply/deleteItems',
        payload: {
          baseParam,
          params: {
            entryItemKeys: [itemKey],
            entryKey: this.props.entryKey,
          },
        },
      });
    }
  }
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div style={{ padding: '10px 0 20px' }}>
        <SelectGood />
        <Table bordered dataSource={dataSource} columns={columns} pagination={false} />
      </div>
    );
  }
}

export default EditableTable;
