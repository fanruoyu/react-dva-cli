import React from 'react';

class Dismantle extends React.Component {
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
    console.log(record);
    const splitOrder = Math.ceil(record.number / record.splitOrderBase);
    return (
      <div>
        {
          record.number >= record.splitThresholdNum ?
            <div style={{ display: 'flex', paddingLeft: '10px', height: 30 }}>
              <div
                style={{ width: '15px', height: '15px', borderRadius: '50%', border: '1px solid #ccc', margin: 'auto', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onClick={() => {
                  const value = this.state.value !== '' ? !this.state.value : !text;
                  this.setState({
                    value,
                  });
                  updateItemInfo({
                    isQuantitySplit: value ? 1 : 0,
                    entryItemKeys: [record.cartItemKey],
                  });
                }}
              >
                <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: (this.state.value === '' ? text : this.state.value) ? '#999' : 'transparent' }} />
                {this.state.value}
              </div>
              <div style={{ textAlign: 'left', transfrom: 'scale(.8)', fontSize: 10, width: 120 }}>
                {
                  text || this.state.value ?
                    <div>
                      <p>拆单后订单数量：{splitOrder}</p>
                      <p>每单商品数量：{record.splitOrderBase}</p>
                    </div> : null
                }
              </div>
            </div> :
            <div style={{ display: 'flex', paddingLeft: '10px', height: 30 }}>
              <div
                style={{ width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  background: '#ddd',
                  border: '1px solid #ccc',
                  margin: 'auto',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'not-allowed' }}
              >
                <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#aaa' }} />
              </div>
              <div style={{ width: 120 }} />
            </div>
        }
      </div>
    );
  }
}

export default Dismantle;
