import React, { Component } from 'react';
import { Table, Button, Upload, message, Icon } from 'antd';
import './table.less';
import reqwest from 'reqwest';

class TableCont extends Component {
  constructor() {
    super();
    this.state = {
      fileList: [],
      uploading: false,
    };
  }
  one = () => {
    return (
      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <Button type="primary" size="small" style={{ marginBottom: 5 }}>出租</Button>
        <Button type="primary" size="small" style={{ marginBottom: 5 }}>编辑</Button>
        <Button type="primary" size="small" style={{ marginBottom: 5 }}>删除</Button>
        <Button type="danger"size="small" >设置为闲置</Button>
      </p>
    );
  }
  two = () => {
    return (
      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <Button type="primary" size="small" style={{ marginBottom: 5 }}>退租</Button>
        <Button type="primary" size="small" style={{ marginBottom: 5 }}>编辑</Button>
        <Button type="primary" size="small" style={{ marginBottom: 5 }}>删除</Button>
        <Button type="danger"size="small" >设置为闲置</Button>
      </p>
    );
  }
  three = () => {
    return (
      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <Button type="danger"size="small" >设置为闲置</Button>
      </p>
    );
  }
  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });
    console.log(this.state.fileList, 'fileList');
    // You can use any AJAX library you like
    reqwest({
      url: '//jsonplaceholder.typicode.com/posts/',
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        message.success('upload successfully.');
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      },
    });
  }
  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      }, {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      }, {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <div>
            {
              record.name === 'John Brown' ? this.one() : (record.name === 'Jim Green' ? this.two() : this.three())
            }
          </div>
        ),
      },
    ];

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
      }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
      }, {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
    ];

    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };
    return (
      <div>
        <Table
          columns={columns} // th
          dataSource={data} // data
          pagination={false} // 是否显示分页
          bordered // 边框
          rowKey={record => record.key}
          loading={false}  // 设置loading
        />
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
        <Button
          className="upload-demo-start"
          type="primary"
          onClick={this.handleUpload}
          disabled={this.state.fileList.length === 0}
          loading={this.state.uploading}
        >
          {this.state.uploading ? 'Uploading' : 'Start Upload' }
        </Button>
      </div>
    );
  }
}

export default TableCont;
