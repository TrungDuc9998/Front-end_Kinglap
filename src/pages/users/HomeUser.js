import React from "react";
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



function HomeUser() {
    return (
        <div>
            <div class="section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-4 col-xs-6">
                            <div class="shop">
                                <div class="shop-img">
                                    <img src={anh1} alt="" />
                                </div>
                                <div class="shop-body">
                                    <h3>Laptop<br />Collection</h3>
                                    <a href="#" class="cta-btn">Shop now <i class="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 col-xs-6">
                            <div class="shop">
                                <div class="shop-img">
                                    <img src={anh3} alt="" />
                                </div>
                                <div class="shop-body">
                                    <h3>Accessories<br />Collection</h3>
                                    <a href="#" class="cta-btn">Shop now <i class="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 col-xs-6">
                            <div class="shop">
                                <div class="shop-img">
                                    <img src={anh1} alt="" />
                                </div>
                                <div class="shop-body">
                                    <h3>Laptop Gaming<br />Collection</h3>
                                    <a href="#" class="cta-btn">Shop now <i class="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="section-title">
                                <h3 class="title">New Products</h3>
                                <div class="section-nav">
                                    <ul class="section-tab-nav tab-nav">
                                        <li class="active"><a data-toggle="tab" href="#tab1">Laptops</a></li>
                                        <li><a data-toggle="tab" href="#tab1">Smartphones</a></li>
                                        <li><a data-toggle="tab" href="#tab1">Cameras</a></li>
                                        <li><a data-toggle="tab" href="#tab1">Accessories</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="row">
                                <div class="products-tabs">
                                    <div id="tab1" class="tab-pane active">
                                        <div class="products-slick" data-nav="#slick-nav-1">
                                            <div class="product">
                                                <div class="product-img">
                                                    <img src={product1} alt="" />
                                                    <div class="product-label">
                                                        <span class="sale">-30%</span>
                                                        <span class="new">NEW</span>
                                                    </div>
                                                </div>
                                                <div class="product-body">
                                                    <p class="product-category">Category</p>
                                                    <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                                    <div class="product-rating">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                    </div>
                                                    <div class="product-btns">
                                                        <button class="add-to-wishlist"><Heart size={14}></Heart><span class="tooltipp">add to wishlist</span></button>
                                                        <button class="add-to-compare"><Repeat size={14}></Repeat><span class="tooltipp">add to compare</span></button>
                                                        <button class="quick-view"><Eye size={14}></Eye><span class="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div class="add-to-cart">
                                                    <button class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div class="product">
                                                <div class="product-img">
                                                    <img src={product2} alt="" />
                                                    <div class="product-label">
                                                        <span class="new">NEW</span>
                                                    </div>
                                                </div>
                                                <div class="product-body">
                                                    <p class="product-category">Category</p>
                                                    <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                                    <div class="product-rating">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star-o"></i>
                                                    </div>
                                                    <div class="product-btns">
                                                        <button class="add-to-wishlist"><Heart size={14}></Heart><span class="tooltipp">add to wishlist</span></button>
                                                        <button class="add-to-compare"><Repeat size={14}></Repeat><span class="tooltipp">add to compare</span></button>
                                                        <button class="quick-view"><Eye size={14}></Eye><span class="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div class="add-to-cart">
                                                    <button class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div class="product">
                                                <div class="product-img">
                                                    <img src={product3} alt="" />
                                                    <div class="product-label">
                                                        <span class="sale">-30%</span>
                                                    </div>
                                                </div>
                                                <div class="product-body">
                                                    <p class="product-category">Category</p>
                                                    <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                                    <div class="product-rating">
                                                    </div>
                                                    <div class="product-btns">
                                                        <button class="add-to-wishlist"><Heart size={14}></Heart><span class="tooltipp">add to wishlist</span></button>
                                                        <button class="add-to-compare"><Repeat size={14}></Repeat><span class="tooltipp">add to compare</span></button>
                                                        <button class="quick-view"><Eye size={14}></Eye><span class="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div class="add-to-cart">
                                                    <button class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div class="product">
                                                <div class="product-img">
                                                    <img src={product4} alt="" />
                                                </div>
                                                <div class="product-body">
                                                    <p class="product-category">Category</p>
                                                    <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                                    <div class="product-rating">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                    </div>
                                                    <div class="product-btns">
                                                        <button class="add-to-wishlist"><Heart size={14}></Heart><span class="tooltipp">add to wishlist</span></button>
                                                        <button class="add-to-compare"><Repeat size={14}></Repeat><span class="tooltipp">add to compare</span></button>
                                                        <button class="quick-view"><Eye size={14}></Eye><span class="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div class="add-to-cart">
                                                    <button class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div class="product">
                                                <div class="product-img">
                                                    <img src={product5} alt="" />
                                                </div>
                                                <div class="product-body">
                                                    <p class="product-category">Category</p>
                                                    <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                                    <div class="product-rating">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                    </div>
                                                    <div class="product-btns">
                                                        <button class="add-to-wishlist"><Heart size={14}></Heart><span class="tooltipp">add to wishlist</span></button>
                                                        <button class="add-to-compare"><Repeat size={14}></Repeat><span class="tooltipp">add to compare</span></button>
                                                        <button class="quick-view"><Eye size={14}></Eye><span class="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div class="add-to-cart">
                                                    <button class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="slick-nav-1" class="products-slick-nav"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="hot-deal" class="section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="hot-deal">
                                <ul class="hot-deal-countdown">
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
                                <h2 class="text-uppercase">hot deal this week</h2>
                                <p>New Collection Up to 50% OFF</p>
                                <a class="primary-btn cta-btn" href="#">Shop now</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="container">
                    <div class="row">

                        <div class="col-md-12">
                            <div class="section-title">
                                <h3 class="title">Top selling</h3>
                                <div class="section-nav">
                                    <ul class="section-tab-nav tab-nav">
                                        <li class="active"><a data-toggle="tab" href="#tab2">Laptops</a></li>
                                        <li><a data-toggle="tab" href="#tab2">Smartphones</a></li>
                                        <li><a data-toggle="tab" href="#tab2">Cameras</a></li>
                                        <li><a data-toggle="tab" href="#tab2">Accessories</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="row">
                                <div class="products-tabs">
                                    <div id="tab2" class="tab-pane fade in active">
                                        <div class="products-slick" data-nav="#slick-nav-2">
                                            <div class="product">
                                                <div class="product-img">
                                                    <img src={product6} alt="" />
                                                    <div class="product-label">
                                                        <span class="sale">-30%</span>
                                                        <span class="new">NEW</span>
                                                    </div>
                                                </div>
                                                <div class="product-body">
                                                    <p class="product-category">Category</p>
                                                    <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                                    <div class="product-rating">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                    </div>
                                                    <div class="product-btns">
                                                        <button class="add-to-wishlist"><Heart size={14}></Heart><span class="tooltipp">add to wishlist</span></button>
                                                        <button class="add-to-compare"><Repeat size={14}></Repeat><span class="tooltipp">add to compare</span></button>
                                                        <button class="quick-view"><Eye size={14}></Eye><span class="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div class="add-to-cart">
                                                    <button class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div class="product">
                                                <div class="product-img">
                                                    <img src={product1} alt="" />
                                                    <div class="product-label">
                                                        <span class="new">NEW</span>
                                                    </div>
                                                </div>
                                                <div class="product-body">
                                                    <p class="product-category">Category</p>
                                                    <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                                    <div class="product-rating">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star-o"></i>
                                                    </div>
                                                    <div class="product-btns">
                                                        <button class="add-to-wishlist"><Heart size={14}></Heart><span class="tooltipp">add to wishlist</span></button>
                                                        <button class="add-to-compare"><Repeat size={14}></Repeat><span class="tooltipp">add to compare</span></button>
                                                        <button class="quick-view"><Eye size={14}></Eye><span class="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div class="add-to-cart">
                                                    <button class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div class="product">
                                                <div class="product-img">
                                                    <img src={product8} alt="" />
                                                    <div class="product-label">
                                                        <span class="sale">-30%</span>
                                                    </div>
                                                </div>
                                                <div class="product-body">
                                                    <p class="product-category">Category</p>
                                                    <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                                    <div class="product-rating">
                                                    </div>
                                                    <div class="product-btns">
                                                        <button class="add-to-wishlist"><Heart size={14}></Heart><span class="tooltipp">add to wishlist</span></button>
                                                        <button class="add-to-compare"><Repeat size={14}></Repeat><span class="tooltipp">add to compare</span></button>
                                                        <button class="quick-view"><Eye size={14}></Eye><span class="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div class="add-to-cart">
                                                    <button class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div class="product">
                                                <div class="product-img">
                                                    <img src={product2} alt="" />
                                                </div>
                                                <div class="product-body">
                                                    <p class="product-category">Category</p>
                                                    <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                                    <div class="product-rating">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                    </div>
                                                    <div class="product-btns">
                                                        <button class="add-to-wishlist"><Heart size={14}></Heart><span class="tooltipp">add to wishlist</span></button>
                                                        <button class="add-to-compare"><Repeat size={14}></Repeat><span class="tooltipp">add to compare</span></button>
                                                        <button class="quick-view"><Eye size={14}></Eye><span class="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div class="add-to-cart">
                                                    <button class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>

                                            <div class="product">
                                                <div class="product-img">
                                                    <img src={product1} alt="" />
                                                </div>
                                                <div class="product-body">
                                                    <p class="product-category">Category</p>
                                                    <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                                    <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                                    <div class="product-rating">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                    </div>
                                                    <div class="product-btns">
                                                        <button class="add-to-wishlist"><Heart size={14}></Heart><span class="tooltipp">add to wishlist</span></button>
                                                        <button class="add-to-compare"><Repeat size={14}></Repeat><span class="tooltipp">add to compare</span></button>
                                                        <button class="quick-view"><Eye size={14}></Eye><span class="tooltipp">quick view</span></button>
                                                    </div>
                                                </div>
                                                <div class="add-to-cart">
                                                    <button class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="slick-nav-2" class="products-slick-nav"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-4 col-xs-6">
                            <div class="section-title">
                                <h4 class="title">Top selling</h4>
                                <div class="section-nav">
                                    <div id="slick-nav-3" class="products-slick-nav"></div>
                                </div>
                            </div>

                            <div class="products-widget-slick" data-nav="#slick-nav-3">
                                <div>
                                    <div class="product-widget">
                                        <div class="product-img">
                                            <img src={product1} alt="" />
                                        </div>
                                        <div class="product-body">
                                            <p class="product-category">Category</p>
                                            <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div class="product-widget">
                                        <div class="product-img">
                                            <img src={product8} alt="" />
                                        </div>
                                        <div class="product-body">
                                            <p class="product-category">Category</p>
                                            <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div class="product-widget">
                                        <div class="product-img">
                                            <img src={product2} alt="" />
                                        </div>
                                        <div class="product-body">
                                            <p class="product-category">Category</p>
                                            <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 col-xs-6">
                            <div class="section-title">
                                <h4 class="title">Top selling</h4>
                                <div class="section-nav">
                                    <div id="slick-nav-4" class="products-slick-nav"></div>
                                </div>
                            </div>

                            <div class="products-widget-slick" data-nav="#slick-nav-4">
                                <div>
                                    <div class="product-widget">
                                        <div class="product-img">
                                            <img src={product4} alt="" />
                                        </div>
                                        <div class="product-body">
                                            <p class="product-category">Category</p>
                                            <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div class="product-widget">
                                        <div class="product-img">
                                            <img src={product5} alt="" />
                                        </div>
                                        <div class="product-body">
                                            <p class="product-category">Category</p>
                                            <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div class="product-widget">
                                        <div class="product-img">
                                            <img src={product6} alt="" />
                                        </div>
                                        <div class="product-body">
                                            <p class="product-category">Category</p>
                                            <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 col-xs-6">
                            <div class="section-title">
                                <h4 class="title">Top selling</h4>
                                <div class="section-nav">
                                    <div id="slick-nav-5" class="products-slick-nav"></div>
                                </div>
                            </div>

                            <div class="products-widget-slick" data-nav="#slick-nav-5">
                                <div>
                                    <div class="product-widget">
                                        <div class="product-img">
                                            <img src={product1} alt="" />
                                        </div>
                                        <div class="product-body">
                                            <p class="product-category">Category</p>
                                            <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div class="product-widget">
                                        <div class="product-img">
                                            <img src={product2} alt="" />
                                        </div>
                                        <div class="product-body">
                                            <p class="product-category">Category</p>
                                            <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
                                        </div>
                                    </div>

                                    <div class="product-widget">
                                        <div class="product-img">
                                            <img src={product3} alt="" />
                                        </div>
                                        <div class="product-body">
                                            <p class="product-category">Category</p>
                                            <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                            <h4 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h4>
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