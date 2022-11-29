import { Select, Input, Button, InputNumber, Space, Image } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import "../Order/table.css";
import { Table, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import CurrencyFormat from "react-currency-format";
const { Option } = Select;
const { TextArea } = Input;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});

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

function Table1() {
  const [value, setValue] = useState("");
  const [users, setUsers] = useState();
  const [getFullName, setFullNameClient] = useState();
  const [valueUser, setValueUser] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();
  const [phoneClient, setPhoneClient] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [address, setAddRess] = useState();
  const [fullNameForm, setFullNameForm] = useState();
  const [phoneNumberForm, setPhoneNumberForm] = useState();
  const [addressForm, setAddRessForm] = useState();
  const [username, setUsername] = useState();
  const [open, setOpen] = useState(false);
  const [addressDetail, setAddressDetail] = useState();
  const [quantity, setQuantity] = useState();
  const [array, setArray] = useState([{}]);
  const [district, setDistrict] = useState([{}]);
  const [isDelete, setDelete] = useState(false);
  const [id, setId] = useState();
  const [Ward, setWard] = useState([{}]);
  const [disableCountry, setDisableCountry] = useState(false);
  const [districtId, setDistrictId] = useState(1);
  const [wardCode, setWardCode] = useState(1);
  const [shipping, setShipping] = useState(0);
  const [serviceId, setServiceId] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [ProvinceID, setProvinceID] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [dataCart, setDataCart] = useState();
  const [dataClient, setDataClient] = useState();
  const [valueProduct, setValueProduct] = useState("");
  const [valueClient, setValueClient] = useState("");
  const [total, setTotal] = useState(0);
  const [valueProvince, setValueProvince] = useState();
  const [valueDistrict, setValueDistrict] = useState();
  const [payment, setPayment] = useState();
  const [valueWard, setValueWard] = useState();
  const [valueQuantity, setValueQuantity] = useState();
  const [totalWith, setTotalWidth] = useState();
  const [totalHeight, setTotalHeight] = useState();
  const [totalLength, setTotalLength] = useState();
  const [totalWeight, setTotalWeight] = useState();
  const [note, setNote] = useState();
  const [userId, setUserId] = useState();
  const [discounts, setDiscounts] = useState();
  const [userNameLogin, setUserNameLogin] = useState();
  const [typeOrder, setTypeOrder] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const [tableParamDiscount, setTableParamDiscount] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      searchStatus: 1,
    },
  });

  const loadDataDisCount = () => {
    fetch(
      `http://localhost:8080/api/discount?${qs.stringify(
        getRandomuserParams(tableParamDiscount)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDiscounts(results.data.data);
        console.log(results.data.data);
        setLoading(false);
        setTableParamDiscount({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadInfo = () => {
    fetch(
      `http://localhost:8080/api/information?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setUsers(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const handleOk = () => {
    if (password2 === password1) {
      fetch(`http://localhost:8080/api/orders/createUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          newPassword: password1,
          fullName: fullName,
          email: email,
          phoneNumber: phoneNumber,
          address: address,
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          if (results.data == null) {
            toastError(results.message);
          } else {
            toastSuccess("Thêm mới thành công!");
            setUsername("");
            setPassword1("");
            setPassword2("");
            setFullName("");
            setEmail("");
            setPhoneNumber("");
            setAddRess("");
            setOpen(false);
          }
        });
    } else {
      toastError("Xác nhận tài khoản không chính xác!");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleChangePayment = (value) => {
    if (value === "TẠI CỬA HÀNG") {
      setDisableCountry(true);
    } else {
      setDisableCountry(false);
    }
    setTypeOrder(value);
  };

  const handleChangePayment2 = (value) => {
    setPayment(value);
  };

  const handleSubmitOrder = () => {
    console.log(dataCart.length);
    if (dataCart === undefined || dataCart.length === 0) {
      toastError("Vui lòng thêm sản phẩm vào giỏ hàng");
    } else if (
      payment === undefined ||
      typeOrder === undefined ||
      (fullNameForm === undefined && valueUser === undefined) ||
      (phoneClient === undefined && phoneNumberForm === undefined)
    ) {
      toastError("Vui lòng điền đầy đủ thông tin !");
    } else {
      const order = {
        payment: payment,
        total: total + shipping,
        userId: userId === undefined ? 1 : userId,
        address:
          valueProvince !== undefined
            ? (addressDetail === undefined ? "" : addressDetail + ",") +
              valueWard +
              ", " +
              valueDistrict +
              ", " +
              valueProvince
            : "TẠI CỬA HÀNG",
        note: note,
        customerName: valueUser === undefined ? fullNameForm : valueUser,
        phone: phoneClient === undefined ? phoneNumberForm : phoneClient,
        money: 0,
        status: "CHO_XAC_NHAN",
      };
      const orderDetails = [];
      dataCart?.forEach((item, index) => {
        orderDetails.push({
          quantity: item.quantity,
          status: "CHO_XAC_NHAN",
          total: item.total,
          productId: item.productId.id,
          isCheck: null,
        });
      });
      console.log(orderDetails);
      try {
        fetch("http://localhost:8080/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment: order.payment,
            userId: order.userId | null,
            total: order.total,
            address: order.address,
            note: "acv",
            customerName:
              order.customerName == "" ? "Nguyễn Thị Huệ" : order.customerName,
            phone: order.phone,
            status: "CHO_XAC_NHAN",
            money: 0,
            orderDetails: orderDetails,
          }),
        }).then((res) => {
          console.log("đặt hàng thành công !");
          console.log(orderDetails);
          console.log(res.data);
        });
        // debugger
        console.log(order);
        toastSuccess("Thêm hoá đơn thành công");
      } catch (err) {
        toastError("Thêm hoá đơn thất bại");
      }
    }
  };

  const updateCart = (cart, id, quantity) => {
    let tong =
      cart.total === cart.productId.price * quantity
        ? cart.total
        : cart.productId.price * quantity;
    fetch(`http://localhost:8080/api/carts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: cart.productId.id,
        userId: cart.useId | 1,
        quantity: quantity !== undefined ? quantity + 1 : cart.quantity,
        total: cart.total,
      }),
    }).then((res) => {
      console.log("load data cart:");
      console.log(res.data);
      loadDataCart();
    });
  };

  const onChangeInputNumber = (value, productId, price, id, useId) => {
    console.log("value quantity:" + value);
    setValueQuantity(value);
    const cart = {
      total: value * price,
      useId: useId,
      quantity: value,
      productId: productId,
    };
    updateCart(cart, id);
  };

  const SubmitCartData = (value, price, quantity) => {
    fetch("http://localhost:8080/api/carts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: value,
        userId: 1,
        quantity: quantity === 1 ? 1 : quantity + 1,
        total: price,
      }),
    }).then((res) => {
      // res.json();
      loadDataCart();
    });
  };

  const onDelete = (id) => {
    setId(id);
    setDelete(true);
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

  const onChangeDiscount = (value) => {
    console.log("DATA Discount: " + value);
    // setProvinceID(value);
    // loadDataDistrict(value);
  };
  const onSearchDisCount = (value) => {
    console.log("discount Id khi onClick: " + value);
    // if (value.target.innerText !== "") {
    //   setValueProvince(value.target.innerText);
    //   loadDataDistrict();
    // }
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

  const onChangeWards = (value) => {
    if (value === "") {
      setIsDisabled(true);
    }
    setWardCode(value);
    SubmitShipping(value);
  };

  const onSearchWards = (value) => {
    console.log("shipping" + shipping);
    if (value.target.innerText !== "") {
      setValueWard(value.target.innerText);
      SubmitShipping();
    }
  };

  const onChangePhoneNumber = (value) => {
    console.log("changProduct: " + value);
  };

  const onSearchPhoneNumber = (value) => {
    console.log("search product: " + value);
  };

  const onChangeProduct = (value) => {
    setValueProduct(value);
    let isUpdate = false;
    if (value !== undefined) {
      let quantity = 0;
      dataCart
        ?.filter((item) => item.productId.id === value)
        .map((cart) => {
          quantity += cart.quantity;
          updateCart(cart, cart.id, quantity);
          console.log(quantity);
          isUpdate = true;
        });
      let priceProduct;
      data
        ?.filter((item) => item.id === value)
        .map((product) => (priceProduct = product.price));
      if (isUpdate === false) {
        SubmitCartData(value, priceProduct, quantity);
      }
      let total = 0;
      dataCart?.forEach((item) => (total += item.total));
      setTotal(total);
    }
  };

  const onSearchProduct = (searchItem) => {
    console.log("value product click" + valueProduct);
  };

  const onChangeClient = (event) => {
    setValueClient(event.target.value);
    console.log("value client: " + event.target.value);
  };

  const onSearchClient = (searchItem) => {
    setValueClient(searchItem);
    console.log("value client: " + searchItem);
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
          province_id: value ? value : ProvinceID != 1,
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
      .catch((error) => {
        console.log("err", error);
      });
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
            to_district: value ? value : districtId != 1,
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
                  district_id: value ? value : districtId != 1,
                }),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.data === null) {
                  console.log("không có dữ liệu phù hợp");
                } else {
                  setWard(data.data);
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const changeUsername = (event) => {
    setUsername(event.target.value);
  };

  const changePassword1 = (event) => {
    setPassword1(event.target.value);
  };

  const changePassword2 = (event) => {
    setPassword2(event.target.value);
  };

  const changeFullname = (event) => {
    setFullName(event.target.value);
  };

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  const changePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };

  const changeAddRess = (event) => {
    setAddRess(event.target.value);
  };

  const onChangeProvince = (event) => {
    setValue(event.target.value);
  };

  const url = "http://localhost:8080/api/orders";

  const SubmitShipping = (value) => {
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
        setIsDisabled(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("username") != undefined) {
      setUserNameLogin(localStorage.getItem("username"));
    }
    loadDataProvince();
    loadDataProduct();
    loadDataClient();
    loadDataCart();
    loadDataDisCount();
    loadInfo();
    setDisableCountry(true);
  }, [(total != undefined) | (ProvinceID != 1)]);

  const loadDataClient = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataClient(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };
  const loadDataCart = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/carts?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataCart(results.data.data);
        let total = 0;
        let weight = 0;
        let width = 0;
        let height = 0;
        let length = 0;
        results.data.data?.forEach((item) => {
          total += item.total;
          weight += item.productId.weight * item.quantity;
          width += item.productId.width * item.quantity;
          height += item.productId.height * item.quantity;
          length += item.productId.length * item.quantity;
        });
        setTotalWeight(weight);
        setTotal(total);
        setTotalLength(length);
        setTotalHeight(height);
        setTotalWidth(width);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/carts?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataCart(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataProduct = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const onSearchUser = (searchItem) => {
    setValueUser(searchItem);
    console.log("user item: " + searchItem);
  };
  const onChangeUser = (event) => {
    setValueUser(event.target.value);
    console.log("value user: " + event.target.value);
  };
  const onSearchAndFillUser = (item) => {
    if (item != null) {
      setFullNameClient(item.fullName);
    }
    onSearchUser("");
    setFullNameForm(item.fullName);
    setPhoneNumberForm(item.phoneNumber);
    setAddRessForm(item.address);
    setUserId(item.id);
  };

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className="row">
        <div className="btn-search col-12 mt-3 mb-4 d-flex float-end">
          <div className="timk col-4 ">
            <div className="search-container">
              <div className="search-inner mb-2">
                <Select
                  showSearch
                  placeholder="Tên sản phẩm"
                  optionFilterProp="children"
                  style={{
                    width: 700,
                  }}
                  onChange={onChangeProduct}
                  onClick={onSearchProduct}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {data != undefined
                    ? data.map((item, index) => (
                        <Option key={index} value={item.id}>
                          {item.name}{" "}
                          {/* <Image width={90} src={item.images[0].name}/>{" "} */}
                        </Option>
                      ))
                    : ""}
                </Select>
              </div>
            </div>
          </div>
          {/* <button type="submit">Thêm sản phẩm</button> */}
        </div>
        <div className="col-5">
          <div className="title">
            <h3>Thông tin khách hàng</h3>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="search-container">
                <div className="search-inner">
                  <input
                    type="text"
                    placeholder="Tên khách hàng"
                    defaultValue={""}
                    value={fullNameForm}
                    style={{ width: "240px" }}
                    onChange={onChangeUser}
                    onClick={() => onSearchUser(valueUser)}
                  />
                  <div className="dropdown">
                    {users != null
                      ? users
                          .filter((item) => {
                            const searchTerm = valueUser
                              .toString()
                              .toLowerCase();
                            const fullName =
                              item.fullName !== undefined
                                ? item.fullName.toLowerCase()
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
                              onClick={() => onSearchAndFillUser(item)}
                              className="dropdown-row"
                              key={item.id}
                            >
                              {item.fullName}
                            </div>
                          ))
                      : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 ">
              <Button onClick={showModal} style={{ borderRadius: "10px" }}>
                Tạo khách hàng
              </Button>
              <Modal
                title="Tạo mới"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
              >
                <label>
                  Tài khoản
                  <span className="text-danger"> *</span>
                </label>
                <Input
                  type="text"
                  name="username"
                  value={username}
                  placeholder="Nhập tài khoản"
                  onChange={changeUsername}
                />
                <label>
                  Mật khẩu
                  <span className="text-danger"> *</span>
                </label>
                <Input
                  type="password"
                  name="password1"
                  value={password1}
                  placeholder="Nhập mật khẩu"
                  onChange={changePassword1}
                />
                <label>
                  Xác nhận mật khẩu
                  <span className="text-danger"> *</span>
                </label>
                <Input
                  type="password"
                  name="password2"
                  value={password2}
                  placeholder="Nhập lại mật khẩu"
                  onChange={changePassword2}
                />
                <label>
                  Họ và tên
                  <span className="text-danger"> *</span>
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={fullName}
                  placeholder="Nhập họ và tên"
                  onChange={changeFullname}
                />
                <label>
                  Email
                  <span className="text-danger"> *</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Nhập địa chỉ email"
                  onChange={changeEmail}
                />
                <label>
                  Số điện thoại
                  <span className="text-danger"> *</span>
                </label>
                <Input
                  type="number"
                  name="phoneNumber"
                  value={phoneNumber}
                  placeholder="Nhập số điện thoại"
                  onChange={changePhoneNumber}
                />
                <label>
                  Địa chỉ
                  <span className="text-danger"> *</span>
                </label>
                <Input
                  type="text"
                  name="address"
                  value={address}
                  placeholder="Nhập địa chỉ"
                  onChange={changeAddRess}
                  onClick={changeAddRess}
                />
              </Modal>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>Thông tin người bán</label>
                <Input
                  readOnly="true"
                  value={userNameLogin}
                  placeholder="Hà Trung Kiên"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Số điện thoại khách hàng</label>
                <Select
                  style={{
                    width: "100%",
                  }}
                  showSearch
                  placeholder="Số điện thoại khách hàng"
                  optionFilterProp="children"
                  onChange={onChangePhoneNumber}
                  onClick={onSearchPhoneNumber}
                  filterOption={(input, option) =>
                    option.children.includes(input.toLowerCase())
                  }
                >
                  {data != undefined
                    ? users.map((item, index) => (
                        <Option key={index} value={item.id}>
                          {item.phoneNumber}{" "}
                        </Option>
                      ))
                    : ""}
                </Select>
                <Input
                  onChange={(e) => setPhoneClient(e.target.value)}
                  value={phoneNumberForm}
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>Phương thức mua hàng</label>
                <br />
                <Select
                  placeholder="Hình thức mua hàng"
                  style={{
                    width: 240,
                  }}
                  onChange={handleChangePayment}
                >
                  <Option key={"TẠI CỬA HÀNG"} value="TẠI CỬA HÀNG">
                    Tại cửa hàng
                  </Option>
                  <Option key={"GIAO HÀNG TẠI NHÀ"} value="GIAO HÀNG TẠI NHÀ">
                    Giao hàng tại nhà
                  </Option>
                </Select>
              </div>
            </div>
            {/* <div className="col-6">
              <div className="form-group">
                <label>Khuyến mãi</label>
                <Select
                  // disabled={disableCountry}
                  showSearch
                  placeholder="Chọn dịch vụ"
                  optionFilterProp="children"
                  style={{
                    width: 240,
                  }}
                  onChange={onChangeDiscount}
                  onClick={onSearchDisCount}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {discounts?.map((item) => (
                    <Option key={item.id} value={item.name}>
                      {item.name} - {item.ratio}%
                    </Option>
                  ))}
                </Select>
              </div>
            </div> */}
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <label>Tỉnh/ Thành Phố</label>
              <Select
                disabled={disableCountry}
                showSearch
                placeholder="Tỉnh/thành phố"
                optionFilterProp="children"
                style={{
                  width: 240,
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
              <div className="search-container mb-2">
                <div className="search-inner">
                  <label>Tên quận huyện</label>
                  <Select
                    showSearch
                    disabled={disableCountry}
                    placeholder="Quận/huyện"
                    optionFilterProp="children"
                    style={{
                      width: 240,
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
              <div className="search-container">
                <div className="search-inner">
                  <label>Tên phường xã</label>
                  <Select
                    showSearch
                    placeholder="Phường/xã"
                    optionFilterProp="children"
                    style={{
                      width: 240,
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
            <div className="col-6">
              <div className="form-group">
                <br />
                <TextArea
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  rows={6}
                  placeholder={"Địa chỉ chi tiết"}
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            {/* <div className="col-6">
              <label>Hình thức thanh toán</label>
              <Select
                placeholder="Hình thức thanh toán"
                style={{
                  width: 240,
                }}
                onChange={handleChangePayment2}
              >
                <Option key={"TẠI CỬA HÀNG"} value="TẠI CỬA HÀNG">
                  Tại cửa hàng
                </Option>
                <Option key={"TÀI KHOẢN VN PAY"} value="TÀI KHOẢN VN PAY">
                  Tài khoản VN PAY
                </Option>
              </Select>
            </div> */}
            <div className="col-6">
              <div className="form-group">
                <label>Tổng tiền</label>
                <br />
                {/* <Space direction="vertical"> */}
                <Input
                  className="text-danger fw-bold"
                  style={{
                    width: 240,
                  }}
                  readOnly={true}
                  value={total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                  onChange={(e) => setTotal(e.target.value)}
                  // addonAfter={"VNĐ"}
                  defaultValue={0}
                />
                {/* </Space> */}
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Phí ship</label>
                {/* <Space direction="vertical"> */}
                <Input
                  style={{
                    width: 240,
                  }}
                  className="text-danger fw-bold"
                  readOnly={true}
                  value={shipping.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                  defaultValue={0}
                />
                {/* </Space> */}
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="form-group">
              <br />
              <TextArea
                rows={6}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={"Ghi chú"}
              />
            </div>
          </div>
        </div>

        <div className="col-7">
          <div className="title">
            <h3>Giỏ hàng</h3>
          </div>
          <div className="row">
            <div className="col-12 mt-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {dataCart?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index}</td>
                        <td>
                          <Image
                            width={90}
                            src={item.productId.images[0].name}
                          />
                        </td>
                        <td>{item.productId.name}</td>
                        <td>
                          <CurrencyFormat
                            style={{ fontSize: "14px" }}
                            value={item.productId.price}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </td>
                        <td key={item.productId.id}>
                          <InputNumber
                            // disabled={isDisabled}
                            onChange={(event) =>
                              onChangeInputNumber(
                                event,
                                item.productId.id,
                                item.productId.price,
                                item.id,
                                item.userId
                              )
                            }
                            value={quantity | item.quantity}
                            key={item.productId.id}
                            defaultValue={1}
                            min={1}
                            max={item.productId.quantity}
                          />
                        </td>
                        <td>
                          <CurrencyFormat
                            style={{ fontSize: "14px" }}
                            value={item.total}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </td>
                        <td>
                          <DeleteOutlined
                            onClick={() => onDelete(item.id)}
                            style={{ color: "red", marginLeft: 12 }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* <Table
                columns={columns}
                rowKey={(record) => record++}
                dataSource={dataCart}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
              /> */}
              <Modal
                title="Xóa sản phẩm "
                open={isDelete}
                onCancel={() => {
                  setDelete(false);
                }}
                onOk={() => {
                  fetch(`http://localhost:8080/api/carts/${id}`, {
                    method: "DELETE",
                  }).then(() => loadDataCart());
                  setDelete(false);
                  // toastSuccess("Xóa sản phẩm thành công!");
                }}
              >
                Bạn muốn xoá sản phẩm khỏi giỏ hàng không ?
              </Modal>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="btn-submit">
          <Button
            className="text-center"
            type="button"
            onClick={handleSubmitOrder}
          >
            Hoàn tất đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Table1;
