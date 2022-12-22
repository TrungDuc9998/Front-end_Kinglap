import {
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Image, InputNumber, Modal, Table, Tabs, Upload, message } from "antd";
import axios from "axios";
import qs from "qs";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreContext from '../../store/Context';
import qr from "../../image/QR.jpg"
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { storage } from "../../image/firebase/firebase";
import { v4 } from "uuid";


const onChange = (key) => {
};

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
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

function ViewOrder() {
  const props = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status == "error") {
        info.file.status = "done";
      }
      if (info.file.status !== 'removed') {
        setImage({});
      }
      if (info.file.status === 'done') {
        uploadFile(info.fileList[0].originFileObj);
      }
    },
  };
  const [image, setImage] = useState();
  const uploadFile = (image) => {
    if (image == null) return;
    const imageRef = ref(storage, `images/${image.name + v4()}`);
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImage(url);
      });
    });
  };

  // modal thanh toán
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const showModal1 = (data) => {
    setIsModalOpen1(true);
    setOrder1(data)
  };
  const [order1, setOrder1] = useState()
  const handleOk1 = () => {
    setIsModalOpen1(false);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "name": image,
      "exchange_id": null,
      "order_id": order1.id,
      "product": null
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("http://localhost:8080/api/orders/image", requestOptions)
      .then(response => response.text())
      .then(result => {
        toastSuccess("Thanh toán thành công!")
        updateStatusOrder(order1);
      }
      )
      .catch();
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };

  const updateStatusOrder = (order) => {
    order.status = "CHO_XAC_NHAN"
    order.money = order?.total;
    fetch(`http://localhost:8080/api/orders/` + order.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).then((res) => {
      getData();
    });
  }


  let navigate = useNavigate();
  const [state, dispatch] = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const url = "http://localhost:8080/api/orders";
  const [totalSet, setTotal] = useState(10);
  const [todos, setTodos] = useState([]);
  const [quantity, setQuantity] = useState();
  const [dataOrder, setDataOrder] = useState();
  const [orderId, setOrderId] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderHistory, setOrderHistory] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
  });

  const getData = () => {
    let param = searchParams.get("vnp_ResponseCode");
    let userId = localStorage.getItem("username");
    if (param === "00") {
      let total = localStorage.getItem("total");
      let payment = localStorage.getItem("payment");
      let address = localStorage.getItem("address");
      let type = localStorage.getItem("type");
      let phone = localStorage.getItem("phone");
      let customerName = localStorage.getItem("customerName");
      let status = localStorage.getItem("status");
      let orderDetails = localStorage.getItem("orderDetails");
      let valueWard = localStorage.getItem("valueWard");
      let valueDistrict = localStorage.getItem("valueDistrict");
      let valueProvince = localStorage.getItem("valueProvince");
      let value = localStorage.getItem("value");

      fetch(`http://localhost:8080/api/orders/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: localStorage.getItem("id"),
          total: total,
          money: payment === "VN_PAY" ? total : total * 0.1,
          payment: payment,
          // type: type,
          address:
            type == 0
              ? "TẠI CỬA HÀNG"
              : address +
              ", " +
              valueWard +
              ", " +
              valueDistrict +
              ", " +
              valueProvince,
          phone: phone,
          customerName: customerName,
          // email: email,
          status: status,
          orderDetails: JSON.parse(orderDetails),
        }),
      }).then(() => {
        JSON.parse(localStorage.getItem("orderDetails")) ? JSON.parse(localStorage.getItem("orderDetails")).forEach((ord) => {
          dispatch({
            type: "REMOVE_CART_AFTER_CHECKOUT",
            payload: ord.productId
          })
        }) : console.log("null");
        localStorage.removeItem("total");
        localStorage.removeItem("payment");
        localStorage.removeItem("address");
        localStorage.removeItem("type");
        localStorage.removeItem("phone");
        localStorage.removeItem("customerName");
        localStorage.removeItem("status");
        localStorage.removeItem("orderDetails");
        localStorage.removeItem("valueWard");
        localStorage.removeItem("valueDistrict");
        localStorage.removeItem("value");
        navigate("/user/order");
      });

      //localStorage.removeItem("carts");
    }
    fetch(
      `http://localhost:8080/api/orders/list/${userId}?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setOrders(results);
        setOrderDetails(results[0].orderDetails);
        setTotal(results.total);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalSet,
          },
        });
      });
  };

  useEffect(() => {
    getData();
    // loadDataOrder();
  }, [JSON.stringify(tableParams)]);
  // useEffect(() => {
  //   getData();
  //   // loadDataOrder();
  // }, []);

  const columnOrderHistory = [
    {
      title: "Mã hoá đơn",
      dataIndex: "orderId",
      width: "20%",
      render(orderId) {
        return <>{orderId.id}</>;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: "25%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",

      width: "20%",
      render(total) {
        return (
          <>
            {total?.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      width: "13%",
      render: (status) => {
        if (status === "CHO_XAC_NHAN") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Chờ xác nhận
              </div>
            </>
          );
        }
        if (status === "CHO_LAY_HANG") {
          return (
            <>
              <div
                className="bg-warning text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Chờ lấy hàng
              </div>
            </>
          );
        }
        if (status === "DANG_GIAO") {
          return (
            <>
              <div
                className="bg-primary text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Đang giao hàng
              </div>
            </>
          );
        }
        if (status === "DA_NHAN") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Đã nhận hàng
              </div>
            </>
          );
        }
        if (status === "DA_HUY") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Đã huỷ hàng
              </div>
            </>
          );
        }
      },
    },
  ];

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      width: "7%",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      width: "14%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      width: "9%",
      render(total) {
        return total.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        });
      },
    },
    {
      title: "Đã thanh toán",
      dataIndex: "money",
      width: "9%",
      render(money, data) {
        return money.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        });
      },
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "payment",
      width: "15%",
      render: (payment) => {
        if (payment === "NGAN_HANG") {
          return (
            <>
              <ToastContainer></ToastContainer>
              <div
                className="bg-warning text-center text-light"
                style={{ width: "80%", borderRadius: "5px", padding: "4px" }}
              >
                Thanh toán qua ngân hàng
              </div>
            </>
          );
        }
        if (payment === "VN_PAY") {
          return (
            <>
              <ToastContainer></ToastContainer>
              <div
                className="bg-success text-center text-light"
                style={{ width: "80%", borderRadius: "5px", padding: "4px" }}
              >
                Thanh toán qua VN PAY
              </div>
            </>
          );
        }
        if (payment === "DAT_COC") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ borderRadius: "5px", padding: "4px", width: "80%" }}
              >
                Đặt cọc qua VN PAY
              </div>
            </>
          );
        }
      },
    },
    {
      title: "Địa chỉ nhận",
      dataIndex: "address",
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "15%",
      style: "",
      render: (status) => {
        if (status === "CHUA_THANH_TOAN") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Chưa thanh toán
              </div>
            </>
          );
        }
        if (status === "CHO_XAC_NHAN") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Chờ xác nhận
              </div>
            </>
          );
        }
        if (status === "CHO_LAY_HANG") {
          return (
            <>
              <div
                className="bg-warning text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Chờ lấy hàng
              </div>
            </>
          );
        }
        if (status === "DANG_GIAO") {
          return (
            <>
              <div
                className="bg-secondary text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Đang giao hàng
              </div>
            </>
          );
        }
        if (status === "DA_NHAN") {
          return (
            <>
              <div
                className="bg-primary text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Đã nhận hàng
              </div>
            </>
          );
        }
        if (status === "DA_HUY") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Đã huỷ hàng
              </div>
            </>
          );
        }
      },
    },

    {
      title: "Thao tác",
      dataIndex: "id",
      dataIndex: "data",
      width: "15%",
      render: (id, data) => {
        if (data.status == "CHUA_THANH_TOAN") {
          return (<>
            <button className="btn btn-primary" style={{ height: "30px", fontSize: "12px" }} onClick={() => showModal1(data)}>Thanh toán</button>
            <>
              <EyeOutlined
                style={{ fontSize: "20px", marginLeft: "25%" }}
                onClick={() => {
                  showModalData(data.id);
                }}
              />
              <DeleteOutlined
                className="ms-2"
                style={{ fontSize: "20px", color: "red" }}
                onClick={() => {
                  showModalCancel1(data.id);
                  setIDCancel(data.id);
                }}
              />
            </>
            <Modal width={700} okText={"Hoàn thành"} cancelText={"Đóng"} title="Chuyển tiền đến tài khoản" open={isModalOpen1} onOk={() => handleOk1(data)} onCancel={handleCancel1}>
              <div className="container row">
                <div className="col-6">
                  <img src={qr} style={{ width: '300px' }} />
                </div>
                <div className="col-6 mt-3">
                  <p>Chuyển đến số tài khoản với nội dung là số điện thoại của bạn!</p>
                  <h5 className="mt-4">Tổng tiền : <span className="text-danger" style={{ fontSize: '25px', fontWeight: '600' }}>
                    {order1?.total?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span></h5>
                  <h4>Hình ảnh giao dịch thành công!</h4>
                  <Upload {...props}
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                  </Upload>
                </div>
              </div>
            </Modal>
          </>)
        }
        if (data.status === "CHO_XAC_NHAN") {
          // if(data)
          return (
            <>
              <EyeOutlined
                style={{ fontSize: "20px", marginLeft: "25%" }}
                onClick={() => {
                  showModalData(data.id);
                }}
              />
              <DeleteOutlined
                className="ms-2"
                style={{ fontSize: "20px", color: "red" }}
                onClick={() => {
                  showModalCancel(data.id);
                  setIDCancel(data.id);
                }}
              />
            </>
          );
        } else if (
          data.status === "DANG_GIAO" ||
          data.status === "CHO_LAY_HANG"
        ) {
          return (
            <>
              <EyeOutlined
                style={{ fontSize: "20px", marginLeft: "25%" }}
                onClick={() => {
                  showModalData(data.id);
                }}
              />

              {/* <CheckCircleOutlined
                className="ms-2"
                style={{ fontSize: "20px", color: "blue" }}
                onClick={() => {
                  showModalConfirm(data.id);
                  setIDCancel(data.id);
                }}
              /> */}
            </>
          );
        } else if (data.status === "DA_NHAN") {
          return (
            <>
              <Button
                onClick={() => {
                  showModalData(data.id);
                }}
              >
                Hiển thị
              </Button>
              <Button
                className="mt-2"
                danger
                onClick={() => navigate(`/user/order/exchange/${data.id}`)}
              >
                Đổi hàng
              </Button>
              {/* <Button
                className="mt-2"
                onClick={() => navigate(`/user/order/return/${data.id}`)}
              >
                Trả hàng
              </Button> */}
            </>
          );
        } else {
          return (
            <>
              <EyeOutlined
                style={{ fontSize: "20px", marginLeft: "25%" }}
                onClick={() => {
                  showModalData(data.id);
                }}
              />
            </>
          );
        }
      },
    },
  ];
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isEditing1, setEditing1] = useState(false);
  const [isConfirm, setConfirm] = useState(false);
  const [isView, setView] = useState(false);
  const [order, setOrder] = useState();
  const [idCancel, setIDCancel] = useState();
  const [count, setCount] = useState();

  const showModalCancel = () => {
    setEditing(true);
  };
  const showModalCancel1 = () => {
    setEditing1(true);
  };
  const showModalConfirm = () => {
    setConfirm(true);
  };
  const showModalData = (id) => {
    setOrderId(id);
    axios.get(url + "/" + id).then((res) => {
      setOrder(res.data);
    });
    setView(true);
    loadDataOrderHistoryById(id);
    loadDataOrder(id);
  };
  const loadDataOrderHistoryById = (id) => {
    // setLoading(true);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setOrderHistory(res);
      });
  };

  const load = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/orders?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      // axios.get(url + `?${qs.stringify(
      //   getRandomuserParams(tableParams)
      // )}`)
      .then((res) => res.json())
      .then((results) => {
        setOrders(results.data.data);
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
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const onChangeInput = (value, id, proId, price) => {
    const set = new Set();

    setCount(value);

    const orderDetail = {
      id: id,
      total: 1,
      quantity: value,
      status: "CHO_XAC_NHAN",
      isCheck: null,
      productId: proId,
    };
    if (todos.length === 0) {
      todos.push(orderDetail);
    } else {
      todos.forEach((item) => {
        set.add(item.id);
      });
      if (set.has(id)) {
        let abc = -1;
        todos?.forEach((item, index) => {
          if (item.id === id) {
            abc = index;
          }
        });
        todos[abc].quantity = value;
      } else {
        todos.push({
          id: id,
          total: 1,
          quantity: value,
          status: "CHO_XAC_NHAN",
          isCheck: null,
          productId: proId,
        });
      }
    }
    setTodos(todos);
    let count = -1;
    order?.forEach((element, index) => {
      if (element.id == id) {
        count = index;
      }
    });
    const total = quantity * price;
    order[count].total = Number(price * value);
    setOrder(order);
    // handleUpdateOrderDetail();
  };

  const loadDataOrder = (id) => {
    fetch(`http://localhost:8080/api/orders/get/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setDataOrder(res.data);
      });
  };

  const handleUpdateOrderDetail = () => {
    const od = {
      id: dataOrder.id,
      total: dataOrder.total,
      payment: dataOrder.payment,
      address: dataOrder.address,
      status: dataOrder.status,
      note: dataOrder.note,
      customerName: dataOrder.customerName,
      phone: dataOrder.phone,
      user: dataOrder.user,
      orderDetails: todos,
    };
    fetch(`http://localhost:8080/api/orders/${dataOrder.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: dataOrder.id,
        total: dataOrder.total,
        payment: dataOrder.payment,
        address: dataOrder.address,
        status: dataOrder.status,
        note: dataOrder.not,
        customerName: dataOrder.customerName,
        phone: dataOrder.phone,
        user: dataOrder.user,
        orderDetails: todos,
      }),
    }).then((res) => {
    });
  };

  return (
    <>
      <div className="container mt-3">
        <div className="row">
          <div className="col-12">
            <Tabs
              defaultActiveKey="1"
              onChange={onChange}
              items={[
                {
                  label: `Chưa thanh toán`,
                  key: "CHUA_THANH_TOAN",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record.id}
                      dataSource={orders.filter(
                        (order) => order.status === "CHUA_THANH_TOAN"
                      )
                      }
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
                {
                  label: `Chờ xác nhận`,
                  key: "CHO_XAC_NHAN",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record.id}
                      dataSource={orders.filter(
                        (order) => order.status === "CHO_XAC_NHAN"
                      )
                      }
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
                {
                  label: `Chờ lấy hàng`,
                  key: "CHO_LAY_HANG",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record++}
                      dataSource={orders.filter(function (order) {
                        return order.status === "CHO_LAY_HANG";
                      })}
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
                {
                  label: `Đang giao hàng`,
                  key: "DANG_GIAO",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record++}
                      dataSource={orders.filter(function (order) {
                        return order.status === "DANG_GIAO";
                      })}
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
                {
                  label: `Đã Nhận`,
                  key: "DA_NHAN",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record++}
                      dataSource={orders.filter(function (order) {
                        return order.status === "DA_NHAN";
                      })}
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
                {
                  label: `Đơn đã hủy`,
                  key: "DA_HUY",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record++}
                      dataSource={orders.filter(function (order) {
                        return order.status === "DA_HUY";
                      })}
                      pagination={tableParams.pagination}
                      loading={loading}
                      onChange={handleTableChange}
                    />
                  ),
                },
              ]}
            />

            {/* Modal */}

            <Modal
              title="Xác nhận"
              open={isConfirm}
              onCancel={() => {
                setConfirm(false);
              }}
              onOk={() => {
                fetch(`http://localhost:8080/api/orders/received/${idCancel}`, {
                  method: "PUT",
                }).then(() => load());
                toastSuccess("Hủy thành công!");
                setConfirm(false);
                setLoading(true);
              }}
            >
              <label>
                Đã nhận hàng?
                <span className="text-danger"> !!!!!</span>
              </label>
            </Modal>

            <Modal
              title="Huỷ đơn hàng"
              open={isEditing}
              okText={"Có"}
              cancelText={"Không"}
              onCancel={() => {
                setEditing(false);
              }}
              onOk={() => {
                fetch(
                  `http://localhost:8080/api/orders/cancelled/${idCancel}`,
                  { method: "PUT" }
                ).then(() => load());
                toastSuccess("Hủy thành công!");
                setEditing(false);
                setLoading(true);
              }}
            >
              <label>
                Bạn có muốn huỷ đơn hàng này không?
                <p className="text-danger">Nếu bạn hủy đơn này bạn sẽ mất 10% số tiền đã thanh toán hoặc số tiền đã đặt cọc!!</p>
              </label>
            </Modal>
            <Modal
              title="Huỷ đơn hàng"
              open={isEditing1}
              okText={"Có"}
              cancelText={"Không"}
              onCancel={() => {
                setEditing1(false);
              }}
              onOk={() => {
                fetch(
                  `http://localhost:8080/api/orders/cancelled/${idCancel}`,
                  { method: "PUT" }
                ).then(() => load());
                toastSuccess("Hủy thành công!");
                setEditing1(false);
                setLoading(true);
              }}
            >
              <label>
                Bạn có muốn huỷ đơn hàng này không?
              </label>
            </Modal>

            <Modal
              title="Chi tiết đơn hàng"
              open={isView}
              onCancel={() => {
                setView(false);
              }}
              okButtonProps={{
                style: {
                  display: "none",
                },
              }}
              cancelText={"Đóng"}
              width={900}
              onOk={() => {
                // setView(false);
                // loadDataOrder();
                handleUpdateOrderDetail();
              }}
            >
              {/* <div className="col-12 text-center mb-2">
                <h6 className="text-danger fw-bold">Hình ảnh đơn thanh toán</h6>
                <Image width={250} src={order?.images[0]?.name} />
              </div> */}
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Mã HDCT</th>
                    <th>Hình ảnh</th>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Giá</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Tổng tiền</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>
                          {" "}
                          <Image
                            width={90}
                            src={item.product.images[0]?.name}
                          />{" "}
                        </td>
                        <td>{item.product.name}</td>
                        <td>
                          {item.product.price.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td>
                          <InputNumber
                            // style={{width: "20%"}}
                            disabled={
                              item.status != "CHO_XAC_NHAN" ? true : false
                            }
                            min={1}
                            max={item.product.quantity}
                            value={quantity}
                            defaultValue={item.quantity}
                            onChange={(event) =>
                              onChangeInput(
                                event,
                                item.id,
                                item.product.id,
                                item.product.price,
                                quantity
                              )
                            }
                          />
                        </td>
                        <td>
                          {item.total.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <h6 className="text-danger ms-1 mt-2">Lịch sử đơn hàng</h6>
              <Table
                columns={columnOrderHistory}
                rowKey={(record) => record.id}
                dataSource={orderHistory}
                pagination={{ position: ["none", "none"] }}
              />
            </Modal>
          </div>
        </div>
      </div >
    </>
  );
}

export default ViewOrder;
