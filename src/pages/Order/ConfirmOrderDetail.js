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
import Moment from "react-moment";
const { TextArea } = Input;
import { useParams } from "react-router-dom";

const { Option } = Select;

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

const ConfirmOrderDetail = () => {
  let { id } = useParams();
  const [order, setOrder] = useState();
  const [orderHistory, setOrderHistory] = useState();
  const [dataOD, setDataOD] = useState();
  const [todos, setTodos] = useState([]);
  const [quantity, setQuantity] = useState();
  const [count, setCount] = useState();
  const [array, setArray] = useState();
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();
  const [serviceId, setServiceId] = useState();
  const [shipping, setShipping] = useState();
  const [totalWith, setTotalWidth] = useState();
  const [totalHeight, setTotalHeight] = useState();
  const [totalLength, setTotalLength] = useState();
  const [totalWeight, setTotalWeight] = useState();
  const [total, setTotal] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    loadDataOrder(id);
    loadDataProvince();
    loadDataOrderHistoryById(id);
  }, [order != undefined]);

  const columns = [
    {
      title: "Mã lịch sử",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: "Mã hoá đơn",
      dataIndex: "orderId",
      width: "10%",
      render(orderId) {
        return <>{orderId.id}</>;
      },
    },
    {
      title: "Người xác nhận",
      dataIndex: "verifier",
      width: "20%",
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
    fetch(`http://localhost:8080/api/auth/orders/get/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("result");
        console.log(res);
        setOrder(res);
        let total = 0;
        let weight = 0;
        let width = 0;
        let height = 0;
        let length = 0;
        res.orderDetails.forEach((item) => {
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
      });
  };

  const loadDataOrderHistoryById = (id) => {
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setOrderHistory(res);
      });
  };

  const SubmitShipping = (value, checkValue, toDistrict) => {
    let total = 0;
    let weight = 0;
    let width = 0;
    let height = 0;
    let length = 0;
    order.orderDetails.forEach((item) => {
      total += item.total;
      weight += item.product.weight * item.quantity;
      width += item.product.width * item.quantity;
      height += item.product.height * item.quantity;
      length += item.product.length * item.quantity;
    });
    console.log("total", total);
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
          service_id: checkValue,
          insurance_value: total,
          coupon: null,
          from_district_id: 3440,
          to_district_id: toDistrict,
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
        console.log("phí ship sau khi tính:");
        console.log(data);
        onConfirm(data.data.total);
        setShipping(data.data.total);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const onConfirm = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Phí giao hàng của bạn sẽ thay đổi thành ${record.toLocaleString(
        "it-IT",
        {
          style: "currency",
          currency: "VND",
        }
      )}.
      Bạn có đồng ý không ?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        updateOrderDetail();
      },
    });
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
                  district_id: value,
                }),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.data === null) {
                  console.log("không có dữ liệu phù hợp");
                } else {
                  console.log("data xã phường");
                  console.log(data.data);
                  const myArray = order?.address.split(",");
                  const ward = myArray[1];
                  console.log("Xã: ", ward);
                  data.data.forEach((item) => {
                    if (item.WardName == ward.trim()) {
                      console.log("ward code");
                      setWard(item.WardCode);
                      SubmitShipping(item.WardCode, checkValue, value);
                    }
                  });
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
        const myArray = order?.address.split(",");
        const district = myArray[2];
        console.log(district);
        result.data.forEach((item) => {
          if (item.DistrictName == district.trim()) {
            console.log("vào distric id:");
            setDistrict(item.DistrictID);
            loadDataWard(item.DistrictID);
          }
        });
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const handleUpdateOrderDetail = () => {
    if (order?.address != "TẠI CỬA HÀNG") {
      const myArray = order?.address.split(",");
      const ProvinceName = myArray[3];
      array.forEach((element) => {
        if (element.ProvinceName == ProvinceName.trim()) {
          loadDataDistrict(element.ProvinceID);
        }
      });
    }else{
      updateOrderDetail();
    }
  };

  const updateOrderDetail = () => {
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

    fetch(`http://localhost:8080/api/auth/orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
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
      toastSuccess("Cập nhật đơn hàng thành công !");
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
    setTodos(todos);
    let i = -1;
    order?.orderDetails.forEach((element, index) => {
      if (element.id === id) {
        i = index;
      }
    });
    order.orderDetails[i].total = Number(value * price);
    order.orderDetails[i].quantity = value;

    setOrder(order);
    // setTodos(todos);
    // loadDataOrder(order.id);
  };

  const handleConfirm = () => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Xác nhận đơn hàng ",
      content: `Bạn có muốn xác nhận đơn hàng này không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        confirmOrder(isPut);
      },
    });
  };

  const confirmOrder = (isPut) => {
    const dataOrder = [];
    dataOrder.push({
      id: order?.id,
      status: isPut === true ? "CHO_LAY_HANG" : "DA_HUY",
    });
    fetch(`http://localhost:8080/api/staff/orders/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(dataOrder),
    }).then((res) => {
      if (isPut === true) {
        
        navigate("/admin/order/confirm");
        toastSuccess("Xác nhận đơn hàng thành công !");
      } else {
        toastSuccess("Huỷ đơn hàng thành công !");
        navigate("/admin/order/confirm");
      }
     
      // clearSearchForm();
    });
  };

  const cancelCheckBox = () => {
    const isPut = false;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Huỷ đơn hàng ",
      content: `Bạn có muốn huỷ đơn hàng này không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        confirmOrder(isPut);
      },
    });
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
              <div className="mt-2 ms-5">
                Ghi chú: <b>{order?.note}</b>{" "}
              </div>
            </div>
            <div className="col-6 mt-4 mb-5">
              <div className="mt-2">
                Ngày đặt: <b><Moment format="DD-MM-YYYY HH:mm:ss">{order?.createdAt}</Moment></b>
              </div>
              <div className="mt-2">
                Tổng tiền:{" "}
                <b>
                  {order?.total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </b>
              </div>
              <div className="mt-2">
                Đã thanh toán: <b>{order?.money}</b>
              </div>
              <div className="mt-2">
                Trạng thái:{" "}
                <b> {order?.status == "CHO_XAC_NHAN" ? "Chờ xác nhận" : ""}</b>
              </div>
              <div className="mt-2">
                Địa chỉ nhận hàng: <b>{order?.address}</b>
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
                        disabled={order?.status !="CHO_XAC_NHAN"}
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
          <div className="col-12 text-center mb-3 mt-2">
            {order?.status === "CHO_XAC_NHAN" ? (
              <div>
                <Button type="primary" onClick={handleConfirm}>
                  Xác nhận đơn hàng
                </Button>
                <Button
                  type="primary"
                  onClick={cancelCheckBox}
                  className="ms-2"
                  danger
                >
                  Huỷ đơn hàng
                </Button>
                <Button onClick={confirm} className="ms-2">
                  Cập nhật đơn hàng
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
          <h6 className="text-danger mt-5 ms-2">Lịch sử đơn hàng</h6>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={orderHistory}
            pagination={{ position: ["none", "none"] }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderDetail;
