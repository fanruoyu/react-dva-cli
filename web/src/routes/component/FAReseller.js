import React from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

class FAReseller extends React.Component {
  render() {
    return (
      <Select
        labelInValue
        notFoundContent=""
        style={{ width: '300px' }}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: '150px' }}
        onFocus={() => {
        //   this.props.dispatch({
        //     type: 'specialApply/searchOrderReason',
        //     payload: this.props.productGroupNo,
        //   });
        }}
        onBlur={(val) => {
          if (val) {
            // this.props.onChange({
            //   orderReason: val.key,
            //   orderReasonDesc: val.label.split('--')[1],
            // });
          }
        }}
      >
        {/* {
          this.props.specialApply.group.orderReasons && this.props.specialApply.group.orderReasons.map((item, key) => {
            return (<Select.Option value={item.reasonCode} key={key}>
              {`${item.reasonCode}--${item.reasonDesc}`}
            </Select.Option>);
          })
        } */}
      </Select>
    );
  }
}

export default connect(({ settlement }) => ({ settlement }))(FAReseller);
