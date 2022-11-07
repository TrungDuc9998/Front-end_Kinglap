import React, { useEffect, useState, useContext } from "react";
import Context from '../../store/Context';
import { addToCart, setCheckoutCart } from "../../store/Actions";
import './css/home.css';
import anh1 from '../../asset/images/products/shop01.png'
import anh3 from '../../asset/images/products/shop02.png'

import product1 from '../../asset/images/products/product01.png'
import product2 from '../../asset/images/products/product02.png'
import product3 from '../../asset/images/products/product03.png'
import product4 from '../../asset/images/products/product04.png'
import product5 from '../../asset/images/products/product05.png'
import product6 from '../../asset/images/products/product06.png'
import product8 from '../../asset/images/products/product08.png'

import { Heart, Repeat, Eye, ShoppingCart } from 'react-feather';
import {
    DeleteOutlined
} from "@ant-design/icons";

import ProductIndex from '../customer/product/ProductIndex'
import { useSelector } from "react-redux";
import qs from "qs";

import axios from "axios";
import 'toastr/build/toastr.min.css';
import toastrs from "toastr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const products = [
//     {
//         id: 1,
//         name: 'Sản phẩm 1',
//         price: '15.000.000'
//     },
//     {
//         id: 2,
//         name: 'Sản phẩm 2',
//         price: '12.000.000'
//     },
//     {
//         id: 3,
//         name: 'Sản phẩm 3',
//         price: '17.000.000'
//     },
//     {
//         id: 4,
//         name: 'Sản phẩm 4',
//         price: '17.000.000'
//     },
//     {
//         id: 5,
//         name: 'Sản phẩm 5',
//         price: '17.000.000'
//     }
// ]


function HomeUser() {
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
    }
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
    }
    const [state, dispatch] = useContext(Context);
    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
        notifySuccess('Thêm vào giỏ hàng thành công!')
    }
    const handleClickAddToCart = (product) => {
        handleAddToCart(product)
    }
    const handleClickRemoveFromCart = (product) => {
        dispatch({
            type: "REMOVE_CART",
            payload: product
        })
    }

    const url = 'http://localhost:8080/api/products';
    const [totalSet, setTotal] = useState(10);
    const [products, setData] = useState([{
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
        images: null
    }]
    );
    const getRandomuserParams = (params) => ({
        limit: params.pagination?.pageSize,
        page: params.pagination?.current,
    });
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5
        },
    });
    //APILoadList
    const getData = () => {
        axios.get(url + `?${qs.stringify(
            getRandomuserParams(tableParams)
        )}`)
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
                    }
                });
            });
    };

    //LoadList
    useEffect(() => {
        getData();
    }, [JSON.stringify(tableParams)]);
    const carts = JSON.parse(localStorage.getItem('carts'));
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
                                    <h3>Laptop<br />Collection</h3>
                                    <a href="#" className="cta-btn">Shop now <i className="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 col-xs-6">
                            <div className="shop">
                                <div className="shop-img">
                                    <img src={anh3} alt="" />
                                </div>
                                <div className="shop-body">
                                    <h3>Accessories<br />Collection</h3>
                                    <a href="#" className="cta-btn">Shop now <i className="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 col-xs-6">
                            <div className="shop">
                                <div className="shop-img">
                                    <img src={anh1} alt="" />
                                </div>
                                <div className="shop-body">
                                    <h3>Laptop Gaming<br />Collection</h3>
                                    <a href="#" className="cta-btn">Shop now <i className="fa fa-arrow-circle-right"></i></a>
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
                                <h3 className="title">New Products</h3>
                                <div className="section-nav">
                                    <ul className="section-tab-nav tab-nav">
                                        <li className="active"><a data-toggle="tab" href="#tab1">Laptops</a></li>
                                        <li><a data-toggle="tab" href="#tab1">Accessories</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="row">
                                <div className="products-tabs">
                                    <div id="tab1" className="tab-pane active">
                                        <div className="products-slick" data-nav="#slick-nav-1">

                                            {products.map(pro => (
                                                <div className="product" key={pro.id}>
                                                    <div className="product-img">
                                                        <img src={product1} alt="" />
                                                        <div className="product-label">
                                                            <span className="sale">-30%</span>
                                                            <span className="new">NEW</span>
                                                        </div>
                                                    </div>
                                                    <div className="product-body">
                                                        <p className="product-category">Category</p>
                                                        <h3 className="product-name"><a href="#">{pro.name}</a></h3>
                                                        <h4 className="product-price">VNĐ {pro.price} <del className="product-old-price">$990.00</del></h4>
                                                        <div className="product-rating">
                                                            <i className="fa fa-star"></i>
                                                            <i className="fa fa-star"></i>
                                                            <i className="fa fa-star"></i>
                                                            <i className="fa fa-star"></i>
                                                            <i className="fa fa-star"></i>
                                                        </div>
                                                        <div className="product-btns">
                                                            <button className="add-to-wishlist"><Heart size={14}></Heart><span className="tooltipp">add to wishlist</span></button>
                                                            <button className="add-to-compare"><Repeat size={14}></Repeat><span className="tooltipp">add to compare</span></button>
                                                            <button className="quick-view"><Eye size={14}></Eye><span className="tooltipp">quick view</span></button>
                                                        </div>
                                                    </div>
                                                    {carts.some(p => p.id === pro.id) ?
                                                        (<div className="add-to-cart">
                                                            <button className="add-to-cart-btn" onClick={() => handleClickRemoveFromCart(pro)} ><DeleteOutlined size={18}></DeleteOutlined> remove from cart</button>
                                                        </div>) :
                                                        (<div className="add-to-cart">
                                                            <button className="add-to-cart-btn" onClick={() => handleClickAddToCart(pro)} ><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                        </div>)
                                                    }

                                                </div>
                                            ))}

                                            {/* <div className="product">
                                                <div className="product-img">
                                                    <img src={product2} alt="" />
                                                    <div className="product-label">
                                                        <span className="new">NEW</span>
                                                    </div>
                                                </div>
                                                <div className="product-body">
                                                    <p className="product-category">Category</p>
                                                    <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                                    <div className="product-rating">
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star-o"></i>
                                                    </div>
                                                    <div className="product-btns">
                                                        <button className="add-to-wishlist"><Heart size={14}></Heart><span className="tooltipp">add to wishlist</span></button>
                                                        <button className="add-to-compare"><Repeat size={14}></Repeat><span className="tooltipp">add to compare</span></button>
                                                        <button className="quick-view"><Eye size={14}></Eye><span className="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div className="add-to-cart">
                                                    <button className="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>
                                            <div className="product">
                                                <div className="product-img">
                                                    <img src={product3} alt="" />
                                                    <div className="product-label">
                                                        <span className="sale">-30%</span>
                                                    </div>
                                                </div>
                                                <div className="product-body">
                                                    <p className="product-category">Category</p>
                                                    <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                                    <div className="product-rating">
                                                    </div>
                                                    <div className="product-btns">
                                                        <button className="add-to-wishlist"><Heart size={14}></Heart><span className="tooltipp">add to wishlist</span></button>
                                                        <button className="add-to-compare"><Repeat size={14}></Repeat><span className="tooltipp">add to compare</span></button>
                                                        <button className="quick-view"><Eye size={14}></Eye><span className="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div className="add-to-cart">
                                                    <button className="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>
                                            <div className="product">
                                                <div className="product-img">
                                                    <img src={product4} alt="" />
                                                </div>
                                                <div className="product-body">
                                                    <p className="product-category">Category</p>
                                                    <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                                    <div className="product-rating">
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                    </div>
                                                    <div className="product-btns">
                                                        <button className="add-to-wishlist"><Heart size={14}></Heart><span className="tooltipp">add to wishlist</span></button>
                                                        <button className="add-to-compare"><Repeat size={14}></Repeat><span className="tooltipp">add to compare</span></button>
                                                        <button className="quick-view"><Eye size={14}></Eye><span className="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div className="add-to-cart">
                                                    <button className="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>
                                            <div className="product">
                                                <div className="product-img">
                                                    <img src={product5} alt="" />
                                                </div>
                                                <div className="product-body">
                                                    <p className="product-category">Category</p>
                                                    <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                                    <div className="product-rating">
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                    </div>
                                                    <div className="product-btns">
                                                        <button className="add-to-wishlist"><Heart size={14}></Heart><span className="tooltipp">add to wishlist</span></button>
                                                        <button className="add-to-compare"><Repeat size={14}></Repeat><span className="tooltipp">add to compare</span></button>
                                                        <button className="quick-view"><Eye size={14}></Eye><span className="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div className="add-to-cart">
                                                    <button className="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div> */}
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
                                            <span>Days</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <h3>10</h3>
                                            <span>Hours</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <h3>34</h3>
                                            <span>Mins</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <h3>60</h3>
                                            <span>Secs</span>
                                        </div>
                                    </li>
                                </ul>
                                <h2 className="text-uppercase">hot deal this week</h2>
                                <p>New Collection Up to 50% OFF</p>
                                <a className="primary-btn cta-btn" href="#">Shop now</a>
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
                                <h3 className="title">Top selling</h3>
                                <div className="section-nav">
                                    <ul className="section-tab-nav tab-nav">
                                        <li className="active"><a data-toggle="tab" href="#tab2">Laptops</a></li>
                                        <li><a data-toggle="tab" href="#tab2">Accessories</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="row">
                                <div className="products-tabs">
                                    <div id="tab2" className="tab-pane fade in active">
                                        <div className="products-slick" data-nav="#slick-nav-2">
                                            <div className="product">
                                                <div className="product-img">
                                                    <img src={product6} alt="" />
                                                    <div className="product-label">
                                                        <span className="sale">-30%</span>
                                                        <span className="new">NEW</span>
                                                    </div>
                                                </div>
                                                <div className="product-body">
                                                    <p className="product-category">Category</p>
                                                    <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                                    <div className="product-rating">
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                    </div>
                                                    <div className="product-btns">
                                                        <button className="add-to-wishlist"><Heart size={14}></Heart><span className="tooltipp">add to wishlist</span></button>
                                                        <button className="add-to-compare"><Repeat size={14}></Repeat><span className="tooltipp">add to compare</span></button>
                                                        <button className="quick-view"><Eye size={14}></Eye><span className="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div className="add-to-cart">
                                                    <button className="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div className="product">
                                                <div className="product-img">
                                                    <img src={product1} alt="" />
                                                    <div className="product-label">
                                                        <span className="new">NEW</span>
                                                    </div>
                                                </div>
                                                <div className="product-body">
                                                    <p className="product-category">Category</p>
                                                    <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                                    <div className="product-rating">
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star-o"></i>
                                                    </div>
                                                    <div className="product-btns">
                                                        <button className="add-to-wishlist"><Heart size={14}></Heart><span className="tooltipp">add to wishlist</span></button>
                                                        <button className="add-to-compare"><Repeat size={14}></Repeat><span className="tooltipp">add to compare</span></button>
                                                        <button className="quick-view"><Eye size={14}></Eye><span className="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div className="add-to-cart">
                                                    <button className="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div className="product">
                                                <div className="product-img">
                                                    <img src={product8} alt="" />
                                                    <div className="product-label">
                                                        <span className="sale">-30%</span>
                                                    </div>
                                                </div>
                                                <div className="product-body">
                                                    <p className="product-category">Category</p>
                                                    <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                                    <div className="product-rating">
                                                    </div>
                                                    <div className="product-btns">
                                                        <button className="add-to-wishlist"><Heart size={14}></Heart><span className="tooltipp">add to wishlist</span></button>
                                                        <button className="add-to-compare"><Repeat size={14}></Repeat><span className="tooltipp">add to compare</span></button>
                                                        <button className="quick-view"><Eye size={14}></Eye><span className="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div className="add-to-cart">
                                                    <button className="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div className="product">
                                                <div className="product-img">
                                                    <img src={product2} alt="" />
                                                </div>
                                                <div className="product-body">
                                                    <p className="product-category">Category</p>
                                                    <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                                    <div className="product-rating">
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                    </div>
                                                    <div className="product-btns">
                                                        <button className="add-to-wishlist"><Heart size={14}></Heart><span className="tooltipp">add to wishlist</span></button>
                                                        <button className="add-to-compare"><Repeat size={14}></Repeat><span className="tooltipp">add to compare</span></button>
                                                        <button className="quick-view"><Eye size={14}></Eye><span className="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div className="add-to-cart">
                                                    <button className="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div className="product">
                                                <div className="product-img">
                                                    <img src={product1} alt="" />
                                                </div>
                                                <div className="product-body">
                                                    <p className="product-category">Category</p>
                                                    <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                                    <div className="product-rating">
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                    </div>
                                                    <div className="product-btns">
                                                        <button className="add-to-wishlist"><Heart size={14}></Heart><span className="tooltipp">add to wishlist</span></button>
                                                        <button className="add-to-compare"><Repeat size={14}></Repeat><span className="tooltipp">add to compare</span></button>
                                                        <button className="quick-view"><Eye size={14}></Eye><span className="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div className="add-to-cart">
                                                    <button className="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>
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
                                            <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div className="product-widget">
                                        <div className="product-img">
                                            <img src={product8} alt="" />
                                        </div>
                                        <div className="product-body">
                                            <p className="product-category">Category</p>
                                            <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div className="product-widget">
                                        <div className="product-img">
                                            <img src={product2} alt="" />
                                        </div>
                                        <div className="product-body">
                                            <p className="product-category">Category</p>
                                            <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
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
                                            <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div className="product-widget">
                                        <div className="product-img">
                                            <img src={product5} alt="" />
                                        </div>
                                        <div className="product-body">
                                            <p className="product-category">Category</p>
                                            <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div className="product-widget">
                                        <div className="product-img">
                                            <img src={product6} alt="" />
                                        </div>
                                        <div className="product-body">
                                            <p className="product-category">Category</p>
                                            <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
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
                                            <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div className="product-widget">
                                        <div className="product-img">
                                            <img src={product2} alt="" />
                                        </div>
                                        <div className="product-body">
                                            <p className="product-category">Category</p>
                                            <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div className="product-widget">
                                        <div className="product-img">
                                            <img src={product3} alt="" />
                                        </div>
                                        <div className="product-body">
                                            <p className="product-category">Category</p>
                                            <h3 className="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeUser;