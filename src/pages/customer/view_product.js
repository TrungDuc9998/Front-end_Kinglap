import React from "react";
import product1 from '../../asset/images/products/product01.png'
import product2 from '../../asset/images/products/product02.png'
import product3 from '../../asset/images/products/product03.png'
import './css/view.css'

function ViewProduct() {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-2 bg-success">ádasdas</div>
                    <div className="col-5 img-content">
                        <div id="carouselExampleCaptions" class="carousel carousel-dark slide" data-bs-ride="false">
                            <div class="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                            </div>
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img src={product1} class="d-block w-100" alt="..." />

                                </div>
                                <div class="carousel-item">
                                    <img src={product2} class="d-block w-100" alt="..." />

                                </div>
                                <div class="carousel-item">
                                    <img src={product3} class="d-block w-100" alt="..." />
                                </div>
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className="col-5 info">
                        <div class="product-details">
                            <p class="product-name">product name goes here</p>
                            {/* <div>
                                <div class="product-rating">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star-o"></i>
                                </div>
                            </div> */}
                            <div>
                                <h3 class="product-price">$980.00 <del class="product-old-price">$990.00</del></h3>
                                <span class="product-available">In Stock</span>
                            </div>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                laboris nisi ut aliquip ex ea commodo consequat.</p>

                            <div class="add-to-cart">
                                <button class="btn-add-to-cart"><i class="fa fa-shopping-cart"></i> add to cart</button>
                                <button class="btn-add-to-cart ms-2"><i class="fa fa-shopping-cart"></i>buy now</button>
                            </div>

                            <ul class="product-btns">
                                <li><a href="#"><i class="fa fa-heart-o"></i> add to wishlist</a></li>
                                <li><a href="#"><i class="fa fa-exchange"></i> add to compare</a></li>
                            </ul>

                            <ul class="product-links">
                                <li>Category:</li>
                                <li><a href="#">Headphones</a></li>
                                <li><a href="#">Accessories</a></li>
                            </ul>

                            <ul class="product-links">
                                <li>Share:</li>
                                <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                                <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                                <li><a href="#"><i class="fa fa-google-plus"></i></a></li>
                                <li><a href="#"><i class="fa fa-envelope"></i></a></li>
                            </ul>

                        </div>
                    </div>
                </div>
            </div>
        </>)
}

export default ViewProduct