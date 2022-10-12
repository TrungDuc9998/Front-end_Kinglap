import "../../../App.css";
import "antd/dist/antd.css";
import logo from '../../../asset/images/logo_kinglap.png';

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key: key,
    label: label,
    icon: icon,
    children: children,
  };
}
const items = [
  getItem("Trang chủ", "/", <PieChartOutlined />),
  getItem("Quản lý dịch vụ", "/dichvu", <PieChartOutlined />),
  getItem("Quản lý sản phẩm", "sub1", <UserOutlined />, [
    getItem("Quản lý thể loại", "/admin/category"),
    getItem("Danh sách sản phẩm", "/admin/product"),
    getItem("Tạo sản phẩm", "/admin/product/create"),
  ]),
  getItem("Quản đơn hàng", "sub2", <UserOutlined />, [
    getItem("Quản lý đơn đặt hàng", "/admin/order"),
    getItem("Xác nhận đơn hàng", "/admin/order1"),
    getItem("Đơn hàng đã đặt", "/admin/order/checked"),
    getItem("Đơn hàng đã huỷ", "/admin/order/cancel"),
  ]),
  getItem("Quản lý hệ thống", "sub3", <TeamOutlined />, [
    getItem("Quản lý người dùng", "/admin/setting/user"),
    getItem("Quản lý nhân viên", "/admin/setting/employee"),
    getItem("Quản lý vai trò", "/admin/setting/role"),
  ]),
  getItem("Yêu cầu hỗ tợ", "sub4", <UserOutlined />, [
    getItem("Yêu cầu trả hàng", "/admin/order"),
    getItem("Yêu cầu đổi hàng", "/admin/order/checked"),
  ]),
  getItem("Thống kê", "/statistical", <FileOutlined />),
];

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" >
          <Link to={'/'}>
            <img src={logo} className="logo-content" />
          </Link>
        </div>
        <Menu
          theme="dark"
          defaultValue={[items.label]}
          mode="inline"
          items={items}
          onClick={({ key }) => {
            navigate(key);
          }}
        ></Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            textAlign: "center"
          }}>
          <div className="d-flex justify-content-end me-5">
            <Link to={'login'} className="acc"><UserSwitchOutlined className="me-2 ic" style={{ fontSize: '22px' }} />Đăng nhập</Link>
          </div>
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          {/* <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
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
        {/* <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©2022 Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout >
  );
};

export default DefaultLayout;
