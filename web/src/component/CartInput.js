import { Input, message } from 'antd';
import React from 'react';

class CartInput extends React.Component {
  constructor() {
    super();
    this.state = {
      num: null,
    };
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.text !== nextProps.text) {
      this.setState({
        num: null,
      });
    }
    return true;
  }
  modify = (val) => {
    const min = parseInt(val, 10) > (this.props.min || 0);
    const max = parseInt(val, 10) <= (this.props.max || 999999);
    if (Number(val) && min && max) {
      this.props.inputChange(val);
    } else {
      this.setState({
        num: null,
      });
      message.warning('数量不在范围内！');
    }
  }
  render() {
    return (
      <Input
        style={{ display: 'inline-block', width: 80, marginLeft: 10, marginRight: 10, textAlign: this.props.splitAverageNum ? 'left' : 'center' }}
        value={this.state.num === null ? this.props.text : this.state.num}
        disabled={this.props.disable}
        onChange={(e) => {
          this.setState({
            num: e.target.value,
          });
        }}
        onPressEnter={e => this.modify(e.target.value)}
        onBlur={e => this.modify(e.target.value)}
      />
    );
  }
}

export default CartInput;
