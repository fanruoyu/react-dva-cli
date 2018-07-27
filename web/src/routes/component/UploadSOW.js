import React from 'react';
import { Upload, message, Button, Icon } from 'antd';
import style from './Comment.css';
import { authkey, apiPrefix } from '../../utils/Constants';

const beforeUpload = (file) => {
  const isLt10M = file.size > 10485760;
  if (isLt10M) {
    message.error('File must smaller than 10MB!');
  }
  return !isLt10M;
}

class UploadSOW extends React.Component {
  constructor() {
    super();
    this.state = {
      visable: true,
    };
  }
  handleChange = (info) => {
    if (info.fileList.length === 0) {
      this.setState({ visable: true });
    } else if (info.file.response) {
      if (info.file.response.code === '0') {
        this.setState({ visable: false });
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.response.code === '1') {
        this.setState({ fileList: [] });
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  }
  render() {
    const { entryKey, entryItemKeys } = this.props;
    const props = {
      action: `${apiPrefix}/v1/specialApply/uploadItemFile?entryKey=${encodeURIComponent(entryKey)}&entryItemKeys=${encodeURIComponent(entryItemKeys)}`,
      headers: {
        Accept: 'application/json',
        'MSP-AppKey': 'FA0C4B2415AD407691074E49AA892059',
        'MSP-AuthKey': authkey,
      },
      onChange: this.handleChange,
      accept: '.docx,.doc,.pdf',
      className: style.upload,
      beforeUpload,
    };
    return (
      <div>
        <Upload {...props}>
          {
              this.state.visable ?
                <Button>
                  <Icon type="upload" /> SOW附件
                </Button> : null
          }
        </Upload>
      </div>
    );
  }
}

export default UploadSOW;
