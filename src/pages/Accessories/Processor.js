import {
  Table,
  DatePicker,
  Checkbox,
  Slider,
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

const getRandomParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchCpuCompany: params.pagination?.search1,
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

const Processor = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [data, setData] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const [processors, setProcessors] = useState();
  const [processor, setProcessor] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [searchName, setSearchName] = useState();
  const [isView, setView] = useState(false);
  const [formEdit] = Form.useForm();
  const [cpuTechnology, setCpuTechnology] = useState();
  const [cpuCompany, setCpuCompany] = useState("2");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const inputRef = useRef(null);

  const loadDataProcessor = () => {
    setSearchName("");
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setProcessors(results.data.data);
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
    loadDataProcessor();
    if (inputRef.current) {
      inputRef.current.focus();
    }
    console.log({ inputRef });
  }, [cpuCompany != undefined]);

  const loadDataCategory = () => { };

  const onDelete = (record) => {
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Xoá RAM ",
      content: `Bạn có muốn xoá ram ${record.cpuCompany} ${record.cpuTechnology} không?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        deleteProcessor(record);
      },
    });
  };

  const deleteProcessor = (record) => {
    console.log(record);
    fetch(`http://localhost:8080/api/staff/processors/${record.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          toastSuccess("Xoá thành công !");
          loadDataProcessor();
        }
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const columns = [
    {
      title: "Hãng CPU",
      dataIndex: "cpuCompany",
      width: "10%",
    },
    {
      title: "Công nghệ CPU",
      dataIndex: "cpuTechnology",
      width: "12%",
    },
    {
      title: "Loại CPU",
      dataIndex: "cpuType",
      width: "8%",
    },
    {
      title: "Tốc độ CPU",
      dataIndex: "cpuSpeed",
      width: "9%",
    },
    {
      title: "Tốc độ tối đa",
      dataIndex: "maxSpeed",
      width: "9%",
    },
    {
      title: "Số nhân",
      dataIndex: "multiplier",
      width: "7%",
    },
    {
      title: "Số luồng",
      dataIndex: "numberOfThread",
      width: "7%",
    },
    {
      title: "Bộ nhớ đệm",
      dataIndex: "caching",
      width: "8.5%",
    },
    {
      title: "Giá tiền(VNĐ)",
      dataIndex: "price",
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "12%",
      render: (status) => {
        if (status === "ACTIVE") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100%", padding: "5px", borderRadius: "5px" }}
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
                style={{ width: "100%", padding: "5px", borderRadius: "5px" }}
              >
                Không hoạt động
              </div>
            </>
          );
        } else if (status === "DRAFT") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100%", padding: "5px", borderRadius: "5px" }}
              >
                Nháp
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
      width: "10%",
      render: (id, data) => {
        if (data.status === "DRAFT") {
          return (
            <>
              <DeleteOutlined
                onClick={() => onDelete(data)}
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
                style={{}}
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/processors/${data.id}/inactive`,
                    { method: "PUT" }
                  ).then(() => loadDataProcessor());
                  toastSuccess("Khoá thành công !");
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
                style={{}}
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/processors/${data.id}/active`,
                    { method: "PUT" }
                  ).then(() => loadDataProcessor());
                  toastSuccess("Mở khóa thành công!");
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

  const clearSearchForm = () => {
    loadDataProcessor();
    // loadDataProcessor();
    // setSearchName("");
    // setSearchStatus();
  };

  const handleTableChange = (pagination) => {
    console.log(pagination);
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);
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

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = (data) => {
    setOpen(true);
  };

  const handleOk = () => {

  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const [dataEdit, setDataEdit] = useState({});
  const onEdit = (data) => {
    setDataEdit(data);
    setEditing(true);
    formEdit.setFieldsValue(data);
  };

  const handleSubmit = (data) => {
    if (isUpdate === false) {
      data.status = "ACTIVE";
      console.log(data);
      fetch("http://localhost:8080/api/staff/processors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => loadDataProcessor())
        .then((data) => {
          console.log("Success:", data);
          toastSuccess("Thêm mới thành công !");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleSubmitUpdate = (data) => {
    const edit = {
      id: dataEdit.id,
      cpuCompany: data.cpuCompany,
      cpuTechnology: data.cpuTechnology,
      cpuType: data.cpuType,
      cpuSpeed: data.cpuSpeed,
      maxSpeed: data.maxSpeed,
      multiplier: data.multiplier,
      numberOfThread: data.numberOfThread,
      caching: data.caching,
      price: data.price,
      status: dataEdit.status
    }
    if (isUpdate === false) {
      data.status = "ACTIVE";
      console.log(data.status);
      fetch('http://localhost:8080/api/staff/processors/' + edit.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edit),
      })
        .then((response) => loadDataProcessor())
        .then((data) => {
          console.log("Success:", data);
          toastSuccess("Cập nhật thành công!");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setEditing(false);
    }
  };

  const search = () => {
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results.data.data);
        setProcessors(results.data.data);
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

  const changeSearchStatus = (value) => {
    console.log(value);
    setSearchStatus(value);
  };

  const handleChange = () => { };

  return (
    <div>
      <ToastContainer></ToastContainer>
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
          <label>Hãng CPU</label>
          <Input
            name="searchName"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Nhập hãng CPU"
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
            type="primary-outline"
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
            id="modal"
            title="Tạo mới"
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Form
              initialValues={{
                // cpuCompany: name,
              }}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 10 }}
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
                name="cpuCompany"
                label="Hãng CPU"
                rules={[
                  {
                    required: true,
                    message: "Hãng CPU không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập hãng CPU" ref={cpuCompany} />
              </Form.Item>

              <Form.Item
                name="cpuTechnology"
                label="Công nghệ CPU"
                rules={[
                  {
                    required: true,
                    message: "Công nghệ CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập công nghệ CPU" />
              </Form.Item>

              <Form.Item
                name="cpuType"
                label="Loại CPU"
                rules={[
                  {
                    required: true,
                    message: "Loại CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Tốc độ CPU" />
              </Form.Item>
              <Form.Item
                name="cpuSpeed"
                label="Tốc độ CPU"
                rules={[
                  {
                    required: true,
                    message: "Tốc độ CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tốc độ CPU" />
              </Form.Item>
              <Form.Item
                name="maxSpeed"
                label="Tốc độ tối đa CPU"
                rules={[
                  {
                    required: true,
                    message: "Tốc độ tối đa không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Tốc độ tối đa CPU" />
              </Form.Item>
              <Form.Item
                name="multiplier"
                label="Số nhân"
                rules={[
                  {
                    required: true,
                    message: "Số nhân CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập số nhân CPU" />
              </Form.Item>
              <Form.Item
                name="numberOfThread"
                label="Số luồng CPU"
                rules={[
                  {
                    required: true,
                    message: "Số luồng CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập số luồng CPU" />
              </Form.Item>
              <Form.Item
                name="price"
                label="Giá tiền"
                rules={[
                  {
                    required: true,
                    message: "Giá tiền không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập giá tiền CPU" />
              </Form.Item>
              <Form.Item
                name="caching"
                label="Bộ nhớ đệm"
                rules={[
                  {
                    required: true,
                    message: "Bộ nhớ đẹm CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập bộ nhớ đệm CPU" />
              </Form.Item>
              <Form.Item className="text-center">
                <Button block type="primary" htmlType="submit" id="create">
                  Tạo mới
                </Button>
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
            dataSource={processors}
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
          >
            <Form
              form={formEdit}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 10 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmitUpdate(values, isUpdate);
                console.log({ values });
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="cpuCompany"
                label="Hãng CPU"
                initialValue={dataEdit.cpuCompany}
                rules={[
                  {
                    required: true,
                    message: "Hãng CPU không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="cpuTechnology"
                label="Công nghệ CPU"
                initialValue={dataEdit.cpuTechnology}
                rules={[
                  {
                    required: true,
                    message: "Công nghệ CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="cpuType"
                label="Loại CPU"
                initialValue={dataEdit.cpuType}
                rules={[
                  {
                    required: true,
                    message: "Loại CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="cpuSpeed"
                label="Tốc độ CPU"
                initialValue={dataEdit.cpuSpeed}
                rules={[
                  {
                    required: true,
                    message: "Tốc độ CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="maxSpeed"
                label="Tốc độ tối đa CPU"
                initialValue={dataEdit.maxSpeed}
                rules={[
                  {
                    required: true,
                    message: "Tốc độ tối đa không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="multiplier"
                label="Số nhân"
                initialValue={dataEdit.multiplier}
                rules={[
                  {
                    required: true,
                    message: "Số nhân CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="numberOfThread"
                label="Số luồng CPU"
                initialValue={dataEdit.numberOfThread}
                rules={[
                  {
                    required: true,
                    message: "Số luồng CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="caching"
                label="Bộ nhớ đệm"
                initialValue={dataEdit.caching}
                rules={[
                  {
                    required: true,
                    message: "Bộ nhớ đẹm CPU không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="price"
                label="Giá tiền"
                initialValue={dataEdit.price}
                rules={[
                  {
                    required: true,
                    message: "Giá tiền không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item className="text-center">
                <Button block type="primary" htmlType="submit" id="create">
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            // style={{borderRadius:"10px"}}
            title="Hiển thị"
            open={isView}
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

export default Processor;
