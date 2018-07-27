import React from 'react';
import { connect } from 'dva';
import { Input, Button, Icon, Table } from 'antd';
import { baseParam, soldToId, userId } from '../../utils/Constants';
import ModalComponent from '../../component/ModalComponent';
import styles from './SelectGood.css';

class EditableCell extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      editable: '',
      searchValue: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }
  cellChange = (val) => {
    const searchValue = val.target.value;
    this.setState({ searchValue });
  };
  search = () => {
    this.props.dispatch({
      type: 'specialApply/searchGood',
      payload: {
        MTMCode: this.state.searchValue.trim(),
        soldtoPartnerId: soldToId,
      },
    });
  }
  hide = () => {
    this.setState({ editable: false });
  }
  edit = () => {
    this.setState({ editable: true });
  }
  add = (val, info) => {
    if (this.props.specialApply.goodArr.length === 1) {
      this.hide();
    }
    this.setState({ value: val });
    this.props.dispatch({
      type: 'specialApply/addGood',
      payload: {
        baseParam,
        params: {
          checked: true,
          goodsId: info.goodsId,
          materialNumber: info.materialNumber,
          prodGroup: info.productGroupNO,
          productType: info.productType,
          quantity: 1,
          salesChannel: info.salesChannel,
          salesOrg: info.salesOrg,
          soldToId,
          userId,
        },
      },
    });
  }
  render() {
    const { editable } = this.state;
    const modal = {
      title: '选择商品',
      width: 800,
      visible: editable,
      btn: ['取消'],
      hideModal: () => {
        this.hide();
      },
      hideModalOk: () => {
        this.hide();
      },
    };
    const columns = [{
      title: 'MTM编号',
      dataIndex: 'mtm',
    }, {
      title: '商品名称',
      dataIndex: 'name',
    }, {
      title: '产品组',
      dataIndex: 'group',
    }, {
      title: '通路',
      dataIndex: 'access',
    }, {
      title: 'ATS周期',
      dataIndex: 'ats',
      render: () => (
        <div className={styles.ats}>
          <span />
          <span />
          <span />
        </div>
      ),
    }, {
      title: '价格',
      dataIndex: 'price',
    }, {
      title: '操作',
      render: (text, record) => (
        <span
          className={styles.add}
          onClick={() => this.add(record.mtm, record.info)}
        >添加</span>
      ),
    }];
    const data = [];
    if (this.props.specialApply.goodArr.length > 0) {
      this.props.specialApply.goodArr.map((item, ind) => {
        data.push({
          key: ind,
          mtm: item.materialNumber,
          name: item.goodsName,
          group: item.productGroupNO ? item.productGroupNO : '',
          access: item.salesChannel ? item.salesChannel : '',
          price: `￥${item.price}`,
          info: item,
        });
      });
    }
    const pagination = {
      pageSize: 4,
    };
    return (
      <div>
        <Button type="primary" onClick={this.edit}>添加商品</Button>
        {
          editable ?
            <ModalComponent {...modal}>
              <Input
                className={styles.input}
                placeholder="请输入商品MTM编号"
                onChange={this.cellChange}
                onPressEnter={this.search}
              />
              <Button
                type="check"
                onClick={this.search}
              >搜索</Button>
              <Table className={styles.table} columns={columns} dataSource={data} pagination={pagination} />
            </ModalComponent>
            : null
        }
      </div>
    );
  }
}

export default connect(({ specialApply }) => ({ specialApply }))(EditableCell);
