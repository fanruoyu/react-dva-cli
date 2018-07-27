import React from 'react';
import { message } from 'antd';

class MoreAddress extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
    };
  }
  render() {
    const {
        text,
        record,
        updateItemInfo,
    } = this.props;
    return (
      <div
        style={{ width: '15px', height: '15px', borderRadius: '50%', border: '1px solid #ccc', margin: 'auto', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        onClick={() => {
          if (text !== undefined) {
            this.setState({
              value: this.state.value !== '' ? !this.state.value : !text,
            });
            updateItemInfo({
              isMultiAddress: this.state.value !== '' ? !this.state.value : !text,
              entryItemKeys: [record.cartItemKey],
            });
          } else {
            message.warning('您还没有添加商品！');
          }
        }}
      >
        <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: (this.state.value === '' ? text : this.state.value) ? '#999' : 'transparent' }} />
        {this.state.value}
      </div>
    );
  }
}

export default MoreAddress;
