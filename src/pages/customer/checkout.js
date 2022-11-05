// import React, { useContext } from "react";
// import './css/checkout.css'
// import product from '../../asset/images/products/product01.png';
// import StoreContext from '../../store/Context';

// function Checkout() {
//     const [state, dispath] = useContext(StoreContext);
//     const products = state.cartCheckout;
//     console.log('list products', products)
//     return (
//         <>
//             <div className="checkout row pt-2 mt-5">
//                 <div className="col-12 col-md-7">
//                     <p style={{ fontWeight: '600' }}>1. Địa chỉ giao hàng</p>
//                     <div className="ck-content">

//                         <form className="form-info p-0 ">
//                             <div><label>Họ tên</label>
//                                 <input type={'text'} className="form-control radio-ip" placeholder="Họ tên"></input>
//                             </div>
//                             <div><label>Số điện thoại</label>
//                                 <input type={'text'} className="form-control radio-ip" placeholder="Số điện thoại"></input>
//                             </div>
//                             <div><label>Email</label>
//                                 <input type={'text'} className="form-control radio-ip" placeholder="Email"></input>
//                             </div>
//                             <div><label>Tỉnh/Thành phố</label>
//                                 <input type={'text'} className="form-control radio-ip" placeholder="Tỉnh/Thành phố"></input>
//                             </div>
//                             <div><label>Quận huyện</label>
//                                 <input type={'text'} className="form-control radio-ip" placeholder="Quận huyện"></input>
//                             </div>
//                             <div><label>Phường xã</label>
//                                 <input type={'text'} className="form-control radio-ip" placeholder="Phường xã"></input>
//                             </div>
//                             <div><label>Địa chỉ</label>
//                                 <input type={'text'} className="form-control radio-ip" placeholder="Nhập số nhà/Tên đường"></input>
//                             </div>
//                         </form>
//                     </div>
//                     <div className="checkout2">
//                         <p style={{ fontWeight: '600' }}>2. Hình thức lấy hàng</p>
//                         <div className="ck-content">
//                             <form className="form-htgh ms-5">
//                                 <div className=" d-flex">
//                                     <input type={'radio'} name="ip-rdo"></input> <label>Lấy tại cửa hàng</label>
//                                     <input type={'radio'} name="ip-rdo"></input> <label>Lấy tại nhà</label>
//                                 </div>
//                             </form>
//                             {products.map(pro => (
//                                 <div className="row d-flex" key={pro.id}>
//                                     <div className="col-3 img">
//                                         <img alt="Ảnh sản phẩm" src={product} className="img-content"></img>
//                                     </div>
//                                     <div className="col-9 mt-3 d-block ">
//                                         <div>
//                                             <p className="text-name">{pro.name}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-12 col-md-5">
//                     <p style={{ fontWeight: '600' }}>3. Đơn hàng</p>
//                     <div className="content-right ">
//                         <div className="row d-flex">
//                             <div className="col-8">
//                                 <input type={'text'} className="form-control ip-sale mb-3 radio-ip" placeholder="Nhập mã giảm giá"></input>
//                                 <p>Số lượng sản phẩm: {products.length}</p>
//                                 <p>tên sản phẩm</p>
//                             </div>
//                             <div className="col-4"><button className="btn btn-primary btn-sale">Sửa</button>
//                                 <button className="btn btn-danger mt-2 btn-sale">Áp dụng</button>
//                             </div>
//                         </div>
//                         <hr></hr>
//                         <span style={{ color: 'red', fontSize: '20px', fontWeight: '700' }}>Thành Tiền : 300000000đ</span>
//                     </div>
//                     <p style={{ fontWeight: '600' }}>4. Hình thức thanh toán</p>
//                     <div className="content-right ">
//                         <div >
//                             <form className="form-htgh ms-5">
//                                 <div><input type={'radio'} name="ip-ht"></input> <label>Thanh toán tiền mặt khi nhận hàng</label></div>
//                                 <div><input type={'radio'} name="ip-ht"></input> <label>Thanh toán chuyển khoản qua ngân hàng</label></div>
//                                 <div><input type={'radio'} name="ip-ht"></input> <label>Thanh toán qua VN PAY</label></div>
//                             </form>
//                         </div>
//                     </div>
//                     <div className="row">
//                         <div className="col-12">
//                             <button className="btn btn-danger form-control btn-ck">Đặt hàng</button>
//                         </div>
//                         <div className="col-6 mt-2">
//                             <button className="btn btn-primary form-control btn-ck ">Chọn sản phẩm</button>
//                         </div>
//                         <div className="col-6 mt-2">
//                             <button className="btn btn-success form-control btn-ck">Tải file excel</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Checkout;

import React, { useEffect, useState, useContext } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import product from '../../asset/images/products/product01.png';
import './css/checkout.css';
import StoreContext from '../../store/Context';

function Checkout() {
    const [state, dispath] = useContext(StoreContext);
    const products = state.cartCheckout;
    console.log('list products', products)
    const carts = state.cartCheckout;
    const [valueDistrict, setValueDistrict] = useState("");
    const [array, setArray] = useState([{}]);
    const [district, setDistrict] = useState([{}]);
    const [ProvinceID, setProvinceID] = useState();
    const [value, setValue] = useState("");
    const [districtId, setDistrictId] = useState(1542);
    const [serviceId, setServiceId] = useState();
    const [isDisabled, setIsDisabled] = useState(false);
    const [Ward, setWard] = useState([{}]);
    const [valueWard, setValueWard] = useState("");
    const [shipping, setShipping] = useState(0);
    const [address, setAddRess] = useState();
    const [type, setType] = useState();
    const [payment, setPayment] = useState();
    const [total, setTotal] = useState();
    const [status, setStatus] = useState();

    const createOrder = () => {
        fetch(
            `http://localhost:8080/api/orders`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 1,
                    total: total,
                    payment: payment,
                    type: type,
                    address: address,
                    status: status,
                    orderDetails: getListsetListOrderDetails(carts)
                })
            }
        )
            .then((res) => res.json())
            .then((results) => {
                if (results.data === null) {
                    toastError(results.message);
                } else {
                    toastSuccess("Thêm mới thành công!");
                }
            });
    }

    const getListsetListOrderDetails = (carts) => {
        let cartList = carts;
        let listItem = [];
        let item;
        for (var i = 0; i < cartList.length; i++) {
            item = {
                productId: cartList[i].id,
                money: cartList[i].price,
                quantity: cartList[i].quantity,
                status: 1,
            }
            listItem.push(item)
        }
        return listItem;
    }

    useEffect(() => {
        loadDataProvince();
        setTotal(getTotal(carts));
    }, []);

    const _handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setValueDistrict(e.target.value);
        }
    };

    const changePayment = (event) => {
        setPayment(event.target.value)
    }

    const changeType = (event) => {
        setType(event.target.value)
        if (event.target.value === 0) {
            setStatus('0');
        } else {
            setStatus('1');
        }
    }

    const changeAddress = (event) => {
        setAddRess(event.target.value)
    }

    const onSearchWard = (searchTerm, value) => {
        if (searchTerm != null) {
            setValueWard(searchTerm);
        } else {
            valueWard = isDisabled;
        }

        if (value != null) {
            setShipping(value);
            SubmitShipping(value);
        }
    };

    const onChangeProvince = (event) => {
        setValue(event.target.value);
    };

    const onChangeWard = (event) => {
        setValueWard(event.target.value);
    };

    const onChangeDistrict = (event) => {
        setValueDistrict(event.target.value);
        setIsDisabled(false);
    };

    const onSearchProvince = (searchTerm, value) => {
        setValue(searchTerm);
        setProvinceID(value);
        loadDataDistrict(value);
    };

    const onSearchDistrict = (searchTerm, value) => {
        setValueDistrict(searchTerm);
        setDistrictId(value);
        if (value != null) {
            loadDataWard(value);
        }
    };

    const SubmitShipping = (value) => {
        if (value != null) {
            fetch(
                "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        service_id: serviceId,
                        token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
                    },
                    body: JSON.stringify({
                        service_id: serviceId,
                        insurance_value: 500000,
                        coupon: null,
                        from_district_id: 3440,
                        to_district_id: districtId,
                        to_ward_code: value,
                        height: 15,
                        length: 15,
                        weight: 1000,
                        width: 15,
                    }),
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    setShipping(data.data.total);
                })
        }
    };

    const loadDataWard = (value) => {
        if (value != null) {
            fetch(
                "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
                    },
                    body: JSON.stringify({
                        shop_id: 3379752,
                        from_district: 1542,
                        to_district: value,
                    }),
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.data === null) {
                        console.log("không có dữ liệu giao hàng phù hợp");
                        setIsDisabled(true);
                    } else {
                        console.log("Success service:", data.data);
                        console.log("data service id: " + data.data[0].service_id);
                        const checkValue = data.data[0].service_id;
                        setServiceId(checkValue);
                        console.log("check Value: " + checkValue);
                        console.log("service id sau khi set: " + serviceId);
                        fetch(
                            "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Accept: "application/json",
                                    token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
                                },
                                body: JSON.stringify({
                                    district_id: value,
                                }),
                            }
                        )
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.data === null) {
                                    console.log("không có dữ liệu phù hợp");
                                } else {
                                    console.log("Success ward:", data.data);
                                    setWard(data.data);
                                }
                            })
                    }
                })
        }
    };

    const loadDataProvince = () => {
        fetch(
            "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
                },
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log(result.data);
                setArray(result.data);
            })
            .catch((error) => {
                console.log("err", error);
            });
    };

    const loadDataDistrict = (value) => {
        console.log("load Province Id: " + value);
        fetch(
            "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
                },
                body: JSON.stringify({
                    province_id: value,
                }),
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                setDistrict(result.data);
            })
    };

    const toastSuccess = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })
    };

    const toastError = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    

    const getTotal = (carts) => {
        let cartList = carts;
        let price = 0;
        for (let i = 0; i < cartList.length; i++) {
            price += cartList[i].price;
        }
        return price;
    }
    const showCarts = (carts) => {
        let cartList = carts;
        if (cartList.length > 0) {
            // for(i=0;i<cartList.length;i++){
            const listItems = cartList.map((cart) =>
                <div className="row d-flex">
                    <div className="col-3 img">
                        <img alt="Ảnh sản phẩm" src={product} className="img-content"></img>
                    </div>
                    <div className="col-5 mt-5 d-block ">
                        <div>
                            <p className="text-name">x{cart.quantity} - {cart.name}
                            </p>
                        </div>
                    </div>
                    <div className="col-4 mt-5">
                        <p className="text-name">{cart.price} VNĐ</p>
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
                                <input type={'text'} className="form-control radio-ip" placeholder="Họ tên" disabled={'true'}></input>
                            </div>
                            <div><label>Số điện thoại</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Số điện thoại" disabled={'true'}></input>
                            </div>
                            <div><label>Email</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Email" disabled={'true'}></input>
                            </div>
                            <div className="search-inner">
                                <label>Tỉnh/Thành phố</label>
                                <input
                                    type={'text'}
                                    className="form-control radio-ip"
                                    placeholder="Tên tỉnh thành"
                                    value={value}
                                    onChange={onChangeProvince}
                                    onClick={() => onSearchProvince(value)}
                                />
                            </div>
                            <div className="dropdown">
                                {array
                                    .filter((item) => {
                                        const searchTerm = value.toString().toLowerCase();
                                        const fullName =
                                            item.ProvinceName !== undefined
                                                ? item.ProvinceName.toLowerCase()
                                                : "";
                                        return (
                                            searchTerm &&
                                            fullName.startsWith(searchTerm) &&
                                            fullName !== searchTerm
                                        );
                                    })
                                    .slice(0, 10)
                                    .map((item) => (
                                        <div
                                            onClick={() =>
                                                onSearchProvince(item.ProvinceName, item.ProvinceID)
                                            }
                                            className="dropdown-row"
                                            key={item.ProvinceName}
                                        >
                                            {item.ProvinceName}
                                        </div>
                                    ))}
                            </div>
                            <div className="search-inner">
                                <label>Tên quận huyện</label>
                                <input
                                    type={'text'}
                                    className="form-control radio-ip"
                                    placeholder="Tên quận huyện"
                                    value={valueDistrict}
                                    onChange={onChangeDistrict}
                                    onClick={() => onSearchDistrict(valueDistrict)}
                                    onKeyDown={_handleKeyDown}
                                />
                            </div>
                            <div className="dropdown">
                                {district
                                    .filter((item) => {
                                        const searchTerm = valueDistrict.toString().toLowerCase();
                                        const fullName =
                                            item.DistrictName !== undefined
                                                ? item.DistrictName.toLowerCase()
                                                : "";

                                        return (
                                            searchTerm &&
                                            fullName.startsWith(searchTerm) &&
                                            fullName !== searchTerm
                                        );
                                    })
                                    .slice(0, 5)
                                    .map((item) => (
                                        <div
                                            onClick={() =>
                                                onSearchDistrict(item.DistrictName, item.DistrictID)
                                            }
                                            className="dropdown-row"
                                            key={item.DistrictID}
                                        >
                                            {item.DistrictName}
                                        </div>
                                    ))}
                            </div>
                            <div className="search-inner">
                                <label>Tên phường xã</label>
                                <input
                                    type={'text'}
                                    className="form-control radio-ip"
                                    placeholder="Tên phường xã"
                                    value={valueWard}
                                    disabled={isDisabled}
                                    onChange={onChangeWard}
                                    onClick={() => onSearchWard(valueWard)}
                                />
                            </div>
                            <div className="dropdown">
                                {Ward.filter((item) => {
                                    const searchTerm = valueWard.toString().toLowerCase();
                                    const fullName = item.WardName !== undefined
                                        ? item.WardName.toLowerCase() : "";

                                    return (
                                        searchTerm &&
                                        fullName.startsWith(searchTerm) &&
                                        fullName !== searchTerm
                                    );
                                })
                                    .slice(0, 10)
                                    .map((item) => (
                                        <div
                                            onClick={() =>
                                                onSearchWard(item.WardName, item.WardCode)
                                            }
                                            className="dropdown-row"
                                            key={item.WardName}
                                        >
                                            {item.WardName}
                                        </div>
                                    ))}
                            </div>
                            <div><label>Địa chỉ</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Nhập số nhà/Tên đường" onChange={changeAddress}></input>
                            </div>
                        </form>
                    </div>
                    <div className="checkout2">
                        <p style={{ fontWeight: '600' }}>2. Hình thức lấy hàng</p>
                        <div className="ck-content">
                            <form className="form-htgh ms-5">
                                <div className=" d-flex">
                                    <input type={'radio'} name="ip-rdo" value={'0'} onChange={changeType}></input> <label>Lấy tại cửa hàng</label>
                                    <input type={'radio'} name="ip-rdo" value={'1'} onChange={changeType}></input> <label>Lấy tại nhà</label>
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
                        <div className="form-group">
                            <label>Phí vận chuyển</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={shipping}
                                    onChange={(e) => setShipping(e.target.value)}
                                    className="form-control"
                                    placeholder="0"
                                    disabled
                                />
                                <span className="input-group-text">VNĐ</span>
                            </div>
                        </div>
                        <hr></hr>
                        <span style={{ color: 'red', fontSize: '20px', fontWeight: '700' }}>Thành tiền: {getTotal(carts) + shipping} VNĐ</span>
                    </div>
                    <p style={{ fontWeight: '600' }}>4. Hình thức thanh toán</p>
                    <div className="content-right ">
                        <div >
                            <form className="form-htgh ms-5">
                                <div><input type={'radio'} name="ip-ht" value={'0'} onChange={changePayment}></input> <label>Thanh toán tiền mặt khi nhận hàng</label></div>
                                <div><input type={'radio'} name="ip-ht" value={'1'} onChange={changePayment}></input> <label>Thanh toán qua VN PAY</label></div>
                            </form>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-danger form-control btn-ck" onClick={createOrder}>Đặt hàng</button>
                        </div>
                        <div className="col-6 mt-2">
                            <button className="btn btn-primary form-control btn-ck ">Chọn sản phẩm</button>
                        </div>
                        <div className="col-6 mt-2">
                            <button className="btn btn-success form-control btn-ck">Tải file excel</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Checkout;