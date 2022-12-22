import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Radio,
  Space,
  Alert,
  Image,
  Checkbox,
  AutoComplete,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const { TextArea } = Input;
import moment from "moment";
import { useParams } from "react-router-dom";
import { render } from "@testing-library/react";
const { Option } = Select;

const getRandomProductParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});

const ExchangeUser = () => {
  let { id } = useParams();
  const [order, setOrder] = useState();
  const [dataProduct, setDataProduct] = useState([]);
  const [reason, setReason] = useState();
  const [note, setNote] = useState();
  const [data, setData] = useState([]);
  const [values, setValues] = useState();
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
  const [checked, setChecked] = useState(false);
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
      pageSize: 100,
      search1: "",
      search2: "",
      searchStatus: "ACTIVE",
    },
  });
  const showModal = (item) => {
    setItem(item);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const data = [];

    dataCart?.forEach((element, index) => {
      data.push({
        orderId: id,
        productId: element.id,
        total: element.price,
        quantity: 1,
        isCheck: item?.id,
      });
    });

    if (reason != undefined) {
      fetch("http://localhost:8080/api/orders/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((results) => {
          handleSubmitReturn(results.data, item);
        })
        .then((data) => {
        })
        .catch((error) => {
        });
    }

    setIsModalOpen(false);
  };

  const handleSubmitReturn = (data, dataOrderDetail) => {

    const ExchangeDetail = [];
    data?.forEach((element) => {
      ExchangeDetail.push({
        productId: element.product.id,
        orderDetailId: item.id,
        quantity: 1,
        orderChange: element.id,
        status: "YEU_CAU",
        id: null,
      });
    });

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    setCurrentDate(date + "-" + month + "-" + year + " ");
    const event = new Date(order?.updatedAt);
    const event1 = new Date("2022-11-11 18:56:26");
    if (reason != undefined) {
      ///tạo đơn đổi
      try {
        fetch("http://localhost:8080/api/auth/returns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            reason: reason,
            description: note,
            isCheck: checked === true ? "3" : "1",
            status: "CHUA_XU_LY",
            returnDetailEntities: ExchangeDetail,
          }),
        }).then((res) => { });
        fetch(
          `http://localhost:8080/api/orders/${dataOrderDetail.id}/updateOrderDetail`,
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
        setIsModalOpen(false);
        setChecked(false);
        setReason('');
        setNote('')
        setLoading(false);
      } catch (err) {
        toastError("Gửi yêu cầu thất bại!");
      }
    } else {
      toastError("Bạn chưa nhập lý do đổi hàng !");
    }

    setChecked(false);
    setDataCart([]);
    loadDataOrder(id);
  };
  const handleCancel = () => {
    setDataCart([]);
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
    loadDataProduct2();
  }, []);

  const loadDataProduct2 = () => {
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomProductParams(tableParamPro)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataProduct(results.data.data);
        const dataResult = [];
        results.data.data.forEach((item) => {
          dataResult.push(
            renderItem(
              item.id,
              item.name,
              item?.images[0]?.name,
              item.price,
              item.debut
            )
          );
          setData(dataResult);
        });
      });
  };

  const renderItem = (id, title, count, price, debut) => ({
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
        {" " + title + " (" + debut + ") "}{" "}
        {price.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}
      </div>
    ),
    price: price,
  });

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
    setLoading(true);
    fetch(`http://localhost:8080/api/orders/get/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setOrder(res);
      });
  };

  const onChange = (value) => {
    setValueInputNumber(value);
  };

  const onChangeProduct = (value) => {
    loadDataProduct();
    const dataPro = [];
    let productValue;
    setValueProduct(value);
    let isUpdate = false;
    if (value !== undefined) {
      dataProduct
        .filter((item) => item.id === value)
        .map((product) => {
          dataPro.push({
            id: product.id,
            images: product?.images[0].name,
            name: product?.name,
            price: product?.price,
            debut: product?.debut,
          });
          productValue = product;
        });
    }
    if (dataCart === undefined) {
      dataPro.forEach((element, index) => {
        if (element.price < item.product.price) {
          dataPro.splice(index, 1);
          toastError(
            "Sản phẩm phải có giá tiền lớn hơn hoặc bằng sản phẩm trước đó"
          );
        } else {
          setDataCart(dataPro);
        }
      });
    } else {
      if (dataCart.length + 1 > item.quantity) {
        toastError("Sản phẩm không được vượt quá số lượng mua ban đầu !");
      } else {
        dataPro.forEach((element, index) => {
          if (element.price < item.product.price) {
            dataPro.splice(index, 1);
            toastError(
              "Sản phẩm phải có giá tiền lớn hơn hoặc bằng sản phẩm trước đó"
            );
          } else {
            setDataCart((t) => [...t, productValue]);
          }
        });
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
      if (total > 0) {
        setTotalProduct(total);
      } else {
        setTotalProduct(0);
      }
    }
  };

  const onSearchProduct = (searchItem) => {
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

  const onChangeSearch = (event) => {
    setValues(event);
  };

  const onSelectAuto = (value) => {
    setValueProduct(value);
    setValues("");
    const dataPro = [];
    let productValue;

    let isUpdate = false;
    if (value !== undefined) {
      dataProduct
        .filter((item) => item.id === value)
        .map((product) => {
          dataPro.push({
            id: product.id,
            images: product?.images[0]?.name,
            name: product?.name,
            price: product?.price,
            debut: product?.debut,
          });
          productValue = product;
        });
    }
    if (dataCart === undefined) {
      dataPro.forEach((element, index) => {
        if (Number(element.price) < Number(item.product.price)) {
          dataPro.splice(index, 1);
          toastError(
            "Sản phẩm phải có giá tiền lớn hơn hoặc bằng sản phẩm trước đó"
          );
        } else {
          setDataCart(dataPro);
        }
      });
    } else {
      if (dataCart.length + 1 > item.quantity) {
        toastError("Sản phẩm không được vượt quá số lượng mua ban đầu !");
      } else {
        dataPro.forEach((element, index) => {
          if (Number(element.price) < Number(item.product.price)) {
            dataPro.splice(index, 1);
            toastError(
              "Sản phẩm phải có giá tiền lớn hơn hoặc bằng sản phẩm trước đó"
            );
          } else {
            setDataCart((t) => [...t, productValue]);
          }
        });
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
      if (total > 0) {
        setTotalProduct(total);
      } else {
        setTotalProduct(0);
      }
    }
  };

  return (
    <div className="container mt-4">
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
        <h4 className="text-danger fw-bold mt-4 text-center">Đổi hàng</h4>
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
                Ngày mua: <b>{order?.updatedAt}</b>
              </div>
              <div className="mt-2">
                Tổng tiền:
                <b>
                  {order?.total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </b>
              </div>
              <div className="mt-2">
                Trạng thái: <b>Đã nhận hàng</b>{" "}
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
                <th scope="col">Giá tiền</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {order?.orderDetails.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>
                      <Image width={100} src={item.product.images[0]?.name} />{" "}
                    </td>
                    <td>{item.product.name}</td>
                    <td>
                      {item?.product.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      {item?.total.toLocaleString("it-IT", {
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
                        item.total > 0 ? (
                          <Alert
                            message="Hoá đơn chính"
                            type="success"
                            showIcon
                          />
                        ) : (
                          <Alert
                            message="Hoá đơn trước khi đổi"
                            type="info"
                            showIcon
                          />
                        )
                      ) : item.isCheck != 1 && item.isCheck !== null ? (
                        <Alert
                          message="Hoá đơn yêu cầu đổi hàng"
                          type="error"
                          showIcon
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
        <Modal
          title="Chọn sản phẩm muốn đổi hàng"
          open={isModalOpen}
          onOk={handleOk}
          okText={"Gửi yêu cầu"}
          cancelText={"Đóng"}
          width={850}
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
                <div className="mt-4">
                  <TextArea
                    onChange={(e) => setReason(e.target.value)}
                    className="mb-2"
                    style={{ width: "80%" }}
                    placeholder="Lý do đổi hàng"
                    rows={3}
                    cols={2}
                  />
                </div>
              </div>
              <div className="col-5">
                <p>
                  Tổng tiền hiện tại:{" "}
                  <i className="text-danger">
                    {totalProduct > 0
                      ? totalProduct.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })
                      : "0 VND"}
                  </i>
                </p>
                <p>
                  Số tiền khách hàng phải trả thêm:{" "}
                  <i className="text-danger">
                    {totalProduct > 0
                      ? (totalProduct - item?.total).toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })
                      : "0 VND"}
                  </i>
                </p>
                <p className="text-danger fw-bold mt-2">
                  Vui lòng tích chọn nếu sản phẩm lỗi
                </p>
                <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
                  Sản phẩm lỗi
                </Checkbox>
                <div className="mt-2">
                  <TextArea
                    onChange={(e) => setNote(e.target.value)}
                    className="ms-2"
                    value={note}
                    style={{ width: "100%" }}
                    placeholder="Ghi chú"
                    rows={3}
                    cols={4}
                  />
                </div>
              </div>
            </div>
            <AutoComplete
              style={{
                width: 800,
              }}
              value={values}
              options={data}
              onChange={(event) => onChangeSearch(event)}
              onSelect={onSelectAuto}
              placeholder="Tên sản phẩm"
              filterOption={(inputValue, option) =>
                option.label.props.children[1]
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
            />
            {/* <Select
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
            </Select> */}
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá tiền</th>
                <th>Năm sản xuất</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dataCart?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>
                      {item.images === undefined ? (
                        <Image width={90} src={item.images} />
                      ) : (
                        <Image width={90} src={item.images[0].name} />
                      )}
                    </td>
                    <td>{item.name}</td>
                    <td>
                      {item?.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
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

export default ExchangeUser;
