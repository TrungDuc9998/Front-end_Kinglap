import { Table, Slider, Select, Input, Button, Modal, Form } from "antd";
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
  //searchStorageType: params.pagination?.searchStorageType
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
  const [formE] = Form.useForm();
  const [detail, setDetail] = useState([]);
  const [data, setData] = useState();
  const [dataDetail, setDataDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  //const [searchStorageType, setSearchStorageType]=useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      page: 1,
      limit: 10,
      //searchStorageType:""
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
  const [storageDetail, setStorageDetail]=useState()
  const [form, setValues] = useState({
    id: "",
    storageDetailId: "",
    total: "",
    number: "",
  });
  const [formDefault, setFormDefault] = useState({
    id: "",
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

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = () => {
    setOpen(true);
  };

  const handleEdit = (value) => {
    const formEdit={
      id:form.id,
      storageDetailId: storageDetail,
      total: value.total,
      number: value.number,
    }
    fetch(`http://localhost:8080/api/storages/` + formEdit.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formEdit),
    }).then((res) => res.json())
      .then((results) => {
        if (results.data == null) {
          toastError(results.message);
        } else {
          fetchData();
          toastSuccess("Cập nhật thành công!");
          handleCancel();
        }
      });
  }

  const handleSelect = (e) => {
    console.log("select",e)
    setValues({
      ...form,
      storageDetailId: e
    });
    setStorageDetail(e)
  }

  const handle = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleOk = (value) => {
    const form={
      storageDetailId: value.storageDetailId,
      total: value.total,
      number: value.number,
    }
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
          fetchData();
          formE.setFieldsValue(formDefault);
        }
      });
  };

  const onEdit = (id, data) => {
    setValues(data);
    formE.setFieldsValue(data);
    setStorageDetail(data.storageDetail.id);
    setEditing(true);
  };

  const onView = (record) => {
    setView(true);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
    setEditing(false);
    formE.setFieldsValue(formDefault);
  };
  // const search=()=>{
  //   setTableParams(
  //     tableParams.pagination.current= 1,
  //     tableParams.pagination.pageSize= 10,
  //     //tableParams.pagination.searchStorageType=searchStorageType,
  //   );
  //   fetchData();
  // }
  // const clearSearchForm = () => {
  //   setSearchStorageType("")
  //   setTableParams({
  //     ...tableParams,
  //     pagination: {
  //       ...tableParams.pagination.current = 1,
  //       ...tableParams.pagination.pageSize = 10,
  //       ...tableParams.pagination.searchStorageType = ""
  //     }
  //   });
  //   fetchData();
  // }
  return (
    <div>
      {/* <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "auto",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        
            <div className="col-10 mt-3 mb-3">
              <label>Từ khoá</label>
              <div className="row">
                <div className="col-4 mt-3">
                    <Input placeholder="Nhập kiểu ổ cứng" value={searchStorageType}
                      onChange={(e) => setSearchStorageType(e.target.value)}/>
                </div>
                <div className="col-8 mt-3">
                    <Button
                        className="mb-2 mx-2"
                        type="primary"
                        onClick={search}
                        style={{ borderRadius: "10px" }}
                    >
                        <SearchOutlined />
                        Tìm kiếm
                    </Button>
                    <Button
                        className="mb-2"
                        type="primary-uotline"
                        onClick={clearSearchForm}
                        style={{ borderRadius: "10px" }}
                    >
                        <ReloadOutlined />
                        Đặt lại
                    </Button>

                    </div>
              </div>
              
            </div>
            
      </div> */}
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
            width={750}
          >
            <Form
              form={formE}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 10 }}
              onFinish={(values) => {
                setValues(
                  values
                );
                handleOk(values)
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="storageDetailId"
                label="Kiểu ổ cứng"
                rules={[
                  {
                    required: true,
                    message: "Kiểu ổ cứng không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Select
                showSearch
                style={{
                  width: 300,
                }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                onChange={(e) => handleSelect(e)}
                options={detail.map((detail) => ({
                  label: detail.storageType.name + " (" + detail.type + ", " + detail.capacity + ")",
                  value: detail.id,
                }))}
              />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="total"
                label="Tổng số khe cắm SSD/HDD"
                rules={[
                  {
                    required: true,
                    message: "Tổng số khe cắm SSD/HDD không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tổng số khe cắm SSD/HDD" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="number"
                label="Số khe SSD/HDD còn lại"
                rules={[
                  {
                    required: true,
                    message: "Số khe SSD/HDD còn lại không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập số khe SSD/HDD còn lại" />
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
            dataSource={data}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Cập nhật"
            visible={isEditing}
            onCancel={handleCancel}
            onOk={() => {
              setEditing(false);
              handleEdit();
            }}
          >
            <Form
              form={formE}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 10 }}
              onFinish={(values) => {
                console.log("values",values);
                handleEdit(
                  values
                );
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                // name="storageDetailId"
                label="Kiểu ổ cứng"
                // rules={[
                //   {
                //     required: true,
                //     message: "Kiểu ổ cứng không được để trống",
                //   },
                // ]}
                // hasFeedback
              >
                <Select
                showSearch
                style={{
                  width: 300,
                }}
                name="storageDetailId"
                value={storageDetail}
                placeholder="Search to Select"
                optionFilterProp="children"
                
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                onChange={(e) => handleSelect(e)}
                options={detail.map((detail) => ({
                  label: detail.storageType.name + " (" + detail.type + ", " + detail.capacity + ")",
                  value: detail.id,
                }))}
              />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="total"
                label="Tổng số khe cắm SSD/HDD"
                rules={[
                  {
                    required: true,
                    message: "Tổng số khe cắm SSD/HDD không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tổng số khe cắm SSD/HDD" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="number"
                label="Số khe SSD/HDD còn lại"
                rules={[
                  {
                    required: true,
                    message: "Số khe SSD/HDD còn lại không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập số khe SSD/HDD còn lại" />
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
    </div>
  );
};

export default Storage;