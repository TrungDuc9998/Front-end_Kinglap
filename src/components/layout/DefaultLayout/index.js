import '../../../App.css';

import 'antd/dist/antd.css'; 
import logo from '../../../image/4-48497_s.jpg'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        'key': key,
        'label': label,
        'icon': icon,
        'children': children
        
    }
}

function handleClick(items, index) {

    window.location.href = items[index].label;
}

const items = [
   
  getItem('/category', '1', <PieChartOutlined />),
  getItem('Quản lý tài khoản', '2', <DesktopOutlined />),
  getItem('Quản lý đơn hàng', 'sub1', <UserOutlined />, [
    getItem('Xác nhận đơn hàng', '3'),
    getItem('Đơn hàng đã đặt', '4'),
    getItem('Đơn hàng đã huỷ', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),



];

const DefaultLayout = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
        <div className="logo" />
    
        
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} menu = {items.label} >
        </Menu>
       
       
        
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        />
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
