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
  DeleteOutlined,
  EditOutlined,
  RightCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import qs from "qs";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import React, { useEffect, useState } from "react";
import { Link, Route, Router } from "react-router-dom";
const url = "http://localhost:8080/api/orders";
const { Option } = Select;
const { RangePicker } = DatePicker;

const onDelete = (record) => {
  Modal.confirm({
    title: "Xoá thể loại",
    content: "Bạn có muón xoá bản ghi này không?",
  });
};

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});

const OrderSuccess = () => {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [put, setPut] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DA_NHAN",
    },
  });

  useEffect(() => {
    loadDataOrder();
    console.log(dataOrder);
  }, [dataOrder != undefined]);

  const onConfirm = (record) => {
    const isPut = true;
    Modal.success({
      title: `Bạn có muốn xác nhận đơn hàng ${record.id}  không?`,
      okText: "Yes",
      okType: "primary",
      onOk: () => {
        confirmOrder(record, isPut);
      },
    });
  };

  const onCancel = (record) => {
    const isPut = false;
    Modal.error({
      title: `Bạn có muốn huỷ đơn hàng ${record.id}  không?`,
      okText: "Yes",
      okType: "primary",
      onOk: () => {
        confirmOrder(record, isPut);
      },
    });
  };

  const showModalData = (id) => {
    axios.get(url + "/" + id).then((res) => {
      console.log(res.data);
      setDataOD(res.data);
    });
    setView(true);
  };

  const confirmOrder = (record) => {
    fetch(`http://localhost:8080/api/orders/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: record.id,
        userId: record.userId | undefined,
        total: record.total,
        payment: record.payment,
        address: record.address,
        status: "DA_NHAN",
        note: record.note | undefined,
        customerName: record.customerName | undefined,
        phone: record.phone | undefined,
        orderDetails: [
          {
            id: record.orderDetails.id,
            productId: record.orderDetails.productId,
            total: record.orderDetails.total,
            quantity: record.orderDetails.quantity,
            status: "DA_NHAN",
          },
        ],
      }),
    }).then((res) => {
      loadDataOrder();
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
        setDataOrder(results.data.data);
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "Mã đơn đặt",
      dataIndex: "id",
      sorter: true,
      width: "10%",
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
      title: "Hình thức đặt",
      dataIndex: "payment",
      sorter: true,
      width: "20%",
      render: (payment) => {
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
              className="bg-success text-center text-light"
              style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
            >
              Đã nhận hàng
            </div>
          </>
        );
      },
    },
    {
      title: "Thao tác",
      width: "40%",
      dataIndex: "id",
      render: (id, record) => {
        return (
          <>
            <Button
              onClick={() => {
                showModalData(id);
              }}
            >
              Hiển thị
            </Button>
            <Button
              className="ms-2"
              danger
              onClick={() => navigate(`/admin/order/exchange/${id}`)}
            >
              Đổi hàng
            </Button>
            <Button
              className="ms-2"
              type="primary"
              onClick={() => navigate(`/admin/return/${id}`)}
            >
              Trả hàng
            </Button>
            {/* <CheckCircleOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onConfirm(record);
              }}
            />
            <DeleteOutlined
              onClick={() => onCancel(record)}
              style={{ color: "red", marginLeft: 12 }}
            /> */}
          </>
        );
      },
    },
  ];

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

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

  const resetEditing = () => {
    setEditing(false);
  };
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
          <label>Tên khách hàng</label>
          <Input placeholder="Nhập tên khách hàng" />
        </div>
        <div className="col-6 mt-4">
          <label>Thời gian đặt: </label>
          <br />
          <Space
            className="mx-2"
            direction="vertical"
            style={{ minWidth: "90%" }}
            size={12}
          >
            <RangePicker size={"middle"} />
          </Space>
        </div>
        <div className="col-12 text-center mt-4 ">
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
            onOk={() => {
              setView(false);
            }}
          >
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-6">
                    <p>Khách hàng: </p>
                    <p>Số điện thoại: </p>
                  </div>
                  <div className="col-6">
                    <p>Ngày nhận: </p>
                    <p>Tổng tiền: </p>
                    <p>Trạng thái: </p>
                  </div>
                </div>
              </div>
              <div className="col-12">
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
                            {" "}
                            <Image
                              width={100}
                              src={item.product.images[0].name}
                            />{" "}
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
