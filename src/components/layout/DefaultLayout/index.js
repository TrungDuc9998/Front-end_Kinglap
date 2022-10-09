import "../../../App.css";

import "antd/dist/antd.css";
import logo from "../../../image/4-48497_s.jpg";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
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
  getItem("Quản lý thể loại", "/category", <DesktopOutlined />),
  // getItem("Quản lý sản phẩm", "/product", <DesktopOutlined />),
  getItem("Quản lý sản phẩm", "sub1", <UserOutlined />, [
    getItem("Danh sách sản phẩm", "/product"),
    getItem("Tạo sản phẩm", "/product/create"),
    // getItem("Đơn hàng đã huỷ", "/order/cancel"),
  ]),
  getItem("Quản đơn hàng", "sub3", <UserOutlined />, [
    getItem("Xác nhận đơn hàng", "/order"),
    getItem("Đơn hàng đã đặt", "/order/checked"),
    getItem("Đơn hàng đã huỷ", "/order/cancel"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
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
        <div className="logo" />
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
          }}
        />
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
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©2022 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
