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
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import qs from "qs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Item from "antd/lib/list/Item";
const { Option } = Select;
const { RangePicker } = DatePicker;
const url = "http://localhost:8080/api/staff/returns";
const onDelete = (record) => {
  Modal.confirm({
    title: "Xoá thể loại",
    content: "Bạn có muón xoá bản ghi này không?",
  });
};

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  check: params.pagination?.check,
  searchStatus: params.pagination?.searchStatus,
});

const ReturnConfirm = () => {
  const [data, setData] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataExchange, setDataExchange] = useState();
  const [put, setPut] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      check: "2",
      //   searchStatus: "YEU_CAU",
    },
  });

  useEffect(() => {
    loadDataExchange();
    // console.log(dataExchange);
  }, [dataExchange != undefined]);

  const onConfirm = (record) => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: `Bạn có muốn xác nhận trả hàng hàng ${record.id}  không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        confirmUpdateStatus(record, isPut);
      },
    });
  };

  const confirmUpdateStatus = (record, isPut) => {
    console.log(record);
    const returnDetail = [];
    record.returnDetailEntities.forEach((item) => {
      returnDetail.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    });
    console.log(returnDetail);
    fetch(`http://localhost:8080/api/returns/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: record.orderId,
        reason: record.reason,
        description: record.description,
        status: isPut === true ? "XAC_NHAN" : "KHONG_XAC_NHAN",
        isCheck: "2",
        returnDetailEntities: returnDetail,
      }),
    }).then((res) => {});
    console.log(returnDetail[0].productId);
    fetch(`http://localhost:8080/api/orders/${record.orderId}/updateReturn`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: returnDetail[0].productId,
        quantity: returnDetail[0].quantity,
      }),
    }).then((res) => {});
  };

  const onCancel = (record) => {
    const isPut = false;
    Modal.confirm({
      title: "Huỷ xác nhận",
      content: `Bạn có muốn huỷ yêu cầu xác nhận trả hàng đơn hàng ${record.id}  không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        confirmUpdateStatus(record, isPut);
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

  const loadDataExchange = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/returns?${qs.stringify(
        getRandomOrderParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataExchange(results.data.data);
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "Mã đơn đổi",
      dataIndex: "id",
      sorter: true,
      width: "20%",
    },
    {
      title: "Mã hoá đơn",
      dataIndex: "orderId",
      sorter: true,
      width: "20%",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      sorter: true,
      width: "30%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      with: "40%",
      render: (status) => {
        if (status === "YEU_CAU") {
          return (
            <>
              <div
                className="bg-primary text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
              >
                Yêu cầu trả hàng
              </div>
            </>
          );
        } else if (status === "XAC_NHAN") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
              >
                Đã xác nhận
              </div>
            </>
          );
        } else {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
              >
                Đã huỷ
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
        if (record.status === "YEU_CAU") {
          return (
            <>
              <EyeOutlined
                style={{ fontSize: "20px" }}
                onClick={() => {
                  showModalData(id);
                }}
              />
              <CheckCircleOutlined
                className="ms-5"
                style={{ fontSize: "20px", color: "green" }}
                onClick={() => {
                  onConfirm(record);
                }}
              />
              <CloseCircleOutlined
                onClick={() => onCancel(record)}
                className="ms-5"
                style={{ fontSize: "20px", color: "red" }}
              />
            </>
          );
        } else {
          return (
            <EyeOutlined
                style={{ fontSize: "20px" }}
                onClick={() => {
                  showModalData(id);
                }}
              />
          );
        }
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
            <Option value="jack">Yêu cầu</Option>
            <Option value="lucy">Xác nhận</Option>
            <Option value="lucy">Không xác nhận</Option>
          </Select>
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
            // rowKey={(record) => record++}
            dataSource={dataExchange}
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
            title="Chi tiết đơn trả"
            open={isView}
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
                  <th>STT</th>
                  <th scope="col">Tên sản phẩm</th>
                  <th scope="col">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {dataOD?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>{item.productId}</td>
                      <td>{item.quantity}</td>
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

export default ReturnConfirm;
