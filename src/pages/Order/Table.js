import {
  Select,
  Input,
  Button,
  InputNumber,
  Image,
  AutoComplete,
  Form,
} from "antd";
import React, { useEffect, useState } from "react";
import qs from "qs";
import "./table.css";
import "../Order/table.css";
import { Modal } from "antd";
import { DeleteOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
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
    autoClose: 2000,
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
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

function CreateOrderAdmin() {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const [values, setValues] = useState();
  const [users, setUsers] = useState();
  const [getFullName, setFullNameClient] = useState();
  const [valueUser, setValueUser] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneClient, setPhoneClient] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [address, setAddRess] = useState();
  const [fullNameForm, setFullNameForm] = useState();
  const [phoneNumberForm, setPhoneNumberForm] = useState();
  const [addressForm, setAddRessForm] = useState();
  const [username, setUsername] = useState("");
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
  const [dataCart, setDataCart] = useState([]);
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
  const [dataLogin, setDataLogin] = useState();
  const [discounts, setDiscounts] = useState();
  const [userNameLogin, setUserNameLogin] = useState();
  const [typeOrder, setTypeOrder] = useState();
  const [form] = Form.useForm();
  const [resetSelect, SetRestSelect] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const [tableParamPro, setTableParamPro] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
      searchStatus: "ACTIVE",
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

  const loadInfo = () => {
    fetch(
      `http://localhost:8080/api/information?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        if (results.status === 200) {
          setUsers(results.data.data);
          setLoading(false);
          setTableParams({
            pagination: {
              current: results.data.current_page,
              pageSize: 10,
              total: results.data.total,
            },
          });
        }
      });
  };

  const onReset = () => {
    form.resetFields();
    loadDataClient();
    setShipping(0);
    setValueUser("");
    setShow(false);
    setTotal(total);
  };

  const handleOk = (value) => {
    if (password2 === password1) {
      fetch(`http://localhost:8080/api/orders/createUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: value.username,
          newPassword: value.password,
          fullName: value.fullName,
          email: value.email,
          phoneNumber: value.phoneNumber,
          address: "none",
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          if (results.data == null) {
            toastError(results.message);
          } else {
            toastSuccess("Thêm mới khách hàng thành công!");
            onReset();
            setUsername("");
            setPhoneNumberForm("");
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
    console.log("Hình thức nhận hàng khi change: " + value);

    if (value === "TẠI CỬA HÀNG") {
      setDisableCountry(true);
      setShow(false);
    } else {
      setShow(true);
      setDisableCountry(false);
    }
    setTypeOrder(value);
  };

  const handleSubmitOrder = (form) => {
    if (dataCart === undefined || dataCart.length === 0) {
      toastError("Vui lòng thêm sản phẩm vào giỏ hàng");
    }
    if (valueUser === undefined) {
      toastError("Bạn chưa nhập tên khách hàng !");
    } else {
      const order = {
        payment: form.payment,
        total: total + shipping,
        userId: userId === undefined ? null : userId,
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
          productId: item.product.id,
          isCheck: null,
        });
      });
     
        if (Number(order.total) + Number(shipping) > 200000000) {
          toastError("Giá trị đơn hàng không vượt quá 200 triệu !");
        } else {
          try {
            fetch("http://localhost:8080/api/auth/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
              body: JSON.stringify({
                payment: form.payment,
                userId: order.userId | null,
                total: Number(order.total) + Number(shipping),
                address: order.address,
                note: form.note,
                customerName:
                  order.customerName == "" ? fullNameForm : order.customerName,
                phone: order.phone,
                status:
                  typeOrder === "TẠI CỬA HÀNG" ? "DA_NHAN" : "CHO_XAC_NHAN",
                money: 0,
                shippingFree: shipping,
                orderDetails: orderDetails,
              }),
            })
              .then((res) => res.json())
              .then((results) => {
                if (results.status === 200) {
                  toastSuccess("Tạo hoá đơn thành công");
                  onReset();
                  loadDataCart();
                  // resetInputField();
                } else {
                  toastError("Tạo hoá đơn thất bại");
                }
              });
          } catch (err) {
            toastError("Tạo hoá đơn thất bại");
          }
    
      }
    }
  };

  const onRest = () => {
    setPhoneClient("");
    setValueUser("");
    setShipping("0 VND");
    setAddressDetail("");
    setTypeOrder("");
    // SetRestSelect("");
  };

  const updateCart = (cart, id, quantity) => {
    console.log("cart-update");
    console.log(cart);
    let tong =
      cart.total === cart.price * quantity ? cart.total : cart.price * quantity;
    fetch(`http://localhost:8080/api/carts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: cart.productId,
        userId: cart.useId | 1,
        quantity: quantity !== undefined ? quantity + 1 : cart.quantity,
        total: cart.total,
      }),
    }).then((res) => {
      loadDataCart();
    });
  };

  const getDataProductById = (productId, cart, id) => {
    fetch(`http://localhost:8080/api/products/${productId}?`)
      .then((res) => res.json())
      .then((results) => {
        console.log("data product get by id");
        console.log(results);
        cart.price = results.price;
        updateCart(cart, id);
      });
  };

  const onChangeInputNumber = (value, productId, price, id, useId) => {
    console.log("productId:" + productId);
    setValueQuantity(value);
    let priceProduct = 0;
    console.log(data);

    console.log("product price:", priceProduct);
    const cart = {
      total: value * price,
      useId: useId,
      quantity: value,
      productId: productId,
    };
    getDataProductById(productId, cart, id);
    // updateCart(cart, id);
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
        setArray(result.data);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const loadDataDistrict = (value) => {
    console.log("provent id,", value);
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
        let dataDis = [];

        // if (value === 201) {
        //   // result.data.splice(0, 1);
        //   // result.data.splice(0, 1);
        //   // dataDis = result.data;
        //   // setDistrict(dataDis);
        // }
        // if (value === 202) {
        //   // result.data.splice(1, 1);
        //   // result.data.splice(1, 1);
        //   // result.data.splice(2, 1);
        //   // dataDis = result.data;
        //   // setDistrict(dataDis);
        // }
        // if (value === 268) {
        //   // result.data.splice(0, 1);
        //   // dataDis = result.data;
        //   // setDistrict(dataDis);
        //   // console.log(dataDis);
        // } else {

        // }

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
    console.log("submit shipping");
    console.log("serviceId:", serviceId);
    console.log("total,", total);
    fetch(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // service_id: serviceId,
          shop_id: 3379752,
          token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
        },
        body: JSON.stringify({
          service_id: serviceId,
          insurance_value: total,
          coupon: null,
          from_district_id: 3440,
          to_district_id: districtId,
          height: Math.round(totalHeight * 0.1),
          length: Math.round(totalLength * 0.1),
          weight: Math.round(totalWeight * 1000),
          width: Math.round(totalWith * 0.1),
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
    loadInfo();
    setDisableCountry(true);
    loadDataUseLogin();
  }, [(total != undefined) | (ProvinceID != 1)]);

  const loadDataUseLogin = () => {
    console.log("load data login");
    const id = localStorage.getItem("id");
    fetch(
      `http://localhost:8080/api/users/find/${id}?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setDataLogin(results.data.data);
        setLoading(false);
      });
  };

  const loadDataClient = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log("data client");
        console.log(results.data.data);
        const option = [];
        results.data.data.forEach((item) => {
          item.information.forEach((element) => {
            if (element.phoneNumber != "none") {
              option.push({
                value: element.phoneNumber,
                id: element.id,
                fullName: element.fullName,
              });
            }
          });
        });
        setDataClient(option);
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
          weight += item.product.weight * item.quantity;
          width += item.product.width * item.quantity;
          height += item.product.height * item.quantity;
          length += item.product.length * item.quantity;
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

  const loadDataProduct = () => {
    console.log("vào load data product");
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParamPro)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        const dataResult = [];
        results.data.data.forEach((item) => {
          dataResult.push(
            renderItem(item.id, item.name, item?.images[0]?.name, item.price)
          );
          setData(dataResult);
        });
      });
  };

  const onSearchUser = (searchItem) => {
    setValueUser(searchItem);
  };
  const onChangeUser = (event) => {
    setValueUser(event.target.value);
  };
  const onSearchAndFillUser = (item) => {
    if (item != null) {
      setFullNameClient(item.fullName);
    }
    onSearchUser("");
    setFullNameForm(item.fullName);
    setPhoneNumberForm(item.phoneNumber);
    setAddRessForm(item.address);
    setUserId(item.userId);
  };

  const renderItem = (id, title, count, price) => ({
    value: id,
    label: (
      <div
        style={{
          display: "flex",
        }}
      >
        <span>
          <Image width={85} src={count} />
        </span>
        {title}{" "}
        {price.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}
      </div>
    ),
    price: price,
  });

  const onSelectAutoClient = (value) => {
    console.log("on select client");
    console.log(value);
    dataClient.forEach((element) => {
      if (element.value === value) {
        console.log("kiểm tra số điện thoại khách hàng để  hiển thị");
        console.log(element.fullName);
        setValueUser(element.fullName);
      }
    });
  };

  const onSelectAuto = (value) => {
    setValueProduct(value);
    setValues("");
    let isUpdate = false;
    if (value !== undefined) {
      let quantity = 0;
      dataCart
        ?.filter((item) => item.product.id === value)
        .map((cart) => {
          quantity += cart.quantity;
          updateCart(cart, cart.id, quantity);
          isUpdate = true;
        });
      let priceProduct;
      getDataProductById(value);
      data
        ?.filter((item) => item.value === value)
        .map((product) => {
          priceProduct = product.price;
        });
      if (isUpdate === false) {
        SubmitCartData(value, priceProduct, quantity);
      }
      let total = 0;
      dataCart?.forEach((item) => (total += item.total));
      setTotal(total);
    }
  };

  const resetInputField = () => {
    setPhoneNumberForm("");
    loadDataProvince();
    loadDataDistrict();
    loadDataWard();
    setFullNameForm("");
  };

  const onChangeSearch = (event) => {
    setValues(event);
  };

  const onChangeSearchClient = (event) => {
    console.log("onchange search client");
    console.log(event);
    setPhoneClient(event);
    setValueUser("")
    console.log("id event on change:");
  };

  const valueShow = (value) => {
    console.log("value show: " + value);
  };

  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Đặt hàng</h4>
        </div>
      </div>
      <ToastContainer></ToastContainer>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="btn-search col-12 mt-3 mb-4 d-flex float-end">
          <div className="timk col-4 ">
            <div className="search-container">
              <div className="search-inner mb-2">
                <AutoComplete
                  style={{
                    width: 700,
                  }}
                  options={data}
                  onChange={(event) => onChangeSearch(event)}
                  onSelect={onSelectAuto}
                  placeholder="Chọn sản phẩm"
                  value={values}
                  filterOption={(inputValue, option) =>
                    option.label.props.children[1]
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-5">
          <div className="title">
            <h3 className="text-danger">Thông tin khách hàng</h3>
          </div>
          <Form
            form={form}
            autoComplete="off"
            layout="vertical"
            disabled={ dataCart.length ==0}
            onFinish={(values) => {
              // handleOk(values);
              console.log("value đặt  hàng");
              console.log({ values });
              handleSubmitOrder(values);
            }}
            onFinishFailed={(error) => {
              console.log({ error });
            }}
          >
            <div className="row">
              <div className="col-6">
                <Form.Item
                  className=""
                  name="phone"
                  label="Số điện thoại khách"
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại khách hàng không được trống",
                    },{
                      pattern:`^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$`,
                      message: "Số điện thoại khách hàng không đúng định dạng",
                    },
                    { whitespace: true },
                    { min: 3, message: "Tài khoản từ 3 ký tự trở lên" },
                  ]}
                  hasFeedback
                >
                  <AutoComplete
                    style={{ width: 240 }}
                    onChange={(event) => onChangeSearchClient(event)}
                    options={dataClient}
                    value={phoneClient}
                    pattern="[0]{10}"
                    onSelect={(event) => onSelectAutoClient(event)}
                    placeholder="Nhập số điện thoại khách hàng"
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
                <label>Thông tin người bán </label>
                <Input
                  readOnly={true}
                  value={userNameLogin}
                  placeholder="Hà Trung Kiên"
                />

                <Form.Item
                  className="mt-4"
                  name="paymentOrder"
                  label="Hình thức mua hàng"
                  rules={[
                    {
                      required: true,
                      message: "Hình thức mua hàng không được để trống",
                    },
                  ]}
                
                >
                  <Select
                    key={1}
                    allowClear
                    value={typeOrder}
                    onChange={handleChangePayment}
                    placeholder="Hình thức mua hàng"
                  >
                    <Option key={"TẠI CỬA HÀNG"} value="TẠI CỬA HÀNG">
                      Tại cửa hàng
                    </Option>
                    <Option
                      onClick={() => setShow(!show)}
                      key={"TAI_NHA"}
                      value="TAI_NHA"
                    >
                      Giao hàng tại nhà
                    </Option>
                  </Select>
                </Form.Item>

                {show && (
                  <div>
                    <Form.Item
                      className="mt-4"
                      name="province"
                      label="Tỉnh / Thành phố"
                      rules={[
                        {
                          required: true,
                          message: "Tỉnh/thành phố không được trống!",
                        },
                      ]}
                    >
                      <Select
                        key={2}
                        combobox="true"
                        showSearch
                        placeholder="Tỉnh/thành phố"
                        optionFilterProp="children"
                        style={{
                          width: 240,
                        }}
                        defaultValue={resetSelect}
                        onChange={onChange}
                        onClick={onSearch}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {array.map((item) => (
                          <Option key={item.ProvinceID} value={item.ProvinceID}>
                            {item.ProvinceName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      className="mt-4"
                      name="district"
                      label="Quận / huyện"
                      rules={[
                        {
                          required: true,
                          message: "Quận/huyện không được trống!",
                        },
                      ]}
                    >
                      <Select
                        key={3}
                        combobox="true"
                        showSearch
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
                        {district?.map((item) => (
                          <Option key={item.DistrictID} value={item.DistrictID}>
                            {item.DistrictName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      className="mt-4"
                      
                      name="ward"
                      label="Phường / xã"
                      rules={[
                        {
                          required: true,
                          message: "Phường/xã không được để trống!",
                          
                        },
                      ]}
                    >
                      <Select
                        key={4}
                        combobox="true"
                        showSearch
                        placeholder="Phường/xã"
                        optionFilterProp="children"
                        style={{
                          width: 240,
                        }}
                        onChange={onChangeWards}
                        onClick={onSearchWards}
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
                    </Form.Item>
                  </div>
                )}
                <label>
                  Tổng tiền <span className="text-danger fs-6">*</span>
                </label>
                <br />
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
                  defaultValue={0}
                />
              </div>
              <div className="col-6">
                <Button
                  onClick={showModal}
                  className="mt-4"
                  shape="round"
                  danger
                >
                  Tạo khách hàng
                </Button>
                <Form.Item
                  className="mt-4"
                  name="payment"
                  label="Hình thức thanh toán"
                  rules={[
                    {
                      required: true,
                      message: "Hình thức thanh toán không được để trống!",
                    },
                  ]}
                >
                  <Select placeholder="Hình thức thanh toán">
                    <Option value="Thanh toán bằng tiền mặt">Thanh toán bằng tiền mặt</Option>
                    <Option value="Thanh toán bằng thẻ ATM">Thanh toán bằng thẻ ATM</Option>
                    <Option value="Thanh toán bằng tiền mặt và thẻ ATM">
                    Thanh toán tiền mặt và thẻ ATM
                    </Option>
                  </Select>
                </Form.Item>
                <div className="form-group">
                  <label>
                    Tên khách hàng <span className="text-danger fs-6">*</span>
                  </label>
                  <Input required
                    onChange={(e) => setValueUser(e.target.value)}
                    value={valueUser}
                    placeholder="Tên khách hàng"
                    // type="number"
                  />
                </div>
                {show && (
                  <div>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: "Địa chỉ chi tiết không được trống!",
                        },
                      ]}
                      name="address"
                      className="mt-4"
                      label="Địa chỉ chi tiết"
                    >
                      <TextArea placeholder={"Địa chỉ chi tiết"} rows={9} />
                    </Form.Item>
                    <label>
                      Phí ship <span className="text-danger fs-6">*</span>
                    </label>
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
                  </div>
                )}

                {/* <Form.Item label="Phí giao hàng" name="shipping"> */}

                {/* </Form.Item> */}
              </div>
              <div className="col-12">
                <Form.Item
                  name="note"
                  className="mt-4"
                  label="Ghi chú đơn hàng"
                >
                  <TextArea
                    showCount
                    maxLength={200}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={"Ghi chú"}
                    rows={6}
                  />
                </Form.Item>
              </div>
            </div>

            <Form.Item className="text-center mt-4">
              <Button
                block
                shape="round"
                danger
                type="primary"
                htmlType="submit"
                style={{ width: "120px" }}
              >
                Đặt hàng
              </Button>
              <Button
                block
                shape="round"
                className="ms-2"
                style={{ width: "120px" }}
                onClick={onReset}
              >
                Làm mới
              </Button>
            </Form.Item>
          </Form>
          {/* <div className="row mt-3">
            <div className="col-6">
              <div className="search-container">
                <div className="search-inner">
                  <label>
                    {" "}
                    Số điện thoại khách hàng{" "}
                    <span className="text-danger fs-6">*</span>
                  </label>
                  <br />
                  <AutoComplete
                    style={{ width: 200 }}
                    onChange={(event) => onChangeSearchClient(event)}
                    options={dataClient}
                    value={phoneClient}
                    onSelect={(event) => onSelectAutoClient(event)}
                    placeholder="Nhập số điện thoại khách hàng"
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-6 mt-3">
              <Button
                onClick={showModal}
                style={{ borderRadius: "10px" }}
                danger
              >
                Tạo khách hàng
              </Button>
              <Modal
                title="Tạo khách hàng"
                open={open}
                onOk={handleOk}
                okButtonProps={{
                  style: {
                    display: "none",
                  },
                }}
                width={700}
                cancelText={"Đóng"}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
              >
                <Form
                  form={form}
                  autoComplete="off"
                  layout="vertical"
                  onFinish={(values) => {
                    handleOk(values);
                    console.log({ values });
                  }}
                  onFinishFailed={(error) => {
                    console.log({ error });
                  }}
                >
                  <div className="row">
                    <div className="col-6">
                      <Form.Item
                        className=""
                        name="username"
                        label="Tài khoản"
                        rules={[
                          {
                            required: true,
                            message: "Tài khoản khách hàng không được để trống",
                          },
                          { whitespace: true },
                          { min: 3, message: "Tài khoản từ 3 ký tự trở lên" },
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Nhập tài khoản khách hàng" />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                          {
                            required: true,
                            message: "Mật khẩu khách hàng không được để trống",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Nhập mật khẩu" type="password" />
                      </Form.Item>
                      <Form.Item
                        name="password2"
                        label="Xác nhận mật khẩu"
                        rules={[
                          {
                            required: true,
                            message: "Xác nhận mật khẩu không được để trống",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          placeholder="Xác nhận mật khẩu"
                          type="password"
                        />
                      </Form.Item>
                    </div>
                    <div className="col-6">
                      <Form.Item
                        name="fullName"
                        label="Nhập họ và tên"
                        rules={[
                          {
                            required: true,
                            message: "Họ tên khách hàng không được để trống",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Nhập họ tên khách hàng" />
                      </Form.Item>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          {
                            required: true,
                            message: "Email không được để trống",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Nhập email" type="email" />
                      </Form.Item>
                      <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message:
                              "Số điện thoại khách hàng không được để trống",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Nhập số điện thoại" type="number" />
                      </Form.Item>
                    </div>
                  </div>

                  <Form.Item className="text-center">
                    <Button block type="primary" htmlType="submit" id="create">
                      Tạo mới khách hàng
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>
                  Thông tin người bán{" "}
                  <span className="text-danger fs-6">*</span>
                </label>
                <Input
                  readOnly={true}
                  value={userNameLogin}
                  placeholder="Hà Trung Kiên"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  Tên khách hàng <span className="text-danger fs-6">*</span>
                </label>
                <Input
                  onChange={(e) => setValueUser(e.target.value)}
                  value={valueUser}
                  placeholder="Tên khách hàng"
                  // type="number"
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>
                  Phương thức mua hàng{" "}
                  <span className="text-danger fs-6">*</span>
                </label>
                <br />
                <Select
                  key={1}
                  combobox="true"
                  placeholder="Hình thức mua hàng"
                  style={{
                    width: 240,
                  }}
                  value={typeOrder}
                  onChange={handleChangePayment}
                >
                  <Option key={"TẠI CỬA HÀNG"} value="TẠI CỬA HÀNG">
                    Tại cửa hàng
                  </Option>
                  <Option key={"TAI_NHA"} value="TAI_NHA">
                    Giao hàng tại nhà
                  </Option>
                </Select>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <label>Tỉnh/ Thành Phố</label>
              <Select
                key={2}
                combobox="true"
                disabled={
                  disableCountry === true
                    ? disableCountry
                    : dataCart?.length === 0
                }
                showSearch
                placeholder="Tỉnh/thành phố"
                optionFilterProp="children"
                style={{
                  width: 240,
                }}
                defaultValue={resetSelect}
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
                    key={3}
                    combobox="true"
                    showSearch
                    disabled={disableCountry || dataCart?.length === 0}
                    placeholder="Quận/huyện"
                    optionFilterProp="children"
                    style={{
                      width: 240,
                    }}
                    value={resetSelect}
                    onChange={onChangeDistricts}
                    onClick={onSearchDistricts}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {district?.map((item) => (
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
                    key={4}
                    combobox="true"
                    showSearch
                    placeholder="Phường/xã"
                    optionFilterProp="children"
                    style={{
                      width: 240,
                    }}
                    value={resetSelect}
                    onChange={onChangeWards}
                    onClick={onSearchWards}
                    disabled={disableCountry || dataCart?.length === 0}
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
                  disabled={disableCountry || dataCart?.length === 0}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  rows={6}
                  placeholder={"Địa chỉ chi tiết"}
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>
                  Tổng tiền <span className="text-danger fs-6">*</span>
                </label>
                <br />
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
                  defaultValue={0}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  Phí ship <span className="text-danger fs-6">*</span>
                </label>
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
              </div>
            </div>
          </div> */}
          {/* <div className="row mt-3">
            <div className="form-group">
              <br />
              <TextArea
                rows={6}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={"Ghi chú"}
              />
            </div>
          </div> */}
        </div>

        <div className="col-7">
          <div className="title">
            <h3 className="text-danger">Giỏ hàng</h3>
          </div>
          <div className="row">
            <div className="col-12 mt-3">
              <table className="table" style={{ width: "700px" }}>
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
                            src={item.product.images[0]?.name}
                          />
                        </td>
                        <td>{item.product.name}</td>
                        <td>
                          {item.product.price.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td key={item.product.id}>
                          <InputNumber
                            onChange={(event) =>
                              onChangeInputNumber(
                                event,
                                item.product.id,
                                item.product.price,
                                item.id,
                                item.userId
                              )
                            }
                            value={quantity | item.quantity}
                            key={item.product.id}
                            defaultValue={1}
                            min={1}
                            max={item.product.quantity}
                          />
                        </td>
                        <td>
                          {item.total.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
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
              <Modal
                title="Xóa sản phẩm "
                open={isDelete}
                onCancel={() => {
                  setDelete(false);
                }}
                okText={"Có"}
                cancelText={"Không"}
                onOk={() => {
                  fetch(`http://localhost:8080/api/carts/${id}`, {
                    method: "DELETE",
                  }).then(() => loadDataCart());
                  setDelete(false);
                }}
              >
                Bạn muốn xoá sản phẩm khỏi giỏ hàng không ?
              </Modal>
            </div>
          </div>
        </div>
        {/* <div className="row mb-5">
          <div className="btn-submit">
            <Button
              className="text-center"
              type="button"
              onClick={handleSubmitOrder}
            >
              Hoàn tất đặt hàng
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default CreateOrderAdmin;
