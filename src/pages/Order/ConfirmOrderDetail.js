import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  InputNumber,
  Modal,
} from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const { TextArea } = Input;
import { useParams } from "react-router-dom";
const { Option } = Select;

const ConfirmOrderDetail = () => {
  let { id } = useParams();
  const [order, setOrder] = useState();
  const [reason, setReason] = useState();
  const [note, setNote] = useState();
  const [valueInputNumber, setValueInputNumber] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [put, setPut] = useState();
  const [dataOD, setDataOD] = useState();
  const [todos, setTodos] = useState([]);
  const [quantity, setQuantity] = useState();

  const toastSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
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
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    loadDataOrder(id);
  }, [order != undefined]);

  const showModalData = (id) => {
    axios.get(url + "/" + id).then((res) => {
      console.log(res.data);
      setDataOD(res.data);
    });
    setView(true);
  };

  const onConfirm = (record) => {
    const isPut = true;

    Modal.confirm({
      title: "Yêu cầu trả hàng hoàn tiền",
      icon: <CheckCircleOutlined />,
      content: `Bạn có muốn xác nhận yêu cầu trả hàng hoàn tiền đơn hàng ${record.orderId.id}  không?`,
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        handleSubmitReturn(record);
      },
    });
  };

  const loadDataOrder = (id) => {
    console.log(id);
    setLoading(true);
    fetch(`http://localhost:8080/api/orders/get/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        setOrder(res.data);
      });
  };

  const handleUpdateOrderDetail = () => {
    console.log("submit");
    console.log(todos);
    console.log(order);
    console.log(
      order.id,
      "-",
      order.user,
      "-",
      order.total,
      "-",
      order.payment,
      "-",
      order.status,
      "-",
      order.note,
      "- ",
      order.customerName,
      "-",
      order.phone
    );

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

    console.log(od);

    fetch(`http://localhost:8080/api/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // id: order.id,
        // total: order.total,
        // payment: order.payment,
        // address: order.address,
        // status: order.status,
        // note: order.note,
        // customerName: order.customerName,
        // phone: order.phone,
        // user: order.user,
        // orderDetails: todos,
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
        // orderDetails: [
        //   {
        //     id: 74,
        //     total: 1.929e7,
        //     quantity: 4,
        //     status: "CHO_XAC_NHAN",
        //     isCheck: null,
        //     productId: 1,
        //   },
        // ],
      }),
    }).then((res) => {
      console.log("thành công!");
    });
  };

  const handleSubmitReturn = (item) => {
    console.log(item);

    if (reason != undefined) {
      try {
        console.log("vào fetch");
        fetch("http://localhost:8080/api/returns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            reason: reason,
            description: note,
            status: "YEU_CAU",
            isCheck: 2,
            returnDetailEntities: [
              {
                productId: item.product.id,
                quantity: valueInputNumber != undefined ? valueInputNumber : 1,
              },
            ],
          }),
        }).then((res) => {});

        fetch(`http://localhost:8080/api/orders/${item.id}/orderDetails`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.product.id,
            total: item.total,
            quantity: item.quantity,
            status: item.status,
            isCheck: 2,
          }),
        }).then((res) => {});
        toastSuccess("Gửi yêu cầu thành công!");
        loadDataOrder(id);
        // location.reload();
      } catch (err) {
        console.log(err);
        toastError("Gửi yêu cầu thất bại!");
      }
    } else {
      toastError("Bạn chưa nhập lý do");
    }
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
      }
    });
  };

  const onChange = (value, id, proId) => {
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

  const resetEditing = () => {
    setEditing(false);
  };
  return (
    <div>
      <ToastContainer></ToastContainer>
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
          <table class="table">
            <thead>
              <tr>
                <th >Mã HDCT</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Tổng tiền</th>
                {/* <th scope="col">Thao tác</th> */}
              </tr>
            </thead>
            <tbody>
              {order?.orderDetails.map((item, index) => {
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
                          onChange(event, item.id, item.product.id, quantity)
                        }
                      />
                    </td>
                    <td>{item.total}</td>
                    {/* <td>
                        {item.isCheck === null ? (
                          <Button type="danger"
                            onClick={() =>
                              handleSubmitReturn(item, valueInputNumber)
                            }
                          > Trả hàng</Button>
                        ) : (
                          ""
                        )}
                      </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="col-12 text-center mb-3 mt-2">
          {/* <Button
            onClick={handleUpdateOrderDetail}
            type="primary"
            shape="round"
            icon={<CheckCircleOutlined />}
            className=" mt-2 mb-2"
          >
            Cập nhật đơn hàng
          </Button> */}
          <Button onClick={confirm}>Cập nhật đơn hàng</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderDetail;
