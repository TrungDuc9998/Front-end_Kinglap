import React, { useContext, useState, useEffect } from "react";
import './css/cart.css';
import imProduct from '../../asset/images/products/product01.png';
import { Link } from "react-router-dom";
import StoreContext from '../../store/Context';
import { setCheckoutCart } from "../../store/Actions";
import { Select, Input, Button, Checkbox, InputNumber, Space, Modal } from "antd";
import {
    DeleteOutlined
  } from "@ant-design/icons";
  import CurrencyFormat from "react-currency-format";

function Cart() {
    const [total, setTotal] = useState(0);
    const [state, dispatch] = useContext(StoreContext);
    console.log("list cart", state.cart)
    const carts=JSON.parse(localStorage.getItem('carts'));
    const getTotal=()=>{
        let totalSum = 0;
        carts?.forEach((item) => (totalSum += item.price*item.quantity));
        console.log("tổng tiền sau khi tính: " + totalSum);
        setTotal(totalSum);
    }
    
    //LoadList
    useEffect(() => {
        getTotal();
    }, [carts]);
    const handleCheckout = () => {
        const checkboxes = document.querySelectorAll('input[name="ck"]');
            checkboxes.forEach((checkbox) => {
                if(checkbox.checked == true){
                    carts.forEach((item) => (item.id==checkbox.value)?checked.push(item):"")
                }
                setChecked(checked)
            });
            dispatch(setCheckoutCart(checked))
    }

    const [checked, setChecked] = useState([]);

    //check all
    const [isCheckedAll, setIsCheckedAll]=useState(true);
    function handleCheckAll(check) {
        if(isCheckedAll){
            console.log("checkedAll")
            const checkboxes = document.querySelectorAll('input[name="ck"]');
            checkboxes.forEach((checkbox) => {
                checkbox.checked = true;
            });
            setIsCheckedAll(false);
        }else{
            console.log("not checkedAll")
            const checkboxes = document.querySelectorAll('input[name="ck"]');
            checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
            })
            setIsCheckedAll(true);
        }
    }
    function formatCash(str) {
        if(str.length>1){
          return str.split('').reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + ',')) + prev
          })
        }else{
          return ""
        }
    }

    return (<>
        <div className="cart">
            <div className="card-header mb-2">
                <span>Giỏ hàng</span>
            </div>
            <div className="cart-content mt-2 pt-3 border-div container-fluid">
                <div className="row">
                    <div className="col-2 ip">
                        <input type={"checkbox"} 
                        id="checkall"
                        // checked={isCheckedAll[product]}
                        onChange={() => handleCheckAll(checked)}/>
                    </div>
                    Chọn tất cả
                </div>
                {carts?carts.map(product => (
                    <div className="row d-flex" key={product.id}>
                        <div className="col-2 ip mt-4">
                            <input type={"checkbox"}
                                name="ck"
                                value={product.id}
                                // checked={isChecked[product]}
                                //onChange={() => handleCheck(product)}
                            />
                        </div>
                        <div className="col-3 img">
                            <img alt="Ảnh sản phẩm" src={product.images?product.images[0].name:imProduct} className="img-content"></img>
                        </div>
                        <div className="col-7 mt-3 d-block ">
                            <div>
                                <h4 className="text-name"> {product.name}
                                </h4>
                                <span className="center-on-small-only">
                                    <InputNumber className="qty"  onChange={(e) =>
                                    dispatch({
                                        type:"CHANGE_CART_QTY",
                                        payload:{
                                            id:product.id,
                                            quantity:e,
                                        }
                                    })
                                    }
                                    value={product.quantity}
                                    key={product?product.id:""}
                                    defaultValue={0}
                                    min={1}
                                    max={10}
                                    ></InputNumber>
                                </span>
                                <p className="d-flex"><span className="price me-3 text-danger">
                                <CurrencyFormat
                                    style={{fontSize:"14px"}}
                                    value={product.price*product.quantity}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                />
                                    {/* {formatCash(product.price*product.quantity+"")} */}
                                    </span> <span className="price ms-3">17.000.000</span>
                                    <button className="btn btn-danger ms-3" style={{ fontSize: '13px', fontWeight: 'bold' }}>Giảm 30%</button>
                                </p>
                                <DeleteOutlined
                                    onClick={() => 
                                        dispatch({
                                            type:"REMOVE_CART",
                                            payload:product
                                        })
                                    }
                                    style={{ color: "red", marginLeft: 1, marginBottom:5 }}
                                />
                            </div>
                        </div>
                    </div>
                )):""}
            </div>
            <div className="cart-footer border-div container-fluid pb-3 mt-2">
                <div className="d-flex m-3 ">
                    <span className="flex-grow-1 cart-footer-text">Tổng tiền tạm tính</span>
                    <span className="text-danger cart-footer-text">{formatCash(total+"")} VNĐ</span>
                </div>
                <div className="mt-2">
                    <Link className="btn btn-primary btn-cart" onClick={handleCheckout} to={"/user/checkout"}>Tiến hành đặt hàng</Link>
                </div>
                <div className="mt-2">
                    <button className="btn btn-outline-primary btn-cart">Chọn thêm sản phẩm</button>
                </div>

            </div>
        </div>
    </>)
}

export default Cart;