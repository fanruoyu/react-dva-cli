import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class TypeSelect extends React.Component {
  render() {
    const {
        typeValue,
        deliver,
      } = this.props;
    return (
      <Select
        placeholder="请选择配送方式"
        value={typeValue}
        style={{ width: 300 }}
        onChange={val => deliver(val)}
      >
        <Option value="0">联想标准运输</Option>
        <Option value="1">自提</Option>
      </Select>
    );
  }
  }

export default TypeSelect;

