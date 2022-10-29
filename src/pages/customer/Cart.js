import React, { useEffect, useState, useR } from "react";
import './css/cart.css';
import imProduct from '../../asset/images/products/product01.png';
import { Select } from "antd";
import { Link } from "react-router-dom";

const products = [
    {
        id: 1,
        name: 'Sản phẩm 1',
        price: '15.000.000'
    },
    {
        id: 2,
        name: 'Sản phẩm 2',
        price: '12.000.000'
    },
    {
        id: 3,
        name: 'Sản phẩm 2',
        price: '17.000.000'
    }
]

function Cart() {
    const [checked, setChecked] = useState([]);
    const handleCheck = (id) => {
        setChecked(prev => {
            const isChecked = checked.includes(id);
            if (isChecked) {
                return checked.filter(item => item !== id)
            } else {
                return [...prev, id]
            }
        });

    }

    const handleSubmit = () => {
        localStorage.setItem("products", checked);
        console.log({ ids: checked })
    }

    return (<>
        <div className="cart">
            <div className="card-header mb-2">
                <span>Giỏ hàng</span>
            </div>
            <div className="cart-content mt-2 pt-3 border-div container">
                <div className="row">
                    <div className="col-2 ip">
                        <input type={"checkbox"} />
                    </div>
                </div>
                {products.map(product => (
                    <div className="row d-flex" key={product.id}>
                        <div className="col-2 ip mt-4">
                            <input type={"checkbox"}
                                name="ck"
                                checked={checked.includes(product.id)}
                                onChange={() => handleCheck(product.id)}
                            />
                        </div>
                        <div className="col-3 img">
                            <img alt="Ảnh sản phẩm" src={imProduct} className="img-content"></img>
                        </div>
                        <div className="col-7 mt-3 d-block ">
                            <div>
                                <h4 className="text-name"> {product.name}
                                </h4>
                                <p className="d-flex"><span className="price me-3 text-danger">
                                    {product.price}</span> <span className="price ms-3">17.000.000</span>
                                    <button className="btn btn-danger ms-3" style={{ fontSize: '13px', fontWeight: 'bold' }}>Giảm 30%</button>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-footer border-div container-fluid pb-3 mt-2">
                <div className="d-flex m-3 ">
                    <span className="flex-grow-1 cart-footer-text">Tổng tiền tạm tính</span>
                    <span className="text-danger cart-footer-text">17.999.000 đ</span>
                </div>
                <div className="mt-2">
                    <Link className="btn btn-primary btn-cart" onClick={() => handleSubmit()} to={"/user/checkout"}>Tiến hành đặt hàng</Link>
                </div>
                <div className="mt-2">
                    <button className="btn btn-outline-primary btn-cart">Chọn thêm sản phẩm</button>
                </div>

            </div>
        </div>
    </>)
}

export default Cart;