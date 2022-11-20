import React from "react";
import './css/layout.css';
import { Phone, Mail, MapPin, DollarSign, User, Heart, ShoppingCart } from 'react-feather';
import { Link, Navigate } from "react-router-dom";
import logo from '../../asset/images/LOGO LAPTOP.png'
import { useNavigate } from "react-router-dom";


function Menu() {
    let navigate = useNavigate();
    const yourCart = () => {
        navigate("/user/cart");
    }

    const toAdmin = () => {
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "") {
            navigate('/login');
        } else {
            navigate('/admin/order');
        }
    }

    const yourOrder = () => {
        if (localStorage.getItem("token") == null || localStorage.getItem("token") == "") {
            navigate('/login');
        } else {
            navigate('/user/order');
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
                                <a style={{color:"ưhite"}} onClick={toAdmin}>
                                    <DollarSign size={12} color="red"></DollarSign>
                                    Admin
                                </a>
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
                                        <a style={{color:"white"}} onClick={yourOrder}>
                                            <Heart></Heart>
                                            <span>Your Wishlist</span>
                                        </a>
                                    </div>

                                    <div className="">
                                        <a style={{color:"white"}} onClick={yourCart} aria-expanded="true">
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