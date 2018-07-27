import React from 'react';
import { Input, Icon, message } from 'antd';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    source: this.props.value,
    editable: false,
  };
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    const val = parseInt(this.state.value, 10);
    if (this.props.onChange) {
      if (val || val === 0) {
        if (val > 999999 || val <= 0) {
          this.setState({ value: this.state.source });
          message.warning('您输入的数量不在范围内！');
        } else {
          this.props.onChange(this.state.value);
        }
      } else {
        this.setState({ value: this.state.source });
        message.warning('请您输入数字！');
      }
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div>
        {
          editable ?
            <div>
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                onClick={this.check}
              />
            </div>
            :
            <div>
              {value || ' '}
              <Icon
                type="edit"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}

export default EditableCell;
