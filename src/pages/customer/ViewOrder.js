import axios from "axios";
import React, { useEffect, useState } from "react";
import product8 from "../../asset/images/products/product08.png";
import qs from "qs";
import { Modal, Table, Tabs, InputNumber } from "antd";
import toastrs from "toastr";
import { ToastContainer, toast } from "react-toastify";
import {
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const onChange = (key) => {
  console.log(key);
};
function ViewOrder() {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const url = "http://localhost:8080/api/orders";
  const [totalSet, setTotal] = useState(10);
  const [todos, setTodos] = useState([]);
  const [quantity, setQuantity] = useState();
  const [dataOrder,setDataOrder] = useState();
  const [orderId, setOrderId] = useState();
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
    axios
      .get(url + `?${qs.stringify(getRandomuserParams(tableParams))}`)
      .then((results) => {
        setOrders(results.data.data.data);
        setOrderDetails(results.data.data.data[0].orderDetails);
        // console.log(results.data.data.data)
        setTotal(results.data.data.total);
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
  }, [JSON.stringify(tableParams)]);

  const columns = [
    {
      title: "Mã HD",
      dataIndex: "id",
      sorter: true,
      width: "7%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: true,
      width: "14%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      sorter: true,
      width: "9%",
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "total",
      sorter: true,
      width: "15%",
      render: (payment) => {
        if (payment === "TAI CUA HANG") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "80%", borderRadius: "5px", padding: "4px" }}
              >
                Tại cửa hàng
              </div>
            </>
          );
        }
        if (payment === "TAI KHOAN ATM") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ borderRadius: "5px", padding: "4px", width: "80%" }}
              >
                Tài khoản ATM
              </div>
            </>
          );
        }
        if (payment === "THANH TOAN VNPAY") {
          return (
            <>
              <div
                className="bg-primary text-center text-light"
                style={{ borderRadius: "5px", padding: "4px", width: "80%" }}
              >
                Ví VNPAY
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
              <CheckCircleOutlined
                className="ms-2"
                style={{ fontSize: "20px", color: "blue" }}
                onClick={() => {
                  showModalConfirm(data.id);
                  setIDCancel(data.id);
                }}
              />
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

  const showModalCancel = () => {
    setEditing(true);
  };
  const showModalConfirm = () => {
    setConfirm(true);
  };
  const showModalData = (id) => {
    axios.get(url + "/" + id).then((res) => {
      setOrder(res.data);
    });
    setOrderId(id);
    setView(true);
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

  const onChangeInput = (value, id, proId) => {
    console.log("changed", value, id, proId);
    const set = new Set();
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
            console.log(abc);
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
    console.log(todos);
    setTodos(todos);
  };

  const loadDataOrder = () => {
    console.log(orderId);
    // setLoading(true);
    fetch(`http://localhost:8080/api/orders/get/${orderId}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        setDataOrder(res.data);
      });
  };

  const handleUpdateOrderDetail = () => {
    // const od = {
    //   id: order.id,
    //   total: order.total,
    //   payment: order.payment,
    //   address: order.address,
    //   status: order.status,
    //   note: order.note,
    //   customerName: order.customerName,
    //   phone: order.phone,
    //   user: order.user,
    //   orderDetails: todos,
    // };
    // console.log(od);
    // fetch(`http://localhost:8080/api/orders/${order.id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     // id: order.id,
    //     // total: order.total,
    //     // payment: order.payment,
    //     // address: order.address,
    //     // status: order.status,
    //     // note: order.note,
    //     // customerName: order.customerName,
    //     // phone: order.phone,
    //     // user: order.user,
    //     // orderDetails: todos,
    //     id: order.id,
    //     total: order.total,
    //     payment: order.payment,
    //     address: order.address,
    //     status: order.status,
    //     note: order.not,
    //     customerName: order.customerName,
    //     phone: order.phone,
    //     user: order.user,
    //     orderDetails: todos,
    //     // orderDetails: [
    //     //   {
    //     //     id: 74,
    //     //     total: 1.929e7,
    //     //     quantity: 4,
    //     //     status: "CHO_XAC_NHAN",
    //     //     isCheck: null,
    //     //     productId: 1,
    //     //   },
    //     // ],
    //   }),
    // }).then((res) => {
    //   console.log("thành công!");
    // });
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
                      rowKey={(record) => record++}
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
              visible={isConfirm}
              onCancel={() => {
                setConfirm(false);
              }}
              onOk={() => {
                fetch(`http://localhost:8080/api/orders/received/${idCancel}`, {
                  method: "PUT",
                }).then(() => load());
                toastrs.options = {
                  timeOut: 6000,
                };
                toast.success("Hủy thành công!", {
                  position: "top-right",
                  autoClose: 1000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
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
              visible={isEditing}
              onCancel={() => {
                setEditing(false);
              }}
              onOk={() => {
                fetch(
                  `http://localhost:8080/api/orders/cancelled/${idCancel}`,
                  { method: "PUT" }
                ).then(() => load());
                toastrs.options = {
                  timeOut: 6000,
                };
                toast.success("Hủy thành công!", {
                  position: "top-right",
                  autoClose: 1000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
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
              visible={isView}
              onCancel={() => {
                setView(false);
              }}
              onOk={() => {
                // setView(false);
                loadDataOrder();
              }}
            >
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Mã HDCT</th>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Giá</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Tổng tiền</th>
                    <th scope="col">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.product.name}</td>
                        <td>{item.product.price}</td>
                        <td>
                          <InputNumber
                            // style={{width: "20%"}}
                            min={1}
                            max={item.product.quantity}
                            value={quantity}
                            defaultValue={item.quantity}
                            onChange={(event) =>
                              onChangeInput(
                                event,
                                item.id,
                                item.product.id,
                                quantity
                              )
                            }
                          />
                        </td>
                        <td>{item.quantity * item.product.price}</td>
                        <td>{item.status}</td>
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
