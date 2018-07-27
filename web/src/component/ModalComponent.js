import React from 'react';
import { Button, Modal } from 'antd';

class ModalComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      modalObj: {
        width: 600,
        title: '查询收货地址',
        btn: ['取消', '确定'],
        loadingFlag: false,
      },
    };
  }
  // 关闭的按钮
  handleOk = () => {
    const modalKey = this.props.modalKey;
    const flag = typeof this.props.loadingFlag === 'boolean' ? this.props.loadingFlag : this.state.modalObj.loadingFlag;
    if (flag) {
      this.handleOkLoad(modalKey);
    } else {
      this.props.hideModalOk(modalKey);
    }
  }
  // 带loading的提交
  handleOkLoad = (val) => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.hideModalOk(val);
    }, 3000);
  }
  render() {
    const { loading, modalObj } = this.state;
    const modal = Object.assign(modalObj, this.props);
    const {
      width,
      title,
      modalKey,
      visible,
      btn,
      hideModal,
    } = modal;
    return (
      <Modal
        width={width}
        style={{ top: 40 }}
        visible={visible}
        title={title}
        onCancel={() => {
          hideModal(modalKey);
        }}
        footer={
          btn[1] ?
          [
            <Button
              key="back" size="large"
              onClick={() => { hideModal(modalKey); }}
            >{btn[0]}</Button>,
            <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
              {btn[1]}
            </Button>,
          ] :
          [
            <Button
              key="back" size="large"
              onClick={() => { hideModal(modalKey); }}
            >{btn[0]}</Button>,
          ]
        }
      >
        {/* 插槽 */}
        {this.props.children}
      </Modal>
    );
  }
}

export default ModalComponent;
