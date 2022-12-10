import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Image,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  EyeOutlined,
  MenuFoldOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import qs from "qs";
import axios from "axios";
import React, { useEffect, useState } from "react";
const url = "http://localhost:8080/api/orders";
const { Option } = Select;
const { RangePicker } = DatePicker;

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
  searchStartDate: params.pagination?.searchStartDate,
  searchEndDate: params.pagination?.searchEndDate,
});

const OrderWait = () => {
  const [data, setData] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [put, setPut] = useState();
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [searchName, setSearchName] = useState();
  const [orderHistory, setOrderHistory] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "CHO_LAY_HANG",
      search1: "",
      search2: "",
      searchStartDate: "",
      searchEndDate: "",
    },
  });

  useEffect(() => {
    loadDataOrder();
  }, [dataOrder != undefined]);

  const columnOrderHistory = [
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
      width: "25%",
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
      width: "25%",
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

  const search = () => {
    if (searchStartDate != undefined && searchEndDate != undefined) {
      console.log("vào");
      tableParams.pagination.searchStartDate = searchStartDate;
      tableParams.pagination.searchEndDate = searchEndDate;
    }
    console.log(searchName);
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/orders?${qs.stringify(
        getRandomOrderParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataOrder(results.data.data);
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
  const confirmCheckBox = () => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Xác nhận đơn hàng ",
      content: `Bạn có muốn xác nhận những đơn hàng này không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        handleConfirm(isPut);
      },
    });
  };

  const handleConfirm = (isPut) => {
    const dataOrder = [];
    selectedRowKeys.forEach((item) => {
      dataOrder.push({
        id: item,
        status: "DANG_GIAO",
      });
    });
    fetch(`http://localhost:8080/api/orders/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataOrder),
    }).then((res) => {
      clearSearchForm();
    });

    console.log(dataOrder);
  };

  const clearSearchForm = () => {
    dataOrder?.forEach((item, index) => {
      data.splice(index, dataOrder.length);
    });

    if (dataOrder.length == 0) {
      setDataOrder([]);
      setData([]);
      loadDataOrder();
      setSearchName("");
      setSelectedRowKeys([]);
    }
  };

  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings[0] != null) setSearchStartDate(dateStrings[0]);
    if (dateStrings[1] != null) setSearchEndDate(dateStrings[1]);
  };
  const onchangeSearch = (val, dateStrings) => {
    setSearchStartDate(dateStrings[0]);
    setSearchEndDate(dateStrings[1]);
  };

  const onConfirm = (record) => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Xác nhận đơn hàng",
      content: `Bạn có muốn xác nhận đơn hàng ${record.id}  không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        confirmOrder(record, isPut);
      },
    });
  };

  const confirmOrder = (record) => {
    console.log(record);
    const sdt = record.phone;
    fetch(`http://localhost:8080/api/orders/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: record.id,
        userId: record.userId | undefined,
        total: record.total,
        payment: record.payment,
        address: record.address,
        status: "DANG_GIAO",
        note: record.note | undefined,
        customerName: record.customerName,
        phone: sdt,
        orderDetails: [
          {
            id: record.id,
            productId: record.productId,
            total: record.total,
            quantity: record.quantity,
            status: "DANG_GIAO",
          },
        ],
      }),
    }).then((res) => {
      loadDataOrder();
    });
  };

  const showModalData = (id) => {
    console.log("id show modal: ", id);
    axios.get(url + "/" + id).then((res) => {
      console.log(res.data);
      setDataOD(res.data);
    });
    loadDataOrderHistoryById(id);
    setView(true);
  };

  const loadDataOrderHistoryById = (id) => {
    console.log("id hoá đơn log ra", id);
    // setLoading(true);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("data order history");
        console.log(res);
        setOrderHistory(res);
      });
  };

  const loadDataOrder = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/orders?${qs.stringify(
        getRandomOrderParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        results.data.data?.forEach((item) => {
          data.push({
            key: item.id,
            id: item.id,
            payment: item.payment,
            customerName: item.customerName,
            total: item.total,
            status: item.status,
            quantity: item.quantity,
          });
        });
        setDataOrder(data);
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "Mã đơn đặt",
      dataIndex: "id",
      sorter: true,
      width: "20%",
    },
    {
      title: "Người đặt",
      dataIndex: "customerName",
      sorter: true,
      width: "15%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      sorter: true,
      render(total) {
        return (
          <>
            {total.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
      width: "15%",
    },
    {
      title: "Hình thức đặt",
      dataIndex: "payment",
      sorter: true,
      width: "20%",
      render: (payment) => {
        if (payment != "TẠI CỬA HÀNG") {
          return (
            <>
              <div
                className="bg-info text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
              >
                {payment === "VN_PAY" ? "Thanh toán VNPAY" : "Đặt cọc VNPAY"}
              </div>
            </>
          );
        } else {
          return (
            <>
              <div
                className="bg-info text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
              >
                Tại cửa hàng
              </div>
            </>
          );
        }
      },
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      width: "13%",
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
    {
      title: "Thao tác",
      width: "30%",
      dataIndex: "id",
      render: (id, record) => {
        return (
          <>
            <EyeOutlined
              style={{ marginLeft: 12, color: "red", fontSize: "23px" }}
              onClick={() => {
                showModalData(id);
              }}
            />
          </>
        );
      },
    },
  ];

  const onChange = (value) => {};

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const OrderDelivering = (record, IsPut) => {
    fetch(`http://localhost:8080/api/orders/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: record.id,
        userId: record.userId | undefined,
        total: record.total,
        payment: record.payment,
        address: record.address,
        status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
        note: record.note | undefined,
        customerName: record.customerName | undefined,
        phone: record.phone | undefined,
        orderDetails: [
          {
            id: record.orderDetails.id,
            productId: record.orderDetails.productId,
            total: record.orderDetails.total,
            quantity: record.orderDetails.quantity,
            status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
          },
        ],
      }),
    }).then((res) => {
      loadDataOrder();
    });
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const resetEditing = () => {
    setEditing(false);
  };
  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Chờ lấy hàng</h4>
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
        <div className="col-4 mt-3">
          <label>Từ khoá</label>
          <Input
            type="text"
            name="searchName"
            value={searchName}
            placeholder="Nhập tên khách hàng"
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-4 mt-3">
          <label>Thời gian đặt: </label>
          <br />
          <Space
            direction="vertical"
            size={12}
            style={{ width: "100%", borderRadius: "5px" }}
          >
            <RangePicker
              showTime={{ format: "HH:mm:ss" }}
              format={"yyyy-MM-DD HH:mm:ss"}
              onChange={onchangeSearch}
              onCalendarChange={handleChangeDateSearch}
              type="datetime"
            />
          </Space>
        </div>
        <div className="col-12 text-center mt-4">
          <Button
            className="mt-2"
            type="primary-uotline"
            onClick={clearSearchForm}
            style={{ borderRadius: "10px" }}
          >
            <ReloadOutlined />
            Đặt lại
          </Button>
          <Button
            className="mx-2  mt-2"
            type="primary"
            onClick={search}
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
            rowSelection={rowSelection}
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={dataOrder}
            pagination={tableParams.pagination}
            loading={loading}
          />
          <Modal
            title="Xác nhận đơn hàng"
            open={isEditing}
            onCancel={() => {
              resetEditing();
            }}
            onOk={() => {
              setEditing(true);
            }}
          >
            Bạn có muốn xác nhận đơn hàng không ?
          </Modal>

          <Modal
            title="Chi tiết đơn hàng"
            open={isView}
            onCancel={() => {
              setView(false);
            }}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
           cancelText={"Đóng"}
            onOk={() => {
              setView(false);
            }}
            width= {800}
          >
            {/* <h6>Mã hoá đơn {orderHistory[0]?.id} </h6> */}
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Mã HDCT</th>
                  <th>Hình ảnh</th>
                  <th scope="col">Tên sản phẩm</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Tổng tiền</th>
                  {/* <th scope="col">Trạng thái</th> */}
                </tr>
              </thead>
              <tbody>
                {dataOD?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>
                        <Image width={100} src={item.product.images[0]?.name} />{" "}
                      </td>
                      <td>{item.product.name}</td>
                      <td>
                        {item.product.price.toLocaleString("it-IT", {
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
                      {/* <td>{item.status}</td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <h6 className="text-danger mt-5">Lịch sử đơn hàng</h6>
            <Table
              columns={columnOrderHistory}
              rowKey={(record) => record.id}
              dataSource={orderHistory}
              pagination={{ position: ["none", "none"] }}
            />
          </Modal>
        </div>
        {selectedRowKeys.length > 0 ? (
          <div className="text-center mb-4">
            <Button type="primary" onClick={confirmCheckBox}>
              Cập nhật đơn hàng
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default OrderWait;
