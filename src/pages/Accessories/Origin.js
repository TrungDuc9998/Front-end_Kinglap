import { Table, Select, Input, Button, Modal, Form } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
  LockOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
import toastrs from "toastr";
import { toast } from "react-toastify";
import Moment from "react-moment";
import "./Origin.css";
const { Option } = Select;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});

const Origin = () => {
  const [data, setData] = useState();
  const [formEdit] = Form.useForm();
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [id, setId] = useState();
  const [isDelete, setDelete] = useState(false);
  const [searchName, setSearchName] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });

  const toastSuccessOrigin = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: "Tên nước sản xuất",
      dataIndex: "name",
      width: "25%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY">{createdAt}</Moment>;
      },
      width: "20%",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render(updatedAt) {
        return <Moment format="DD-MM-YYYY">{updatedAt}</Moment>;
      },
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        if (status === "DRAFT") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "5px" }}
              >
                Nháp
              </div>
            </>
          );
        }
        if (status === "ACTIVE") {
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
        } else if (status === "INACTIVE") {
          return (
            <>
              <div
                className="bg-secondary text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "5px" }}
              >
                Không hoạt động
              </div>
            </>
          );
        }
      },
      width: "15%",
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      dataIndex: "data",
      width: "10%",
      render: (id, data) => {
        if (data.status === "DRAFT") {
          return (
            <>
              <DeleteOutlined
                onClick={() => onDelete(data.id)}
                style={{ color: "red" }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onEdit(data);
                }}
              />
            </>
          );
        }
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  // setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/origin/${data.id}/inactive`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization: 'Bearer ' + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => fetchData());
                  toastSuccessOrigin("Khoá thành công !");
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onEdit(data);
                }}
              />
            </>
          );
        } else if (data.status == "INACTIVE") {
          return (
            <>
              <LockOutlined
                onClick={() => {
                  fetch(
                    `http://localhost:8080/api/admin/origin/${data.id}/active`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization: 'Bearer ' + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => fetchData());
                  toastSuccessOrigin("Mở khóa thành công!");
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onEdit(data);
                }}
              />
            </>
          );
        }
      },
    },
  ];

  const fetchData = () => {
    fetch(
      `http://localhost:8080/api/staff/origin?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      },
    }
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
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
  }, [loading, data != undefined]);

  const onDelete = (id) => {
    setId(id);
    setDelete(true);
  };

  const [dataEdit, setDataEdit] = useState({});
  const onEdit = (data) => {
    setEditing(true);
    setDataEdit(data);
    formEdit.setFieldsValue(data);
  };

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    fetch(
      `http://localhost:8080/api/staff/origin?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      },
    }
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const search = () => {
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.current = 1;
    fetch(
      `http://localhost:8080/api/staff/origin?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      },
    }
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const onSearch = (value) => {
  };

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (data) => {
    if (isUpdate === false) {
      data.status = "ACTIVE";
      fetch("http://localhost:8080/api/admin/origin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((results) => {
          if (results.status === 200) {
            toastSuccessOrigin("Thêm mới xuất xứ thành công!");
            setOpen(false);
            fetchData();
          }
        });
    }
  };

  const handleSubmitUpdate = (data) => {
    const edit = {
      id: dataEdit.id,
      name: data.name,
      status: dataEdit.status,
    };
    if (isUpdate === false) {
      data.status = "ACTIVE";
      fetch(`http://localhost:8080/api/admin/origin/` + edit.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
        body: JSON.stringify(edit),
      })
        .then((response) => fetchData())
        .then((data) => {
          toastSuccessOrigin("Cập nhật thành công!");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setEditing(false);
    }
  };

  const clearSearchForm = () => {
    fetchData();
    setSearchName("");
    setSearchStatus();
  };

  const changeSearchStatus = (value) => {
    setSearchStatus(value);
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
          <label>Nhập tên quốc gia</label>
          <Input
            placeholder="Nhập tên nước muốn tìm"
            name="searchName"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-4 mt-4">
          <label>Trạng thái</label>
          <br />
          <Select
            allowClear={true}
            style={{ width: "400px", borderRadius: "5px" }}
            showSearch
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            onChange={changeSearchStatus}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="ACTIVE" selected>
              Hoạt động
            </Option>
            <Option value="INACTIVE">Không hoạt động</Option>
            <Option value="DRAFT">Nháp</Option>
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
            <PlusOutlined /> Thêm mới
          </Button>
          <Modal
            title="Tạo mới"
            open={open}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"Đóng"}
            width={700}
          >
            <Form
              initialValues={{}}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmit(values, isUpdate);
              }}
              onFinishFailed={(error) => {
              }}
            >
              <Form.Item
                name="name"
                label="Tên nước"
                rules={[
                  {
                    required: true,
                    message: "Tên quốc gia không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tên quốc giá" />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button
                      block
                      type="primary"
                      className="create"
                      htmlType="submit"
                    >
                      Tạo mới
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
            open={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"Đóng"}
            width={700}
          >
            <Form
              form={formEdit}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmitUpdate(values, isUpdate);
              }}
              onFinishFailed={(error) => {
              }}
            >
              <Form.Item
                name="name"
                label="Tên nước"
                initialValue={dataEdit.name}
                rules={[
                  {
                    required: true,
                    message: "Tên quốc gia không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button
                      block
                      type="primary"
                      className="create"
                      htmlType="submit"
                    >
                      Cập nhật
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="Xóa danh mục"
            open={isDelete}
            onCancel={() => {
              setDelete(false);
            }}
            onOk={() => {
              fetch(`http://localhost:8080/api/admin/origin/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: 'Bearer ' + localStorage.getItem("token"),
                },
              }).then(() => fetchData());
              setDelete(false);
              toastrs.options = {
                timeOut: 6000,
              };
              toastrs.clear();
              toast.success("Xóa danh mục thành công!", {
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
            Bạn có chắc chắn muốn xóa quốc gia này?
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Origin;
