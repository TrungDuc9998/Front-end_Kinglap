import React, { useEffect, useState, useContext } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import product from '../../asset/images/products/product01.png';
import './css/checkout.css';
import StoreContext from '../../store/Context';

function Checkout() {
    const [state, dispath] = useContext(StoreContext);
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
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [type, setType] = useState();
    const [payment, setPayment] = useState();
    const [total, setTotal] = useState();
    const [status, setStatus] = useState();
    const [user, setUser] = useState();
    const [totalHeight, setTotalHeight] = useState();
    const [totalLength, setTotalLength] = useState();
    const [totalWeight, setTotalWeight] = useState();
    const [totalWith, setTotalWidth] = useState();

    const createOrder = () => {
        if (status == 0) {
            fetch(
                `http://localhost:8080/api/orders`,
                {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: 147,
                        total: parseInt(getTotal(carts)) + parseInt(shipping),
                        payment: payment,
                        // type: type,
                        address: type === 1 ? 'TẠI CỬA HÀNG' : (address + ', ' + valueWard + ', ' + valueDistrict + ', ' + value),
                        phone: phone,
                        customerName: name,
                        // email: email,
                        status: status,
                        orderDetails: getListSetListOrderDetails(carts)
                    })
                }
            )
                .then((results) => {
                    if (results.status == 200) {
                        toastSuccess("Đặt hàng thành công!");
                    } else {
                        toastError(results.message);
                    }
                });
        } else {
            fetch(
                `http://localhost:8080/api/vnpay`,
                {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        vnp_OrderInfo: "Thanh toán VnPay cho khách hàng " + name,
                        orderType: "other",
                        amount: parseInt(getTotal(carts)) + parseInt(shipping),
                        bankCode: "NCB",
                        language: "vn"
                    })
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    window.location.href = data.paymentUrl;
                })
        }
    }

    const formatCash = (str) => {
        if (str.length > 1) {
            return str.split('').reverse().reduce((prev, next, index) => {
                return ((index % 3) ? next : (next + ',')) + prev
            })
        } else {
            return ""
        }
    }

    const getListSetListOrderDetails = (carts) => {
        let cartList = carts;
        let listItem = [];
        let item;
        for (var i = 0; i < cartList.length; i++) {
            item = {
                productId: cartList[i].id,
                total: cartList[i].price * cartList[i].quantity,
                quantity: cartList[i].quantity,
                status: status === 'CHO_XAC_NHAN' ? 'CHO_XAC_NHAN' : 'CHO_LAY_HANG',
            }
            listItem.push(item)
        }
        return listItem;
    }

    useEffect(() => {
        loadDataProvince();
        setTotal(getTotal(carts));
        loadInfo(carts);
    }, []);

    const _handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setValueDistrict(e.target.value);
        }
    };

    const changePayment = (event) => {
        setPayment(event.target.value)
        console.log(event.target.value)
        if (event.target.value === "0") {
            setStatus('CHO_XAC_NHAN');
        } else {
            setStatus('CHO_LAY_HANG');
        }
    }

    const changeType = (event) => {
        setType(event.target.value)
    }

    const changeAddress = (event) => {
        setAddRess(event.target.value)
    }

    const changeName = (event) => {
        setName(event.target.value)
    }

    const changePhone = (event) => {
        setPhone(event.target.value)
    }

    const changeEmail = (event) => {
        setEmail(event.target.value)
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
                        to_district_id: 1875,
                        height: Math.round(totalHeight * 0.1),
                        length: Math.round(totalLength * 0.1),
                        weight: Math.round(totalWeight * 1000),
                        width: Math.round(totalLength * 0.1),
                        to_ward_code: value,
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

    const loadInfo = (carts) => {
        let cartList = carts;
        let weight = 0;
        let width = 0;
        let height = 0;
        let length = 0;
        for (let i = 0; i < cartList.length; i++) {
            weight += cartList[i].weight * cartList[i].quantity;
            width += cartList[i].width * cartList[i].quantity;
            height += cartList[i].height * cartList[i].quantity;
            length += cartList[i].length * cartList[i].quantity;
        }
        setTotalWeight(weight);
        setTotal(total);
        setTotalLength(length);
        setTotalHeight(height);
        setTotalWidth(width);
    }

    const getTotal = (carts) => {
        let cartList = carts;
        let price = 0;
        let total = 0;
        for (let i = 0; i < cartList.length; i++) {
            price += cartList[i].price;
            total += cartList[i].total;
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
                        <p className="text-name">{formatCash(cart.price + "")} VNĐ</p>
                    </div>
                </div>
            )
            return listItems;
            // };
        }

    }
    return (
        <>
            <ToastContainer></ToastContainer>
            <div className="checkout row pt-2 mt-5 pb-4">
                <div className="col-12 col-md-7">
                    <p style={{ fontWeight: '600' }}>1. Địa chỉ giao hàng</p>
                    <div className="ck-content">
                        <form className="form-info p-0 ">
                            <div><label>Họ tên</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Họ tên" onChange={changeName}></input>
                            </div>
                            <div><label>Số điện thoại</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Số điện thoại" onChange={changePhone}></input>
                            </div>
                            <div><label>Email</label>
                                <input type={'text'} className="form-control radio-ip" placeholder="Email" onChange={changeEmail}></input>
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
                                    value={formatCash(shipping + "")}
                                    onChange={(e) => setShipping(e.target.value)}
                                    className="form-control"
                                    placeholder="0"
                                    disabled
                                />
                                <span className="input-group-text">VNĐ</span>
                            </div>
                        </div>
                        <hr></hr>
                        <span style={{ color: 'red', fontSize: '20px', fontWeight: '700' }}>Thành tiền: {formatCash(parseInt(getTotal(carts)) + parseInt(shipping) + "")} VNĐ</span>
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