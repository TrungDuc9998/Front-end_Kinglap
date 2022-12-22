import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  InputNumber,
  Modal,
  Image,
} from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { ToastContainer, toast } from "react-toastify";
const { TextArea } = Input;
import { useParams } from "react-router-dom";
const { Option } = Select;

const ConfirmOrderDetail = () => {
  let { id } = useParams();
  const [order, setOrder] = useState();
  const [orderHistory, setOrderHistory] = useState();
  const [dataOD, setDataOD] = useState();
  const [todos, setTodos] = useState([]);
  const [quantity, setQuantity] = useState();

  useEffect(() => {
    loadDataOrder(id);
    loadDataOrderHistoryById(id);
  }, [order != undefined]);

  const columns = [
    {
      title: "Mã lịch sử",
      dataIndex: "id",
      width: "20%",
    },
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
      width: "20%",
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

        if (status === "CHUA_THANH_TOAN") {
          return (
            <>
              <div
                className="bg-secondary text-center text-light"
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

  const loadDataOrder = (id) => {
    fetch(`http://localhost:8080/api/orders/get/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setOrder(res);
      });
  };

  const loadDataOrderHistoryById = (id) => {
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setOrderHistory(res);
      });
  };

  const handleUpdateOrderDetail = () => {
    const od = {
      id: order.id,
      total: order.total,
      payment: order.payment,
      address: order.address,
      status: order.status,
      note: order.note,
      customerName: order.customerName,
      phone: order.phone,
      user: order.user,
      orderDetails: todos,
    };

    fetch(`http://localhost:8080/api/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id,
        total: order.total,
        payment: order.payment,
        address: order.address,
        status: order.status,
        note: order.not,
        customerName: order.customerName,
        phone: order.phone,
        user: order.user,
        orderDetails: todos,
      }),
    }).then((res) => {
      loadDataOrder(id);
    });
  };

  const confirm = () => {
    Modal.confirm({
      title: "Cập nhật đơn hàng",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có muốn cập nhật đơn hàng không?",
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        handleUpdateOrderDetail();
      },
    });
  };

  const onChange = (value, id, proId, price) => {
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
    let i = -1;
    order?.orderDetails.forEach((element, index) => {
      if (element.id === id) {
        i = index;
      }
    });
    order.orderDetails[i].total = Number(value * price);
    order.orderDetails[i].quantity = value;
    setOrder(order);
    setTodos(todos);
    loadDataOrder(order.id);
  };

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Chi tiết đơn hàng</h4>
        </div>
      </div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "auto",
          paddingBottom: "40px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-12">
          <div className="row">
            <div className="col-6 mt-4 ps-4">
              <div className="mt-2 ms-5">
                Mã hoá đơn: <b>{order?.id}</b>
              </div>
              <div className="mt-2 ms-5">
                Khách hàng: <b>{order?.customerName}</b>
              </div>
              <div className="mt-2 ms-5">
                Số điện thoại: <b>{order?.phone}</b>{" "}
              </div>
            </div>
            <div className="col-6 mt-4 mb-5">
              <div className="mt-2">
                Ngày đặt: <b>{order?.createdAt}</b>
              </div>
              <div className="mt-2">
                Tổng tiền: <b>{order?.total}</b>
              </div>
              <div className="mt-2">
                Trạnh thái: <b>Chờ xác nhận</b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-4 row"
        style={{
          borderRadius: "20px",
          height: "auto",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-12">
          <table className="table">
            <thead>
              <tr>
                <th>Mã HDCT</th>
                <th>Hình ảnh</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Tổng tiền</th>
                {/* <th scope="col">Thao tác</th> */}
              </tr>
            </thead>
            <tbody>
              {order?.orderDetails?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>
                      <Image width={100} src={item.product?.images[0]?.name} />{" "}
                    </td>
                    <td>{item.product?.name}</td>
                    <td>
                      {item.product?.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      <InputNumber
                        // style={{width: "20%"}}
                        min={1}
                        max={item.product?.quantity}
                        value={quantity}
                        defaultValue={item.quantity}
                        onChange={(event) =>
                          onChange(
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
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h6 className="text-danger mt-5 ms-2">Lịch sử đơn hàng</h6>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={orderHistory}
            pagination={{ position: ["none", "none"] }}
          />
        </div>
        <div className="col-12 text-center mb-3 mt-2">
          <Button onClick={confirm}>Cập nhật đơn hàng</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderDetail;
