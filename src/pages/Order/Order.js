import {
  Table,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Image,
  Space,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import "../Order/order.css";
import Moment from "react-moment";
import qs from "qs";
import axios from "axios";
import toastrs from "toastr";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../image/firebase/firebase";
import { v4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import QRCode from "qrcode";
import { async } from "@firebase/util";

const { Option } = Select;
const url = "http://localhost:8080/api/orders";
const url_pro = "http://localhost:8080/api/products";

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
  searchStartDate: params.pagination?.searchStartDate,
  searchEndDate: params.pagination?.searchEndDate,
});
//date
const { RangePicker } = DatePicker;

const Order = () => {
  const id = "ok";
  const [data, setData] = useState([]);
  const [dataSuccess, setDataSuccess] = useState([]);
  const [dataDelivering, setDataDelivering] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [dataO, setDataO] = useState();
  const [dateOrder, setDateOrder] = useState(getDateTime);
  const [searchStatus, setSearchStatus] = useState();
  const [searchName, setSearchName] = useState();
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const [images, setImages] = useState([]);
  const [orderHistory, setOrderHistory] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [isOrder, setOrder] = useState(false);
  const componentRef = useRef();
  const [dataCancel, setDataCancel] = useState([]);
  const [dataWait, setDataWait] = useState([]);
  const [dataPending, setDataPedning] = useState([]);
  const [searchStartDate, setSearchStartDate] = useState();
  const [searchEndDate, setSearchEndDate] = useState();
  const [checkId, setCheckId] = useState();
  const [qrImageUrl, setQRImageUrl] = useState();
  const imagesListRef = ref(storage, "images/"); //all url
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
      searchStartDate: "",
      searchEndDate: "",
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

  const onchangeSearch = (val, dateStrings) => {
    setSearchStartDate(dateStrings[0]);
    setSearchEndDate(dateStrings[1]);
  };

  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings[0] != null) setSearchStartDate(dateStrings[0]);
    if (dateStrings[1] != null) setSearchEndDate(dateStrings[1]);
  };

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

  const qrCodeData = [
    { id: 1234, value: "TEST1" },
    { id: 1235, value: "TEST2" },
  ];
  const qrCodeIds = qrCodeData.map((data) => data.id);

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
        if (results.status) console.log(results);
        if (results.status === 200) {
          setDataPedning(results.data.data);
          setLoading(false);
          setTableParamsPending({
            pagination: {
              current: results.data.current_page,
              pageSize: 10,
              total: results.data.total,
            },
          });
        }
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
        console.log(results);
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
  }, [checkId != undefined, dataO != undefined]);

  const search = () => {
    console.log(searchDate);
    if (searchDate != undefined && searchEndDate != undefined) {
      tableParams.pagination.searchStartDate = searchStartDate;
      tableParams.pagination.searchEndDate = searchEndDate;
    }
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

  const changeSearchDate = (val, dateStrings) => {
    setDateOrder(dateStrings);
  };

  const showModalData = (id) => {
    axios.get(url + "/" + id).then((res) => {
      console.log(res.data);
      setDataOD(res.data);
    });
    console.log("tên khách hàng trong modal: ", dataO?.name);
    // createQRCode();
    setCheckId(
      `SỐ ĐIỆN THOẠI: 0338861522` +
        `\nEMAIL: ptung539@gmail.com` +
        `\nĐỊA CHỈ: Lạng Giang - Bắc Giang` +
        `\nNGÂN HÀNG: NCB - Số tài khoản: 899983869999` +
        `\nCHỦ TÀI KHOẢN: NGUYỄN VĂN A` +
        `\nHOÁ ĐƠN MUA HÀNG` +
        `\nMÃ HOÁ ĐƠN: ${id}` +
        `\nCHỦ TÀI KHOẢN: NGUYỄN VĂN A`
    );
    loadDataOrderHistoryById(id);
    setView(true);
  };

  const loadDataOrderHistoryById = (id) => {
    console.log("id hoá đơn log ra", id);
    fetch(`http://localhost:8080/api/auth/orders/history/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("data order history");
        console.log(res);
        setOrderHistory(res);
      });
  };

  const showModalOrder = (id) => {
    let dataOrder = "";
    axios.get(url + "/get/" + id).then((res) => {
      setDataO(res.data);
      createQRCode(res.data);
    });
    axios.get(url + "/" + id).then((res) => {
      setDataOD(res.data);
    });
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
      title: "Tổng tiền(VNĐ)",
      dataIndex: "total",
      sorter: true,
      width: "10%",
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
      sorter: true,
      width: "13%",
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
      title: "Địa chỉ nhận hàng",
      dataIndex: "address",
      sorter: true,
      width: "25%",
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
      width: "8%",
      render: (id, data) => {
        if (data.status != "DA_HUY") {
          return (
            <div className="thao_tac">
              <EyeOutlined
                style={{ fontSize: "20px" }}
                onClick={() => {
                  showModalData(data.id);
                }}
              />
              {/* <EditOutlined
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
              /> */}
              <PrinterOutlined
                style={{ fontSize: "20px" }}
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
            </div>
          );
        }
      },
    },
  ];

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
      width: "30%",
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

  const handleUploadFile = () => {
    console.log("vào handle uploadFile");
    const check = "1";
    const imageRef = ref(storage, `images/${check + v4()}`);
    // console.log("imageRef",imageRef)//_service: {…}, _location: {…}
    uploadBytes(imageRef, check).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImages((prev) => [...prev, url]);
        console.log("snapshot.ref", snapshot.ref); //_service: {…}, _location: {…}
        setImageUrls((prev) => [...prev, url]); //set url ->all url
      });
      // toastSuccess("upload ảnh thành công !");
    });
  };

  async function createQRCode(data) {
    const b =
      `\nMÃ HOÁ ĐƠN: ${data?.id}` +
      `\nNGÀY MUA HÀNG: ${data?.createdAt}` +
      `\nTÊN KHÁCH HÀNG: ${data?.customerName}` +
      `\nĐỊA CHỈ: ${data?.address}` +
      `\nSỐ ĐIỆN THOẠI: ${data?.phone}` +
      data?.orderDetails.map((item) => {
        return (
          `\nTên sản phẩm: ${item?.product.name}` +
          ` - Số lượng: ${item.quantity}` +
          ` - Đơn giá: ${item.product.price.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}` +
          ` - Tổng tiền: ${item.total.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}`
        );
      }) +
      `\nĐÃ ĐẶT CỌC: ${data?.money}` +
      `\nĐÃ THANH TOÁN: ${data?.total}` +
      `\nTRẠNG THÁI ĐƠN HÀNG: ${data?.status}`;
    const response = await QRCode.toDataURL(b);
    setQRImageUrl(response);
  }

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
        <div className="col-12 mt-4">
          <Button
            className="offset-11 "
            type="primary"
            style={{ borderRadius: "10px" }}
            onClick={() => {
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
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"Đóng"}
            onOk={() => {
              setView(false);
            }}
            width={850}
          >
            <table className="table">
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
                        {" "}
                        <Image
                          width={100}
                          src={item.product?.images[0]?.name}
                        />{" "}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <h6 className="text-danger ms-1">Lịch sử đơn hàng</h6>
            <Table
              columns={columnOrderHistory}
              rowKey={(record) => record.id}
              dataSource={orderHistory}
              pagination={{ position: ["none", "none"] }}
            />
          </Modal>

          <Modal
            title="Hiển thị hóa đơn"
            footer={null}
            open={isOrder}
            onCancel={() => {
              setOrder(false);
            }}
            width={700}
          >
            <div>
              <div className="order" ref={componentRef}>
                <div className="qrcode ">
                  {qrImageUrl && (
                    <div className="mt-4">
                      <a href={qrImageUrl} download={`HoaDon`+ dataO?.id +'.png'}>
                        <img src={qrImageUrl} style={{width: "140px", height:"140px"}} alt="QR CODE" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="title">
                  <p className="fs-6">Số điện thoại: 0338861522</p>
                  <p className="fs-6">Email: ptung539@gmail.com</p>
                  <p className="fs-6">Địa chỉ: Lạng Giang - Bắc Giang</p>
                  <p className="fs-6">
                    Ngân hàng: NCB - Số tài khoản: 899983869999{" "}
                  </p>
                  <p className="fs-6">Chủ tài khoản: Nguyễn Văn A</p>
                  <h2 className="fw-bold">HOÁ ĐƠN MUA HÀNG</h2>
                </div>
                <div className="">
                  <p className="fw-bold">Mã hóa đơn: {dataO?.id}</p>
                  <p className="fw-bold">
                    Ngày mua hàng:{" "}
                    <Moment format="DD-MM-YYYY">{dataO?.createdAt}</Moment>
                  </p>
                  <p className="fw-bold">
                    Tên khách hàng: {dataO?.customerName}
                  </p>
                  <p className="fw-bold">Địa chỉ: {dataO?.address}</p>
                  <p className="fw-bold">Số điện thoại: {dataO?.phone}</p>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Mã HDCT</th>
                        <th scope="col">Tên sản phẩm</th>
                        <th scope="col">Giá(VNĐ)</th>
                        <th scope="col">Số lượng</th>
                        <th scope="col" className="fw-bold">
                          Tổng tiền(VNĐ)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataOD?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.id}</td>
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
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={4}>Tổng tiền</td>
                        <td>
                          {dataO?.total.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="fw-bold">
                    Đã đặt cọc :{" "}
                    <i className="text-danger fw-bold">
                      {" "}
                      {dataO?.money.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </i>
                  </p>
                  <p className="fw-bold">
                    Tổng số tiền phải thanh toán:{" "}
                    <i className="text-danger">
                      {(dataO?.total - dataO?.money).toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </i>
                  </p>
                  <p className="fw-bold">
                    Trạng thái đơn hàng:
                    <i className="text-danger">
                      {dataO?.money === 0 ? "Đã thanh toán" : "Đã đặt cọc"}
                    </i>
                  </p>
                </div>
              </div>
              <ReactToPrint
                className="text-center"
                trigger={() => {
                  return (
                    <Button
                      onClick={handleUploadFile}
                      className="text-center print"
                    >
                      Xuất hóa đơn
                    </Button>
                  );
                }}
                content={() => componentRef.current}
                documentTitle={"Order" + dataO?.id}
                pageStyle="print"
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Order;
