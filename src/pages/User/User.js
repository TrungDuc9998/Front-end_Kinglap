import { Table, Slider, Select, Input, Button, Modal, InputNumber, Alert } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
const { Option } = Select;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
});

const onChange = (value) => {
  //change value input number
  console.log("changed", value);
};

const User = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [id, setId] = useState();
  const [isView, setView] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const columns = [
    {
      title: "Tài khoản",
      dataIndex: "username",
      width: "55%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      with: "25%",
      render: (status) => {
        if (status == 1) {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100px", borderRadius: "5px" }}
              >
                Không khóa
              </div>
            </>
          );
        }
        if (status == 0) {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100px", borderRadius: "5px" }}
              >
                Đã khóa
              </div>
            </>
          );
        }
      },
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      width: "20%",
      render: (id) => {
        return (
          <>
            <LockOutlined
              onClick={() => {
                onView(id);
              }}
            />
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onEdit(id);
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

  const fetchData = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
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
    fetchData();
  }, [JSON.stringify(tableParams)]);

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
  const [username, setUsername] = useState();
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();
  const [password3, setPassword3] = useState();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const search = () => {
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParams)
      )}&searchUsername=${username}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        setLoading(false);
        // setTableParams({
        //   pagination: {
        //     current: results.data.current_page,
        //     pageSize: 10,
        //     total: results.data.total,
        //   },
        // });
      });
  }

  const clearSearchForm = () => {
    setUsername("");
  }

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    if (password2 === password1) {
      fetch(
        `http://localhost:8080/api/users`, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, password: password1, status: 1 }) }).then(() => fetchData());
      setUsername("");
      setPassword1("");
      setPassword2("");
      setOpen(false);
    }
  };

  const changeUsername = (event) => {
    setUsername(event.target.value);
  };

  const changePassword1 = (event) => {
    setPassword1(event.target.value);
  };

  const changePassword2 = (event) => {
    setPassword2(event.target.value);
  };

  const changePassword3 = (event) => {
    setPassword3(event.target.value);
  };

  const onEdit = (id) => {
    setId(id);
    setEditing(true);
  };

  const onDelete = (id) => {
    setId(id);

    setDelete(true);
  };

  const onView = (id) => {
    setView(true);
  };

  const handleCancel = () => {
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
        <div className="col-4 mt-3">
          <label>Từ khoá</label>
          <Input type="text" name="username" value={username} placeholder="Nhập tên tài khoản người dùng" onChange={changeUsername} />
        </div>
        <div className="col-4 mt-3">
          <label>Trạng thái</label>
          <br />
          <Select
            style={{ width: "400px", borderRadius: "5px" }}
            showSearch
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="0">Đang hoạt động</Option>
            <Option value="1">Không hoạt động</Option>
          </Select>
        </div>
        <div className="col-12 text-center ">
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
            onClick={showModal}
            style={{ borderRadius: "10px" }}
          >
            <a href="/product/create"></a>
            <PlusOutlined />
            Thêm mới
          </Button>
          <Modal
            title="Tạo mới"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <form>
              <label>
                Tài khoản
                <span className="text-danger"> *</span>
              </label>
              <Input type="text" name="username" value={username} placeholder="Nhập tài khoản" onChange={changeUsername} />
              <label>
                Mật khẩu
                <span className="text-danger"> *</span>
              </label>
              <Input type="password" name="password1" value={password1} placeholder="Nhập mật khẩu" onChange={changePassword1} />
              <label>
                Xác nhận mật khẩu
                <span className="text-danger"> *</span>
              </label>
              <Input type="password" name="password2" value={password2} placeholder="Nhập lại mật khẩu" onChange={changePassword2} />
            </form>
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
            rowKey={(record) => record++}
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
              if (password2 === password1) {
                fetch(
                  `http://localhost:8080/api/users/${id}`, { method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, password: password1 }) }).then(() => fetchData());
                setUsername("");
                setPassword1("");
                setPassword2("");
                setEditing(false);
              }
            }}
          >
            <label>
              Tài khoản
              <span className="text-danger"> *</span>
            </label>
            <Input type="text" name="username" value={username} placeholder="Nhập tài khoản" onChange={changeUsername} />
            <label>
              Mật khẩu cũ
              <span className="text-danger"> *</span>
            </label>
            <Input type="password" name="password3" value={password3} placeholder="Nhập mật khẩu cũ" onChange={changePassword3} />
            <label>
              Mật khẩu mới
              <span className="text-danger"> *</span>
            </label>
            <Input type="password" name="password1" value={password1} placeholder="Nhập mật khẩu mới" onChange={changePassword1} />
            <label>
              Xác nhận mật khẩu
              <span className="text-danger"> *</span>
            </label>
            <Input type="password" name="password2" value={password2} placeholder="Nhập lại mật khẩu" onChange={changePassword2} />
          </Modal>
          <Modal
            title="Xóa người dùng"
            visible={isDelete}
            onCancel={() => {
              setDelete(false);
            }}
            onOk={() => {
              fetch(
                `http://localhost:8080/api/users/${id}`, { method: 'DELETE' }).then(() => fetchData());
              setDelete(false);
            }}
          >
            Bạn muốn xóa người dùng này chứ?
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default User;