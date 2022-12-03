import React from "react";
import { Link } from "react-router-dom";
import './css/layout.css';
function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container">
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to={"/user"}><h4>Trang chủ</h4></Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link className="nav-link" to={""}>Categories</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={""}>Accessories</Link>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>)
}

export default Navbar;