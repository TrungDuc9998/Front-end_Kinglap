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
  Image,
  Option,
  Checkbox,
  Spin,
} from "antd";
import {
  CheckCircleOutlined,
  EyeOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import qs from "qs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAsyncError, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const { RangePicker } = DatePicker;
const url = "http://localhost:8080/api/returns";

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  check: params.pagination?.check,
  searchStatus: params.pagination?.searchStatus,
});

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

const ExchangeSuccess = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [dataRequest, setDataRequest] = useState([]);
  const [dataExchange, setDataExchange] = useState();
  const [isView, setView] = useState(false);
  const [dataExchange1, setDataExchange1] = useState();
  const [dataExchangeDetail, setDataExchangeDetail] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    loadDataExchange();
  }, [JSON.stringify(tableParams)]);

  const onConfirm = (record) => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined className="text-success" />,
      title: "Xác nhận đổi đơn hàng",
      content: `Bạn có muốn xác nhận đổi đơn hàng này không ?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        handleSubmit(isPut);
      },
    });
  };

  const handleSubmit = (isPut) => {
    const orderDetail = [];

    console.log(dataRequest);

    console.log(data);
    console.log("selected row key handle submit");
    console.log(selectedRowKeys);

    const array = [];
    selectedRowKeys.forEach((item) => {
      dataRequest.forEach((element) => {
        if (item == element.id) {
          array.push({
            id: element.id,
            productId: element.productIdE,
            orderDetailId: element.orderDetailId,
            quantity: element.quantity,
            orderChange: element.orderChange,
            status: isPut === true ? "DA_XAC_NHAN" : "KHONG_XAC_NHAN",
          });
        }
      });
    });

    console.log("array");
    console.log(array);

    array.forEach((element) => {
        orderDetail.push({
          id: element.orderDetailId,
          isCheck: element.orderChange,
          productId: element.productId,
          quantity: element.quantity,
          total: 0,
          isBoolean: true,
          status: "0",
        });
    
    });

    const exchangeDetails = [];

    // let check = false;

    // dataExchange
    //   .filter((item) => item.select === true)
    //   .forEach((item) => {
    //     console.log('vào if');
    //     check = true;
    //     exchangeDetails.push({
    //       id: item.id,
    //       productId: item.productId.id,
    //       orderDetailId: item.orderDetail.id,
    //       quantity: item.quantity,
    //       status: isPut === true ? "DA_XAC_NHAN" : "KHONG_XAC_NHAN",
    //     });
    //   });

    // console.log(orderDetail);

    fetch(`http://localhost:8080/api/returns/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: data.orderId.id,
        reason: "a",
        description: "a",
        isCheck: 1,
        status: "DA_XU_LY",
        returnDetailEntities: array,
      }),
    }).then((res) => {});
    // if (isPut === true) {
      fetch(
        `http://localhost:8080/api/staff/orders/update/exchange/${data.orderId.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(orderDetail),
        }
      ).then((res) => loadDataExchange());
      toastSuccess("Xác nhận yêu cầu thành công !");
    // } else {
    //   toastSuccess("Huỷ yêu cầu thành công !");
    // }
  };

  const ConfirmReturn = (data, isPut) => {
    const returnDetail = [];
    data.returnDetailEntities.forEach((element) => {
      returnDetail.push({
        productId: element.productId.id,
        orderDetailId: element.orderDetail.id,
        quantity: element.quantity,
        status: isPut == true ? "DA_XAC_NHAN" : "KHONG_XAC_NHAN",
      });
    });
    toastSuccess("Cập nhật thành công !");
  };

  const loadDataExchange = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/returns?${qs.stringify(
        getRandomOrderParams(tableParams)
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        const data = [];
        // results.data.data?.forEach((item) => {
        //   data.push({
        //     key: item.id,
        //     id: item.id,
        //     orderId: item.orderId.id,
        //     customerName: item.orderId.customerName,
        //     phone: item.orderId.phone,
        //     createdAt: item.createdAt,
        //     description: item.description,
        //     status: item.status,
        //   });
        // });
        setDataExchange(results.data.data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: results.data.total,
          },
        });
      });
  };

  const columnDetail = [
    {
      title: "Hình ảnh",
      dataIndex: "imageProductOd",
      width: "10%",
      render: (imageProductOd) => {
        return (
          <>
            {imageProductOd != undefined ? (
              <Image width={100} src={imageProductOd} />
            ) : (
              <Spin></Spin>
            )}
          </>
        );
      },
    },
    {
      title: "Sản phẩm trước đó",
      dataIndex: "productNameOd",
      width: "14%",
    },
    {
      title: "Giá tiền",
      dataIndex: "priceProductOd",
      width: "10%",
      render: (priceProductOd) => {
        return (
          <>
            {priceProductOd.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageProductE",
      width: "10%",
      render: (imageProductE) => {
        return <Image width={100} src={imageProductE} />;
      },
    },
    {
      title: "Đổi sang sản phẩm",
      dataIndex: "productNameE",
      width: "15%",
    },
    {
      title: "Giá tiền",
      dataIndex: "priceProductE",
      width: "10%",
      render: (priceProductE) => {
        return (
          <>
            {priceProductE.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Sản phẩm lỗi",
      dataIndex: "isCheck",
      width: "7%",
      render: (isCheck) => {
        return <Checkbox checked={isCheck == "1" ? true : false} />;
      },
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      width: "15%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "10%",
      render: (status) => {
        return (
          <>
            {status != "YEU_CAU" ? (
              status === "DA_XAC_NHAN" ? (
                <div
                  className="bg-success text-center text-light"
                  style={{
                    width: "150px",
                    borderRadius: "5px",
                    padding: "4px",
                  }}
                >
                  Đã xác nhận
                </div>
              ) : (
                <div
                  className="bg-danger text-center text-light"
                  style={{
                    width: "150px",
                    borderRadius: "5px",
                    padding: "4px",
                  }}
                >
                  Huỷ
                </div>
              )
            ) : (
              <div
                className="bg-warning text-center text-light"
                style={{
                  width: "150px",
                  borderRadius: "5px",
                  padding: "4px",
                }}
              >
                Yêu cầu xác nhận
              </div>
            )}
          </>
        );
      },
    },
  ];

  const showModalData = (id) => {
    fetch(`http://localhost:8080/api/auth/returns/${id}/detail`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
      });

    fetch(`http://localhost:8080/api/returns/${id}`)
      .then((res) => res.json())
      .then((res) => {
        const data = [];
        const dataRequest = [];
        console.log(res);
        res.forEach((item) => {
          if (item.status === "YEU_CAU") {
            data.push({
              key: item.id,
              id: item.id,
              status: item.status,
              productNameOd: item.orderDetail.product.name,
              priceProductOd: item.orderDetail.product.price,
              imageProductOd: item.orderDetail.product.images[0]?.name,
              productNameE: item.productId.name,
              priceProductE: item.productId.price,
              imageProductE: item.productId.images[0]?.name,
              productIdE: item.productId.id,
              productIdOd: item.orderDetail.product.id,
              isCheck: item.isCheck,
              reason: item.reason,
              quantity: item.quantity,
              orderDetailId:item.orderDetail.id,
              orderChange: item.orderChange,
            });
          } else {
            dataRequest.push({
              key: item.id,
              id: item.id,
              status: item.status,
              productNameOd: item.orderDetail.product.name,
              priceProductOd: item.orderDetail.product.price,
              imageProductOd: item.orderDetail.product.images[0]?.name,
              productNameE: item.productId.name,
              priceProductE: item.productId.price,
              imageProductE: item.productId.images[0]?.name,
              isCheck: item.isCheck,
              reason: item.reason,
            });
          }
        });
        console.log("data set");
        console.log(data);
        setDataRequest(data);
        setDataExchangeDetail(dataRequest);
      });
    setView(true);
  };

  const columns = [
    {
      title: "Mã đơn đổi",
      dataIndex: "id",
      width: "7%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Mã hoá đơn",
      dataIndex: "orderId",
      width: "10%",
      sorter: (a, b) => a.orderId.id - b.orderId.id,
      render: (orderId) => {
        return <p> {orderId.id}</p>;
      },
    },
    {
      title: "Tên khách hàng",
      dataIndex: "orderId",
      width: "17%",
      render: (orderId) => {
        return <>{orderId.customerName}</>;
      },
      sorter: (a, b) => a.orderId - b.orderId,
    },
    {
      title: "Số điện thoai",
      dataIndex: "orderId",
      width: "15%",
      render: (orderId) => {
        return <>{orderId.phone}</>;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: "18%",
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      with: "30%",
      render: (status) => {
        if (status === "CHUA_XU_LY") {
          return (
            <>
              <div
                className="bg-warning text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
              >
                Chưa xử lý
              </div>
            </>
          );
        } else if (status === "KHONG_XU_LY") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
              >
                Không xử lý
              </div>
            </>
          );
        } else {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
              >
                Đã xử lý
              </div>
            </>
          );
        }
      },
    },
    {
      title: "Thao tác",
      width: "35%",
      dataIndex: "id",
      render: (id, record) => {
        return (
          <>
            <EyeOutlined
              style={{ fontSize: "20px" }}
              onClick={() => navigate(`/admin/order/exchange/detail/${id}`)}
            />
            <Button
              onClick={() => {
                showModalData(id);
              }}
            >
              Chi tiết
            </Button>
          </>
        );
      },
    },
  ];

  const [valueSearch, setValueSearch] = useState("TAT_CA");
  const onChange = (value) => {
    setValueSearch(value);
  };
  const onClickDatLai = () => {
    setValueSearch("TAT_CA");
    setDataExchange(dataExchange1);
  };
  const onClickSearch = () => {
    console.log(valueSearch);
    if (valueSearch == "TAT_CA") {
      setDataExchange(dataExchange1);
      return;
    }
    setDataExchange(
      dataExchange1.filter((item) => item.status === valueSearch)
    );
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    console.log("row key: ", newSelectedRowKeys[0]);
    console.log("return detail");
    console.log(dataExchangeDetail);
    setSelectedRowKeys(newSelectedRowKeys);
    dataExchangeDetail.forEach((element) => {
      if (element.id === newSelectedRowKeys[0]) {
        if (element.status == "YEU_CAU") {
          console.log("vào yêu cầu");
          setSelectedRowKeys(newSelectedRowKeys);
        }
      }
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Yêu cầu đổi hàng</h4>
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
        <div className="col-4 mt-4">
          <label>Trạng thái</label>
          <br />
          <Select
            style={{ width: "300px", borderRadius: "5px" }}
            defaultValue={"TAT_CA"}
            value={valueSearch}
            onChange={onChange}
            options={[
              {
                value: "TAT_CA",
                label: "Tất cả",
              },
              {
                value: "DA_XU_LY",
                label: "Đã xử lý",
              },
              {
                value: "CHUA_XU_LY",
                label: "Chưa xử lý",
              },
            ]}
          ></Select>
        </div>
        <div className="col-12 text-center ">
          <Button
            className="mt-2"
            type="primary-uotline"
            onClick={onClickDatLai}
            style={{ borderRadius: "10px" }}
          >
            <ReloadOutlined />
            Đặt lại
          </Button>
          <Button
            className="mx-2  mt-2"
            type="primary"
            onClick={onClickSearch}
            style={{ borderRadius: "10px" }}
          >
            <SearchOutlined />
            Tìm kiếm
          </Button>
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
          <Table
            // rowSelection={rowSelection}
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={dataExchange}
            pagination={tableParams.pagination}
            loading={loading}
            // onChange={handleTableChange}
          />
          <Modal
            title="Chi tiết đơn đổi"
            footer={[
              <Button key="back" onClick={() => setView(false)}>
                Đóng
              </Button>,
            ]}
            open={isView}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {}}
            onClick
            width={1300}
          >
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                  <p>Mã đơn đổi: {data?.id} </p>
                  <p>Mã hoá đơn: {data?.orderId.id} </p>
                  <p>Ngày gửi yêu cầu: {data?.orderId.createdAt}</p>
                </div>
                <div className="col-6">
                  <p>Tên khách hàng: {data?.orderId.customerName}</p>
                  <p>Số điện thoại: {data?.orderId.phone}</p>
                  <p>Ghi chú: {data?.description}</p>
                </div>
              </div>
              <div>
                <h6 className="text-danger fw-bold ">Đơn đổi chưa xử lý</h6>
                <div className="col-12 mt-4 mb-2 confirm">
                  {selectedRowKeys.length > 0 ? (
                    <div className="text-center ">
                      <Button type="primary" shape="round" onClick={onConfirm}>
                        Xác nhận đơn hàng
                      </Button>
                      <Button
                        className="ms-2"
                        type="primary"
                        shape="round"
                        danger
                      >
                        Huỷ
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <Table
                  rowSelection={rowSelection}
                  columns={columnDetail}
                  rowKey={(record) => record.id}
                  dataSource={dataRequest}
                  pagination={{ position: ["none", "none"] }}
                />
                <h6 className="text-danger fw-bold mt-5">Đơn đổi đã xử lý</h6>
                <Table
                  columns={columnDetail}
                  rowKey={(record) => record.id}
                  dataSource={dataExchangeDetail}
                  pagination={{ position: ["none", "none"] }}
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ExchangeSuccess;
