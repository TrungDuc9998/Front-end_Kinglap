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
}
  from "@ant-design/icons";
import '../Order/order.css';
import Moment from 'react-moment';
import moment from "moment";
import qs from "qs";
import axios from "axios";
import toastrs from "toastr";
import { ToastContainer, toast } from 'react-toastify';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const url = 'http://localhost:8080/api/orders';
const url_pro = 'http://localhost:8080/api/products';

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
  const [dataOD, setDataOD] = useState();
  const [dateOrder, setDateOrder] = useState(getDateTime);
  const [searchStatus, setSearchStatus] = useState();
  const [searchName, setSearchName] = useState();
  const [dataUser, setDataUser] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: '',
      search2: '',
    },
  });
  const [idCancel, setIDCancel] = useState();


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
          }
        })
      });
  }


  const searchDate = () => {
    setLoading(true);
    console.log(dateOrder)
    fetch(
      `http://localhost:8080/api/orders/list/date/` + dateOrder
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results);
        setLoading(false);
        setTableParams({
        })
      });

  }

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
      month = '0' + month;
    }
    if (day.toString().length == 1) {
      day = '0' + day;
    }
    if (hour.toString().length == 1) {
      hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
      minute = '0' + minute;
    }
    if (second.toString().length == 1) {
      second = '0' + second;
    }
    var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
  }


  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings != null)
      setDateOrder(dateStrings);
  };

  const changeSearchDate = (val, dateStrings) => {
    setDateOrder(dateStrings);
  };


  const showModalData = (id) => {
    axios.get(url + "/" + id)
      .then((res) => {
        console.log(res.data);
        setDataOD(res.data);
      })
    setView(true);
  };

  const showModalCancel = () => {
    setEditing(true);
  }

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
        return (
          <Moment format="DD-MM-YYYY">
            {createdAt}
          </Moment>
        );
      },
      width: "14%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      sorter: true,
      width: "9%",
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "payment",
      sorter: true,
      width: "13%",
      render: (payment) => {
        if (payment === 'TAI CUA HANG') {
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
        if (payment === 'TAI KHOAN ATM') {
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
        if (payment === 'THANH TOAN VNPAY') {
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
      width: "15%",
      render: (status) => {
        if (status === 'CHO_XAC_NHAN') {
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
        };
        if (status === 'CHO_LAY_HANG') {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Chờ lấy hàng
              </div>
            </>
          );
        };
        if (status === 'DANG_GIAO') {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Đang giao hàng
              </div>
            </>
          );
        };
        if (status === 'DA_NHAN') {
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
        };
        if (status === 'DA_HUY') {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "4px" }}
              >
                Đã huỷ hàng
              </div>
            </>
          );
        };
      },
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      dataIndex: "data",
      width: "20%",
      render: (id, data) => {
        if (data.status === "CHO_XAC_NHAN") {
          return (
            <>
              <EyeOutlined
                onClick={() => {
                  showModalData(data.id);
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  console.log('key key')
                  navigate('update');
                }}
              />
              <DeleteOutlined
                onClick={() => {
                  showModalCancel(data.id);
                  console.log(data.id)
                  setIDCancel(data.id)
                }}
              />
            </>
          );
        }
        else {
          return (
            <>
              <EyeOutlined
                onClick={() => {
                  showModalData(data.id);
                }}
              />
            </>
          );
        };
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
  }

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const onEdit = (record) => {
    setEditing(true);
  };

  const onView = (record) => {
    setView(true);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  //xử lý date
  const [size, setSize] = useState("middle");

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };
  const navigate = useNavigate();
  const [keyOrder, setKey] = useState("/order/create")
  return (

    <div>
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
          <Input type="text" name="searchName" value={searchName} placeholder="Nhập tên khách hàng" onChange={changeSearchName} />
        </div>
        <div className="col-4 mt-3">
          <label>Trạng thái</label>
          <br />
          <Select allowClear={true}
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
             <Option value="CHO_XAC_NHAN" selected>Chờ xác nhận</Option>
            <Option value="CHO_LAY_HANG">Chờ lấy hàng</Option>
            <Option value="DANG_GIAO">Đang giao</Option>
            <Option value="DA_NHAN">Đã nhận</Option>
            <Option value="DA_HUY">Đã hủy</Option>
          </Select>
        </div>
        <div className="col-4 mt-3">
          <label>Thời gian đặt: </label><br/>
          <DatePicker  
            onChange={changeSearchDate}
            onCalendarChange={handleChangeDateSearch}
            value={moment(dateOrder, "yyyy-MM-DD HH:mm:ss")}
            showTime={{ format: 'HH:mm:ss' }}
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
              console.log('key key')
              navigate('create');
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
            rowKey={(record) => record++}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Xác nhận"
            visible={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            onOk={() => {
              fetch(
                `http://localhost:8080/api/orders/cancelled/${idCancel}`, { method: "PUT" }).then(() => load());
              toastrs.options = {
                timeOut: 6000,
              }
              toast.success('Hủy thành công!', {
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
            <label>
            <h3>Bạn thực sự muốn hủy đơn hàng này</h3>
              <span className="text-danger"> !!!!!</span>
            </label>
          </Modal>

          <Modal
            title="Hiển thị"
            visible={isView}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
            }}
          >
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Mã HDCT</th>
                  <th scope="col">Tên sản phẩm</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Tổng tiền</th>
                  <th scope="col">Trạng thái</th>
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
                      <td>{item.status}</td>
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

export default Order;