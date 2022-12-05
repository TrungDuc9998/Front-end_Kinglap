import { Table, Slider, Select, Input, Button, Modal, Form } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  LockOutlined,
  UnlockOutlined
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import Moment from 'react-moment';
import toastrs from "toastr";
import { ToastContainer, toast } from 'react-toastify';
const { Option } = Select;

const url = 'http://localhost:8080/api/auth/colors';

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const Color = () => {
  const [data, setData] = useState(
  );
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [name, setName] = useState();
  const [isDelete, setDelete] = useState(false);
  const [id, setId] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const columns = [
    {
      title: "Tên màu",
      dataIndex: "name",
      sorter: true,
      width: "20%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: true,
      render(createdAt) {
        return (
          <Moment format="DD-MM-YYYY HH:mm:ss">
            {createdAt}
          </Moment>
        );
      },
      width: "30%",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
      render(updatedAt) {
        return (
          <Moment format="DD-MM-YYYY HH:mm:ss">
            {updatedAt}
          </Moment>
        );
      },
      width: "30%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      sorter: true,
      with: "30%",
      render: (status) => {
        if (status == 1) {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "5px" }}
              >
                Hoạt động
              </div>
            </>
          );
        }
        else {
          return (
            <>
              <div
                className="bg-secondary text-center text-light"
                style={{ width: "140px", borderRadius: "5px", padding: "5px" }}
              >
                Không hoạt động
              </div>
            </>
          );
        }
      },
    },
    {
      title: "Thao tác",
      dataIndex: "Thao tác",
      width: "30%",
      render: (id, data) => {
        if (data.status == 1) {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/color/${data.id}/inactive/`, { method: "PUT" }).then(() => fetchData());
                  toastrs.options = {
                    timeOut: 6000,
                  }
                  toast.success('Khóa thành công!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onEdit(data.id, data.name);
                }}
              />
              <DeleteOutlined
                onClick={() => onDelete(data.id)}
                style={{ color: "red", marginLeft: 12 }}
              />
            </>
          );
        } else if (data.status == 0) {
          return (
            <>
              <LockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/color/${data.id}/active/`, { method: "PUT" }).then(() => fetchData());
                  toastrs.options = {
                    timeOut: 6000
                  }
                  toast.success('Mở khóa thành công!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onEdit(data.id, data.name);
                }}
              />
              <DeleteOutlined
                onClick={() => onDelete(data.id)}
                style={{ color: "red", marginLeft: 12 }}
              />
            </>
          );
        }
      },
    },
  ];

  const fetchData = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/colors?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        // console.log(results);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: 200,
          },
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const onDelete = (id) => {
    setId(id);
    setDelete(true);
  };

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

  const changeName = (event) => {
    setName(event.target.value);
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

  const handleOk = (values) => {
    fetch(
      `http://localhost:8080/api/staff/color`, {
      method: "POST", headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: values.name, status: 1 })
    }).then((res) => res.json())
      .then((results) => {
        toastrs.options = {
          timeOut: 6000
        }
        toastrs.clear();
        toast.success('Thêm mới thành công!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchData();
        setName("");
        setEditing(false);
        setOpen(false);
      });
  };

  const onEdit = (id, name) => {
    setId(id);
    console.log(id);
    setEditing(true);
    setName(name);
    console.log(name);
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
        <div className="col-4 mt-4">
          <label>Tên thể loại</label>
          <Input placeholder="Nhập tên thể loại" />
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
        <div className="col-12 text-center ">
          <Button
            className="mt-2"
            type="primary-uotline"
            // onClick={showModal}
            style={{ borderRadius: "10px" }}
          >
            <ReloadOutlined />Đặt lại
          </Button>
          <Button
            className="mx-2  mt-2"
            type="primary"
            // onClick={showModal}
            style={{ borderRadius: "10px" }}
          >
            <SearchOutlined />Tìm kiếm
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4">
          <Button
            className="offset-11 "
            type="primary"
            onClick={showModal}
            style={{ borderRadius: "10px" }}
          >
            <PlusOutlined /> Thêm mới
            <ToastContainer />
          </Button>
          <Modal
            title="Tạo mới"
            open={open}
            // onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Form
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 10 }}
              onFinish={(values) => {
                handleCancel();
                handleOk(values);
                console.log({ values });
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="name"
                label="Tên màu"
                rules={[
                  {
                    required: true,
                    message: "Tên màu không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Tên loại màu" />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button block type="primary" id="create" htmlType="submit">
                      Tạo mới
                    </Button>
                  </div>
                  <div className="col-6">
                    <Button block type="danger" id="create" htmlType="submit">
                      Hủy
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
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
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={tableParams.pagination}
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
              fetch(
                `http://localhost:8080/api/staff/color/${id}`,
                { method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name }) }).then((res) => res.json())
                .then(() => fetchData());
              setEditing(false);
              toastrs.options = {
                timeOut: 6000
              }
              toastrs.clear();
              toast.success('Cập nhật danh mục màu thành công!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setName("");
            }}
          >
            <label>
              Tên thể loại
              <span className="text-danger"> *</span>
            </label>
            <Input placeholder="Tên thể loại" name="name" value={name} onChange={changeName} />
          </Modal>

          <Modal
            title="Xóa danh mục"
            visible={isDelete}
            onCancel={() => {
              setDelete(false);
            }}
            onOk={() => {
              console.log(id);
              fetch(
                `http://localhost:8080/api/staff/color/${id}`, { method: 'DELETE' }).then(() => fetchData());
              setDelete(false);
              toastrs.options = {
                timeOut: 6000
              }
              toastrs.clear();
              toast.success('Xóa danh mục thành công!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            Bạn có chắc chắn muốn xóa màu này?
          </Modal>

          <Modal
            // style={{borderRadius:"10px"}}
            title="Hiển thị"
            visible={isView}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
            }}
          >
            <label>
              Tên thể loại
              <span className="text-danger"> *</span>
            </label>
            <Input placeholder="Tên thể loại" />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Color;