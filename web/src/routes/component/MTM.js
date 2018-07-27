import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash.debounce';
import { userId, soldToId } from '../../utils/Constants';

const Option = Select.Option;

class MTM extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }
  state = {
    data: [],
    value: '',
  }
  fetchUser = (value) => {
    this.props.dispatch({
      type: 'settlement/searchGoods',
      payload: {
        materialNumber: value,
        distribChnls: this.props.soldToInfo.channel,
        productGroups: this.props.soldToInfo.productGroup,
        salesOrgs: this.props.soldToInfo.salesOrg,
      },
    });
    // this.lastFetchId += 1;
    // const fetchId = this.lastFetchId;
    // this.setState({ fetching: true });
    // fetch('https://randomuser.me/api/?results=5')
    //   .then(response => response.json())
    //   .then((body) => {
    //     if (fetchId !== this.lastFetchId) { // for fetch callback order
    //       return;
    //     }
    //     const data = body.results.map(user => ({
    //       text: `${user.name.first} ${user.name.last}`,
    //       value: user.login.username,
    //       fetching: false,
    //     }));
    //     this.setState({ data });
    //   });
  }
  handleChange = (value) => {
    this.setState({
      value: value.indexOf('~~') !== -1 ? value.split('~~')[1] : value,
    });
  }
  // 添加商品
  addProduct = (val) => {
    this.props.noRender();
    const {
      materialNumber,
      productGroup,
      distribChnl,
      salesOrg,
    } = this.props.goodArr[val.split('~~')[0]];
    const productInfo = {
      materialNumber,
      prodGroup: productGroup,
      salesChannel: distribChnl,
      salesOrg,
    };
    this.props.dispatch({
      type: 'settlement/addProduct',
      payload: {
        ...productInfo,
        checked: true,
        quantity: 1,
        soldToId,
        userId,
      },
    });
  }
  render() {
    const { fetching, value } = this.state;
    const data = [];
    if (this.props.goodArr.length > 0) {
      this.props.goodArr.map((item, ind) => {
        data.push({
          text: `${ind}~~${item.materialNumber}`,
          value: `mtm:${item.materialNumber}~~name:${item.materialChDescription}`,
        });
      });
    }
    return (
      <div>
        {
          this.props.record.mtm ?
            this.props.record.mtm :
            <Select
              mode="combobox"
              value={value || this.props.record.mtm}
              dropdownMatchSelectWidth={false}
              notFoundContent={fetching ? <Spin size="small" /> : null}
              filterOption={false}
              onFocus={() => { this.props.noRender(); }}
              onSearch={this.fetchUser}
              onChange={this.handleChange}
              onSelect={this.addProduct}
              style={{ width: '100%' }}
            >
              {data.map(d => <Option key={d.text}>{d.value}</Option>)}
            </Select>
        }
      </div>
    );
  }
}

export default MTM;
