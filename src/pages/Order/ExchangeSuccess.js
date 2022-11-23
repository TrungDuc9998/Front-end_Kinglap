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
const url = "http://localhost:8080/api/returns";

const getRandomOrderParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  check: params.pagination?.check,
  searchStatus: params.pagination?.searchStatus,
});

const ExchangeSuccess = () => {
  const [dataOD, setDataOD] = useState();
  const [order, setOrder] = useState();
  const [dataProduct, setDataProduct] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataExchange, setDataExchange] = useState();
  const [put, setPut] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      check: 1,
    },
  });

  useEffect(() => {
    loadDataExchange();
    // getProduct();
  }, []);

  const loadDataOrder = (data) => {
    setLoading(true);
    fetch(`http://localhost:8080/api/orders/get/${data}`)
      .then((res) => res.json())
      .then((res) => {
        setOrder(res.data);
      });
  };

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
        confirmUpdateStatus(record, isPut);
      },
    });
  };

  const confirmUpdateStatus = (record, isPut) => {
    console.log(record.orderDetail.id);
    fetch(`http://localhost:8080/api/${record.id}/updateReturnDetails`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: 1,
        orderDetailId: 1,
        quantity: 1,
        status: isPut === true ? "DA_XAC_NHAN" : "KHONG_XAC_NHAN",
      }),
    }).then((res) => {});
    fetch(
      `http://localhost:8080/api/orders/${record.orderDetail.id}/orderDetails`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: record.productId.id,
          total: record.orderDetail.total,
          quantity: record.quantity,
          status: record.orderDetail.status,
          isCheck: 1,
        }),
      }
    ).then((res) => {});
    loadDataExchange();
  };

  const onCancel = (record) => {
    const isPut = false;
    Modal.confirm({
      title: `Bạn có muốn huỷ xác nhận đơn hàng ${record.id}  không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        confirmUpdateStatus(record, isPut);
      },
    });
  };

  const showModalData = (id, orderId) => {
    // console.log("orderId: " + orderId);
    axios.get(url + "/" + id).then((res) => {
      console.log(res.data);
      setDataOD(res.data);
    });
    fetch(`http://localhost:8080/api/orders/get/${orderId}`)
      .then((res) => res.json())
      .then((res) => {
        setOrder(res.data);
      });
    setView(true);
  };

  const loadDataExchange = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/returns?${qs.stringify(
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
      with: "45%",
      render: (status) => {
        if (status === "CHUA_XU_LY") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "4px" }}
              >
                Chưa xử lý
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
              onClick={() => {
                showModalData(id, record.orderId);
              }}
            />
            <CheckCircleOutlined
              className="ms-3"
              style={{ fontSize: "20px" }}
              onClick={() => {
                onConfirm(record);
              }}
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

  const getOrderDetail = () => {};
  const getProduct = (id) => {
    let count = 0;
    let name;
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((res) => {
        // setDataProduct(res.data);
        console.log(res.name);
        return res.name;
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
            rowKey={(record) => record.id}
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
            style={{ width: "1000px" }}
            title="Chi tiết đơn đổi"
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
                  <th>Hình ảnh</th>
                  <th scope="col">Sản phẩm trước đó</th>
                  <th>Đổi sang sản phẩm</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dataOD?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <Image
                          width={90}
                          src={item.orderDetail.product.images[0].name}
                        />{" "}
                      </td>
                      <td>{item.orderDetail.product.name}</td>
                      <td>{item.productId.name}</td>
                      <td>
                        {item.status === "YEU_CAU" ? (
                          <>
                            <CheckCircleOutlined
                              style={{
                                marginLeft: 12,
                                fontSize: "20px",
                                color: "green",
                              }}
                              onClick={() => {
                                onConfirm(item);
                              }}
                            />
                            <CloseCircleOutlined
                              onClick={() => onCancel(item)}
                              style={{
                                color: "red",
                                marginLeft: 12,
                                fontSize: "20px",
                              }}
                            />
                          </>
                        ) : (
                          ""
                        )}
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

export default ExchangeSuccess;
