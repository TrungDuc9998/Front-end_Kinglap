import Home from "../pages/Home";
import Category from "../pages/Category";
import Product from "../pages/Product/Product";
// import { Children, Component } from "react";
import CreateProduct from "../pages/Product/CreateProduct";
import Order from "../pages/Order/Order";
import Login from "../components/users/Login";
import CreateOrder from "../pages/Order/CreateOrder";
import ConfirmOrder from "../pages/Order/ConfirmOrder";
import OrderSuccess from "../pages/Order/OrderSuccess";
import OrderCancel from "../pages/Order/CancelOrder";
import SupportRT from "../pages/Support/SupportRT";
import SupportRT_detail from "../pages/Support/SupportRT_detail";
// import Statistical from '../pages/Statistical'
const publicRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/admin/category",
    component: Category,
  },
  {
    path: "/admin/product",
    component: Product,
  },
  {
    path: "/admin/product/create",
    component: CreateProduct,
  },
  {
    path: "/admin/order",
    component: Order,
  },
  {
    path: "/login",
    component: Login,
    Layout: null,
  },
  {
    path: "/admin/order/confirm",
    component: ConfirmOrder,
  },
  {
    path: "/admin/order/success",
    component: OrderSuccess,
  },
  {
    path: "/admin/order/cancel",
    component: OrderCancel,
  },
  {
    path: "/admin/order/create",
    component: CreateOrder,
  },

  {
    path: "/admin/user",
    component: User,
  },
  {
    path: "/admin/staff",
    component: Staff,
  },
  {
    path: "/admin/support/return",
    component: SupportRT,
  },
  {
    path: "/admin/support/return/detail",
    component: SupportRT_detail,
  }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
