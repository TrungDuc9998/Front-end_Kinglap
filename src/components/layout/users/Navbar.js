import React from "react";
import './css/layout.css';
function Navbar() {
    return (
        <>
            <nav class="navbar navbar-expand-lg bg-light">
                <div class="container">
                    <div class="container-fluid">
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Hot Deals</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Categories</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Laptops</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Smartphones</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Cameras</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Accessories</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>)
}

export default Navbar;