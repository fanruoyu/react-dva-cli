import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Row, Col, Input, Icon, message } from 'antd';
import styles from './Cart.css';
import Steps from '../component/Steps';
import CartInput from '../component/CartInput';
import { userId, soldToId, shoppingLink } from '../utils/Constants';

let flag = false;

class Cart extends React.Component {
  constructor() {
    super();
    this.state = {
      selectItems: [],
      emptyCart: '',
      selectedRowKeys: '',
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'cart/getCart',
      payload: {
        entryKey: '',
        soldToId,
        userId,
      },
    });
    flag = true;
  }
  // 去结算按钮
  settlement = () => {
    const arr = this.defaultSelect();
    if (arr.length > 0) {
      this.props.dispatch(routerRedux.push('/StandardOrder'));
    } else {
      message.warning('您还未选中商品！');
    }
  }
  // 默认选中的商品
  defaultSelect = () => {
    const { cartInfo } = this.props.cart;
    const arr = [];
    if (cartInfo.length > 0) {
      cartInfo.map(item => (item.isChecked ? arr.push(item.entryItemKey) : null));
    }
    return arr;
  }
  // 返回购买商品页
  returnProductDetails = () => {
    window.location.href = shoppingLink;
  }
  // 加减数量
  modifyGoodNumber = (val, number, cartItemKey) => {
    const { cartKey } = this.props.cart;
    let num = number < 1 ? 1 : number;
    if (val === '-' && number > 1) {
      num--;
    } else if (val === '+') {
      num++;
    }
    if (parseInt(num, 10) > 0 && parseInt(num, 10) <= 999999) {
      this.props.dispatch({
        type: 'cart/modifyGoodNumber',
        payload: {
          entryItemKey: cartItemKey,
          entryKey: cartKey,
          quantity: parseInt(num, 10),
        },
      });
    } else {
      message.warning('您选中商品的数量已超限！');
    }
  }
  // 删除商品
  deleteCartItems = (selectedRowKeys) => {
    const { emptyCart, selectItems } = this.state;
    const arr = this.defaultSelect();
    const cartItemKeys = [];
    selectItems.concat(arr).map((item) => {
      if (cartItemKeys.indexOf(item) === -1) {
        cartItemKeys.push(item);
      }
    });
    if (emptyCart || (selectedRowKeys.length === this.props.cart.cartInfo.length)) {
      this.props.dispatch({
        type: 'cart/deleteCartItems',
        payload: {
          entryItemKeys: [],
          entryKey: this.props.cart.cartKey,
        },
      });
    } else {
      cartItemKeys.length > 0 ?
      this.props.dispatch({
        type: 'cart/deleteCartItems',
        payload: {
          entryItemKeys: cartItemKeys,
          entryKey: this.props.cart.cartKey,
        },
      }) : message.warning('请选中商品');
      this.setState({
        selectItems: [],
      });
    }
  }
  // 选中 or 未选中 商品
  activeItems = (cartItemKeys, checked) => {
    this.props.dispatch({
      type: 'cart/activeItems',
      payload: {
        entryItemKeys: cartItemKeys,
        entryKey: this.props.cart.cartKey,
        checked,
      },
    });
  }
  // 拿到所有的itemKey
  getItemKeys = () => {
    const itemKeys = [];
    this.props.cart.cartInfo.map((item) => {
      itemKeys.push(item.entryItemKey);
    });
    return itemKeys;
  }
  render() {
    const { cartInfo, orderPriceInfo, checkedQuery, empty } = this.props.cart;
    // 行信息填写
    const columns = [{
      title: '商品',
      dataIndex: 'good',
      render: (text, record) => (<dl className={styles.dl}>
        <dt className={record.isOnline !== '0' ? '' : styles.mask}>
          <p><img src={require(`../assets/product${record.key % 2}.png`)} alt="这是一幅商品展示图" /></p>
          {
            record.isOnline === '0' ?
              <span className={styles.offshelf}>已下架</span> : null
          }
        </dt>
        <dd><span>{text}</span></dd>
      </dl>),
    }, {
      title: '单价',
      dataIndex: 'price',
      render: text => (<p style={{ width: '130px' }}>{text}</p>),
    }, {
      title: '数量',
      dataIndex: 'number',
      render: (text, record) => {
        return (<div className={styles.number}>
          <p
            onClick={() => {
              if (record.isOnline !== '0' && text > 1) {
                this.modifyGoodNumber('-', text, record.cartItemKey);
              }
            }}
          >
            <Icon
              style={{ fontSize: 18, color: text > 1 && record.isOnline !== '0' ? '#F05249' : '#ccc', cursor: text > 1 && record.isOnline !== '0' ? 'pointer' : 'not-allowed' }}
              type="minus-circle"
            />
          </p>
          {
            record.isOnline !== '0' ?
              // 未下架
              <CartInput
                text={text}
                inputChange={val => this.modifyGoodNumber('keyIn', val, record.cartItemKey)}
              /> :
              // 已下架
              <Input
                value={text}
                onChange={() => {
                  // 下架商品
                }}
                disabled
                className={styles.numberInput}
              />
          }
          <p
            onClick={() => {
              if (record.isOnline !== '0') {
                this.modifyGoodNumber('+', text, record.cartItemKey);
              }
            }}
          >
            <Icon
              style={{ fontSize: 18, color: text <= 999999 && record.isOnline !== '0' ? '#F05249' : '#ccc', cursor: text <= 999999 && record.isOnline !== '0' ? 'pointer' : 'not-allowed' }}
              type="plus-circle"
            />
          </p>
        </div>);
      },
    }, {
      title: '前返折扣',
      dataIndex: 'discount',
      render: text => (<p style={{ width: '130px' }}>{text}</p>),
    }, {
      title: '小计',
      dataIndex: 'count',
      render: text => (<p style={{ width: '130px' }}>{text}</p>),
    }];
    const rowClassName = (record) => {
      if (record.isOnline === '0') {
        return styles.disabled;
      }
    };
    // 行信息对象创建
    const data = [];
    const selectedRowKeys = [];
    if (cartInfo.length > 0) {
      cartInfo.map((item, ind) => {
        data.push({
          key: ind,
          good: item.productInfo.goodsName,
          price: `￥${item.productInfo.unitPrice}`,
          number: item.quantity,
          discount: `￥${(item.totalPolicyDiscountAmount ? item.totalPolicyDiscountAmount : 0)}`,
          count: `￥${item.actualPayAmount}`,
          flag: item.isChecked,
          cartItemKey: item.entryItemKey,
          isOnline: item.isOnline,
        });
        if (item.isChecked) {
          selectedRowKeys.push(ind);
        }
      });
    }
    // 通过 rowSelection 对象表明需要行选择
    const rowSelection = {
      onSelect: (record, selected, selectedRows) => {
        const arr = [];
        selectedRows.map((item) => {
          arr.push(item.cartItemKey);
        });
        this.setState({
          selectItems: arr,
        });
        if (selectedRows.length !== cartInfo.length) {
          this.setState({
            emptyCart: false,
          });
        } else {
          this.setState({
            emptyCart: true,
          });
        }
        this.activeItems([record.cartItemKey], selected);
      },
      onSelectAll: (emptyCart, record) => {
        const selected = [];
        record.map((item) => {
          selected.push(item.key);
        });
        this.setState({
          emptyCart,
          selectedRowKeys: selected,
        });
        this.activeItems(this.getItemKeys(), emptyCart);
      },
      onChange: (record) => {
        this.setState({
          selectedRowKeys: record,
        });
      },
      selectedRowKeys,
      // 复选框是否为选中状态
      // getCheckboxProps: record => ({
      //   disabled: record.isOnline === '0',
      // }),
    };
    return (
      <div style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', background: '#f8f8f8', padding: '5px 20px' }}>
          <Steps step={1} />
        </div>
        <div style={{ padding: '30px 60px', position: 'relative' }}>
          <span className={styles.all}>全选</span>
          <Table
            className={styles.tab}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            rowClassName={rowClassName}
            pagination={false}
          />
          {
            flag ?
              empty ?
                <Row className={styles.flex}>
                  <Col style={{ float: 'left' }}>
                    {/* <Checkbox
                      checked={this.state.emptyCart}
                      onChange={this.onChange}>全选</Checkbox> */}
                    <span
                      className={styles.seleted}
                      onClick={() => this.deleteCartItems(selectedRowKeys)}
                    >删除选中</span>
                    <span onClick={this.returnProductDetails} style={{ cursor: 'pointer' }}>继续购物</span>
                  </Col>
                  <Col style={{ float: 'right' }}>
                    <span style={{ cursor: 'pointer' }}>已选择：<b className={styles.b}>{checkedQuery || 0}</b>件商品</span>
                    <span className={styles.seleted}>
                    合计：<b className={styles.b}>
                    ￥{orderPriceInfo.totalPrice ? orderPriceInfo.totalPrice : 0}
                    </b>元
                    </span>
                    <span
                      style={{ width: 150, height: '54px', display: 'inline-block', color: '#fff', background: '#F05249', fontSize: 18, lineHeight: '54px', textAlign: 'center', marginLeft: 10, cursor: 'pointer' }}
                      onClick={this.settlement}
                    >去结算
                    </span>
                  </Col>
                </Row> :
                <Row className={styles.emptyCart}>
                  <img src={require('../assets/buycart.png')} alt="空购物车图片" />
                  <p style={{ padding: '0 10px', fontSize: 16 }}>您的购物车内暂无商品，您可以</p>
                  <div className={styles.btnWrap}>
                    <button
                      className={styles.emptyCartBtn}
                      onClick={this.returnProductDetails}
                    >选购商品</button>
                  </div>
                </Row>
            : null
          }
        </div>
      </div>
    );
  }
}

export default connect(({ cart }) => ({ cart }))(Cart);
