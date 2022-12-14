import {
  Select,
  Input,
  Button,
  Modal,
  Alert,
  Image,
  Checkbox,
  AutoComplete,
  Drawer,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
const { TextArea } = Input;
import Moment from "react-moment";
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
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataCart, setDataCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isView, setView] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [dataOrder, setDataOrder] = useState();
  const [item, setItem] = useState();
  const [dataOD, setDataOD] = useState();
  const [valueProduct, setValueProduct] = useState("");
  const [currentDate, setCurrentDate] = useState();
  const [values, setValues] = useState();
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
    console.log("item show modal");
    console.log(item);

    const data = [];

    dataCart?.forEach((element, index) => {
      data.push({
        index: index,
        orderId: id,
        productId: element.id,
        total: element.price,
        quantity: 1,
        isCheck: item?.id,
      });
    });

    let count = 0;
    dataCart.forEach((item) => {
      if (item.reason != undefined && item.reason != "null") {
        count++;
      }
    });

    if (dataCart.length == count) {
      fetch("http://localhost:8080/api/auth/orders/exchanges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((results) => {
          console.log(results);
          handleSubmitReturn(results.data, item);
        })
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setIsModalOpen(false);
    } else {
      toastError("B???n ch??a nh???p ?????y ????? l?? do !");
    }
  };

  const handleSubmitReturn = (data, dataOrderDetail) => {
    const ExchangeDetail = [];
    data?.forEach((element, index) => {
      ExchangeDetail.push({
        productId: element.product.id,
        orderDetailId: item.id,
        quantity: 1,
        reason: dataCart[index].reason,
        orderChange: element.id,
        status: "YEU_CAU",
        isCheck: dataCart[index].checked == true ? "1" : "",
        id: null,
      });
    });

    // console.log("data exchange");
    // console.log(ExchangeDetail);

    // var date = new Date().getDate();
    // var month = new Date().getMonth() + 1;
    // var year = new Date().getFullYear();
    // var hours = new Date().getHours();
    // var min = new Date().getMinutes();
    // var sec = new Date().getSeconds();
    // setCurrentDate(date + "-" + month + "-" + year + " ");
    // const event = new Date(order?.updatedAt);
    // const event1 = new Date("2022-11-11 18:56:26");
    // console.log(
    //   moment(event.setDate(event.getDate() + 2)).format("DD-MM-YYYY")
    // );
    // if (reason != undefined) {
    ///t???o ????n ?????i
    // try {
    fetch("http://localhost:8080/api/auth/returns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        orderId: order.id,
        description: "Ghi ch??",
        status: "CHUA_XU_LY",
        returnDetailEntities: ExchangeDetail,
      }),
    }).then((res) => {});
    fetch(
      `http://localhost:8080/api/auth/orders/${dataOrderDetail.id}/updateOrderDetail`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
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
    toastSuccess("G???i y??u c???u th??nh c??ng!");
    setOpen(false);
    setReason("");
    setChecked(false);
    setIsModalOpen(false);
    setNote("");
    setLoading(false);
    // } catch (err) {
    //   toastError("G???i y??u c???u th???t b???i!");
    // }
    // } else {
    //   toastError("B???n ch??a nh???p l?? do ?????i h??ng !");
    // }

    setChecked(false);
    setDataCart([]);
    console.log("data cart khi g???i y??u c???u:");
    console.log(dataCart);
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

  const onCancel = (record) => {
    const isPut = true;
    Modal.confirm({
      icon: <CloseCircleOutlined className="text-danger" />,
      title: "Hu??? y??u c???u ?????i h??ng",
      content: `B???n c?? mu???n hu??? y??u c???u ?????i h??ng ${record.id} kh??ng ?`,
      okText: "C??",
      cancelText: "Kh??ng",
      okType: "primary",
      onOk: () => {
       cancelOrderDetail(record);
      },
    });
  };

  const cancelOrderDetail = (data) => {
    const orderDetail = [];
    orderDetail.push({
      id: data.id,
      isCheck: data.id,
      productId: data.product.id,
      quantity: data.quantity,
      total: 0,
      isBoolean: false,
      status: "0",
    });
    console.log('order detail g???i y??u c???u');
    console.log(orderDetail);

    fetch(
      `http://localhost:8080/api/staff/orders/update/exchange/${data.id}/cancel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(orderDetail),
      }
    ).then((res) => {
      loadDataOrder(id);
    });
    toastSuccess("Hu??? y??u c???u ?????i h??ng th??nh c??ng !"); 
  }

  useEffect(() => {
    loadDataOrder(id);
    loadDataProduct2();
  }, [checked]);

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
      title: "Y??u c???u tr??? h??ng ho??n ti???n",
      icon: <CheckCircleOutlined />,
      content: render(
        <h1>
          <h1>{record.id}</h1>
        </h1>
      ),
      okText: "C??",
      cancelText: "Kh??ng",
      onOk: () => {
        handleSubmitReturn(record);
      },
    });
  };

  const loadDataOrder = (id) => {
    setLoading(true);
    fetch(`http://localhost:8080/api/auth/orders/get/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("load data order by id");
        console.log(res);
        setOrder(res);
      });
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

  const onSelectAuto = (value) => {
    setValueProduct(value);
    setValues("");
    const dataPro = [];
    let productValue;

    let isUpdate = false;
    if (value !== undefined) {
      dataProduct
        .filter((item, index) => item.id === value)
        .map((product, index) => {
          dataPro.push({
            index: index,
            id: product.id,
            images: product?.images[0]?.name,
            name: product?.name,
            price: product?.price,
            debut: product?.debut,
          });
          // product= {
          //   index: index,
          //   id: product.id,
          //   images: product?.images[0]?.name,
          //   name: product?.name,
          //   price: product?.price,
          //   debut: product?.debut,
          // }
          // productValue = product;
        });
      console.log(dataPro);
    }
    if (dataCart === undefined || dataCart === [] || dataCart.length == 0) {
      dataPro.forEach((element, index) => {
        if (Number(element.price) < Number(item.product.price)) {
          dataPro.splice(index, 1);
          toastError(
            "S???n ph???m ph???i c?? gi?? ti???n l???n h??n ho???c b???ng s???n ph???m tr?????c ????"
          );
        } else {
          setDataCart(dataPro);
        }
      });
    } else {
      if (dataCart.length + 1 > item.quantity) {
        toastError("S???n ph???m kh??ng ???????c v?????t qu?? s??? l?????ng mua ban ?????u !");
      } else {
        dataPro.forEach((element, index) => {
          if (Number(element.price) < Number(item.product.price)) {
            dataPro.splice(index, 1);
            toastError(
              "S???n ph???m ph???i c?? gi?? ti???n l???n h??n ho???c b???ng s???n ph???m tr?????c ????"
            );
          } else {
            console.log("v??o else cu???i c??ng");
            console.log(dataCart[dataCart.length - 1].index);
            console.log(dataPro[0]);
            const pro = {
              index: Number(dataCart[dataCart.length - 1].index) + 1,
              id: dataPro[0].id,
              images: dataPro[0].images,
              name: dataPro[0].name,
              price: dataPro[0].price,
              debut: dataPro[0].debut,
            };
            // console.log((t) => [...t, dataPro[0]]);
            setDataCart((t) => [...t, pro]);
            console.log(dataCart);
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

  const onChangeSearch = (event) => {
    setValues(event);
  };

  const onChangeReason = (value, id) => {
    let check = false;
    console.log(value);
    if (!isNaN(value)) {
      console.log("--------------- v??o r???ng --------------");
      dataCart?.forEach((element, index) => {
        if (element.index == id) {
          console.log("r???ng ?????u ti??n");
          element.reason = "null";
          // setReason(count);
        }
      });
      check = true;
    }
    let count = 0;
    dataCart?.forEach((element, index) => {
      if (element.index == id && isNaN(value)) {
        console.log("r???ng: ", check);
        console.log("v??o ?????m count");
        count++;
        element.reason = value;
        // setReason(count);
      }
    });
  };

  const onChangeChecked = (value, id) => {
    console.log("value checked");
    console.log(value);
    setChecked(value);
    dataCart?.forEach((element, index) => {
      if (element.index == id) {
        element.checked = value;
      }
    });
    console.log("data checked");
    console.log(dataCart);
  };

  const showDrawer = (item) => {
    showModal(item);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">?????i h??ng</h4>
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
                M?? ho?? ????n: <b>{order?.id}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
                Kh??ch h??ng: <b>{order?.customerName}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
                S??? ??i???n tho???i: <b>{order?.phone}</b>{" "}
              </div>
              <div className="mt-2 ms-5 text-success">
                Ghi ch?? ????n h??ng: <b>{order?.note}</b>{" "}
              </div>
            </div>
            <div className="col-6 mt-4 mb-5">
              <div className="mt-2 text-success">
                Ng??y mua: <b className="">{order?.createdAt}</b>
              </div>
              <div className="mt-2 text-success">
                T???ng ti???n:
                <b>
                  {" "}
                  {order?.total.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </b>
              </div>
              <div className="mt-2 text-success">
                ?????a ch??? nh???n h??ng: <b>{order?.address}</b>
              </div>
              <div className="mt-2 text-success">
                Tr???ng th??i: <b>???? nh???n h??ng</b>{" "}
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
                <th scope="col">M?? HDCT</th>
                <th>H??nh ???nh</th>
                <th scope="col">T??n s???n ph???m</th>
                <th scope="col">Gi??</th>
                <th scope="col">S??? l?????ng</th>
                <th>Th???i gian </th>
             
                <th scope="col">T???ng ti???n</th>
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
                   
                    <td> <Moment format="DD-MM-YYYY HH:mm:ss">{item.updatedAt}</Moment></td>
                    <td>
                      {item.total.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>

                    <td>
                      {item.isCheck === null ? (
                        <Button  shape="round" onClick={() => showDrawer(item)}>
                          Ch???n s???n ph???m
                        </Button>
                      ) : (
                        ""
                      )}
                      {item.isCheck === 1 ? (
                        item.total > 0 ? (
                          <Alert
                            message="Ho?? ????n ch??nh"
                            type="success"
                            showIcon
                          />
                        ) : (
                          <Alert
                            message="Ho?? ????n tr?????c khi ?????i"
                            type="info"
                            showIcon
                          />
                        )
                      ) : item.isCheck != 1 && item.isCheck !== null && item.isCheck!=3 ? (
                        <>
                        <Button type="primary"   onClick={() => onCancel(item)} danger>Hu???</Button>
                        <i className="text-primary mx-2">
                          ????n y??u c???u ?????i ho?? ????n {item.isCheck}
                        </i>
                       
                        </>
                      ) : (
                        item.isCheck == 3 ? (
                          <i className="text-danger fw-bold">
                          ????n y??u c???u ?????i ho?? ????n {item.isCheck} b??? hu???
                        </i>
                        ): ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Drawer
          title="Ch???n s???n ph???m mu???n ?????i h??ng"
          placement="right"
          onClose={onClose}
          width={1000}
          open={open}
        >
          <div className="search-inner mb-2">
            <div className="row">
              <div className="col-7">
                <p>
                  S???n ph???m tr?????c ????:{" "}
                  <i className="text-danger">{item?.product.name}</i>
                </p>
                <p>
                  S??? l?????ng: <i className="text-danger">{item?.quantity}</i>
                </p>
                <p>
                  T???ng ti???n tr?????c ????:{" "}
                  <i className="text-danger">
                    {item?.total.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </i>
                </p>
                <div className="mt-2 mb-3">
                  <TextArea
                    onChange={(e) => setNote(e.target.value)}
                    className=""
                    value={note}
                    style={{ width: "100%" }}
                    placeholder="Ghi ch?? ????n ?????i"
                    rows={3}
                    cols={4}
                  />
                </div>
              
              </div>
              <div className="col-5">
                <p>
                  T???ng ti???n hi???n t???i:{" "}
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
                  S??? ti???n kh??ch h??ng ph???i tr??? th??m:{" "}
                  <i className="text-danger">
                    {totalProduct > item?.total
                      ? (totalProduct - item?.total).toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })
                      : (item?.total - totalProduct).toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}
                  </i>
                </p>
               
              </div>
            </div>
            <AutoComplete
              style={{
                width: 760,
              }}
              value={values}
              options={data}
              onChange={(event) => onChangeSearch(event)}
              onSelect={onSelectAuto}
              placeholder="T??n s???n ph???m"
              filterOption={(inputValue, option) =>
                option.label.props.children[1]
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th className="text-center" cols="1">
                  STT
                </th>
                <th className="text-center" cols="2">
                  H??nh ???nh
                </th>
                <th className="text-center">T??n s???n ph???m</th>
                <th className="text-center">L?? do ?????i h??ng</th>
                <th className="text-center">S???n ph???m l???i ?</th>
                <th className="text-center">Thao t??c</th>
              </tr>
            </thead>
            <tbody>
              {dataCart?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>
                      {item.images[0].name === undefined ? (
                        <Image width={90} src={item.images} />
                      ) : (
                        <Image width={90} src={item.images[0].name} />
                      )}
                    </td>
                    <td>
                      {item.name}{" "}
                      {item?.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>

                    <td>
                      <TextArea
                        rows={4}
                        style={{ width: "300px" }}
                        onChange={(event) =>
                          onChangeReason(event.target.value, index)
                        }
                        cols={4}
                        placeholder="Nh???p l?? do"
                      />
                    </td>
                    <td>
                      <Checkbox
                        onChange={(e) =>
                          onChangeChecked(e.target.checked, index)
                        }
                      />
                    </td>
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
          <Button className="offset-6" disabled={dataCart.length == 0} type="primary"  shape="round" onClick={handleOk}>G???i y??u c???u</Button>
        </Drawer>
      </div>
    </div>
  );
};

export default Exchange;
