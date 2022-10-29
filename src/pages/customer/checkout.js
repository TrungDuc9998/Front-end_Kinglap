import React from "react";
import './css/checkout.css'
import product from '../../asset/images/products/product01.png';

function Checkout() {
    const carts=localStorage.getItem("cart");
    let i=0;
    const showCarts = (carts) => {
        let result = null;
        let cartList=JSON.parse(carts);
        console.log(cartList[0].productId.name)
        if (cartList.length > 0) {
            // for(i=0;i<cartList.length;i++){
                const listItems = cartList.map((cart) =>
                
                <div className="row d-flex">
                <div className="col-3 img">
                    <img alt="Ảnh sản phẩm" src={product} className="img-content"></img>
                </div>
                <div className="col-9 mt-3 d-block ">
                    <div>
                        <p className="text-name">x{cart.quantity} - {cart.productId.name}
                        - ${cart.productId.price}
                        </p>
                    </div>
                </div>
            </div>
                )
                return listItems;
            // };
        }
        
    }
    return (
        <>
            <div className="checkout row pt-2 mt-5">
                <div className="col-12 col-md-7">
                    <p style={{ fontWeight: '600' }}>1. Địa chỉ giao hàng</p>
                    <div className="ck-content">

                        <form className="form-info p-0 ">
                            <div><label>Họ tên</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Họ tên"></input>
                            </div>
                            <div><label>Số điện thoại</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Số điện thoại"></input>
                            </div>
                            <div><label>Email</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Email"></input>
                            </div>
                            <div><label>Tỉnh/Thành phố</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Tỉnh/Thành phố"></input>
                            </div>
                            <div><label>Quận huyện</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Quận huyện"></input>
                            </div>
                            <div><label>Phường xã</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Phường xã"></input>
                            </div>
                            <div><label>Địa chỉ</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Nhập số nhà/Tên đường"></input>
                            </div>
                        </form>
                    </div>
                    <div className="checkout2">
                        <p style={{ fontWeight: '600' }}>2. Hình thức lấy hàng</p>
                        <div className="ck-content">
                            <form className="form-htgh ms-5">
                                <div className=" d-flex">
                                    <input type={'radio'} name="ip-rdo"></input> <label>Lấy tại cửa hàng</label>
                                    <input type={'radio'} name="ip-rdo"></input> <label>Lấy tại nhà</label>
                                </div>
                            </form>

                            {showCarts(carts)}
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-5">
                    <p style={{ fontWeight: '600' }}>3. Đơn hàng</p>
                    <div className="content-right ">
                        <div className="row d-flex">
                            <div className="col-8">
                                <input type={'text'} className="form-control ip-sale mb-3 radio-ip" placeholder="Nhập mã giảm giá"></input>
                                <p>số lượng sản phẩm</p>
                                <p>tên sản phẩm</p>
                            </div>
                            <div className="col-4"><button className="btn btn-primary btn-sale">Sửa</button>
                                <button className="btn btn-danger mt-2 btn-sale">Áp dụng</button>
                            </div>
                        </div>
                        <hr></hr>
                        <span style={{ color: 'red', fontSize: '20px', fontWeight: '700' }}>Thành Tiền : 300000000đ</span>
                    </div>
                    <p style={{ fontWeight: '600' }}>4. Hình thức thanh toán</p>
                    <div className="content-right ">
                        <div >
                            <form className="form-htgh ms-5">
                                <div><input type={'radio'} name="ip-ht"></input> <label>Thanh toán tiền mặt khi nhận hàng</label></div>
                                <div><input type={'radio'} name="ip-ht"></input> <label>Thanh toán chuyển khoản qua ngân hàng</label></div>
                                <div><input type={'radio'} name="ip-ht"></input> <label>Thanh toán qua VN PAY</label></div>
                            </form>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-danger form-control btn-ck">Đặt hàng</button>
                        </div>
                        <div className="col-6 mt-2">
                            <button className="btn btn-primary form-control btn-ck ">Chọn sản phẩm</button>
                        </div>
                        <div className="col-6 mt-2">
                            <button className="btn btn-success form-control btn-ck">Tải file excel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkout;