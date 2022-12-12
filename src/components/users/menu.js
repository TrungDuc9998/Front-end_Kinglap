import React from "react";
import "./css/layout.css";
import {
  Phone,
  Mail,
  MapPin,
  DollarSign,
  User,
  Heart,
  ShoppingCart,
} from "react-feather";
import { Link, Navigate } from "react-router-dom";
import logo from "../../asset/images/LOGO LAPTOP.png";
import { useNavigate } from "react-router-dom";

const isLogin = localStorage.getItem("token");

function Menu() {
  let navigate = useNavigate();
  const yourCart = () => {
    navigate("/user/cart");
  };

  const toAdmin = () => {
    if (
      localStorage.getItem("token") == null ||
      localStorage.getItem("token") == ""
    ) {
      navigate("/login");
    } else {
      navigate("/admin/order");
    }
  };

  const yourOrder = () => {
    if (
      localStorage.getItem("token") == null ||
      localStorage.getItem("token") == ""
    ) {
      navigate("/login");
    } else {
      navigate("/user/order");
    }
  };

  const logout = () => {
    window.location.href = "/";
    localStorage.removeItem("roles");
    localStorage.removeItem("username");
    localStorage.removeItem("information");
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("carts");
  };

  const login = () => {
    navigate("/login");
  };

  return (
    <>
      <header>
        <div id="top-header">
          <div className="container">
            <ul className="nav">
              <li className="nav-item">
                <a>
                  <Phone size={14} color="red"></Phone>
                  024 7106 9999
                </a>
              </li>
              <li className="nav-item">
                <a>
                  <MapPin size={12} color="red"></MapPin>
                  125 P. Trần Đại Nghĩa, Bách Khoa, Hai Bà Trưng, Hà Nội
                </a>
              </li>
            </ul>
            <ul className="nav justify-content-end">
              <li className="nav-item">
                <Link to={"/policy"}>
                  <DollarSign size={12} color="red"></DollarSign>
                  Chính sách đổi hàng
                </Link>
              </li>
              <li className="nav-item">
                <a style={{ color: "ưhite" }} onClick={toAdmin}>
                  <DollarSign size={12} color="red"></DollarSign>
                  Quản trị
                </a>
              </li>
              <li className="nav-item">
                {isLogin ? (
                  <a onClick={logout}>
                    <User size={12} color="red"></User>
                    Đăng xuất
                  </a>
                ) : (
                  <a onClick={login}>
                    <User size={12} color="red"></User>
                    Đăng nhập
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div id="header">
          <div className="container">
            <div className="row d-flex justify-conten-center">
              <div className="col-md-3">
                <div className="header-logo">
                  <Link to="/user" className="logo1">
                    <img src={logo} alt="" className="logo_content" />
                  </Link>
                </div>
              </div>

              <div className="col-md-6">
                <div className="header-search">
                  <form>
                    <select className="input-select">
                      <option value="0">Tất cả sản phẩm</option>
                      {/* <option value="1">Category 01</option>
                                            <option value="1">Category 02</option> */}
                    </select>
                    <input className="input" placeholder="Search here" />
                    <button className="search-btn">Search</button>
                  </form>
                </div>
              </div>

              <div className="col-md-3 clearfix">
                <div className="header-ctn">
                  <div>
                    <a style={{ color: "white" }} onClick={yourOrder}>
                      <Heart></Heart>
                      <span>Hoá đơn</span>
                    </a>
                  </div>

                  <div className="">
                    <a
                      style={{ color: "white" }}
                      onClick={yourCart}
                      aria-expanded="true"
                    >
                      <ShoppingCart></ShoppingCart>
                      <span>Giỏ hàng</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Menu;
