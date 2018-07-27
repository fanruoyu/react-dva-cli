import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Radio, Input, Modal } from 'antd';

const RadioGroup = Radio.Group;
const Search = Input.Search;

class AddressModal extends React.Component {
  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      width: '450px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    };
    const addressIcon = {
      position: 'absolute',
      top: -7,
      right: -60,
      lineHeight: '10px',
      padding: 3,
      border: '1px solid #F05249',
      color: '#F05249',
      borderRadius: 3,
    };
    const radioStyles = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const {
        visible,
        value,
        inputValue,
        addressArr,
        addressCommontext,
        shipToInfoStr,
        addressInfo,
        hideModal,
        hideModals,
        searchAddress,
        addressChange,
        addressCommon,
        showModal,
      } = this.props;
    return (
      <div style={{ marginTop: 20 }}>
        <p style={{ borderBottom: '3px solid #eee', lineHeight: '30px', marginBottom: 10, fontSize: this.props.range === 'specialApply' ? '14px' : '12px' }}><b>{this.props.range === 'specialApply' ? '选择收货地址：' : '收货地址：'}</b></p>
        {
          this.props.range === 'specialApply' ?
            <p style={{ color: 'red', fontSize: '12px' }}>
              <b style={{ position: 'relative', top: 3, margin: '0 5px', fontSize: 16 }}>*</b>
              如果需要收货到不同地址，需分别提交特殊政策合同
              <b style={{ position: 'relative', top: 3, margin: '0 5px', fontSize: 16 }}>*</b>
            </p> : null
        }
        <RadioGroup
          onChange={e => addressCommon(e)}
          value={addressArr.length > 0 ?
            addressCommontext : shipToInfoStr}
        >
          {
              addressArr.length > 0 ?
              addressArr.map((item, ind) => (
                <Radio key={ind} style={radioStyles} value={item}>
                  {item}
                  {
                      ind === 0 ? <span style={{ position: 'relative' }}><span style={addressIcon}>默认地址</span></span> : null
                  }
                </Radio>
              )) :
              <Radio style={radioStyles} value={shipToInfoStr}>
                {shipToInfoStr}
                <span style={{ position: 'relative' }}><span style={addressIcon}>默认地址</span></span>
              </Radio>
          }
        </RadioGroup>
        <Search
          placeholder="请输入收货地址"
          style={{ width: '400px', marginTop: 10, display: 'block' }}
          onClick={showModal}
          onSearch={showModal}
        />
        <Modal
          title="查询收货地址"
          visible={visible}
          onOk={hideModal}
          onCancel={hideModals}
          okText="确定"
          cancelText="取消"
        >
          <Search
            placeholder="请输入收货地址"
            style={{ width: '100%' }}
            onSearch={val => searchAddress(val)}
          />
          <Scrollbars style={{ height: 300, padding: '10px 0' }}>
            <RadioGroup onChange={e => addressChange(e)} value={value}>
              {
                  addressInfo.map((item, ind) => {
                    if (item.indexOf(inputValue) !== -1) {
                      return (<Radio style={radioStyle} key={ind} value={ind}>
                        {item}
                      </Radio>);
                    }
                  })
              }
            </RadioGroup>
          </Scrollbars>
        </Modal>
      </div>
    );
  }
  }

export default AddressModal;

