import "../../../App.css";
import "antd/dist/antd.css";
import logo from "../../../asset/images/logo_kinglap.png";

import {
  AppstoreOutlined,
  BarChartOutlined,
  DesktopOutlined,
  FileDoneOutlined,
  FileOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  ReloadOutlined,
  StockOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header1 } from "./Header";
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
  getItem("Trang chủ", "/admin/statistical", <PieChartOutlined />),
  getItem("Quản lý dịch vụ", "/admin/discount", <FileDoneOutlined />),
  getItem("Quản lý sản phẩm", "sub1",<AppstoreOutlined />, [
    getItem("Quản lý thể loại", "/admin/category"),
    getItem("Danh sách sản phẩm", "/admin/product"),
    getItem("Tạo sản phẩm", "/admin/product/create"),
    getItem("Quản lý linh kiện", "/admin/accessories"),
    getItem("Sản phẩm tồn kho", "/admin/product/inventory"),
  ]),
  getItem("Quản đơn hàng", "sub2", <OrderedListOutlined />, [
    getItem("Quản lý đơn đặt hàng", "/admin/order"),
    getItem("Xác nhận đơn hàng", "/admin/order/confirm"),
    getItem("Đơn hàng chờ lấy hàng", "/admin/order/wait"),
    getItem("Đơn hàng đang giao", "/admin/order/delivering"),
    getItem("Đơn hàng đã nhận", "/admin/order/success"),
    getItem("Đơn hàng đã huỷ", "/admin/order/cancel"),
  ]),
  getItem("Quản lý hệ thống", "sub3", <TeamOutlined />, [
    getItem("Quản lý người dùng", "/admin/user"),
    getItem("Quản lý nhân viên", "/admin/staff"),
    getItem("Quản lý vai trò", "/admin/setting/role"),
  ]),
  getItem("Yêu cầu hỗ trợ", "sub4", <ReloadOutlined />, [
    getItem("Yêu cầu đổi hàng", "/admin/order/exchange"),
  ]),
];

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("username") != undefined) {
      setUserName(localStorage.getItem("username"));
    }
  }, []);
  return (
    <Layout
    >
      <Sider
        style={{
          overflow: "auto",
          height: "94vh",
          // position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo">
          <Link to={"/user"}>
            <img style={{ width: "100%" }} src={logo} />
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
            textAlign: "center",
          }}
        >
          <div className="d-flex justify-content-end me-5">
            <Link to={"login"} className="acc">
              <UserSwitchOutlined
                className="me-2 ic text-light"
                style={{ fontSize: "22px" }}
              />
              <i className="text-light">
                {" "}
                {userName != undefined
                  ? "Xin chào, " + userName
                  : "Đăng nhập"}{" "}
              </i>
            </Link>
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
    </Layout>
  );
};

export default DefaultLayout;
