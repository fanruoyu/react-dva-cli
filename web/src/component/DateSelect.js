import React from 'react';
import { DatePicker } from 'antd';
import 'moment/locale/zh-cn';
import moment from 'moment';

moment.locale('zh-cn');

class DateSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
    };
  }
  // 默认显示日期
  disabledDate = (current) => {
    // 今天及今天之前不可选择
    return current && current.valueOf() < Date.now();
  }
   // 结束日期
   endDate = (startValue) => {
    const endValue = this.props.entryEndTime;
    if (!startValue || !endValue) {
      return false;
    }
    return (startValue + 86400000).valueOf() > endValue.valueOf();
  }
  // 结束日期
  startDate = (endValue) => {
    const startValue = this.props.startTime;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
  render() {
    return (
      <div>
        {
          this.props.time ?
            <DatePicker
              allowClear={false}
              style={{ width: this.props.width || 300 }}
              format="YYYY-MM-DD"
              value={moment(new Date(parseInt(this.state.value || this.props.time || new Date().getTime(), 10)).toLocaleDateString(), 'YYYY-MM-DD ')}
              placeholder="请选择供货日期"
              disabledDate={
                this.props.disableDate ? this.disabledDate :
                  this.props.dateName === 'entryEndTime' ? this.startDate : this.endDate
              }
              onChange={(date) => {
                const time = new Date(date._d).getTime();
                this.setState({
                  value: time,
                });
                this.props.dateChange(time, this.props.dateName);
              }}
            /> :
            <DatePicker
              allowClear={false}
              disabled
              style={{ width: this.props.width || 300 }}
              format="YYYY-MM-DD"
              value={moment(new Date(parseInt(this.state.value || this.props.time || new Date().getTime(), 10)).toLocaleDateString(), 'YYYY-MM-DD ')}
              placeholder="请选择供货日期"
            />
        }
      </div>
    );
  }
}

export default DateSelect;
