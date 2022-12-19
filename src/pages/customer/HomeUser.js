import React, { useEffect, useState, useContext } from "react";
import Context from "../../store/Context";
import { addToCart, setCheckoutCart, viewProduct } from "../../store/Actions";
import "./css/home.css";
import anh1 from "../../asset/images/products/shop01.png";
import anh3 from "../../asset/images/products/shop02.png";

import product1 from "../../asset/images/products/product01.png";
import product2 from "../../asset/images/products/product02.png";
import product3 from "../../asset/images/products/product03.png";
import product4 from "../../asset/images/products/product04.png";
import product5 from "../../asset/images/products/product05.png";
import product6 from "../../asset/images/products/product06.png";
import product8 from "../../asset/images/products/product08.png";

import { Heart, Repeat, Eye, ShoppingCart } from "react-feather";
import { DeleteOutlined } from "@ant-design/icons";

import ProductIndex from "../customer/product/ProductIndex";
import { useSelector } from "react-redux";
import qs from "qs";

import axios from "axios";
import "toastr/build/toastr.min.css";
import toastrs from "toastr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "antd";

function HomeUser() {
  const handelCLickProduct = (product) => {
    getProductById(product.id);
  };

  const getProductById = (id) => {
    console.log('productId:', id);
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem("product_detail", JSON.stringify(res));
        navigate("/user/product")
        // dispatch(viewProduct(res));
        // console.log("state", state);
      });
  };

  let navigate = useNavigate();
  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const [state, dispatch] = useContext(Context);
  const handleAddToCart = (product) => {
    const findCart = (
      JSON.parse(localStorage.getItem("carts"))
        ? JSON.parse(localStorage.getItem("carts"))
        : []
    ).find((value) => {
      return value.id === product.id;
    });
    console.log("findCart", findCart);
    if (findCart != null) {
      if (findCart.quantity < 10) {
        dispatch(addToCart(product));
        notifySuccess("Thêm vào giỏ hàng thành công!");
      } else {
        notifyError(
          "Đã tồn tại 10 sản phẩm trong giỏ hàng! Liên hệ cửa hàng để đặt mua số lượng lớn"
        );
      }
    } else {
      dispatch(addToCart(product));
      notifySuccess("Thêm vào giỏ hàng thành công!");
    }
  };
  const handleClickAddToCart = (product) => {
    handleAddToCart(product);
  };
  const handleClickRemoveFromCart = (product) => {
    dispatch({
      type: "REMOVE_CART",
      payload: product,
    });
  };
  function formatCash(str) {
    if (str.length > 1) {
      return str
        .split("")
        .reverse()
        .reduce((prev, next, index) => {
          return (index % 3 ? next : next + ",") + prev;
        });
    } else {
      return "";
    }
  }

  const url = "http://localhost:8080/api/products";
  const [totalSet, setTotal] = useState(10);
  const [products, setData] = useState([
    {
      id: "",
      name: "",
      price: null,
      quantity: null,
      active: 1,
      imei: null,
      weight: null,
      size: null,
      debut: null,
      categoryId: null,
      images: null,
    },
  ]);
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8,
    },
  });
  //APILoadList
  const getData = () => {
    axios
      .get(url + `?${qs.stringify(getRandomuserParams(tableParams))}`)
      // .then((res) => res.json())
      .then((results) => {
        setData(results.data.data.data);
        //console.log(products[0].images[0].name)
        setTotal(results.data.data.total);
        //localStorage.setItem("products",JSON.stringify(products))
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalSet,
          },
        });
      });
  };

  //LoadList
  useEffect(() => {
    getData();
  }, [JSON.stringify(tableParams)]);
  const carts = JSON.parse(localStorage.getItem("carts"));
  console.log("c:", carts);

  // const products = useSelector(state => state.productReducer);
  // const showProducts = (products) => {
  //     let result = null;
  //     if (products.length > 0) {
  //         result = products.map((product, index) => {
  //             return <ProductIndex key={product.id} product={product}/>
  //         });
  //     }
  //     return result;
  // }
  return (
    <div>
      <ToastContainer />
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src={anh1} alt="" />
                </div>
                <div className="shop-body">
                  <h3>
                    Laptop
                    <br />
                    Bộ sưu tập
                  </h3>
                  <a href="#" className="cta-btn">
                    Mua ngay <i className="fa fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src={anh3} alt="" />
                </div>
                <div className="shop-body">
                  <h3>
                    Phụ kiện
                    <br />
                    Bộ sưu tập
                  </h3>
                  <a href="#" className="cta-btn">
                    Mua ngay <i className="fa fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src={anh1} alt="" />
                </div>
                <div className="shop-body">
                  <h3>
                    Laptop Gaming
                    <br />
                    Bộ sưu tập
                  </h3>
                  <a href="#" className="cta-btn">
                    Mua ngay <i className="fa fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Sản phẩm mới</h3>
                <div className="section-nav">
                  <ul className="section-tab-nav tab-nav">
                    <li className="active">
                      <a data-toggle="tab" href="#tab1">
                        Laptop
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="row">
                <div className="products-tabs">
                  <div id="tab1" className="tab-pane active">
                    <div className="products-slick" data-nav="#slick-nav-1">
                      <Row gutter={10}>
                        {products
                          ? products.map((pro) => (
                            <Col
                              xs={{ span: 24 }}
                              lg={{ span: 6 }}
                              md={{ span: 8 }}
                              sm={{ span: 12 }}
                            >
                              <div className="product" style={{ marginBottom: "20%" }} key={pro.id}>
                                <div className="product-img">
                                  <img
                                    src={
                                      pro.images
                                        ? pro.images[0]?.name
                                        : product1
                                    }
                                    alt=""
                                  />
                                  <div className="product-label">
                                    {pro.discount ? (<span className="sale">{pro.discount.ratio}%</span>) : ""}
                                    <span className="new">NEW</span>
                                  </div>
                                </div>
                                <div className="product-body">
                                  <h3
                                    className="product-name"
                                    onClick={() => handelCLickProduct(pro)}
                                  >
                                    <a>{pro.name}</a>
                                  </h3>
                                  <h4 className="product-price">{formatCash(Math.ceil(pro.price) + "")} VNĐ {pro.discount ? <del className="product-old-price">{formatCash(Math.ceil(pro.price / ((100 - pro.discount.ratio) / 100)) + "")} VNĐ</del> : ""}</h4>

                                </div>
                                {
                                  // carts?carts.some(p=>p.id===pro.id)?
                                  // (<div className="add-to-cart">
                                  // <button className="add-to-cart-btn" onClick={() => handleClickRemoveFromCart(pro)} ><DeleteOutlined size={18}></DeleteOutlined> remove from cart</button>
                                  //  </div>):
                                  // (<div className="add-to-cart">
                                  // <button className="add-to-cart-btn" onClick={() => handleClickAddToCart(pro)} ><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                  //  </div>):
                                  <div className="add-to-cart">
                                    <button
                                      className="add-to-cart-btn"
                                      onClick={() =>
                                        handleClickAddToCart(pro)
                                      }
                                    >
                                      <ShoppingCart size={18}></ShoppingCart>{" "}
                                      Thêm vào giỏ hàng
                                    </button>
                                  </div>
                                }
                              </div>
                            </Col>
                          ))
                          : ""}
                      </Row>
                    </div>
                    <div id="slick-nav-1" className="products-slick-nav"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="hot-deal" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="hot-deal">
                <ul className="hot-deal-countdown">
                  <li>
                    <div>
                      <h3>02</h3>
                      <span>Ngày</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>10</h3>
                      <span>Giờ</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>34</h3>
                      <span>Phút</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>60</h3>
                      <span>Giây</span>
                    </div>
                  </li>
                </ul>
                <h2 className="text-uppercase">HOT DEAL TUẦN NÀY</h2>
                <p>Bộ sưu tập mới GIẢM GIÁ tới 50%</p>
                <a className="primary-btn cta-btn" href="#">
                  Mua ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">Sản phẩm</h3>
              </div>
            </div>

            <div className="col-md-12">
              <div className="row">
                <div className="products-tabs">
                  <div id="tab2" className="tab-pane fade in active">
                    <div className="products-slick" data-nav="#slick-nav-2">
                      {products
                        ? products.map((pro) => (
                          <div className="product" key={pro.id}>
                            <div className="product-img sp">
                              <img
                                src={
                                  pro.images ? pro.images[0]?.name : product1
                                }
                                alt=""
                              />
                              <div className="product-label">
                                {pro.discount ? (<span className="sale">{pro.discount.ratio}%</span>) : ""}
                                <span className="new">NEW</span>
                              </div>
                            </div>
                            <div className="product-body">
                              <h3
                                className="product-name"
                                onClick={() => handelCLickProduct(pro)}
                              >
                                <a href="/user/product">{pro.name}</a>
                              </h3>
                              <h4 className="product-price">{formatCash(Math.ceil(pro.price) + "")} VNĐ {pro.discount ? <del className="product-old-price">{formatCash(Math.ceil(pro.price / ((100 - pro.discount.ratio) / 100)) + "")} VNĐ</del> : ""}</h4>
                            </div>
                            {
                              // carts?carts.some(p=>p.id===pro.id)?
                              // (<div className="add-to-cart">
                              // <button className="add-to-cart-btn" onClick={() => handleClickRemoveFromCart(pro)} ><DeleteOutlined size={18}></DeleteOutlined> remove from cart</button>
                              //  </div>):
                              // (<div className="add-to-cart">
                              // <button className="add-to-cart-btn" onClick={() => handleClickAddToCart(pro)} ><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                              //  </div>):
                              <div className="add-to-cart">
                                <button
                                  className="add-to-cart-btn"
                                  onClick={() => handleClickAddToCart(pro)}
                                >
                                  <ShoppingCart size={18}></ShoppingCart> Thêm
                                  vào giỏ hàng
                                </button>
                              </div>
                            }
                          </div>
                        ))
                        : ""}
                    </div>
                    <div id="slick-nav-2" className="products-slick-nav"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-xs-6">
              <div className="section-title">
                <h4 className="title">Top selling</h4>
                <div className="section-nav">
                  <div id="slick-nav-3" className="products-slick-nav"></div>
                </div>
              </div>

              <div className="products-widget-slick" data-nav="#slick-nav-3">
                <div>
                  <div className="product-widget">
                    <div className="product-img">
                      <img src={product1} alt="" />
                    </div>
                    <div className="product-body">
                      <p className="product-category">Category</p>
                      <h3 className="product-name">
                        <a href="#">product name goes here</a>
                      </h3>
                      <h4 className="product-price">
                        $980.00 <del className="product-old-price">$990.00</del>
                      </h4>
                    </div>
                  </div>
y

                  <div className="product-widget">
                    <div className="product-img">
                      <img src={product8} alt="" />
                    </div>
                    <div className="product-body">
                      <p className="product-category">Category</p>
                      <h3 className="product-name">
                        <a href="#">product name goes here</a>
                      </h3>
                      <h4 className="product-price">
                        $980.00 <del className="product-old-price">$990.00</del>
                      </h4>
                    </div>
                  </div>

                  <div className="product-widget">
                    <div className="product-img">
                      <img src={product2} alt="" />
                    </div>
                    <div className="product-body">
                      <p className="product-category">Category</p>
                      <h3 className="product-name">
                        <a href="#">product name goes here</a>
                      </h3>
                      <h4 className="product-price">
                        $980.00 <del className="product-old-price">$990.00</del>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="section-title">
                <h4 className="title">Top selling</h4>
                <div className="section-nav">
                  <div id="slick-nav-4" className="products-slick-nav"></div>
                </div>
              </div>

              <div className="products-widget-slick" data-nav="#slick-nav-4">
                <div>
                  <div className="product-widget">
                    <div className="product-img">
                      <img src={product4} alt="" />
                    </div>
                    <div className="product-body">
                      <p className="product-category">Category</p>
                      <h3 className="product-name">
                        <a href="#">product name goes here</a>
                      </h3>
                      <h4 className="product-price">
                        $980.00 <del className="product-old-price">$990.00</del>
                      </h4>
                    </div>
                  </div>

                  <div className="product-widget">
                    <div className="product-img">
                      <img src={product5} alt="" />
                    </div>
                    <div className="product-body">
                      <p className="product-category">Category</p>
                      <h3 className="product-name">
                        <a href="#">product name goes here</a>
                      </h3>
                      <h4 className="product-price">
                        $980.00 <del className="product-old-price">$990.00</del>
                      </h4>
                    </div>
                  </div>

                  <div className="product-widget">
                    <div className="product-img">
                      <img src={product6} alt="" />
                    </div>
                    <div className="product-body">
                      <p className="product-category">Category</p>
                      <h3 className="product-name">
                        <a href="#">product name goes here</a>
                      </h3>
                      <h4 className="product-price">
                        $980.00 <del className="product-old-price">$990.00</del>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="section-title">
                <h4 className="title">Top selling</h4>
                <div className="section-nav">
                  <div id="slick-nav-5" className="products-slick-nav"></div>
                </div>
              </div>

              <div className="products-widget-slick" data-nav="#slick-nav-5">
                <div>
                  <div className="product-widget">
                    <div className="product-img">
                      <img src={product1} alt="" />
                    </div>
                    <div className="product-body">
                      <p className="product-category">Category</p>
                      <h3 className="product-name">
                        <a href="#">product name goes here</a>
                      </h3>
                      <h4 className="product-price">
                        $980.00 <del className="product-old-price">$990.00</del>
                      </h4>
                    </div>
                  </div>

                  <div className="product-widget">
                    <div className="product-img">
                      <img src={product2} alt="" />
                    </div>
                    <div className="product-body">
                      <p className="product-category">Category</p>
                      <h3 className="product-name">
                        <a href="#">product name goes here</a>
                      </h3>
                      <h4 className="product-price">
                        $980.00 <del className="product-old-price">$990.00</del>
                      </h4>
                    </div>
                  </div>

                  <div className="product-widget">
                    <div className="product-img">
                      <img src={product3} alt="" />
                    </div>
                    <div className="product-body">
                      <p className="product-category">Category</p>
                      <h3 className="product-name">
                        <a href="#">product name goes here</a>
                      </h3>
                      <h4 className="product-price">
                        $980.00 <del className="product-old-price">$990.00</del>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeUser;
