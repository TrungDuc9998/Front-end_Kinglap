import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Space,
  InputNumber,
  Image,
} from "antd";
import {
  CheckCircleOutlined,
  EditOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import qs from "qs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Order/ConfirmOrder.css";
import moment from "moment";
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

const OrderConfirm = () => {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [put, setPut] = useState();
  const [dateOrder, setDateOrder] = useState(getDateTime);
  const [quantity, setQuantity] = useState();
  const [orderDetails, setOrderDetails] = useState([]);
  const [todos, setTodos] = useState([]);
  const [searchName, setSearchName] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "CHO_XAC_NHAN",
      search1: "",
      search2: "",
      searchStartDate: "",
      searchEndDate: "",
    },
  });

  useEffect(() => {
    loadDataOrder();
  }, []);

  const onConfirm = (record) => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Xác nhận đơn hàng ",
      content: `Bạn có muốn xác nhận đơn hàng ${record.id}  không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        confirmOrder(record, isPut);
      },
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

  const cancelCheckBox = () => {
    const isPut = false;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Huỷ đơn hàng ",
      content: `Bạn có muốn huỷ những đơn hàng này không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        handleConfirm(isPut);
      },
    });
  };

  function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    if (day.toString().length == 1) {
      day = "0" + day;
    }
    if (hour.toString().length == 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length == 1) {
      minute = "0" + minute;
    }
    if (second.toString().length == 1) {
      second = "0" + second;
    }
    var dateTime =
      year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return dateTime;
  }
  const onCancel = (record) => {
    const isPut = false;

    Modal.confirm({
      title: "Huỷ đơn hàng",
      content: `Bạn có muốn huỷ đơn hàng ${record.id}  không?`,
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        confirmOrder(record, isPut);
      },
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

  const searchDate = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/orders/list/date/` + dateOrder)
      .then((res) => res.json())
      .then((results) => {
        setDataOrder(results);
        setLoading(false);
        setTableParams({});
      });
  };

  const search = () => {
    if (searchDate != undefined && searchEndDate != undefined) {
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

  const columns = [
    {
      title: "Mã đơn đặt",
      dataIndex: "id",
      width: "20%",
    },
    {
      title: "Người đặt",
      dataIndex: "customerName",
      width: "15%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      width: "15%",
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
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "payment",
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
      title: "Trạng thái",
      dataIndex: "status",
      with: "45%",
      render: (status) => {
        return (
          <>
            <div
              className="bg-info text-center text-light"
              style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
            >
              Chờ xác nhận
            </div>
          </>
        );
      },
    },
    {
      title: "Thao tác",
      width: "30%",
      dataIndex: "id",
      render: (id, record) => {
        return (
          <>
            <EditOutlined
              onClick={() => navigate(`/admin/order/${id}/confirm`)}
              style={{ fontSize: "20px" }}
            />
          </>
        );
      },
    },
  ];

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const confirmOrder = (record, IsPut) => {
    console.log(record);
    console.log(Number(record.phone));
    const sdt = record.phone;
    console.log(record.note);
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
        customerName: record.customerName,
        phone: sdt,
        orderDetails: [
          {
            id: record.id,
            productId: record.orderDetails.productId,
            total: record.total,
            quantity: record.orderDetails.quantity,
            status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
          },
        ],
      }),
    }).then((res) => {
      loadDataOrder();
    });
  };

  const handleConfirm = (isPut) => {
    const dataOrder = [];
    selectedRowKeys.forEach((item) => {
      dataOrder.push({
        id: item,
        status: isPut === true ? "CHO_LAY_HANG" : "DA_HUY",
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

  const onChangeInputNumber = (value, id) => {
    console.log("changed", value, id);
    const set = new Set();
    const orderDetail = {
      id: id,
      quantity: value,
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
          quantity: value,
        });
      }
    }
    console.log(todos);
  };

  const onchangeSearch = (val, dateStrings) => {
    setSearchStartDate(dateStrings[0]);
    setSearchEndDate(dateStrings[1]);
  };

  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings[0] != null) setSearchStartDate(dateStrings[0]);
    if (dateStrings[1] != null) setSearchEndDate(dateStrings[1]);
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

    loadDataOrder();
    setSearchName("");
  };

  const handleUpdateOrderDetail = (item) => {
    console.log(item);
  };

  const resetEditing = () => {
    setEditing(false);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Xác nhận đơn hàng</h4>
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
      <div className="row">
        <div className="col-12 mt-4 confirm">
          {selectedRowKeys.length > 0 ? (
            <div className="text-center ">
              <Button type="primary" shape="round" onClick={confirmCheckBox}>
                Cập nhật đơn hàng
              </Button>
              <Button
                className="ms-2"
                type="primary"
                shape="round"
                danger
                onClick={cancelCheckBox}
              >
                Huỷ
              </Button>
            </div>
          ) : (
            ""
          )}
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
            id="a"
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
            onOk={() => handleUpdateOrderDetail()}
          >
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Mã HDCT</th>
                  <th>Hình ảnh</th>
                  <th scope="col">Tên sản phẩm</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {dataOD?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>
                        <Image width={90} src={item.product.images[0].name} />{" "}
                      </td>
                      <td>{item.product.name}</td>
                      <td>{item.product.price}</td>
                      <td>
                        <InputNumber
                          min={1}
                          max={10}
                          value={quantity}
                          defaultValue={item.quantity}
                          onChange={(event) =>
                            onChangeInputNumber(event, item.id, quantity)
                          }
                        />
                      </td>
                      <td>{item.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirm;
