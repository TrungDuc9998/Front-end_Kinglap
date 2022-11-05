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
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});
//date
const { RangePicker } = DatePicker;

const onDelete = (record) => {
  Modal.confirm({
    title: "Xoá hoá đơn",
    content: "Bạn có muốn xoá hoá đơn này không ?",
  });
};

const Order = () => {
  const [data, setData] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [dataUser, setDataUser] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
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
      // axios.get(url + `?${qs.stringify(
      //   getRandomuserParams(tableParams)
      // )}`)
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

  const user = (userId) => {
    fetch(
      `http://localhost:8080/api/category?` + userId
    ).then((res) => res.json())
      .then((results) => {
        setDataUser(results.data.data);
      }
      )
  }

  useEffect(() => {
    load();
  }, []);

  const columns = [
    {
      title: "Mã HD",
      dataIndex: "id",
      sorter: true,
      width: "7%",
    },
    {
      title: "Người đặt",
      dataIndex: "user",
      sorter: true,
      render: (user) => `${user.username}`,
      width: "15%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: true,
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
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

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
        <div className="col-4 mt-4">
          <label>Tên sản phẩm</label>
          <Input placeholder="Nhập tên sản phẩm" />
        </div>
        <div className="col-4 mt-4">
          <label>Tên thể loại</label>
          <br />
          <Select
            style={{ width: "300px", borderRadius: "5px" }}
            showSearch
            placeholder="Chọn thể loại"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="jack">Laptop</Option>
            <Option value="lucy">Linh kiện</Option>
            <Option value="lucy">Phụ kiện</Option>
          </Select>
        </div>
        <div className="col-4 mt-4">
          <label>Trạng thái</label>
          <br />
          <Select
            style={{ width: "300px", borderRadius: "5px" }}
            showSearch
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="jack">Hoạt động</Option>
            <Option value="lucy">Không hoạt động</Option>
          </Select>
        </div>
        <div className="col-6">
          <label>Người đặt</label>
          <Input placeholder="Tên người đặt" />
        </div>
        <div className="col-6 mt-4">
          <label>Thời gian đặt: </label>
          <Space className="mx-2" direction="vertical" size={12}>
            <RangePicker size={"middle"} />
          </Space>
        </div>
        <div className="col-12 text-center ">
          <Button
            className="mt-2"
            type="primary-uotline"
            // onClick={showModal}
            style={{ borderRadius: "10px" }}
          >
            <ReloadOutlined />
            Đặt lại
          </Button>
          <Button
            className="mx-2  mt-2"
            type="primary"
            // onClick={showModal}
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
            // onClick={showModal}
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
              Bạn thực sự muốn hủy đơn hàng này
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
