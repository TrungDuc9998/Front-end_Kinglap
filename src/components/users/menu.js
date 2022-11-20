import React from "react";
import './css/layout.css';
import { Phone, Mail, MapPin, DollarSign, User, Heart, ShoppingCart } from 'react-feather';
import { Link } from "react-router-dom";
import logo from '../../asset/images/LOGO LAPTOP.png'


function Menu() {

    const yourCart = () => {
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "") {
            window.location.href = '/login';
        } else {
            window.location.href = '/user/cart';
        }
    }

    return (
        <>
            <header>
                <div id="top-header">
                    <div className="container">
                        <ul className="nav">
                            <li className="nav-item">
                                <Link to={'/'}>
                                    <Phone size={14} color="red"></Phone>
                                    +021-95-51-84
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/'}>
                                    <Mail size={12} color="red"></Mail>
                                    email@email.com
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/'}>
                                    <MapPin size={12} color="red"></MapPin>
                                    1734 Stonecoal Road
                                </Link>
                            </li>
                        </ul>
                        <ul className="nav justify-content-end">
                            <li className="nav-item">
                                <Link to={'/admin/order/create'}>
                                    <DollarSign size={12} color="red"></DollarSign>
                                    Admin
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/'}>
                                    <User size={12} color="red"></User>
                                    My Account
                                </Link>
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
                                            <option value="0">All Categories</option>
                                            <option value="1">Category 01</option>
                                            <option value="1">Category 02</option>
                                        </select>
                                        <input className="input" placeholder="Search here" />
                                        <button className="search-btn">Search</button>
                                    </form>
                                </div>
                            </div>

                            <div className="col-md-3 clearfix">
                                <div className="header-ctn">
                                    <div>
                                        <a href="/user/order">
                                            <Heart></Heart>
                                            <span>Your Wishlist</span>
                                        </a>
                                    </div>

                                    <div className="">
                                        <Link onClick={yourCart} aria-expanded="true">
                                            <ShoppingCart></ShoppingCart>
                                            <span>Your Cart</span>
                                        </Link>
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