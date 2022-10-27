import React from "react";
import './css/cart.css';
import product from '../../asset/images/products/product01.png';

function Cart() {
    return (<>
        <div className="cart">
            <div className="card-header mb-2">
                <span>Giỏ hàng</span>
            </div>
            <div className="cart-content mt-2 pt-3 border-div container">
                <div className="row">
                    <div className="col-2 ip">
                        <input type={"checkbox"}></input>
                    </div>
                </div>
                <div className="row d-flex">
                    <div className="col-2 ip mt-4">
                        <input type={"checkbox"} name="check-product"></input>
                    </div>
                    <div className="col-3 img">
                        <img alt="Ảnh sản phẩm" src={product} className="img-content"></img>
                    </div>
                    <div className="col-7 mt-3 d-block ">
                        <div>
                            <h4 className="text-name">alsdkbasljdbasjldbasljdbjsdasdasdassssssssssssssdadsa

                            </h4>
                            <p className="d-flex"><span className="price me-3 text-danger">
                                32.000.000</span> <span className="price ms-3">17.000.000</span>
                                <button className="btn btn-danger ms-3" style={{ fontSize: '13px', fontWeight: 'bold' }}>Giảm 30%</button>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row d-flex">
                    <div className="col-2 ip mt-4">
                        <input type={"checkbox"} name="check-product" ></input>
                    </div>
                    <div className="col-3 img">
                        <img alt="Ảnh sản phẩm" src={product} className="img-content"></img>
                    </div>
                    <div className="col-7 mt-3 position-relative">
                        <div><h4 className="text-name">Tên sản phẩmsssssssssssssssssssssssssssssssss</h4>
                            <p className="d-flex"><span className="price me-3 text-danger">
                                32.000.000</span> <span className="price ms-3">17.000.000</span>
                                <button className="btn btn-danger ms-3" style={{ fontSize: '13px', fontWeight: 'bold' }}>Giảm 30%</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cart-footer border-div container-fluid pb-3 mt-2">
                <div className="d-flex m-3 ">
                    <span className="flex-grow-1 cart-footer-text">Tổng tiền tạm tính</span>
                    <span className="text-danger cart-footer-text">17.999.000 đ</span>
                </div>
                <div className="mt-2">
                    <button className="btn btn-primary btn-cart">Tiến hành đặt hàng</button>
                </div>
                <div className="mt-2">
                    <button className="btn btn-outline-primary btn-cart">Chọn thêm sản phẩm</button>
                </div>

            </div>
        </div>
    </>)
}

export default Cart;