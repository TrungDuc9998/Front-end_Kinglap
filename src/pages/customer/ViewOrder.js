import axios from "axios";
import React, { useEffect, useState } from "react";
import product8 from "../../asset/images/products/product08.png";
import qs from "qs";
import { Modal, Table, Tabs, InputNumber, Image, Button } from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const onChange = (key) => {
  console.log(key);
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
  let navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const url = "http://localhost:8080/api/orders";
  const [totalSet, setTotal] = useState(10);
  const [todos, setTodos] = useState([]);
  const [quantity, setQuantity] = useState();
  const [dataOrder, setDataOrder] = useState();
  const [orderId, setOrderId] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
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
    let userId = localStorage.getItem("username");
    fetch(
      `http://localhost:8080/api/orders/list/${userId}?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
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
    let param = searchParams.get("vnp_ResponseCode");
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
                value,
          phone: phone,
          customerName: customerName,
          // email: email,
          status: status,
          orderDetails: JSON.parse(orderDetails),
        }),
      }).then(() => {
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
      });
    }
  };

  useEffect(() => {
    getData();
    // loadDataOrder();
  }, [JSON.stringify(tableParams)]);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      sorter: true,
      width: "7%",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      sorter: true,
      width: "14%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      sorter: true,
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
      sorter: true,
      width: "9%",
      render(money) {
        return money.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        });
      },
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "payment",
      sorter: true,
      width: "15%",
      render: (payment) => {
        if (payment === "VN_PAY") {
          return (
            <>
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
      sorter: true,
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      sorter: true,
      width: "15%",
      style: "",
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
      width: "10%",
      render: (id, data) => {
        if (data.status === "CHO_XAC_NHAN") {
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
              <Button
                className="mt-2"
                onClick={() => navigate(`/user/order/return/${data.id}`)}
              >
                Trả hàng
              </Button>
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
  const [isConfirm, setConfirm] = useState(false);
  const [isView, setView] = useState(false);
  const [order, setOrder] = useState();
  const [idCancel, setIDCancel] = useState();
  const [count, setCount] = useState();

  const showModalCancel = () => {
    setEditing(true);
  };
  const showModalConfirm = () => {
    setConfirm(true);
  };
  const showModalData = (id) => {
    console.log("id show modal: ", id);
    setOrderId(id);
    axios.get(url + "/" + id).then((res) => {
      setOrder(res.data);
      console.log(res.data);
    });

    console.log(orderId);
    setView(true);
    console.log("show modal");
    loadDataOrder(id);
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
    console.log("changed", value, id, proId, price);
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
      console.log(set);
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
    console.log(todos);
    console.log(order);
    let count = -1;
    order?.forEach((element, index) => {
      if (element.id == id) {
        count = index;
      }
    });
    console.log("quantity: ", quantity, "price: ", price);
    const total = quantity * price;
    console.log(total);
    order[count].total = Number(price * value);
    setOrder(order);
    console.log(order);
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
    console.log(od);
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
      console.log("thành công!");
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
                  label: `Chờ xác nhận`,
                  key: "CHO_XAC_NHAN",
                  children: (
                    <Table
                      columns={columns}
                      rowKey={(record) => record.id}
                      dataSource={orders.filter(
                        (order) => order.status === "CHO_XAC_NHAN"
                      )}
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
              title="Xác nhận"
              open={isEditing}
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
                Bạn thực sự muốn hủy đơn hàng này
                <span className="text-danger"> !!!!!</span>
              </label>
            </Modal>

            <Modal
              title="Chi tiết đơn hàng"
              open={isView}
              onCancel={() => {
                setView(false);
              }}
              onOk={() => {
                // setView(false);
                // loadDataOrder();
                handleUpdateOrderDetail();
              }}
            >
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
                            src={item.product.images[0].name}
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
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewOrder;
