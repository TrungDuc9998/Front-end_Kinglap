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
import User from "../pages/User/User";
import Discount from "../pages/Discount";
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
    path: "/admin/discount",
    component: Discount,
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
  }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };