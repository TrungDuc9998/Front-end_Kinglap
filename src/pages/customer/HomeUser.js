import React, { useEffect, useState, useContext } from "react";
import Context from "../../store/Context";
import { addToCart, setCheckoutCart, viewProduct } from "../../store/Actions";
import "./css/home.css";
import anh1 from "../../asset/images/products/shop01.png";
import anh2 from "../../asset/images/products/shop04.png";
import anh3 from "../../asset/images/products/shop03.png";

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
        notifySuccess("Th??m v??o gi??? h??ng th??nh c??ng!");
      } else {
        notifyError(
          "???? t???n t???i 10 s???n ph???m trong gi??? h??ng! Li??n h??? c???a h??ng ????? ?????t mua s??? l?????ng l???n"
        );
      }
    } else {
      dispatch(addToCart(product));
      notifySuccess("Th??m v??o gi??? h??ng th??nh c??ng!");
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
  const [product_discount, setDataProduct_Discount] = useState([
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
    searchStatus: params.pagination?.searchStatus
  });
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8,
      searchStatus: "ACTIVE"
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

  const allProWithDiscount = () => {
    fetch(`http://localhost:8080/api/products/allProWithDiscount`)
      .then((response) => response.json())
      .then((results) => {
        setDataProduct_Discount(results.data)
      })
  }


  //LoadList
  useEffect(() => {
    getData();
  }, [JSON.stringify(tableParams)]);
  const carts = JSON.parse(localStorage.getItem("carts"));
  // console.log("c:", carts);
  useEffect(() => {
    allProWithDiscount();
  }, []);

  console.log(product_discount);

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
                    B??? s??u t???p
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
                    Ph??? ki???n
                    <br />
                    B??? s??u t???p
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
                  <img src={anh2} alt="" />
                </div>
                <div className="shop-body">
                  <h3>
                    Laptop Gaming
                    <br />
                    B??? s??u t???p
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
                <h3 className="title">S???n ph???m m???i</h3>
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
                                <a>{pro.name}</a>
                              </h3>
                              <h4 className="product-price">{formatCash(Math.ceil(pro.price) + "")} VN?? {pro.discount ? <del className="product-old-price">{formatCash(Math.ceil(pro.price / ((100 - pro.discount.ratio) / 100)) + "")} VN??</del> : ""}</h4>
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
                                  <ShoppingCart size={18}></ShoppingCart> Th??m
                                  v??o gi??? h??ng
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

      <div id="hot-deal" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="hot-deal">
                <ul className="hot-deal-countdown">
                  <li>
                    <div>
                      <h3>02</h3>
                      <span>Ng??y</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>10</h3>
                      <span>Gi???</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>34</h3>
                      <span>Ph??t</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>60</h3>
                      <span>Gi??y</span>
                    </div>
                  </li>
                </ul>
                <h2 className="text-uppercase">HOT DEAL TU???N N??Y</h2>
                <p>B??? s??u t???p m???i GI???M GI?? t???i 50%</p>
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
                <h3 className="title">S???n ph???m</h3>
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
                                  <h4 className="product-price">{formatCash(Math.ceil(pro.price) + "")} VN?? {pro.discount ? <del className="product-old-price">{formatCash(Math.ceil(pro.price / ((100 - pro.discount.ratio) / 100)) + "")} VN??</del> : ""}</h4>

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
                                      Th??m v??o gi??? h??ng
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

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">S???n ph???m gi???m gi??</h3>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row">
                <div className="products-tabs">
                  <div id="tab1" className="tab-pane active">
                    <div className="products-slick" data-nav="#slick-nav-1">
                      <Row gutter={10}>
                        {product_discount
                          ? product_discount.map((pro) => (
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
                                  <h4 className="product-price">{formatCash(Math.ceil(pro.price) + "")} VN?? {pro.discount ? <del className="product-old-price">{formatCash(Math.ceil(pro.price / ((100 - pro.discount.ratio) / 100)) + "")} VN??</del> : ""}</h4>

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
                                      Th??m v??o gi??? h??ng
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
    </div>
  );
}

export default HomeUser;
