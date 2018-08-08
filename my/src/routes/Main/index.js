import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Icon, Table, Button, Form, Input } from 'antd';
import { routerRedux } from 'dva/router';
import './main.less';

const { Content, Sider, Header } = Layout;
const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;
// this.props.dispatch(routerRedux.push('/StandardOrder')); // 路由跳转


class Main extends Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
    };
  }
  componentDidMount() {
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
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
        render: () => {
          return (
            <Button
              type="primary"
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            >
              Publish
            </Button>
          );
        },
      }];

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
      }];
    return (
      <Layout>
        <Header>Header</Header>
        <Layout>
          <Sider
            style={{ height: '100%', background: '#fff' }}
            breakpoint="sm"
            onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
          >
            <Menu defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1">
                <Icon type="pie-chart" />
                <span>Option 1</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="desktop" />
                <span>Option 2</span>
              </Menu.Item>
              <SubMenu
                key="sub1"
                title={<span><Icon type="user" /><span>User</span></span>}
              >
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={<span><Icon type="team" /><span>Team</span></span>}
              >
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="9">
                <Icon type="file" />
                <span>File</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content style={{ overflow: 'initial', background: '#fff', padding: '20px' }}>
            <Table columns={columns} dataSource={data} scroll={{ x: 600 }} />
            <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem hasFeedback>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                )}
              </FormItem>
              <FormItem hasFeedback>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Log in
                </Button>
              </FormItem>
            </Form>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(({ home }) => ({ home }))(Form.create()(Main));
