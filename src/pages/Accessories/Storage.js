import { Table, Slider, Select, Input, Button, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Option } = Select;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.limit,
  page: params.pagination?.page,
});

const toastSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const toastError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const Storage = () => {
  const [detail, setDetail] = useState([]);
  const [data, setData] = useState();
  const [dataDetail, setDataDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      page: 1,
      limit: 10,
    },
  });

  const columns = [
    {
      title: "Bộ lưu trữ chi tiết",
      dataIndex: "storageDetail",
      sorter: true,
      render: (storageDetail) => `${storageDetail.storageType.name} (${storageDetail.type}, ${storageDetail.capacity})`,
      width: "25%",
    },
    {
      title: "Tổng số khe cắm SSD/HDD",
      dataIndex: "total",
      sorter: true,
      width: "25%",
    },
    {
      title: "Số khe SSD/HDD còn lại",
      dataIndex: "number",
      sorter: true,
      width: "25%",
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      width: "25%",
      render: (id, data) => {
        return (
          <>
            <ToastContainer></ToastContainer>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onEdit(id, data);
              }}
            />
            <DeleteOutlined
              onClick={() => onDelete(id)}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const columnsDetail = [
    {
      title: "Kiểu ổ cứng",
      dataIndex: "storageType",
      sorter: true,
      render: (storageType) => `${storageType.name}`,
      width: "25%",
    },
    {
      title: "Loại",
      dataIndex: "type",
      sorter: true,
      width: "25%",
    },
    {
      title: "Dung lượng",
      dataIndex: "capacity",
      sorter: true,
      width: "25%",
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      width: "25%",
      render: (id, data) => {
        return (
          <>
            <ToastContainer></ToastContainer>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onEdit(id, data);
              }}
            />
            <DeleteOutlined
              onClick={() => onDelete(id)}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onDelete = (id) => {
    Modal.confirm({
      title: "Xóa bộ lưu trữ",
      content: "Bạn có muốn xoá bản ghi này không?",
      onOk() {
        fetch(`http://localhost:8080/api/storages/` + id, {
          method: "DELETE",
        }).then((res) => res.json())
          .then((results) => {
            fetchData();
            toastSuccess("Xóa bản ghi thành công!");
          });
      }
    });
  };

  const loadDataDetail = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/storage_details?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results.data.data);
        setDetail(results.data.data);
        setLoading(false);
      });
  };

  const fetchData = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/storages?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: results.data.total,
          },
        });
      });
  };

  useEffect(() => {
    fetchData();
    loadDataDetail();
  }, [JSON.stringify(tableParams)]);

  const [form, setValues] = useState({
    id: "",
    storageDetail: "",
    storageDetailId: "",
    total: "",
    number: "",
  });

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

  const handleEdit = () => {
    fetch(`http://localhost:8080/api/storages/` + form.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then((res) => res.json())
      .then((results) => {
        if (results.data == null) {
          toastError(results.message);
        } else {
          fetchData();
          toastSuccess("Cập nhật thành công!");
          setOpen(false);
        }
      });
  }

  const handleSelect = (e) => {
    setValues({
      ...form,
      storageDetailId: e
    });
  }

  const handle = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleOk = () => {
    fetch(`http://localhost:8080/api/storages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then((res) => res.json())
      .then((results) => {
        if (results.data == null) {
          toastError(results.message);
        } else {
          toastSuccess("Thêm mới thành công!");
          setOpen(false);
        }
      });
  };

  const onEdit = (id, data) => {
    setValues(data);
    setEditing(true);
  };

  const onView = (record) => {
    setView(true);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  return (
    <div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "150px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
      </div>
      <div className="row">
        <div className="col-12 mt-4">
          <Button
            className="offset-11"
            type="primary"
            onClick={showModal}
            style={{ borderRadius: "10px" }}
          >
            <PlusOutlined /> Thêm mới
          </Button>
          <Modal
            title="Tạo mới"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <div className="form group">
              <label>Kiểu ổ cứng</label>
              <Select
                showSearch
                style={{
                  width: 300,
                }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                name="storageDetailId"
                onChange={(e) => handleSelect(e)}
                options={detail.map((detail) => ({
                  label: detail.storageType.name + " (" + detail.type + ", " + detail.capacity + ")",
                  value: detail.id,
                }))}
              />
            </div>
            <br></br>
            <div className="form group">
              <label>Tổng số khe cắm SSD/HDD</label>
              <Input name="total" type="total" placeholder="Tổng số khe cắm SSD/HDD" onChange={(e) => handle(e)} />
            </div>
            <br></br>
            <div className="form group">
              <label>Số khe SSD/HDD còn lại</label>
              <Input name="number" type="number" placeholder="Số khe SSD/HDD còn lại" onChange={(e) => handle(e)} />
            </div>
          </Modal>
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
            dataSource={data}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Cập nhật"
            visible={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            onOk={() => {
              setEditing(false);
              handleEdit();
            }}
          >
            <div className="form group">
              <label>Kiểu ổ cứng</label>
              <Select
                value={form.storageDetail.id}
                showSearch
                style={{
                  width: 300,
                }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                name="storageDetailId"
                onChange={(e) => handleSelect(e)}
                options={detail.map((detail) => ({
                  label: detail.storageType.name + " (" + detail.type + ", " + detail.capacity + ")",
                  value: detail.id,
                }))}
              />
            </div>
            <br></br>
            <div className="form group">
              <label>Tổng số khe cắm SSD/HDD</label>
              <Input name="total" type="number" placeholder="Tổng số khe cắm SSD/HDD" onChange={(e) => handle(e)} value={form.total} />
            </div>
            <br></br>
            <div className="form group">
              <label>Số khe SSD/HDD còn lại</label>
              <Input name="number" type="number" placeholder="Số khe SSD/HDD còn lại" onChange={(e) => handle(e)} value={form.number} />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Storage;