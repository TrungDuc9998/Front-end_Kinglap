import {
  Table,
  Select,
  Input,
  Button,
  Modal,
  Form,
} from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState, useRef } from "react";
import "./Processor.css";
import { ToastContainer, toast } from "react-toastify";
const { Option } = Select;

const onDelete = (record) => {
  const isPut = true;
  Modal.confirm({
    icon: <CheckCircleOutlined />,
    title: "Xoá RAM ",
    content: `Bạn có muốn xoá ram ${record.ramCapacity} ${record.ramSpeed} không?`,
    okText: "Có",
    cancelText: "Không",
    okType: "primary",
    onOk: () => {
      fetch(`http://localhost:8080/api/staff/rams/${record.id}`, {
        method: "DELETE", headers: {
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
      });
      // loadDataRam();
    },
  });
};

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchRamCapacity: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});

const toastSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const Ram = () => {
  const [form] = Form.useForm();
  const [isUpdate, setIsUpdate] = useState(false);
  const [category, setCategory] = useState([]);
  const [data, setData] = useState();
  const [rams, setRams] = useState();
  const [processor, setProcessor] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [searchName, setSearchName] = useState();
  const [cpuTechnology, setCpuTechnology] = useState();
  const [cpuCompany, setCpuCompany] = useState("2");
  const [searchStatus, setSearchStatus] = useState();
  const [formEdit] = Form.useForm();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const inputRef = useRef(null);

  const onReset = () => {
    form.resetFields();
  };
  const columns = [
    {
      title: "Loại Ram",
      dataIndex: "typeOfRam",
      width: "7%",
    },
    {
      title: "Dung lượng Ram",
      dataIndex: "ramCapacity",
      width: "14%",
    },
    {
      title: "Tốc độ ram",
      dataIndex: "ramSpeed",
      width: "8%",
    },
    {
      title: "Hỗ trợ RAM tối đa",
      dataIndex: "maxRamSupport",
      width: "11.5%",
    },
    {
      title: "Số Ram onboard",
      dataIndex: "onboardRam",
      width: "10.7%",
    },
    {
      title: "Số khe cắm rời",
      dataIndex: "looseSlot",
      width: "10%",
    },
    {
      title: "Số khe RAM còn lại",
      dataIndex: "remainingSlot",
      width: "12.5%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "12%",
      render: (status) => {
        if (status === "DRAFT") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
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
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
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
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
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
      dataIndex: "id",
      dataIndex: "data",
      width: "11%",
      render: (id, data) => {
        if (data.status === "DRAFT") {
          return (
            <>
              <DeleteOutlined
                onClick={() => onDelete(data)}
                style={{ color: "red", marginLeft: 12 }}
              />
            </>
          );
        }
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/rams/${data.id}/inactive`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization: 'Bearer ' + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataRam());
                  toastSuccess("Khoá thành công !");
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalE(data);
                }} />
            </>
          );
        } else if (data.status == "INACTIVE") {
          return (
            <>
              <LockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/rams/${data.id}/active`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization: 'Bearer ' + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataRam());
                  toastSuccess("Mở khóa thành công!");
                }}

              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalE(data);
                }} />
            </>
          );
        }
        return (
          <>
            <EyeOutlined
              onClick={() => {
                onView(data);
              }}
            />
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                showModalE(data);
              }} />
            <DeleteOutlined
              onClick={() => onDelete(data)}
              style={{ color: "red", fontSize: "20px", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const loadDataRam = () => {
    setSearchName("");
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/rams?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setRams(results.data.data);
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
    loadDataRam();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [cpuCompany != undefined]);

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/rams?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setRams(results.data.data);
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

  const search = () => {
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/rams?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setRams(results.data.data);
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

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [open, setOpen] = useState(false);
  const [openE, setOpenE] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = (data) => {
    setOpen(true);
  };

  const [dataEdit, setDataEdit] = useState({});
  const showModalE = (data) => {
    setDataEdit(data);
    setOpenE(true);
    formEdit.setFieldsValue(data);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const onView = (record) => {
    setView(true);
  };

  const handleCancel = () => {
    setOpenE(false);
    setOpen(false);
  };

  const handleSubmit = (data) => {
    if (isUpdate === false) {
      data.status = "ACTIVE";
      fetch("http://localhost:8080/api/staff/rams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      })
        .then((response) => loadDataRam())
        .then((data) => {
          toastSuccess("Thêm mới thành công !");
          onReset();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setOpen(false);
    }
  };
  const handleSubmitE = (data) => {
    const edit = {
      id: dataEdit.id,
      categoryId: data.categoryId,
      looseSlot: data.looseSlot,
      maxRamSupport: data.maxRamSupport,
      onboardRam: data.onboardRam,
      ramCapacity: data.ramCapacity,
      ramSpeed: data.ramSpeed,
      remainingSlot: data.remainingSlot,
      status: dataEdit.status,
      typeOfRam: data.typeOfRam,
    }
    fetch(`http://localhost:8080/api/staff/rams/` + edit.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      },
      body: JSON.stringify(edit),
    })
      .then((response) => loadDataRam())
      .then((data) => {
        toastSuccess("Cập nhật thành công!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setOpenE(false);
  };

  const clearSearchForm = () => {
    loadDataRam();
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
          <label>Nhập dung lượng ram</label>
          <Input
            placeholder="Nhập dung lượng ram"
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
            defaultValue={"ACTIVE"}
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
            onOk={handleOk}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"Đóng"}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={650}
          >
            <Form
              initialValues={{
                cpuCompany
              }}
              form={form}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 14 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmit(values, isUpdate);
                console.log({ values });
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="ramCapacity"
                label="Dung lượng RAM"
                rules={[
                  {
                    required: true,
                    message: "Dung lượng ram không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập dung lượng RAM" ref={cpuCompany} />
              </Form.Item>
              <Form.Item
                name="typeOfRam"
                label="Loại RAM"
                rules={[
                  {
                    required: true,
                    message: "Loại ram không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập loại ram" />
              </Form.Item>
              <Form.Item
                name="ramSpeed"
                label="Tốc độ RAM"
                rules={[
                  {
                    required: true,
                    message: "Tốc độ RAM không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tốc độ RAM" />
              </Form.Item>

              <Form.Item
                name="looseSlot"
                label="Số khe cắm rời"
                rules={[
                  {
                    required: true,
                    message: "Số khe cẳm rời không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Số khe cắm rời" />
              </Form.Item>
              <Form.Item
                name="remainingSlot"
                label="Số khe còn lại"
                rules={[
                  {
                    required: true,
                    message: "Số khe còn lại không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập số khe còn lại" />
              </Form.Item>
              <Form.Item
                name="onboardRam"
                label="Số RAM onboard"
                rules={[
                  {
                    required: true,
                    message: "Số RAM onboard được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Số RAM onboard" />
              </Form.Item>
              <Form.Item
                name="maxRamSupport"
                label="Hỗ trợ RAM tối đa "
                rules={[
                  {
                    required: true,
                    message: "Hỗ trợ RAM tối đa không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập hỗ trợ RAM tối đa" />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button block type="primary" id="create" htmlType="submit">
                      Tạo mới
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          {/* modal edit */}
          <Modal
            title="Cập nhật"
            open={openE}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            cancelText={"Đóng"}
            width={650}
          >
            <Form
              form={formEdit}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmitE(values, isUpdate);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="ramCapacity"
                label="Dung lượng RAM"
                initialValue={dataEdit.ramCapacity}
                rules={[
                  {
                    required: true,
                    message: "Dung lượng ram không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input ref={cpuCompany} />
              </Form.Item>
              <Form.Item
                name="typeOfRam"
                label="Loại RAM"
                initialValue={dataEdit.typeOfRam}
                rules={[
                  {
                    required: true,
                    message: "Loại ram không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="ramSpeed"
                label="Tốc độ RAM"
                initialValue={dataEdit.ramSpeed}
                rules={[
                  {
                    required: true,
                    message: "Tốc độ RAM không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="looseSlot"
                label="Số khe cắm rời"
                initialValue={dataEdit.looseSlot}
                rules={[
                  {
                    required: true,
                    message: "Số khe cẳm rời không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="remainingSlot"
                initialValue={dataEdit.remainingSlot}
                label="Số khe còn lại"
                rules={[
                  {
                    required: true,
                    message: "Số khe còn lại không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="onboardRam"
                label="Số RAM onboard"
                initialValue={dataEdit.onboardRam}
                rules={[
                  {
                    required: true,
                    message: "Số RAM onboard được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="maxRamSupport"
                initialValue={dataEdit.maxRamSupport}
                label="Hỗ trợ RAM tối đa "
                rules={[
                  {
                    required: true,
                    message: "Hỗ trợ RAM tối đa không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button block type="primary" id="create" htmlType="submit">
                      Cập nhật
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
            dataSource={rams}
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
            onOk={() => {
              setEditing(false);
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

export default Ram;
