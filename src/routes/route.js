import Home from "../pages/Home";
import Category from "../pages/Category";
import Product from "../pages/Product/Product";
import { Children, Component } from "react";
import CreateProduct from "../pages/Product/CreateProduct";
// import Statistical from '../pages/Statistical'
const publicRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/category",
    component: Category,
  },
  {
    path: "/product",
    component: Product,
  },
  {
    path: "/product/create",
    component: CreateProduct,
  },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
