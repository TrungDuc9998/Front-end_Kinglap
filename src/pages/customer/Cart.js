import React, { useEffect, useState } from "react";
import './css/cart.css';
import product from '../../asset/images/products/product01.png';
import 'toastr/build/toastr.min.css';
import toastrs from "toastr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import qs from "qs";
import { Select, Input, Button, Checkbox, InputNumber, Space } from "antd";

function Cart() {
  const url = 'http://localhost:8080/api/carts';
    const notifySuccess=(message)=>{
        toast.success(message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    const [total, setTotal] = useState(0);
    const [totalPage, setTotalPage] = useState(10);
    const [carts, setData] = useState([{
        id:null,
        productId:null,
        quantity:null,
        total:null,
        userId:null
        }]
      );
    const [cart, setCart] = useState({
        id:null,
        productId:null,
        quantity:null,
        total:null,
        userId:null
        }
      );
      const getRandomuserParams = (params) => ({
        limit: params.pagination?.pageSize,
        page: params.pagination?.current,
      });
    const [tableParams, setTableParams] = useState({
        pagination: {
          current: 1,
          pageSize: 100
        },
      });
    //APILoadList
  const getData = () => {
    axios.get(url+`?${qs.stringify(
      getRandomuserParams(tableParams)
    )}`)
      .then((results ) => {
        setData(results.data.data.data);
        setTotalPage(results.data.data.total);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalPage, 
          }
        });
      });
  };

  //LoadList
  useEffect(() => {
    getData();
  }, [JSON.stringify(tableParams)]);
  const btnDown = (cart, index) => {
   console.log(cart)
   setCart({...cart,
    quantity:cart.quantity-1
  })
  axios.put(url+"/"+cart.id,cart)
        .then(res => {
          console.log(res.data);
        })
  };
  const btnUp = (cart, index) => {
    console.log(cart)
    setCart({...cart,
        quantity:cart.quantity+1
      })
    axios.put(url+"/"+cart.id,cart)
        .then(res => {
          console.log(res.data);
        })
  };

  const checkout = (carts) => {
    localStorage.setItem("cart",JSON.stringify(carts))
  };
  //note
  const onChangeInputNumber = (value, productId, price, id, userId) => {
    const cartQ = {
      total: value * price,
      userId: userId,
      quantity: value,
      productId: productId,
    };
    axios.put(`http://localhost:8080/api/carts/${id}`,cartQ).then((res) => {
      // res.json();
      console.log("load data cart:");
      console.log(res.data);
      getData();
      // total = 0;
      // carts?.forEach((item) => (total += item.total));
      // console.log("tổng tiền sau khi tính: " + total);
      // setTotal(total);
      // notify();
    });
  };

  const showCarts = (carts) => {
    let result = null;
    if (carts.length > 0) {
        result = carts.map((cart, index) => {
            return (
              <div className="row d-flex">
                    <div className="col-2 ip mt-4">
                        <input type={"checkbox"} name="check-product"></input>
                    </div>
                    <div className="col-3 img">
                        <img alt="Ảnh sản phẩm" src={product} className="img-content"></img>
                    </div>
                    <div className="col-7 mt-3 d-block ">
                        <div>
                            <h5 className="text-name">{cart.productId?cart.productId.name:""}</h5>
                            <p className="d-flex">
                            <span className="center-on-small-only">
                              <InputNumber className="qty"  onChange={(event) =>
                              onChangeInputNumber(
                                event,
                                cart.productId.id,
                                cart.productId.price,
                                cart.id,
                                cart.userId
                              )
                            }
                            value={cart.quantity}
                            key={cart.productId?cart.productId.id:""}
                            defaultValue={0}
                            min={1}
                            max={10}
                            ></InputNumber>
                              
                          </span>
                            <span className="price me-3 text-danger"><a> </a>
                            {cart.productId?cart.productId.price*cart.quantity:cart.quantity}</span> <span className="price ms-3">17.000.000</span>
                                <button className="btn btn-danger ms-3" style={{ fontSize: '13px', fontWeight: 'bold' }}>Giảm 30%</button>
                            </p>
                        </div>
                    </div>
                </div>
            )
        });
    }
    return result;
  }
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
                { showCarts(carts) }
            </div>
            <div className="cart-footer border-div container-fluid pb-3 mt-2">
                <div className="d-flex m-3 ">
                    <span className="flex-grow-1 cart-footer-text">Tổng tiền tạm tính</span>
                    <span className="text-danger cart-footer-text">17.999.000 đ</span>
                </div>
                <div className="mt-2">
                <a href="/user/checkout"><button className="btn btn-primary btn-cart" onClick={()=>checkout(carts) }>Tiến hành đặt hàng</button></a>
                </div>
                <div className="mt-2">
                    <button className="btn btn-outline-primary btn-cart">Chọn thêm sản phẩm</button>
                </div>

            </div>
        </div>
    </>)
}

export default Cart;