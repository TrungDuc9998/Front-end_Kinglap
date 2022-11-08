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
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const CancelOrder = () => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [dataOrder, setDataOrder] = useState();
  const [put, setPut] = useState();
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
      title: `Bạn có muốn xoá đơn hàng ${record.id}  không?`,
      okText: "Yes",
      okType: "primary",
      onOk: () => {
        deleteOrder(record);
      },
    });
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
      width: "20%",
    },
    {
      title: "Người đặt",
      dataIndex: "userId",
      sorter: true,
      width: "20%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      sorter: true,
      width: "15%",
    },
    {
      title: "Hình thức đặt",
      dataIndex: "payment",
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
      render: (record) => {
        return (
          <>
            <DeleteOutlined
              onClick={() => onCancel(record)}
              style={{ color: "red", marginLeft: 12 }}
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
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  // const confirmOrder = (record, IsPut) => {
  //   fetch(`http://localhost:8080/api/orders/${record.id}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       id: record.id,
  //       userId: record.userId | undefined,
  //       total: record.total,
  //       payment: record.payment,
  //       address: record.address,
  //       status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
  //       note: record.note | undefined,
  //       customerName: record.customerName | undefined,
  //       phone: record.phone | undefined,
  //       orderDetails: [
  //         {
  //           id: record.orderDetails.id,
  //           productId: record.orderDetails.productId,
  //           total: record.orderDetails.total,
  //           quantity: record.orderDetails.quantity,
  //           status: IsPut === true ? "CHO_LAY_HANG" : "DA_HUY",
  //         },
  //       ],
  //     }),
  //   }).then((res) => {
  //     loadDataOrder();
  //   });
  // };

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
            dataSource={dataOrder}
            pagination={tableParams.pagination}
            loading={loading}
          />
          <Modal
            title="Xác nhận đơn hàng"
            visible={isEditing}
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
            style={{ borderRadius: "30px" }}
            title="Hiển thị"
            visible={isView}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
            }}
          >
            Laptop G3 15 3500 : 3
            <br />
            Laptop G3 15 3500 : 2
            <br />
            Laptop G3 15 3500 : 1
            <br />
            Laptop G3 15 3500 : 0
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CancelOrder;
