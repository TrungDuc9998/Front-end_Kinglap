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
  Alert,
  Image,
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
  CloseCircleOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import OrderDelivering from "./OrderDelivering";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const { TextArea } = Input;
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { render } from "@testing-library/react";
const { Option } = Select;

const getRandomProductParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});

const Exchange = () => {
  let { id } = useParams();
  const [order, setOrder] = useState();
  const [dataProduct, setDataProduct] = useState([]);
  const [reason, setReason] = useState();
  const [note, setNote] = useState();
  const [dataCart, setDataCart] = useState();
  const [valueInputNumber, setValueInputNumber] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [dataOrder, setDataOrder] = useState();
  const [put, setPut] = useState();
  const [item, setItem] = useState();
  const [dataOD, setDataOD] = useState();
  const [valueProduct, setValueProduct] = useState("");
  const [currentDate, setCurrentDate] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const showModal = (item) => {
    setItem(item);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log("order Detail ID: " + item.id);
    const data = [];
    dataCart?.forEach((element) => {
      data.push({
        orderId: id,
        productId: element.id,
        total: element.price,
        quantity: 1,
        isCheck: item?.id,
      });
    });
    console.log(data);

    if (reason != undefined) {
      fetch("http://localhost:8080/api/orders/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    handleSubmitReturn(data, item);
    setIsModalOpen(false);
  };

  const handleSubmitReturn = (data, dataOrderDetail) => {
    const ExchangeDetail = [];
    data?.forEach((element) => {
      ExchangeDetail.push({
        productId: element.productId,
        // total: element.price,
        orderDetailId: item.id,
        quantity: 1,
      });
    });

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    // setCurrentDate(
    //   date + "-" + month + "-" + year + " " + hours + ":" + min + ":" + sec
    // );
    setCurrentDate(date + "-" + month + "-" + year + " ");
    const event = new Date(order?.updatedAt);
    const event1 = new Date("2022-11-11 18:56:26");
    console.log(
      moment(event.setDate(event.getDate() + 2)).format("DD-MM-YYYY")
    );
    console.log(currentDate);
    // if (
    //   moment(event.setDate(event.getDate() + 2)).format("DD-MM-YYYY") <=
    //   currentDate
    // ) {
    //   toastError("Bạn đã hết thời gian đổi hàng!");
    // } else {
    if (reason != undefined) {
      try {
        fetch("http://localhost:8080/api/auth/returns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            reason: reason,
            description: note,
            isCheck: "1",
            status: "CHUA_XU_LY",
            returnDetailEntities: ExchangeDetail,
          }),
        }).then((res) => {});
        fetch(
          `http://localhost:8080/api/orders/${dataOrderDetail.id}/orderDetails`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: dataOrderDetail.product.id,
              total: dataOrderDetail.total,
              quantity: dataOrderDetail.quantity,
              status: dataOrderDetail.status,
              isCheck: dataOrderDetail.id,
              isUpdate: 1,
            }),
          }
        ).then((res) => loadDataOrder(id));
        toastSuccess("Gửi yêu cầu thành công!");
        setReason("");
      } catch (err) {
        console.log(err);
        toastError("Gửi yêu cầu thất bại!");
      }
    } else {
      toastError("Bạn chưa nhập lý do");
      // }
    }
    // console.log(moment(event1.setDate(event1.getDate()+2)).format('MMMM DoYYYY, h:mm:ss a'))
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
    loadDataProduct();
  }, []);

  const showModalData = (id) => {
    axios.get(url + "/" + id).then((res) => {
      console.log(res.data);
      setDataOD(res.data);
    });
    setView(true);
  };

  const loadDataProduct = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomProductParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataProduct(results.data.data);
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

  const onConfirm = (record) => {
    const isPut = true;

    Modal.confirm({
      title: "Yêu cầu trả hàng hoàn tiền",
      icon: <CheckCircleOutlined />,
      content: render(
        <h1>
          <h1>{record.id}</h1>
        </h1>
      ),
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
        console.log(res);
        setOrder(res);
      });
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
    setValueInputNumber(value);
  };

  const onChangeProduct = (value) => {
    const dataPro = [];
    let productValue;
    setValueProduct(value);
    let isUpdate = false;
    if (value !== undefined) {
      dataProduct
        .filter((item) => item.id === value)
        .map((product) => {
          dataPro.push(product);
          productValue = product;
        });
    }

    if (dataCart === undefined) {
      setDataCart(dataPro);
    } else {
      if (dataCart.length + 1 > item.quantity) {
        toastError("Sản phẩm không được vượt quá số lượng mua ban đầu !");
      } else {
        console.log(productValue);
        setDataCart((t) => [...t, productValue]);
      }
    }

    let total = dataPro[0]?.price;
    if (dataCart?.length === undefined) {
      setTotalProduct(total);
    }
    if (dataCart?.length + 1 <= item.quantity) {
      dataCart?.forEach((item) => {
        total += item.price;
      });
      setTotalProduct(total);
    }
  };

  const onSearchProduct = (searchItem) => {
    console.log("value product click" + searchItem);
  };
  const deleteProduct = (item) => {
    let total = 0;
    dataCart.forEach((element, index) => {
      if (element.id === item.id) {
        dataCart.splice(index, 1);
      }
    });

    dataCart.forEach((element) => {
      total += element.price;
    });
    setTotalProduct(total);

    loadDataProduct();
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
              <div className="mt-2 ms-5 text-success">
                Mã hoá đơn: <b>{order?.id}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
                Khách hàng: <b>{order?.customerName}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
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
              <div className="mt-2 text-success">
                Ngày mua: <b className="">{order?.createdAt}</b>
              </div>
              <div className="mt-2 text-success">
                Tổng tiền:
                <b>
                  {" "}
                  {order?.total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </b>
              </div>
              <div className="mt-2 text-success">
                Trạng thái: <b>Đã nhận hàng</b>{" "}
              </div>
              {/* <div className="mt-2">
                Tổng tiền tạm tính hiện tại:
                <b>
                  <CurrencyFormat
                    style={{ fontSize: "14px" }}
                    value={order?.total}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </b>
              </div>
              <div className="mt-2">
                Số tiền phải trả:
                <b>
                  <CurrencyFormat
                    style={{ fontSize: "14px" }}
                    value={order?.total}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </b>
              </div> */}
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
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Mã HDCT</th>
                <th>Hình ảnh</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Tổng tiền</th>
                <th></th>
                {/* <th scope="col">Thao tác</th> */}
              </tr>
            </thead>
            <tbody>
              {order?.orderDetails.map((item, index) => {
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
                    <td>{item.quantity}</td>
                    <td>
                      {item.total.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>

                    <td>
                      {item.isCheck === null ? (
                        <Button onClick={() => showModal(item)}>
                          Chọn sản phẩm
                        </Button>
                      ) : (
                        ""
                      )}
                      {item.isCheck === 1 ? (
                        <CheckCircleOutlined
                          style={{ fontSize: "18px", color: "green" }}
                        />
                      ) : item.isCheck === null ? (
                        ""
                      ) : (
                        <RetweetOutlined style={{ fontSize: "18px" }} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Modal
          title="Chọn sản phẩm muốn đổi hàng"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="search-inner mb-2">
            <div className="row">
              <div className="col-7">
                <p>
                  Sản phẩm trước đó:{" "}
                  <i className="text-danger">{item?.product.name}</i>
                </p>
                <p>
                  Số lượng: <i className="text-danger">{item?.quantity}</i>
                </p>
                <p>
                  Tổng tiền trước đó:{" "}
                  <i className="text-danger">
                    {item?.total.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </i>
                </p>
              </div>
              <div className="col-5">
                <p>
                  Tổng tiền hiện tại:{" "}
                  <i className="text-danger">
                    {" "}
                    <CurrencyFormat
                      style={{ fontSize: "14px" }}
                      value={totalProduct}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </i>
                </p>
                <p>
                  Số tiền khách hàng phải trả:{" "}
                  <i className="text-danger">
                    <CurrencyFormat
                      style={{ fontSize: "14px" }}
                      value={
                        totalProduct > item?.total
                          ? totalProduct - item?.total
                          : 0
                      }
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </i>
                </p>
                <p>
                  Số tiền khách hàng nhận lại:{" "}
                  <i className="text-danger">
                    <CurrencyFormat
                      style={{ fontSize: "14px" }}
                      value={
                        totalProduct < item?.total
                          ? item?.total - totalProduct
                          : 0
                      }
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </i>
                </p>
                {/* <p>
                  Trạng thái:{" "}
                  <i className="text-danger">{item?.product.quantity}</i>
                </p> */}
              </div>
            </div>
            <Select
              showSearch
              placeholder="Tên sản phẩm"
              optionFilterProp="children"
              style={{
                width: 400,
              }}
              onChange={onChangeProduct}
              onClick={onSearchProduct}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {dataProduct != undefined
                ? dataProduct.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))
                : ""}
            </Select>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá tiền</th>
                <th>Xuất xứ</th>
                <th>Năm sản xuất</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dataCart?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <Image width={90} src={item.images[0]?.name} />{" "}
                    <td>{item.name}</td>
                    <td>
                      {" "}
                      <CurrencyFormat
                        style={{ fontSize: "14px" }}
                        value={item.price}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </td>
                    <td>{item.origin}</td>
                    <td>{item.debut}</td>
                    <td>
                      <CloseCircleOutlined
                        onClick={() => deleteProduct(item)}
                        style={{ fontSize: "20px", color: "red" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Modal>
      </div>
    </div>
  );
};

export default Exchange;
