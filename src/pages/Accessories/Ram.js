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

const onDelete = (record) => {
  console.log(record);
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
        method: "DELETE",
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
  const [isUpdate, setIsUpdate] = useState(false);
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
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const inputRef = useRef(null);

  const loadDataCategory = () => {};

  const columns = [
    {
      title: "Dung lượng ram",
      dataIndex: "ramCapacity",
      sorter: true,

      width: "20%",
    },
    {
      title: "Loại ram",
      dataIndex: "typeOfRam",
      sorter: true,

      width: "20%",
    },
    {
      title: "Tốc độ ram",
      dataIndex: "ramSpeed",
      sorter: true,

      width: "15%",
    },
    {
      title: "Hỗ trợ RAM tối đa",
      dataIndex: "maxRamSupport",
      sorter: true,
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      with: "30%",
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
                style={{ color: "red", marginLeft: 12 }}
              />
            </>
          );
        }
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                style={{ fontSize: "20px" }}
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/rams/${data.id}/inactive`,
                    { method: "PUT" }
                  ).then(() => loadDataRam());
                  toastSuccess("Khoá thành công !");
                }}
              />
            </>
          );
        } else if (data.status == "INACTIVE") {
          return (
            <>
              <LockOutlined
                style={{ fontSize: "20px" }}
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/rams/${data.id}/active`,
                    { method: "PUT" }
                  ).then(() => loadDataRam());
                  toastSuccess("Mở khóa thành công!");
                }}
              />
            </>
          );
        }
        // return (
        //   <>
        //     <EyeOutlined
        //       onClick={() => {
        //         onView(record);
        //       }}
        //       style={{ fontSize: "20px" }}
        //     />
        //     <EditOutlined
        //       style={{ marginLeft: 12, fontSize: "20px" }}
        //       onClick={() => {
        //         showModal(record);
        //       }}
        //     />
        //     <DeleteOutlined
        //       onClick={() => onDelete(record)}
        //       style={{ color: "red", fontSize: "20px", marginLeft: 12 }}
        //     />
        //   </>
        // );
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
        console.log(results);
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
    console.log({ inputRef });
  }, [cpuCompany != undefined]);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

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
    console.log(searchStatus);
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
        console.log(results.data.data);
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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = (data) => {
    console.log(cpuCompany);
    console.log("data show modal");
    console.log(data);
    // if (typeof data === "number") {
    //   setProcessor("");
    //   fetch(`http://localhost:8080/api/auth/processors/${data}`)
    //     .then((res) => res.json())
    //     .then((results) => {
    //       console.log(results.data);
    //       setProcessor(results.data);
    //       console.log(processor);
    //       setCpuCompany(results.data?.cpuCompany);
    //       loadDataProcessor();
    //       setLoading(false);
    //     });
    // }
    setOpen(true);
  };

  const handleOk = () => {
    console.log("vào handle OK");
    setModalText("The modal will be closed after two seconds");
    // setConfirmLoading(true);
    // setTimeout(() => {
    //   setOpen(false);
    //   setConfirmLoading(false);
    // }, 2000);
  };

  const onEdit = (record) => {
    setEditing(true);
  };

  const onView = (record) => {
    setView(true);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const handleSubmit = (data) => {
    if (isUpdate === false) {
      data.status = "ACTIVE";
      console.log(data);
      fetch("http://localhost:8080/api/staff/rams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          toastSuccess("Thêm mới thành công !");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const clearSearchForm = () => {
    loadDataRam();
    setSearchName("");
    setSearchStatus();
  };

  const changeSearchStatus = (value) => {
    console.log(value);
    setSearchStatus(value);
  };
  const handleChange = () => {};

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
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Form
              initialValues={{
                cpuCompany: name,
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
              <label>{cpuCompany}</label>
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
                name="categoryId"
                label="Thể loại"
                requiredMark="optional"
              >
                <Select placeholder="Select your gender">
                  <Select.Option value="1">Laptop</Select.Option>
                  <Select.Option value="2">Ram</Select.Option>
                </Select>
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
                      Lưu nháp
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

export default Ram;
