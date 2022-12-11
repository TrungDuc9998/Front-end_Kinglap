import { Input, Select } from "antd";
import { Option } from "antd/lib/mentions";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreContext from "../../store/Context";

function Checkout() {
  const navigate = useNavigate();
  const [state, dispath] = useContext(StoreContext);
  const [carts, setCarts] = useState(state.cartCheckout);
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
  const [disableCountry, setDisableCountry] = useState(false);
  const [valueProvince, setValueProvince] = useState();
  const [wardCode, setWardCode] = useState(1);

  const createOrder = () => {
    if (name === "" || name == null) {
      toastError("Vui lòng nhập đầy đủ họ tên!");
    } else if (phone === "" || phone == null) {
      toastError("Vui lòng nhập đầy đủ số điện thoại!");
    } else if (type === "" || type == null) {
      toastError("Vui lòng chọn hình thức lấy hàng!");
    } else if (type == "1" && (ProvinceID === "" || ProvinceID == null || districtId === "" || districtId == null || wardCode === "" || wardCode == null || address === "" || address == null)) {
      toastError("Vui lòng nhập đầy đủ địa chỉ giao hàng!");
    } else if (payment === "" || payment == null) {
      toastError("Vui lòng chọn hình thức thanh toán!");
    } else {
      if (payment === "DAT_COC") {
        localStorage.setItem(
          "total",
          parseInt(getTotal(carts)) + parseInt(shipping)
        );
        localStorage.setItem("payment", payment);
        localStorage.setItem("address", address);
        localStorage.setItem("type", type);
        localStorage.setItem("phone", phone);
        localStorage.setItem("customerName", name);
        localStorage.setItem("status", status);
        localStorage.setItem(
          "orderDetails",
          JSON.stringify(getListSetListOrderDetails(carts))
        );
        localStorage.setItem("valueWard", valueWard);
        localStorage.setItem("valueDistrict", valueDistrict);
        localStorage.setItem("value", value);
        fetch(`http://localhost:8080/api/vnpay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vnp_OrderInfo: "Đặt cọc qua VnPay cho khách hàng " + name,
            orderType: "other",
            amount: (parseInt(getTotal(carts)) + parseInt(shipping)) * 0.1,
            bankCode: "NCB",
            language: "vn",
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            window.location = data.paymentUrl;
          });
      } else {
        localStorage.setItem(
          "total",
          parseInt(getTotal(carts)) + parseInt(shipping)
        );
        localStorage.setItem("payment", payment);
        localStorage.setItem("address", address);
        localStorage.setItem("type", type);
        localStorage.setItem("phone", phone);
        localStorage.setItem("customerName", name);
        localStorage.setItem("status", status);
        localStorage.setItem(
          "orderDetails",
          JSON.stringify(getListSetListOrderDetails(carts))
        );
        localStorage.setItem("valueWard", valueWard);
        localStorage.setItem("valueDistrict", valueDistrict);
        localStorage.setItem("value", value);
        fetch(`http://localhost:8080/api/vnpay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vnp_OrderInfo: "Đặt cọc qua VnPay cho khách hàng " + name,
            orderType: "other",
            amount: (parseInt(getTotal(carts)) + parseInt(shipping)),
            bankCode: "NCB",
            language: "vn",
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            window.location = data.paymentUrl;
          });
      }
    }
  };

  const formatCash = (str) => {
    if (str.length > 1) {
      return str
        .split("")
        .reverse()
        .reduce((prev, next, index) => {
          return (index % 3 ? next : next + ",") + prev;
        });
    } else {
      return "";
    }
  };

  const getListSetListOrderDetails = (carts) => {
    let cartList = carts;
    let listItem = [];
    let item;
    for (var i = 0; i < cartList.length; i++) {
      item = {
        productId: cartList[i].id,
        total: cartList[i].price * cartList[i].quantity,
        quantity: cartList[i].quantity,
        status: status === "CHO_XAC_NHAN" ? "CHO_XAC_NHAN" : "CHO_LAY_HANG",
      };
      listItem.push(item);
    }
    return listItem;
  };

  useEffect(() => {
    //informations = information[0].address.split(",");
    setName(information[0].fullName)
    setPhone(information[0].phoneNumber)
    localStorage.getItem("")
    setTotal(getTotal(carts));
    loadInfo(carts);
  }, []);

  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setValueDistrict(e.target.value);
    }
  };

  const changePayment = (event) => {
    setPayment(event.target.value);
    console.log(event.target.value);
    if (event.target.value === "DAT_COC") {
      setStatus("CHO_XAC_NHAN");
    } else {
      setStatus("CHO_LAY_HANG");
    }
  };

  const onChangeDistricts = (value) => {
    if (value != null) {
      setIsDisabled(false);
    }
    setDistrictId(value);
    loadDataWard(value);
  };

  const onSearchDistricts = (value) => {
    if (value.target.innerText !== "") {
      setValueDistrict(value.target.innerText);
      loadDataWard();
    }
  };

  const changeType = (event) => {
    console.log(event.target.value)
    setType(event.target.value);
    if (event.target.value == 1) {
      loadDataProvince();
    } else {
      setShipping(0)
    }
  };

  const changeAddress = (event) => {
    setAddRess(event.target.value);
  };

  const changeName = (event) => {
    console.log(event.target.value)
    setName(event.target.value);
  };

  const changePhone = (event) => {
    console.log(event.target.value)
    setPhone(event.target.value);
  };

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

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

  const SubmitShipping = (value, serviceId) => {
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
    if (value != null) {
      console.log(serviceId);
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
            height: Math.round(height * 0.1),
            length: Math.round(length * 0.1),
            weight: Math.round(weight * 1000),
            width: Math.round(width * 0.1),
            to_ward_code: value,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data.data)
          setShipping(data.data.total);
        });
    }
  };

  const onChangeWards = (value) => {
    if (value === "") {
      setIsDisabled(true);
    }
    setWardCode(value);
    SubmitShipping(value);
  };

  const onSearchWards = (value) => {
    if (value.target.innerText !== "") {
      setValueWard(value.target.innerText);
      SubmitShipping();
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
            const checkValue = data.data[0].service_id;
            setServiceId(checkValue);
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
                  data.data.forEach((element) => {
                    if (element.WardName === information[0].address.split(",")[2]) {
                      SubmitShipping(element.WardCode, checkValue)
                    }
                  })
                }
              });
          }
        });
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
        result.data.forEach(element => {
          if (element.ProvinceName === information[0].address.split(",")[0]) {
            loadDataDistrict(element.ProvinceID);
          }
        });
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const toOtherProduct = () => {
    navigate('/user')
  }

  const loadDataDistrict = (value) => {
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
        result.data.forEach((element) => {
          if (element.DistrictName === information[0].address.split(",")[1]) {
            loadDataWard(element.DistrictID)
          }
        })
      });
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
    });
  };

  const onChange = (value) => {
    setProvinceID(value);
    loadDataDistrict(value);
  };

  const onSearch = (value) => {
    if (value.target.innerText !== "") {
      setValueProvince(value.target.innerText);
      loadDataDistrict();
    }
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
  };

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
  };

  const getTotal = (carts) => {
    let cartList = carts;
    let price = 0;
    let total = 0;
    for (let i = 0; i < cartList.length; i++) {
      price = price + (cartList[i].price * cartList[i].quantity);
      total += cartList[i].total;
    }
    return price;
  };

  const information = JSON.parse(localStorage.getItem("information"));

  const showCarts = (carts) => {
    let cartList = carts;
    if (cartList.length > 0) {
      // for(i=0;i<cartList.length;i++){
      const listItems = cartList.map((cart) => (
        <div className="row d-flex">
          <div className="col-3 img mt-2">
            <img alt="Ảnh sản phẩm" src={cart.images[0].name} className="img-content"></img>
          </div>
          <div className="col-5 mt-5 d-block ">
            <div>
              <p className="text-name">
                x{cart.quantity} - {cart.name}
              </p>
            </div>
          </div>
          <div className="col-4 mt-5">
            <p className="text-name">{formatCash(cart.price * cart.quantity + "")} VNĐ</p>
          </div>
        </div>
      ));
      return listItems;
      // };
    }
  };
  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="checkout row pt-2 pb-4">
        <div className="col-12 col-md-7 mt-2">
          <p style={{ fontWeight: "600" }}>1. Thông tin khách hàng</p>
          <div className="ck-content">
            <form className="form-info p-0 ">
              <div>
                <label>Họ tên</label>
                <input
                  type={"text"}
                  className="form-control radio-ip"
                  placeholder="Họ tên"
                  onChange={changeName}
                  defaultValue={information[0]?.fullName}
                ></input>
              </div>
              <div>
                <label>Số điện thoại</label>
                <input
                  type={"text"}
                  className="form-control radio-ip"
                  placeholder="Số điện thoại"
                  onChange={changePhone}
                  defaultValue={information[0]?.phoneNumber}
                ></input>
              </div>
            </form>
          </div>
          <div className="checkout2">
            <p style={{ fontWeight: "600" }}>2. Hình thức lấy hàng</p>
            <div className="ck-content">
              <form className="form-htgh ms-5">
                <div className=" d-flex">
                  <input
                    type={"radio"}
                    name="ip-rdo"
                    value={"0"}
                    onChange={changeType}
                  ></input>{" "}
                  <label>Lấy tại cửa hàng</label>
                  <input
                    type={"radio"}
                    name="ip-rdo"
                    value={"1"}
                    onChange={changeType}
                  ></input>{" "}
                  <label>Lấy tại nhà</label>
                </div>
              </form>
              {showCarts(carts)}
            </div>
          </div>
          <div>
            {type === "1" ? (
              <div>
                <div className="row ck-content">
                  <div className="col-12" style={{ paddingLeft: "20px" }}>
                    <p style={{ fontWeight: "600" }}>Địa chỉ giao hàng</p>
                    
                    <div>
                      <div className="search-container mb-2">
                        <div className="search-inner">
                          <label>Tỉnh/ Thành Phố</label>
                          <Select
                            defaultValue={information[0].address.split(",")[0]}
                            disabled={disableCountry}
                            showSearch
                            placeholder="Tỉnh/thành phố"
                            optionFilterProp="children"
                            style={{
                              width: 380,
                              marginLeft: "36px",
                            }}
                            onChange={onChange}
                            onClick={onSearch}
                            filterOption={(input, option) =>
                              option.children.toLowerCase().includes(input.toLowerCase())
                            }
                          >
                            {array.map((item) => (
                              <Option key={item.ProvinceID} value={item.ProvinceID}>
                                {item.ProvinceName}
                              </Option>
                            ))}
                          </Select>
                        </div></div>
                      <div className="search-container mb-2">
                        <div className="search-inner">
                          <label>Tên quận huyện</label>
                          <Select
                            defaultValue={information[0].address.split(",")[1]}
                            showSearch
                            disabled={disableCountry}
                            placeholder="Quận/huyện"
                            optionFilterProp="children"
                            style={{
                              width: 380,
                              marginLeft: "38px",
                            }}
                            onChange={onChangeDistricts}
                            onClick={onSearchDistricts}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {district.map((item) => (
                              <Option key={item.DistrictID} value={item.DistrictID}>
                                {item.DistrictName}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div className="search-container mb-2">
                        <div className="search-inner">
                          <label>Tên phường xã</label>
                          <Select
                            defaultValue={information[0].address.split(",")[2]}
                            showSearch
                            placeholder="Phường/xã"
                            optionFilterProp="children"
                            style={{
                              width: 380,
                              marginLeft: "43px",
                            }}
                            onChange={onChangeWards}
                            onClick={onSearchWards}
                            disabled={disableCountry}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {Ward.map((item) => (
                              <Option key={item.WardCode} value={item.WardCode}>
                                {item.WardName}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label>Địa chỉ</label>
                      <input
                        defaultValue={information[0].address.split(",")[3]}
                        style={{
                          width: 380,
                          marginLeft: "97px",
                          borderRadius: "2px",
                        }}
                        type={"text"}
                        placeholder="Nhập số nhà/Tên đường"
                        onChange={changeAddress}
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="col-12 col-md-5 mt-1">
          <p style={{ fontWeight: "600" }}>3. Đơn hàng</p>
          <div className="content-right ">
            <div className="row d-flex">
              {/* <div className="col-8">
                                <input type={'text'} className="form-control ip-sale mb-3 radio-ip" placeholder="Nhập mã giảm giá"></input>
                                <p>số lượng sản phẩm</p>
                                <p>tên sản phẩm</p>
                            </div> */}
              {/* <div className="col-4"><button className="btn btn-primary btn-sale">Sửa</button>
                                <button className="btn btn-danger mt-2 btn-sale">Áp dụng</button>
                            </div> */}
            </div>
            <div className="form-group">
              <label>Phí vận chuyển</label>
              {/* <div className="input-group"> */}
              <Input
                style={{ borderRadius: "16px" }}
                type="text"
                value={formatCash(shipping + "")}
                onChange={(e) => setShipping(e.target.value)}
                className="form-control fw-bold text-danger"
                placeholder="0"
                disabled
              />
              <img style={{ width: "200px", height: "150px", marginLeft: "130px" }} src="https://inkythuatso.com/uploads/images/2021/12/thiet-ke-khong-ten-04-13-29-21.jpg"></img>
              {/* <span className="input-group-text">VNĐ</span>
                            </div> */}
            </div>
            <hr></hr>
            <span style={{ color: "red", fontSize: "20px", fontWeight: "700" }}>
              Thành tiền:{" "}
              {formatCash(parseInt(getTotal(carts)) + parseInt(shipping) + "")}{" "}
              VNĐ
            </span>
          </div>
          <p style={{ fontWeight: "600" }}>4. Hình thức thanh toán</p>
          <div className="content-right ">
            <div>
              <form className="form-htgh ms-5">
                <div>
                  <input
                    type={"radio"}
                    name="ip-ht"
                    value={"VN_PAY"}
                    onChange={changePayment}
                  ></input>{" "}
                  <label>Thanh toán qua VN PAY</label>
                </div>
                <div>
                  <input
                    type={"radio"}
                    name="ip-ht"
                    value={"DAT_COC"}
                    onChange={changePayment}
                  ></input>{" "}
                  <label>Đặt cọc qua VN PAY</label>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button
                className="btn btn-danger form-control btn-ck"
                onClick={createOrder}
              >
                Đặt hàng
              </button>
            </div>
            <div className="col-12 mt-2">
              <button className="btn btn-primary form-control btn-ck "
                data-bs-toggle="collapse"
                href="#multiCollapseExample1"
                role="button" aria-expanded="false"
                aria-controls="multiCollapseExample1"
              >
                Thêm sản phẩm
              </button>
            </div>
            <div className="col-6 mt-2">
              {/* <button className="btn btn-success form-control btn-ck">
                Tải file excel
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
