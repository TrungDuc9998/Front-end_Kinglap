import Category from "../pages/Category";
import Home from "../pages/Home";
import Order from "../pages/Order/Order";
import CreateProduct from "../pages/Product/CreateProduct";
import Product from "../pages/Product/Product";
import User from "../pages/User/User";
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
    path: "/admin/user",
    component: User,
  },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

