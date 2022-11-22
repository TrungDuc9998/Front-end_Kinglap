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
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import "../Order/order.css";
import Moment from "react-moment";
import moment from "moment";
import qs from "qs";
import axios from "axios";
import toastrs from "toastr";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import ReactToPrint from "react-to-print"
const { Option } = Select;
const url = "http://localhost:8080/api/orders";
const url_pro = "http://localhost:8080/api/products";

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});
//date
const { RangePicker } = DatePicker;

const Order = () => {
  const [data, setData] = useState([]);
  const [dataSuccess, setDataSuccess] = useState([]);
  const [dataDelivering, setDataDelivering] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [dataO, setDataO] = useState();
  const [dateOrder, setDateOrder] = useState(getDateTime);
  const [searchStatus, setSearchStatus] = useState();
  const [searchName, setSearchName] = useState();
  const [dataUser, setDataUser] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [isOrder, setOrder] = useState(false);
  const componentRef = useRef();
  const [dataCancel, setDataCancel] = useState([]);
  const [dataWait, setDataWait] = useState([]);
  const [dataPending, setDataPedning] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const [tableParamsPending, setTableParamsPending] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "CHO_XAC_NHAN",
    },
  });

  const [tableParamsWait, setTableParamsWait] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "CHO_LAY_HANG",
    },
  });

  const [tableParamsCancel, setTableParamsCancel] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "DA_HUY",
    },
  });

  const [tableParamsDelivering, setTableParamsDelivering] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "DANG_GIAO",
    },
  });
  const [tableParamsSuccess, setTableParamsSuccess] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "DA_NHAN",
    },
  });
  const [idCancel, setIDCancel] = useState();

  const loadDataOrderWait = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/orders?${qs.stringify(
        getRandomuserParams(tableParamsWait)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataWait(results.data.data);
        setLoading(false);
        setTableParamsWait({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataOrderCancel = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/orders?${qs.stringify(
        getRandomuserParams(tableParamsCancel)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataCancel(results.data.data);
        setLoading(false);
        setTableParamsCancel({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataOrderDelivering = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/orders?${qs.stringify(
        getRandomuserParams(tableParamsDelivering)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataDelivering(results.data.data);
        setLoading(false);
        setTableParamsDelivering({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataOrderStatusPending = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/orders?${qs.stringify(
        getRandomuserParams(tableParamsPending)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataPedning(results.data.data);
        setLoading(false);
        setTableParamsPending({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataOrderStatusSuccess = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/orders?${qs.stringify(
        getRandomuserParams(tableParamsSuccess)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataSuccess(results.data.data);
        setLoading(false);
        setTableParamsSuccess({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const load = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/orders?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
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

  useEffect(() => {
    load();
    loadDataOrderStatusPending();
    loadDataOrderStatusSuccess();
    loadDataOrderDelivering();
    loadDataOrderCancel();
    loadDataOrderWait();
  }, []);

  const search = () => {
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/orders?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
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

  const searchDate = () => {
    setLoading(true);
    console.log(dateOrder);
    fetch(`http://localhost:8080/api/orders/list/date/` + dateOrder)
      .then((res) => res.json())
      .then((results) => {
        setData(results);
        setLoading(false);
        setTableParams({});
      });
  };

  const changeSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const changeSearchStatus = (value) => {
    setSearchStatus(value);
  };

  //date
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

  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings != null) setDateOrder(dateStrings);
  };

  const changeSearchDate = (val, dateStrings) => {
    setDateOrder(dateStrings);
  };

  const showModalData = (id) => {
    axios.get(url + "/" + id).then((res) => {
      console.log(res.data);
      setDataOD(res.data);
    });
    setView(true);
  };

  const showModalOrder = (id) => {
    axios.get(url + "/get/" + id)
      .then((res) => {
        setDataO(res.data.data);
      })
    axios.get(url + "/" + id)
      .then((res) => {
        setDataOD(res.data);
      })
    setOrder(true);
  };

  const showModalCancel = () => {
    setEditing(true);
  };

  const columns = [
    {
      title: "Mã HD",
      dataIndex: "id",
      sorter: true,
      width: "7%",
    },
    {
      title: "Người đặt",
      dataIndex: "customerName",
      sorter: true,
      width: "15%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: true,
      render(createdAt) {
        return <Moment format="DD-MM-YYYY">{createdAt}</Moment>;
      },
      width: "10%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      sorter: true,
      width: "10%",
      render(total) {
        return (
          <>
            <CurrencyFormat
              style={{ fontSize: "14px" }}
              value={total}
              displayType={"text"}
              thousandSeparator={true}
            />
            vnđ
          </>
        );
      },
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "payment",
      sorter: true,
      width: "14%",
      render: (payment) => {
        if (payment === "TẠI CỬA HÀNG") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "80%", borderRadius: "5px", padding: "4px" }}
              >
                Tại cửa hàng
              </div>
            </>
          );
        }
        if (payment === "TÀI KHOẢN ATM") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ borderRadius: "5px", padding: "4px", width: "80%" }}
              >
                Tài khoản ATM
              </div>
            </>
          );
        }
        if (payment === "THANH TOAN VNPAY") {
          return (
            <>
              <div
                className="bg-primary text-center text-light"
                style={{ borderRadius: "5px", padding: "4px", width: "80%" }}
              >
                Ví VNPAY
              </div>
            </>
          );
        }
      },
    },
    {
      title: "Địa chỉ nhận hàng",
      dataIndex: "address",
      sorter: true,
      width: "20%",
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
      dataIndex: "id",
      dataIndex: "data",
      width: "11%",
      render: (id, data) => {
        if (data.status === "CHO_XAC_NHAN") {
          return (
            <div className="thao_tac">
              <EyeOutlined
                onClick={() => {
                  showModalData(data.id);
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  console.log("key key");
                  navigate("update");
                }}
              />
              <DeleteOutlined
                onClick={() => {
                  showModalCancel(data.id);
                  console.log(data.id);
                  setIDCancel(data.id);
                }}
              />
              <PrinterOutlined
                onClick={() => {
                  showModalOrder(data.id);
                }}
              />
            </div>
          );
        } else {
          return (
            <div className="thao_tac">
              <EyeOutlined
                onClick={() => {
                  showModalData(data.id);
                }}
              />
              <PrinterOutlined
                onClick={() => {
                  showModalOrder(data.id);
                }}
              />
            </div>
          );
        }
      },
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/orders?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
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

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const clearSearchForm = () => {
    load();
    setSearchName("");
    setSearchStatus();
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const navigate = useNavigate();
  const [keyOrder, setKey] = useState("/order/create");
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="row mb-3">
            <div className="col-2 ">
              <div className="card ">
                <div className="card-body ">
                  <h3 className="text-center text-warning">
                    {tableParamsPending.pagination.total > 0
                      ? tableParamsPending.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-success text-center text-warning">
                    Chờ xác nhận
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body ">
                  <h3 className="text-center text-success">
                    {tableParamsSuccess.pagination.total > 0
                      ? tableParamsSuccess.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-success text-center">Đã nhận</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center text-primary">
                    {tableParamsDelivering.pagination.total > 0
                      ? tableParamsDelivering.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-primary text-center">Đang giao</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center text-danger">
                    {tableParamsCancel.pagination.total > 0
                      ? tableParamsCancel.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-center text-danger">Đã huỷ</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body text-secondary">
                  <h3 className="text-center text-secondary">
                    {tableParamsWait.pagination.total > 0
                      ? tableParamsWait.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-center text-secondary">Chờ lấy hàng</h6>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center text-info">
                    {tableParams.pagination.total > 0
                      ? tableParams.pagination.total
                      : 0}
                  </h3>
                  <h6 className="text-center text-info">Tổng đơn hàng</h6>
                </div>
              </div>
            </div>
          </div>
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
            onChange={changeSearchName}
          />
        </div>
        <div className="col-4 mt-3">
          <label>Trạng thái</label>
          <br />
          <Select
            allowClear={true}
            style={{ width: "300px", borderRadius: "5px" }}
            showSearch
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            onChange={changeSearchStatus}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="CHO_XAC_NHAN" selected>
              Chờ xác nhận
            </Option>
            <Option value="CHO_LAY_HANG">Chờ lấy hàng</Option>
            <Option value="DANG_GIAO">Đang giao</Option>
            <Option value="DA_NHAN">Đã nhận</Option>
            <Option value="DA_HUY">Đã hủy</Option>
          </Select>
        </div>
        <div className="col-4 mt-3">
          <label>Thời gian đặt: </label>
          <br />
          <DatePicker
            onChange={changeSearchDate}
            onCalendarChange={handleChangeDateSearch}
            value={moment(dateOrder, "yyyy-MM-DD HH:mm:ss")}
            showTime={{ format: "HH:mm:ss" }}
            format={"yyyy-MM-DD HH:mm:ss"}
            type="datetime"
          />
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
          <Button
            className="mx-2  mt-2"
            type="primary"
            onClick={searchDate}
            style={{ borderRadius: "10px" }}
          >
            <SearchOutlined />
            Tìm kiếm Date
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4">
          <Button
            className="offset-11 "
            type="primary"
            style={{ borderRadius: "10px" }}
            onClick={() => {
              console.log("key key");
              navigate("create");
            }}
          >
            <PlusOutlined /> Thêm mới
            <ToastContainer />
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
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Huỷ đơn hàng"
            open={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            onOk={() => {
              fetch(`http://localhost:8080/api/orders/cancelled/${idCancel}`, {
                method: "PUT",
              }).then(() => load());
              toastrs.options = {
                timeOut: 6000,
              };
              toast.success("Hủy thành công!", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setEditing(false);
              setLoading(true);
            }}
          >
            <label>Bạn có muốn huỷ đơn hàng này không ?</label>
          </Modal>

          <Modal
            title="Chi tiết đơn hàng"
            open={isView}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
            }}
          >
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Mã HDCT</th>
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
                      <td>{item.product.name}</td>
                      <td>
                        <CurrencyFormat
                          value={item.product.price}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                        vnđ
                      </td>
                      <td>{item.quantity}</td>
                      <td>
                        <CurrencyFormat
                          value={item.total}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                        vnđ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Modal>

          <Modal
            title="Hiển thị hóa đơn"
            visible={isOrder}
            onCancel={() => {
              setOrder(false);
            }}
          >
            <div className="order" ref={componentRef}>
              <div className="title">
                <p>Số điện thoại: 0338861522</p>
                <p>Email: ptung539@gmail.com</p>
                <p>Địa chỉ: Lạng Giang - Bắc Giang</p>
                <p>Ngân hàng: NCB - Số tài khoản: 899983869999 </p>
                <p>Chủ tài khoản: Nguyễn Văn A</p>
                <h1>Hóa đơn mua hàng</h1>
              </div>
              <div className="content">
                <h5>Mã hóa đơn:   {dataO?.id}</h5>
                <h5>Ngày mua hàng:
                  <Moment format="DD-MM-YYYY">
                    {dataO?.createdAt}
                  </Moment>
                </h5>
                <h5>Tên khách hàng: {dataO?.customerName}</h5>
                <h5>Địa chỉ: {dataO?.address}</h5>
                <h5>Số điện thoại: {dataO?.phone}</h5>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Mã HDCT</th>
                      <th scope="col">Tên sản phẩm</th>
                      <th scope="col">Giá(VNĐ)</th>
                      <th scope="col">Số lượng</th>
                      <th scope="col">Tổng tiền(VNĐ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataOD?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{item.product.name}</td>
                          <td>{item.product.price}</td>
                          <td>{item.quantity}</td>
                          <td>{item.quantity * item.product.price}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={4}>Tổng tiền</td>
                      <td>{dataO?.total}</td>
                    </tr>
                  </tbody>
                </table>
                <h5>Tổng số tiền phải thanh toán: {dataO?.total} VNĐ</h5>
                <h5>Trạng thái đơn hàng:
                  {dataO ? dataO.status == "CHO_XAC_NHAN" ? " chờ xác nhận" : dataO.status == "CHO_LAY_HANG" ? " chờ lấy hàng" :
                    dataO.status == "DANG_GIAO" ? " đang giao" : dataO.status == "DA_NHAN" ? " đã nhận" : " đã hủy" : ""}
                </h5>
              </div>
            </div>
            <ReactToPrint
              trigger={() => {
                return <button>Xuất hóa đơn</button>
              }}
              content={() => componentRef.current}
              documentTitle='Order'
              pageStyle='print'
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Order;
