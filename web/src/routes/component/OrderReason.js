import React from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

class OrderReason extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
    };
  }
  render() {
    return (
      <Select
        labelInValue
        notFoundContent=""
        placeholder="选择订单原因"
        style={{ width: '100px', position: 'relative', top: 2, border: this.state.value || this.props.record.orderReason ? '' : '1px solid red', borderRadius: 3 }}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: '150px' }}
        onChange={(val) => {
          this.setState({
            value: val.key,
          });
        }}
        onFocus={() => {
          this.props.dispatch({
            type: 'specialApply/searchOrderReason',
            payload: this.props.record.group,
          });
        }}
        onBlur={(val) => {
          if (val) {
            this.props.onChange({
              orderReason: val.key,
              orderReasonDesc: val.label.split('--')[1],
            });
            this.props.orderReasonFlag();
          }
        }}
      >
        {
          this.props.specialApply.group.orderReasons && this.props.specialApply.group.orderReasons.map((item, key) => {
            return (<Select.Option value={item.reasonCode} key={key}>
              {
                item.reasonCode === '""' ?
                   item.reasonDesc :
                  `${item.reasonCode}--${item.reasonDesc}`
              }
            </Select.Option>);
          })
        }
      </Select>
    );
  }
}

export default connect(({ specialApply }) => ({ specialApply }))(OrderReason);
