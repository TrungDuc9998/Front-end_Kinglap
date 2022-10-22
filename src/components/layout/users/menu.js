import React from "react";
import './css/layout.css';
import { Phone, Mail, MapPin, DollarSign, User, Heart, ShoppingCart } from 'react-feather';
import { Link } from "react-router-dom";
import logo from '../../../asset/images/products/logo.png'

function Menu() {
    return (<>
        <header>
            <div id="top-header">
                <div class="container">
                    <ul class="nav">
                        <li class="nav-item">
                            <Link to={'/'}>
                                <Phone size={14} color="red"></Phone>
                                +021-95-51-84
                            </Link>
                        </li>
                        <li class="nav-item">
                            <Link to={'/'}>
                                <Mail size={12} color="red"></Mail>
                                email@email.com
                            </Link>
                        </li>
                        <li class="nav-item">
                            <Link to={'/'}>
                                <MapPin size={12} color="red"></MapPin>
                                1734 Stonecoal Road
                            </Link>
                        </li>
                    </ul>
                    <ul class="nav justify-content-end">
                        <li class="nav-item">
                            <Link to={'/'}>
                                <DollarSign size={12} color="red"></DollarSign>
                                USD
                            </Link>
                        </li>
                        <li class="nav-item">
                            <Link to={'/'}>
                                <User size={12} color="red"></User>
                                My Account
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div id="header">
                <div class="container">
                    <div class="row d-flex justify-conten-center">
                        <div class="col-md-3">
                            <div class="header-logo">
                                <Link to="/" class="logo1">
                                    <img src={logo} alt="" />
                                </Link>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="header-search">
                                <form>
                                    <select class="input-select">
                                        <option value="0">All Categories</option>
                                        <option value="1">Category 01</option>
                                        <option value="1">Category 02</option>
                                    </select>
                                    <input class="input" placeholder="Search here" />
                                    <button class="search-btn">Search</button>
                                </form>
                            </div>
                        </div>

                        <div class="col-md-3 clearfix">
                            <div class="header-ctn">
                                <div>
                                    <a href="#">
                                        <Heart></Heart>
                                        <span>Your Wishlist</span>
                                    </a>
                                </div>

                                <div class="dropdown">
                                    <a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                                        <ShoppingCart></ShoppingCart>
                                        <span>Your Cart</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </>)
}

export default Menu;