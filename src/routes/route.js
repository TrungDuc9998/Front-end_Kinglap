import Home from "../pages/Home";
import Category from "../pages/Category";
import Product from "../pages/Product/Product";
import { Children, Component } from "react";
import CreateProduct from "../pages/Product/CreateProduct";
import Order from "../pages/Order/Order";
import Discount from "../pages/Tag/Discount";
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
    path: "/admin/discount",
    component: Discount,
  },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
