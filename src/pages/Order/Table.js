import {
  Select,
  Input,
  Button,
  InputNumber,
  Image,
  AutoComplete,
  Form,
  Table,
  Tabs,
  Drawer,
  Card
} from "antd";
import React, { useEffect, useState } from "react";
import qs from "qs";
import "./table.css";
import "../Order/table.css";
import { Modal } from "antd";
import { DeleteOutlined, MenuFoldOutlined, EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import Meta from "antd/lib/card/Meta";
import Prod from "../../components/layout/prod";
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
  const getDataProductById1 = (id) => {
    fetch(`http://localhost:8080/api/products/${id}?`)
      .then((res) => res.json())
      .then((results) => {
        setShowData(results)
      });
  };
  const [dataProduct, setDataProduct] = useState([]);
  const [dataSelect, setDataSelect] = useState([]);
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchUsername: params.pagination?.search1,
    searchStatus: params.pagination?.searchStatus,
  });
  const onClickNext = () => {
    // console.log("click");
    // setTableParamPro({
    //     pagination: {
    //         current: 2,
    //         pageSize: 6,
    //         search1: "",
    //         search2: "",
    //         searchStatus: "ACTIVE",
    //     },
    // })
    // getData();
  }
  const getData = () => {
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParamPro)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataProduct(results.data.data);
      });
  }
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
  const onChangeInputPN = (value) => {
    console.log("input", value.target.value)

  }
  const [product, setShowData] = useState();
  const onClickEye = (data) => {
    getDataProductById1(data.id);
    showDrawer();
  }
  const onClickCart = (data) => {
    console.log("data click", data)
    let a = true;
    if (productAdd.length >= 1) {
      productAdd.forEach(item => {
        if (item.id == data.id) {
          a = false;
        }
      })
    }
    if (a == true) {
      setProductAdd([...productAdd, data])
      toastSuccess("???? th??m s???n ph???m");
    } else {
      toastError("S???n ph???m n??y ???? ch???n r???i");
    }

  }
  const [open1, setOpen1] = useState(false);
  const showDrawer = () => {
    setOpen1(true);
  };
  const onClose = () => {
    setOpen1(false);
  };
















  const onclickDelete = (value) => {
    setProductAdd(productAdd.filter((item) => item != value));
  };
  const [productAdd, setProductAdd] = useState([]);
  const columns = [
    {
      title: "H??nh ???nh",
      dataIndex: "image",
      width: "25%",
      render: (id, data) => {
        return (
          <>
            <img width={150} src={data?.images[0]?.name} />
          </>
        );
      },
    },
    {
      title: "T??n s???n ph???m",
      dataIndex: "name",
      width: "45%",
    },
    {
      title: "Gi??",
      dataIndex: "price",
      width: "15%",
    },
    {
      title: "Thao t??c",
      dataIndex: "",
      render: (id, data) => {
        return (
          <>
            {/* <EyeOutlined
              style={{ fontSize: "18px", marginLeft: "20%" }}
              onClick={() => {
                onClickShow(data);
              }}
            /> */}
            <DeleteOutlined
              style={{ fontSize: "18px", marginLeft: "20%", color: "red" }}
              onClick={() => {
                onclickDelete(data);
              }}
            />
          </>
        );
      },
    },
  ];
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const showModal1 = () => {
    setIsModalOpen1(true);
  };
  const handleOk1 = () => {
    console.log("add", productAdd);
    setIsModalOpen1(false);
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };

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
            toastSuccess("Th??m m???i kh??ch h??ng th??nh c??ng!");
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
      toastError("X??c nh???n t??i kho???n kh??ng ch??nh x??c!");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleChangePayment = (value) => {
    console.log("H??nh th???c nh???n h??ng khi change: " + value);

    if (value === "T???I C???A H??NG") {
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
      toastError("Vui l??ng th??m s???n ph???m v??o gi??? h??ng");
    }
    if (valueUser === undefined) {
      toastError("B???n ch??a nh???p t??n kh??ch h??ng !");
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
            : "T???I C???A H??NG",
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
          toastError("Gi?? tr??? ????n h??ng kh??ng v?????t qu?? 200 tri???u !");
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
                  typeOrder === "T???I C???A H??NG" ? "DA_NHAN" : "CHO_XAC_NHAN",
                money: 0,
                shippingFree: shipping,
                orderDetails: orderDetails,
              }),
            })
              .then((res) => res.json())
              .then((results) => {
                if (results.status === 200) {
                  toastSuccess("T???o ho?? ????n th??nh c??ng");
                  onReset();
                  loadDataCart();
                  // resetInputField();
                } else {
                  toastError("T???o ho?? ????n th???t b???i");
                }
              });
          } catch (err) {
            toastError("T???o ho?? ????n th???t b???i");
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
            console.log("kh??ng c?? d??? li???u giao h??ng ph?? h???p");
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
                  console.log("kh??ng c?? d??? li???u ph?? h???p");
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
    getData();
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
    console.log("v??o load data product");
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
        console.log("ki???m tra s??? ??i???n tho???i kh??ch h??ng ?????  hi???n th???");
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
          <h4 className="text-danger fw-bold">?????t h??ng</h4>
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

                <Button type="primary" onClick={showModal1}>
                  Ch???n s???n ph???m
                </Button>
                <Modal
                  width={1000}
                  title="Ch???n s???n ph???m"
                  open={isModalOpen1}
                  onOk={handleOk1}
                  onCancel={handleCancel1}

                >
                  <Tabs
                    defaultActiveKey="1"
                    onChange={onChange}
                    items={[
                      {
                        label: `S???n ph???m`,
                        key: '1',
                        children: <>
                          <div className="row">
                            <div className="col-3">
                              <Input placeholder="Nh???p m?? s???n ph???m" onChange={onChangeInputPN} />
                            </div>
                          </div>
                          <div className="row">
                            {dataProduct ? dataProduct.map(item => (
                              <div className="col-4 mt-2">
                                <Card
                                  style={{ height: '325px' }}
                                  cover={
                                    <img
                                      style={{ height: '179px' }}
                                      alt="example"
                                      src={item?.images[0]?.name ? item.images[0].name : ""}
                                    />
                                  }
                                  actions={[
                                    <EyeOutlined key="setting" style={{ fontSize: '20px', color: '#009999' }} onClick={() => onClickEye(item)} />,
                                    <ShoppingCartOutlined key="edit" style={{ fontSize: '25px', color: '#08c' }} onClick={() => onClickCart(item)}></ShoppingCartOutlined>,
                                  ]}
                                >
                                  <Meta
                                    title={item.name}
                                    description={item.price}
                                  />
                                </Card>
                              </div>
                            )) : ""}
                            <div style={{ width: '100%' }} className="d-flex justify-content-evenly">
                              <nav aria-label="Page navigation example">
                                <ul class="pagination">
                                  <li class="page-item">
                                    <a class="page-link" aria-label="Previous">
                                      <span aria-hidden="true">Previous</span>
                                    </a>
                                  </li>
                                  <li class="page-item">
                                    <a class="page-link" aria-label="Next" onClick={onClickNext}>
                                      <span aria-hidden="true">Next</span>
                                    </a>
                                  </li>
                                </ul>
                              </nav>
                            </div>
                          </div>
                          <Drawer title={product?.name}
                            size="large"
                            placement="right" onClose={onClose} open={open1}>
                            <div className="card">
                              <div className="card-header" style={{ textAlign: "left" }}>
                                Th??ng tin h??ng h??a
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>Xu???t x???: {product?.origin.name}</li>
                                  <li>Th????ng hi???u: {product?.manufacture.name} </li>
                                </div>
                                <div className="col-6">
                                  <li>Th???i ??i???m ra m???t:{product?.debut} </li>
                                  <li>H?????ng d???n b???o qu???n: ????? n??i kh?? r??o, nh??? tay</li>
                                </div>
                              </div>
                              <div className="card-header" style={{ textAlign: "left" }}>
                                Thi???t k??? tr???ng l?????ng
                              </div>
                              <div className="card-body">
                                <li>
                                  K??ch th?????c: {product?.width} x {product?.height} x{" "}
                                  {product?.length}
                                </li>
                                <li>Tr???ng l?????ng s???n ph???m: {product?.weight}kg</li>
                                <li>Ch???t li???u: {product?.material}</li>
                              </div>
                              <div className="card-header" style={{ textAlign: "left" }}>
                                B??? x??? l??
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>H??ng CPU: {product?.processor?.cpuCompany}</li>
                                  <li>
                                    C??ng ngh??? CPU: {product?.processor?.cpuTechnology}
                                  </li>
                                  <li>T???c ????? CPU: {product?.processor?.cpuSpeed}</li>
                                  <li>T???c ????? t???i ??a CPU: {product?.processor?.maxSpeed}</li>
                                </div>
                                <div className="col-6">
                                  <li>Lo???i CPU: {product?.processor?.cpuType}</li>
                                  <li>S??? nh??n: {product?.processor?.multiplier}</li>
                                  <li>S??? lu???ng: {product?.processor?.numberOfThread}</li>
                                  <li>B??? nh??? ?????m: {product?.processor?.caching}</li>
                                </div>
                              </div>
                              <div className="card-header" style={{ textAlign: "left" }}>
                                RAM
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>Dung l?????ng RAM: {product?.ram?.ramCapacity}</li>
                                  <li>Lo???i RAM: {product?.ram?.typeOfRam}</li>
                                  <li>T???c ????? RAM: {product?.ram?.ramSpeed}</li>
                                  <li>S??? khe c???m r???i: {product?.ram?.looseSlot}</li>
                                </div>
                                <div className="col-6">
                                  <li>S??? khe RAM c??n l???i: {product?.ram?.remainingSlot}</li>
                                  <li>S??? RAM onboard: {product?.ram?.onboardRam}</li>
                                  <li>H??? tr??? RAM t???i ??a: {product?.ram?.maxRamSupport}</li>
                                </div>
                              </div>
                              <div className="card-header" style={{ textAlign: "left" }}>
                                M??n H??nh
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>K??ch th?????c m??n h??nh: {product?.screen?.size}</li>
                                  <li>
                                    C??ng ngh??? m??n h??nh: {product?.screen?.screenTechnology}
                                  </li>
                                  <li>????? ph??n gi???i: {product?.screen?.resolution}</li>
                                  <li>T???n s??? qu??t: {product?.screen?.scanFrequency}</li>
                                  <li>T???m n???n: {product?.screen?.backgroundPanel}</li>
                                </div>
                                <div className="col-6">
                                  <li>????? s??ng: {product?.screen?.brightness}</li>
                                  <li>????? ph??? m??u: {product?.screen?.colorCoverage}</li>
                                  <li>T??? l??? m??n h??nh: {product?.screen?.resolution}</li>
                                  <li>
                                    M??n h??nh c???m ???ng: {product?.screen?.backgroundPanel}
                                  </li>
                                  <li>????? t????ng ph???n: {product?.screen?.contrast}</li>
                                </div>
                              </div>
                              <div className="card-header" style={{ textAlign: "left" }}>
                                ????? h???a
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>
                                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                                      Card onboard
                                    </span>
                                  </li>
                                  <li>H??ng: {product?.cardOnboard?.trandemark}</li>
                                  <li>Model: {product?.cardOnboard?.model}</li>
                                  <li>B??? nh???: {product?.cardOnboard?.memory}</li>
                                </div>
                                <div className="col-6">
                                  <li>
                                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                                      Card r???i
                                    </span>
                                  </li>
                                  <li>H??ng: {product?.card?.trandemark}</li>
                                  <li>Model: {product?.card?.model}</li>
                                  <li>B??? nh???: {product?.card?.memory}</li>
                                </div>
                              </div>
                              <div className="card-header" style={{ textAlign: "left" }}>
                                L??u tr???
                              </div>
                              <div className="card-body row">
                                <div className="col-6">
                                  <li>
                                    Ki???u ??? c???ng: {product?.storage?.storageDetail?.type}
                                  </li>
                                  <li>S??? khe c???m: {product?.storage?.number}</li>
                                  <li>
                                    Lo???i SSD:
                                    {product?.storage?.storageDetail.storageType.name}
                                  </li>
                                  <li>
                                    Dung l?????ng: {product?.storage?.storageDetail.capacity}
                                  </li>
                                </div>
                              </div>
                              <div className="card-header" style={{ textAlign: "left" }}>
                                B???o m???t
                              </div>
                              <div className="card-body row">
                                <li>{product?.security}</li>
                              </div>
                              <div className="card-header" style={{ textAlign: "left" }}>
                                H??? ??i???u h??nh
                              </div>
                              <div className="card-body row">
                                <li>OS: {product?.win.name}</li>
                                <li>Version: {product?.win.version}</li>
                              </div>
                            </div>
                          </Drawer>
                        </>
                      },
                      {
                        label: `S???n ph???m ???? ch???n`,
                        key: '2',
                        children: <Table
                          dataSource={productAdd}
                          columns={columns}
                        // pagination={{ position: ["none", "none"] }}
                        />,
                      },
                    ]}
                  />

                </Modal>

                {/* <AutoComplete
                  style={{
                    width: 700,
                  }}
                  options={data}
                  onChange={(event) => onChangeSearch(event)}
                  onSelect={onSelectAuto}
                  placeholder="Ch???n s???n ph???m"
                  value={values}
                  filterOption={(inputValue, option) =>
                    option.label.props.children[1]
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                /> */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-5">
          <div className="title">
            <h3 className="text-danger">Th??ng tin kh??ch h??ng</h3>
          </div>
          <Form
            form={form}
            autoComplete="off"
            layout="vertical"
            disabled={ dataCart.length ==0}
            onFinish={(values) => {
              // handleOk(values);
              console.log("value ?????t  h??ng");
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
                  label="S??? ??i???n tho???i kh??ch"
                  rules={[
                    {
                      required: true,
                      message: "S??? ??i???n tho???i kh??ch h??ng kh??ng ???????c tr???ng",
                    },{
                      pattern:`^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$`,
                      message: "S??? ??i???n tho???i kh??ch h??ng kh??ng ????ng ?????nh d???ng",
                    },
                    { whitespace: true },
                    { min: 3, message: "T??i kho???n t??? 3 k?? t??? tr??? l??n" },
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
                    placeholder="Nh???p s??? ??i???n tho???i kh??ch h??ng"
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
                <label>Th??ng tin ng?????i b??n </label>
                <Input
                  readOnly={true}
                  value={userNameLogin}
                  placeholder="H?? Trung Ki??n"
                />

                <Form.Item
                  className="mt-4"
                  name="paymentOrder"
                  label="H??nh th???c mua h??ng"
                  rules={[
                    {
                      required: true,
                      message: "H??nh th???c mua h??ng kh??ng ???????c ????? tr???ng",
                    },
                  ]}
                
                >
                  <Select
                    key={1}
                    allowClear
                    value={typeOrder}
                    onChange={handleChangePayment}
                    placeholder="H??nh th???c mua h??ng"
                  >
                    <Option key={"T???I C???A H??NG"} value="T???I C???A H??NG">
                      T???i c???a h??ng
                    </Option>
                    <Option
                      onClick={() => setShow(!show)}
                      key={"TAI_NHA"}
                      value="TAI_NHA"
                    >
                      Giao h??ng t???i nh??
                    </Option>
                  </Select>
                </Form.Item>

                {show && (
                  <div>
                    <Form.Item
                      className="mt-4"
                      name="province"
                      label="T???nh / Th??nh ph???"
                      rules={[
                        {
                          required: true,
                          message: "T???nh/th??nh ph??? kh??ng ???????c tr???ng!",
                        },
                      ]}
                    >
                      <Select
                        key={2}
                        combobox="true"
                        showSearch
                        placeholder="T???nh/th??nh ph???"
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
                      label="Qu???n / huy???n"
                      rules={[
                        {
                          required: true,
                          message: "Qu???n/huy???n kh??ng ???????c tr???ng!",
                        },
                      ]}
                    >
                      <Select
                        key={3}
                        combobox="true"
                        showSearch
                        placeholder="Qu???n/huy???n"
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
                      label="Ph?????ng / x??"
                      rules={[
                        {
                          required: true,
                          message: "Ph?????ng/x?? kh??ng ???????c ????? tr???ng!",
                          
                        },
                      ]}
                    >
                      <Select
                        key={4}
                        combobox="true"
                        showSearch
                        placeholder="Ph?????ng/x??"
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
                  T???ng ti???n <span className="text-danger fs-6">*</span>
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
                  T???o kh??ch h??ng
                </Button>
                <Form.Item
                  className="mt-4"
                  name="payment"
                  label="H??nh th???c thanh to??n"
                  rules={[
                    {
                      required: true,
                      message: "H??nh th???c thanh to??n kh??ng ???????c ????? tr???ng!",
                    },
                  ]}
                >
                  <Select placeholder="H??nh th???c thanh to??n">
                    <Option value="Thanh to??n b???ng ti???n m???t">Thanh to??n b???ng ti???n m???t</Option>
                    <Option value="Thanh to??n b???ng th??? ATM">Thanh to??n b???ng th??? ATM</Option>
                    <Option value="Thanh to??n b???ng ti???n m???t v?? th??? ATM">
                    Thanh to??n ti???n m???t v?? th??? ATM
                    </Option>
                  </Select>
                </Form.Item>
                <div className="form-group">
                  <label>
                    T??n kh??ch h??ng <span className="text-danger fs-6">*</span>
                  </label>
                  <Input required
                    onChange={(e) => setValueUser(e.target.value)}
                    value={valueUser}
                    placeholder="T??n kh??ch h??ng"
                    // type="number"
                  />
                </div>
                {show && (
                  <div>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: "?????a ch??? chi ti???t kh??ng ???????c tr???ng!",
                        },
                      ]}
                      name="address"
                      className="mt-4"
                      label="?????a ch??? chi ti???t"
                    >
                      <TextArea placeholder={"?????a ch??? chi ti???t"} rows={9} />
                    </Form.Item>
                    <label>
                      Ph?? ship <span className="text-danger fs-6">*</span>
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

                {/* <Form.Item label="Ph?? giao h??ng" name="shipping"> */}

                {/* </Form.Item> */}
              </div>
              <div className="col-12">
                <Form.Item
                  name="note"
                  className="mt-4"
                  label="Ghi ch?? ????n h??ng"
                >
                  <TextArea
                    showCount
                    maxLength={200}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={"Ghi ch??"}
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
                ?????t h??ng
              </Button>
              <Button
                block
                shape="round"
                className="ms-2"
                style={{ width: "120px" }}
                onClick={onReset}
              >
                L??m m???i
              </Button>
            </Form.Item>
          </Form>
          {/* <div className="row mt-3">
            <div className="col-6">
              <div className="search-container">
                <div className="search-inner">
                  <label>
                    {" "}
                    S??? ??i???n tho???i kh??ch h??ng{" "}
                    <span className="text-danger fs-6">*</span>
                  </label>
                  <br />
                  <AutoComplete
                    style={{ width: 200 }}
                    onChange={(event) => onChangeSearchClient(event)}
                    options={dataClient}
                    value={phoneClient}
                    onSelect={(event) => onSelectAutoClient(event)}
                    placeholder="Nh???p s??? ??i???n tho???i kh??ch h??ng"
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
                T???o kh??ch h??ng
              </Button>
              <Modal
                title="T???o kh??ch h??ng"
                open={open}
                onOk={handleOk}
                okButtonProps={{
                  style: {
                    display: "none",
                  },
                }}
                width={700}
                cancelText={"????ng"}
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
                        label="T??i kho???n"
                        rules={[
                          {
                            required: true,
                            message: "T??i kho???n kh??ch h??ng kh??ng ???????c ????? tr???ng",
                          },
                          { whitespace: true },
                          { min: 3, message: "T??i kho???n t??? 3 k?? t??? tr??? l??n" },
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Nh???p t??i kho???n kh??ch h??ng" />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        label="M???t kh???u"
                        rules={[
                          {
                            required: true,
                            message: "M???t kh???u kh??ch h??ng kh??ng ???????c ????? tr???ng",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Nh???p m???t kh???u" type="password" />
                      </Form.Item>
                      <Form.Item
                        name="password2"
                        label="X??c nh???n m???t kh???u"
                        rules={[
                          {
                            required: true,
                            message: "X??c nh???n m???t kh???u kh??ng ???????c ????? tr???ng",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          placeholder="X??c nh???n m???t kh???u"
                          type="password"
                        />
                      </Form.Item>
                    </div>
                    <div className="col-6">
                      <Form.Item
                        name="fullName"
                        label="Nh???p h??? v?? t??n"
                        rules={[
                          {
                            required: true,
                            message: "H??? t??n kh??ch h??ng kh??ng ???????c ????? tr???ng",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Nh???p h??? t??n kh??ch h??ng" />
                      </Form.Item>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          {
                            required: true,
                            message: "Email kh??ng ???????c ????? tr???ng",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Nh???p email" type="email" />
                      </Form.Item>
                      <Form.Item
                        name="phoneNumber"
                        label="S??? ??i???n tho???i"
                        rules={[
                          {
                            required: true,
                            message:
                              "S??? ??i???n tho???i kh??ch h??ng kh??ng ???????c ????? tr???ng",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Nh???p s??? ??i???n tho???i" type="number" />
                      </Form.Item>
                    </div>
                  </div>

                  <Form.Item className="text-center">
                    <Button block type="primary" htmlType="submit" id="create">
                      T???o m???i kh??ch h??ng
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
                  Th??ng tin ng?????i b??n{" "}
                  <span className="text-danger fs-6">*</span>
                </label>
                <Input
                  readOnly={true}
                  value={userNameLogin}
                  placeholder="H?? Trung Ki??n"
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  T??n kh??ch h??ng <span className="text-danger fs-6">*</span>
                </label>
                <Input
                  onChange={(e) => setValueUser(e.target.value)}
                  value={valueUser}
                  placeholder="T??n kh??ch h??ng"
                // type="number"
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>
                  Ph????ng th???c mua h??ng{" "}
                  <span className="text-danger fs-6">*</span>
                </label>
                <br />
                <Select
                  key={1}
                  combobox="true"
                  placeholder="H??nh th???c mua h??ng"
                  style={{
                    width: 240,
                  }}
                  value={typeOrder}
                  onChange={handleChangePayment}
                >
                  <Option key={"T???I C???A H??NG"} value="T???I C???A H??NG">
                    T???i c???a h??ng
                  </Option>
                  <Option key={"TAI_NHA"} value="TAI_NHA">
                    Giao h??ng t???i nh??
                  </Option>
                </Select>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <label>T???nh/ Th??nh Ph???</label>
              <Select
                key={2}
                combobox="true"
                disabled={
                  disableCountry === true
                    ? disableCountry
                    : dataCart?.length === 0
                }
                showSearch
                placeholder="T???nh/th??nh ph???"
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
                  <label>T??n qu???n huy???n</label>
                  <Select
                    key={3}
                    combobox="true"
                    showSearch
                    disabled={disableCountry || dataCart?.length === 0}
                    placeholder="Qu???n/huy???n"
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
                  <label>T??n ph?????ng x??</label>
                  <Select
                    key={4}
                    combobox="true"
                    showSearch
                    placeholder="Ph?????ng/x??"
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
                  placeholder={"?????a ch??? chi ti???t"}
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>
                  T???ng ti???n <span className="text-danger fs-6">*</span>
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
                  Ph?? ship <span className="text-danger fs-6">*</span>
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
                placeholder={"Ghi ch??"}
              />
            </div>
          </div> */}
        </div>

        <div className="col-7">
          <div className="title">
            <h3 className="text-danger">Gi??? h??ng</h3>
          </div>
          <div className="row">
            <div className="col-12 mt-3">
              <table className="table" style={{ width: "700px" }}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>H??nh ???nh</th>
                    <th>T??n s???n ph???m</th>
                    <th>????n gi??</th>
                    <th>S??? l?????ng</th>
                    <th>Th??nh ti???n</th>
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
                title="X??a s???n ph???m "
                open={isDelete}
                onCancel={() => {
                  setDelete(false);
                }}
                okText={"C??"}
                cancelText={"Kh??ng"}
                onOk={() => {
                  fetch(`http://localhost:8080/api/carts/${id}`, {
                    method: "DELETE",
                  }).then(() => loadDataCart());
                  setDelete(false);
                }}
              >
                B???n mu???n xo?? s???n ph???m kh???i gi??? h??ng kh??ng ?
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
              Ho??n t???t ?????t h??ng
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default CreateOrderAdmin;
