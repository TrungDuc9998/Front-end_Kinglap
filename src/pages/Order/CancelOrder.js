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
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import qs from "qs";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const url = "http://localhost:8080/api/orders";
const { Option } = Select;
const { RangePicker } = DatePicker;

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});

const CancelOrder = () => {
  const [data, setData] = useState([]);
  const [dataOD, setDataOD] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStatus: "DA_HUY",
    },
  });

  useEffect(() => {
    loadDataOrder();
    console.log(dataOrder);
  }, [dataOrder != undefined]);

  const onCancel = (record) => {
    Modal.confirm({
      title: `Bạn có muốn xoá đơn hàng ${record.id}  không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        deleteOrder(record);
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

  const deleteOrder = (record) => {
    fetch(`http://localhost:8080/api/orders/${record.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
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
      width: "15%",
    },
    {
      title: "Người đặt",
      dataIndex: "customerName",
      sorter: true,
      width: "20%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      sorter: true,
      width: "15%",
      render(total) {
        return (
          <>
            <CurrencyFormat
              style={{ fontSize: "14px" }}
              value={total}
              displayType={"text"}
              thousandSeparator={true}
            />
          </>
        );
      },
    },
    {
      title: "Hình thức đặt",
      dataIndex: "payment",
      sorter: true,
      width: "20%",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      sorter: true,
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      with: "45%",
      render: (status) => {
        return (
          <>
            <div
              className="bg-danger text-center text-light"
              style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
            >
              Đã huỷ hàng
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
            <EyeOutlined
              onClick={() => {
                showModalData(id);
              }}
              style={{ fontSize: "20px" }}
            />
            <DeleteOutlined
              onClick={() => onCancel(record)}
              style={{ color: "red", marginLeft: 12, fontSize: "20px" }}
            />
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
        <div className="col-6 mt-4">
          <label>Người đặt</label>
          <Input placeholder="Tên người đặt" />
        </div>
        <div className="col-6 mt-4">
          <label>Thời gian đặt: </label>
          <br />
          <Space
            className="mx-2"
            style={{ minWidth: "90%" }}
            direction="vertical"
            size={12}
          >
            <RangePicker size={"middle"} />
          </Space>
        </div>
        <div className="col-12 text-center mt-3 ">
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
                          style={{ fontSize: "14px" }}
                          value={item.product.price}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </td>
                      <td>{item.quantity}</td>
                      <td>
                        <CurrencyFormat
                          style={{ fontSize: "14px" }}
                          value={item.total}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </td>
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

export default CancelOrder;
