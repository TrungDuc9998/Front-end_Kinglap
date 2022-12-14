import { Select, Input, Button, Modal, Alert, Image, Checkbox } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
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

const Exchange = () => {
  let { id } = useParams();
  const [order, setOrder] = useState();
  const [dataProduct, setDataProduct] = useState([]);
  const [reason, setReason] = useState();
  const [note, setNote] = useState();
  const [dataCart, setDataCart] = useState();
  const [loading, setLoading] = useState(false);
  const [isView, setView] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [dataOrder, setDataOrder] = useState();
  const [item, setItem] = useState();
  const [dataOD, setDataOD] = useState();
  const [valueProduct, setValueProduct] = useState("");
  const [currentDate, setCurrentDate] = useState();
  const [checked, setChecked] = useState(false);
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
    const data = [];
    console.log(dataCart);
    dataCart?.forEach((element) => {
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
    console.log("checked:", checked);
    const ExchangeDetail = [];
    data?.forEach((element) => {
      ExchangeDetail.push({
        productId: element.productId,
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
    setCurrentDate(date + "-" + month + "-" + year + " ");
    const event = new Date(order?.updatedAt);
    const event1 = new Date("2022-11-11 18:56:26");
    console.log(
      moment(event.setDate(event.getDate() + 2)).format("DD-MM-YYYY")
    );
    if (reason != undefined) {
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
        setIsModalOpen(false);
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
    console.log('đi qua chỗ này');
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
  }, [checked]);

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
        console.log("order log");
        console.log(res);
        setOrder(res);
      });
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
    setValueInputNumber(value);
  };

  const onChangeProduct = (value) => {
    console.log("value consolog");
    console.log(value);
    const dataPro = [];
    let productValue;
    setValueProduct(value);
    console.log(dataProduct);
    let isUpdate = false;
    if (value !== undefined) {
      dataProduct
        .filter((item) => item.id === value)
        .map((product) => {
          console.log("vào push");
          dataPro.push({
            id: product.id,
            image: product?.images[0]?.name,
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
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Đổi hàng</h4>
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
              <div className="mt-2 ms-5 text-success">
                Mã hoá đơn: <b>{order?.id}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
                Khách hàng: <b>{order?.customerName}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
                Số điện thoại: <b>{order?.phone}</b>{" "}
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
              <div className=""></div>
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
                      {(item.isCheck === null) ? (
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
          onCancel={handleCancel}
          width={800}
          cancelText={"Đóng"}
          okText={"Gửi yêu cầu"}
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
                      ? totalProduct?.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "0 VND "}
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
                <Checkbox onChange={(e) => setChecked(e.target.checked)}>
                  Sản phẩm lỗi
                </Checkbox>
                <div className="mt-2">
                  <TextArea
                    onChange={(e) => setNote(e.target.value)}
                    className="ms-2"
                    style={{ width: "100%" }}
                    placeholder="Ghi chú"
                    rows={3}
                    cols={4}
                  />
                </div>
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
                <th>Năm sản xuất</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dataCart?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <Image width={90} src={item.image} /> <td>{item.name}</td>
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

export default Exchange;
