import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  InputNumber,
  Modal,
  DatePicker,
  Radio,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  DoubleRightOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderDelivering from "./OrderDelivering";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const { TextArea } = Input;
import moment from "moment";
import { useParams } from "react-router-dom";
const { Option } = Select;

const Exchange = () => {
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
  const [currentDate, setCurrentDate] = useState();

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

  const handleSubmitReturn = (item) => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    setCurrentDate(
      date + "-" + month + "-" + year + " " + hours + ":" + min + ":" + sec
    );
    console.log(item);

    const event = new Date(order?.updatedAt);
    // console.log(event.toISOString());
    console.log(moment(event).format("DD-MM-YYYY HH:mm:ss"));
    const event1 = new Date("2022-11-11 18:56:26");
    console.log(moment(event.setDate(event.getDate() + 2)).format("DD-MM-YYYY HH:mm:ss"));
    if (
      moment(event.setDate(event.getDate() + 2)).format(
        "DD-MM-YYYY HH:mm:ss"
      ) === currentDate
    ) {
      alert("het thoi gian");
    } else {
      // if (reason != undefined) {
      //   try {
      //     console.log("vào fetch");
      //     fetch("http://localhost:8080/api/returns", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         orderId: order.id,
      //         reason: reason,
      //         description: note,
      //         isCheck: "1",
      //         status: "YEU_CAU",
      //         returnDetailEntities: [
      //           {
      //             productId: item.product.id,
      //             quantity: valueInputNumber != undefined ? valueInputNumber : 1,
      //           },
      //         ],
      //       }),
      //     }).then((res) => {});
      //     fetch(`http://localhost:8080/api/orders/${item.id}/orderDetails`, {
      //       method: "PUT",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         productId: item.product.id,
      //         total: item.total,
      //         quantity: item.quantity,
      //         status: item.status,
      //         isCheck: 1,
      //       }),
      //     }).then((res) => {});
      //     toastSuccess("Gửi yêu cầu thành công!");
      //     loadDataOrder(id);
      //     // location.reload();
      //   } catch (err) {
      //     console.log(err);
      //     toastError("Gửi yêu cầu thất bại!");
      //   }
      // } else {
      //   toastError("Bạn chưa nhập lý do");
      // }
    }
    // console.log(moment(event1.setDate(event1.getDate()+2)).format('MMMM DoYYYY, h:mm:ss a'))
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
    setValueInputNumber(value);
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
              <div className="mt-2">
                <TextArea
                  onChange={(e) => setReason(e.target.value)}
                  className="ms-2 ms-5"
                  style={{ width: "80%" }}
                  placeholder="Lý do đổi hàng"
                  rows={3}
                  cols={2}
                />
              </div>
            </div>
            <div className="col-6 mt-4 mb-5">
              <div className="mt-2">
                Ngày mua: <b>{order?.updatedAt}</b>
              </div>
              <div className="mt-2">
                Tổng tiền: <b>{order?.total}</b>
              </div>
              <div className="mt-2">
                Trạnh thái: <b>{order?.status}</b>{" "}
              </div>
              <div className="mt-2">
                <TextArea
                  onChange={(e) => setNote(e.target.value)}
                  className="ms-2"
                  style={{ width: "80%" }}
                  placeholder="Ghi chú"
                  rows={3}
                  cols={2}
                />
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
                <th scope="col">Mã HDCT</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Thao tác</th>
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
                        min={1}
                        max={item.quantity}
                        defaultValue={1}
                        onChange={onChange}
                      />
                      / {item.quantity}
                    </td>
                    <td>{item.quantity * item.product.price}</td>
                    <td>
                      {item.isCheck === null ? (
                        <DoubleRightOutlined
                          onClick={() =>
                            handleSubmitReturn(item, valueInputNumber)
                          }
                          className="text-success"
                          style={{ fontSize: "20px" }}
                        />
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* <div className="col-12 text-center mb-3 mt-2">
          <Button
            onClick={handleSubmitReturn}
            type="primary"
            shape="round"
            icon={<CheckCircleOutlined />}
          >
            Đổi tất cả
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default Exchange;
