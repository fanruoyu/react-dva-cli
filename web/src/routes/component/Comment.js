import React from 'react';
import { Icon, Tooltip } from 'antd';
import style from './Comment.css';

class Comment extends React.Component {
  state = {
    value: this.props.value,
    source: this.props.value,
    editable: false,
  };
  handleChange = (e) => {
    const textarea = this.refs.textarea;
    // 先设置为auto，目的为了重设高度（如果字数减少）
    textarea.style.height = 'auto';
    // 如果高度不够，再重新设置
    if (textarea.scrollHeight >= textarea.offsetHeight) {
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div style={{ width: 140 }}>
        {
          editable ?
            <div style={{ display: 'flex' }}>
              <textarea
                ref="textarea"
                className={style.textarea}
                maxLength="500"
                value={value}
                onChange={this.handleChange}
                onBlur={this.check}
              />
              <div className={style.vertical}>
                <div>
                  <Icon className={style.check} type="check" onClick={this.check} />
                  <Icon
                    className={style.close}
                    type="close" onClick={() => {
                      this.setState({ editable: false, value: this.state.source });
                    }}
                  />
                </div>
                <p style={{ textAlign: 'right' }}>{this.state.value.length}/500</p>
              </div>
            </div>
            :
            <Tooltip placement="top" title={value}>
              <div
                className={style.remarks}
                onClick={this.edit}
              >{
                value ? this.state.value : <p style={{ color: '#ccc' }}>请填写备注信息</p>
              }</div>
            </Tooltip>
        }
      </div>
    );
  }
}

export default Comment;
