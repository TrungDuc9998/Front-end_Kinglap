import { Table, Slider, Select, Input, Button, Modal, DatePicker, Radio, Space, Form, InputNumber } from "antd";
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
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
// import Product from "../Product/index";
import moment from "moment";
import axios from "axios";
import 'toastr/build/toastr.min.css';
import toastrs from "toastr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Moment from 'react-moment';
const url = 'http://localhost:8080/api';
const { Option } = Select;

const Screen = () => {
  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  const [formE] = Form.useForm();
  const [category, setCategory] = useState([]);
  const [totalSet, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [data, setData] = useState([{
    id:"",
    size:"",
    screenTechnology:"",
    resolution:"",
    screenType:"",
    scanFrequency:"", 
    backgroundPanel:"",
    brightness:"",
    colorCoverage:"",
    screenRatio:"",
    touchScreen:"",
    contrast:"",
    price:null,
    status: "ACTIVE",  
  }]
  );
  const [formDefault, setValuesDefault] = useState({
    id:"",
    size:"",
    screenTechnology:"",
    resolution:"",
    screenType:"",
    scanFrequency:"", 
    backgroundPanel:"",
    brightness:"",
    colorCoverage:"",
    screenRatio:"",
    touchScreen:"",
    contrast:"",
    price:null,
    status: "ACTIVE",
  }
  );
  const [form, setValues] = useState({
    id:"",
    size:"",
    screenTechnology:"",
    resolution:"",
    screenType:"",
    scanFrequency:"", 
    backgroundPanel:"",
    brightness:"",
    colorCoverage:"",
    screenRatio:"",
    touchScreen:"",
    contrast:"",
    price:null,
    status: "ACTIVE",
  }
  );

  const [searchScreenType, setSearchScreenType] = useState();
  const [searchSize, setSearchSize] = useState();
  const [searchScreenTechnology, setSearchScreenTechnology] = useState();
  //loadParam getList
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchScreenType: params.pagination?.searchScreenType,
    searchSize: params.pagination?.searchSize,
    searchScreenTechnology: params.pagination?.searchScreenTechnology,
  });
  //phân trang Table
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchScreenType:"",
      searchSize:"",
      searchScreenTechnology:""
    },
  });

  const columns = [
    {
      title: "Kích thước màn hình",
      dataIndex: "size",
      sorter: true,
      width: "20%",
    },
    {
      title: "Công nghệ màn hình",
      dataIndex: "screenTechnology",
      sorter: true,
      width: "20%",
    },
    {
      title: "Độ phân giải",
      dataIndex: "resolution",
      sorter: true,
      width: "20%",
    },
    {
      title: "Loại màn hình",
      dataIndex: "screenType",
      sorter: true,
      width: "20%",
    },
    {
      title: "Tần số quét",
      dataIndex: "scanFrequency",
      sorter: true,
      width: "20%",
    },
    {
      title: "Tấm nền",
      dataIndex: "backgroundPanel",
      sorter: true,
      width: "20%",
    },
    {
      title: "Độ sáng",
      dataIndex: "brightness",
      sorter: true,
      width: "20%",
    },
    {
      title: "Độ phủ màu",
      dataIndex: "colorCoverage",
      sorter: true,
      width: "20%",
    },
    {
      title: "Tỷ lệ màn hình",
      dataIndex: "screenRatio",
      sorter: true,
      width: "20%",
    },
    {
      title: "Màn hình cảm ứng",
      dataIndex: "touchScreen",
      sorter: true,
      width: "20%",
    },
    {
      title: "Độ tương phản",
      dataIndex: "contrast",
      sorter: true,
      width: "20%",
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: true,
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      with: "30%",
      render: (status) => {
        if (status == 'ACTIVE') {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100px", borderRadius: "5px" }}
              >
                Hoạt động
              </div>
            </>
          );
        }
        if (status == 'INACTIVE') {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100px", borderRadius: "5px" }}
              >
                Không hoạt động
              </div>
            </>
          );
        }
      },
    },
    {
      title: "Kích hoạt",
      dataIndex: "id",
      dataIndex: "data",
      width: "5%",
      render: (id, data) => {
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/screens/close/${data.id}`, { method: "PUT" }).then(() => getData());
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
            </>
          );
        } else if (data.status == "INACTIVE") {
          return (
            <>
              <LockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/screens/open/${data.id}`, { method: "PUT" }).then(() => getData());
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
            </>
          );
        }
        else if (data.status == "DRAFT") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/screens/open/${data.id}`, { method: "PUT" }).then(() => getData());
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
            </>
          );
        }
      },
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      dataIndex: "data",
      width: "20%",
      render: (id,data) => {
        return (
          <>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onEdit(data);
              }}
            />
            <DeleteOutlined
              onClick={() => onDelete(data.id)}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  //APILoadList
  const getData = () => {
    setLoading(true);
    axios.get(url + `/auth/screens?${qs.stringify(
      getRandomuserParams(tableParams)
    )}`)
      .then((results) => {
        setData(results.data.data.data);
        setTotal(results.data.data.total);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalSet,
          }
        });
      });
  };

  //LoadList
  useEffect(() => {
    getData();
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
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = () => {
    setOpen(true);
  };

  const onEdit = (data) => {
    showModalEdit(data);
    setEditing(true);
  };

  //btn Add
  const handleAdd = (value) => {
    const form={
      size:value.size,
      screenTechnology:value.screenTechnology,
      resolution:value.resolution,
      screenType:value.screenType,
      scanFrequency:value.scanFrequency, 
      backgroundPanel:value.backgroundPanel,
      brightness:value.brightness,
      colorCoverage:value.colorCoverage,
      screenRatio:value.screenRatio,
      touchScreen:value.touchScreen,
      contrast:value.contrast,
      price:value.price,
      status: "ACTIVE",
    }
      axios.post(url+"/staff/screens", form)
        .then(res => {
          notifySuccess('Thêm bản ghi thành công')
          // setAdd(false);
          setOpen(false);
          getData();
          setValues(formDefault);
          formE.setFieldsValue(formDefault);
          console.log(res.data);
        }).catch((error) => {
          notifyError('Yêu cầu nhập đủ các trường!');
          return;
        })
  }
  //loadFormEdit
  const showModalEdit = (data) => {
    console.log("edit",data)
    setValues(data);
    formE.setFieldsValue(data);
  };

  //btn Edit
  const handleEdit = (value)=>{
      const dataEdit={
        id:form.id,
        size:value.size,
        screenTechnology:value.screenTechnology,
        resolution:value.resolution,
        screenType:value.screenType,
        scanFrequency:value.scanFrequency, 
        backgroundPanel:value.backgroundPanel,
        brightness:value.brightness,
        colorCoverage:value.colorCoverage,
        screenRatio:value.screenRatio,
        touchScreen:value.touchScreen,
        contrast:value.contrast,
        price:value.price,
        status: form.status,
      }
      axios.put(url + "/staff/screens/" + dataEdit.id, dataEdit)
        .then(res => {
          notifySuccess('Sửa bản ghi thành công')
          getData();
          setEditing(false);
          setValues(formDefault);
          formE.setFieldsValue(formDefault);
          console.log(res.data);
        }).catch((error) => {
          notifyError('Yêu cầu nhập đủ các trường!');
          return;
        })
  }


  //Delete
  const onDelete = (id) => {
    Modal.confirm({
      title: "Xoá giảm giá",
      content: "Bạn có muốn xoá bản ghi này không?",
      onOk() {
        axios.delete(url + "/admin/screens/" + id)
          .then(res => {
            notifySuccess('Xóa bản ghi thành công!')
            getData();
            console.log(res.data);
          }).catch((errorMessage) => {
            notifyError('Xóa bản ghi không thành công!');
            return;
          })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
    setEditing(false);
    setValues(formDefault);
    formE.setFieldsValue(formDefault);
  };
  const search=()=>{
    setTableParams(
      tableParams.pagination.current= 1,
      tableParams.pagination.pageSize= 10,
      tableParams.pagination.searchScreenType=searchScreenType,
      tableParams.pagination.searchSize=searchSize,
      tableParams.pagination.searchScreenTechnology=searchScreenTechnology
    );
    getData();
  }

  const clearSearchForm = () => {
    setSearchSize("")
    setSearchScreenType("")
    setSearchScreenTechnology("")
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination.current = 1,
        ...tableParams.pagination.pageSize = 10,
        ...tableParams.pagination.searchSize = "",
        ...tableParams.pagination.searchScreenType = "",
        ...tableParams.pagination.searchScreenTechnology=""
      }
    });
    getData();
  }
  const checkPrice = (_,value) => {
    if (value >= 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Giá phải lớn hơn hoặc bằng 0!'));
  };

  return (
    <div>
      <ToastContainer />
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "auto",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        
            <div className="col-10 mt-3">
              <label>Từ khoá</label>
              <div className="row">
                <div className="col-4 mt-4">
                  <label>Loại màn hình</label>
                    <Input placeholder="Nhập loại màn hình" value={searchScreenType}
                      onChange={(e) => setSearchScreenType(e.target.value)}/>
                  </div>
                  <div className="col-4 mt-4">
                    <label>Kích thước màn hình</label>
                    <Input placeholder="Nhập thước màn hình"  value={searchSize}
                      onChange={(e) => setSearchSize(e.target.value)}/>
                  </div>
                  <div className="col-4 mt-4">
                    <label>Công nghệ màn hình</label>
                    <Input placeholder="Nhập công nghệ màn hình"  value={searchScreenTechnology}
                      onChange={(e) => setSearchScreenTechnology(e.target.value)}/>
                  </div>
              </div>
              
            </div>
            <div className="col-12 text-center ">
              <Button
                className="mx-2  mt-2"
                type="primary"
                onClick={search}
                style={{ borderRadius: "10px" }}
              >
                <SearchOutlined />
                Tìm kiếm
              </Button>
              <Button
                className="mt-2"
                type="primary-uotline"
                onClick={clearSearchForm}
                style={{ borderRadius: "10px" }}
              >
                <ReloadOutlined />
                Đặt lại
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
            // onOk={handleAdd}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={700}
          >
            <Form
              form={formE}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 10 }}
              onFinish={(values) => {
                handleAdd(values)
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="size"
                label="Kích thước màn hình"
                rules={[
                  {
                    required: true,
                    message: "Kích thước màn hình không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập kích thước màn hình" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="screenTechnology"
                label="Công nghệ màn hình"
                rules={[
                  {
                    required: true,
                    message: "Công nghệ màn hình không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập công nghệ màn hình" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="screenType"
                label="Độ phân giải"
                rules={[
                  {
                    required: true,
                    message: "Độ phân giải không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập độ phân giải" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="resolution"
                label="Loại màn hình"
                rules={[
                  {
                    required: true,
                    message: "Loại màn hình không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập loại màn hình"/>
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="scanFrequency"
                label="Tần số quét"
                rules={[
                  {
                    required: true,
                    message: "Tần số quét không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tần số quét" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="backgroundPanel"
                label="Tấm nền"
                rules={[
                  {
                    required: true,
                    message: "Tấm nền không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tấm nền" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="brightness"
                label="Độ sáng"
                rules={[
                  {
                    required: true,
                    message: "Độ sáng không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập độ sáng"/>
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="colorCoverage"
                label="Độ phủ màu"
                rules={[
                  {
                    required: true,
                    message: "Độ phủ màu không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập độ phủ màu" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="screenRatio"
                label="Tỷ lệ màn hình"
                rules={[
                  {
                    required: true,
                    message: "Tỷ lệ màn hình không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tỷ lệ màn hình" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="touchScreen"
                label="Màn hình cảm ứng"
                rules={[
                  {
                    required: true,
                    message: "Màn hình cảm ứng không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập màn hình cảm ứng" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="contrast"
                label="Độ tương phản"
                rules={[
                  {
                    required: true,
                    message: "Độ tương phản không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập độ tương phản" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="price"
                label="Giá"
                rules={[
                  {
                    required: true,
                    message: "Giá tiền không được để trống",
                  },
                  { validator: checkPrice }
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập giá"/>
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
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Cập nhật"
            visible={isEditing}
            onCancel={handleCancel}
            // onOk={(e) => {
            //   handleEdit(e);
            // }}
          >
            <Form
              form={formE}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 10 }}
              onFinish={(values) => {
                console.log("editV",values)
                handleEdit(values);
              }}
              // onFinishFailed={(error) => {
              //   console.log({ error });
              // }}
            >
              <Form.Item
                className="mt-2"
                name="size"
                label="Kích thước màn hình"
                rules={[
                  {
                    required: true,
                    message: "Kích thước màn hình không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập kích thước màn hình" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="screenTechnology"
                label="Công nghệ màn hình"
                rules={[
                  {
                    required: true,
                    message: "Công nghệ màn hình không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập công nghệ màn hình"/>
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="screenType"
                label="Độ phân giải"
                rules={[
                  {
                    required: true,
                    message: "Độ phân giải không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập độ phân giải" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="resolution"
                label="Loại màn hình"
                rules={[
                  {
                    required: true,
                    message: "Loại màn hình không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập loại màn hình"/>
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="scanFrequency"
                label="Tần số quét"
                rules={[
                  {
                    required: true,
                    message: "Tần số quét không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tần số quét" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="backgroundPanel"
                label="Tấm nền"
                rules={[
                  {
                    required: true,
                    message: "Tấm nền không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tấm nền"/>
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="brightness"
                label="Độ sáng"
                rules={[
                  {
                    required: true,
                    message: "Độ sáng không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập độ sáng"/>
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="colorCoverage"
                label="Độ phủ màu"
                rules={[
                  {
                    required: true,
                    message: "Độ phủ màu không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập độ phủ màu" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="screenRatio"
                label="Tỷ lệ màn hình"
                rules={[
                  {
                    required: true,
                    message: "Tỷ lệ màn hình không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập tỷ lệ màn hình" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="touchScreen"
                label="Màn hình cảm ứng"
                rules={[
                  {
                    required: true,
                    message: "Màn hình cảm ứng không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập màn hình cảm ứng"/>
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="contrast"
                label="Độ tương phản"
                rules={[
                  {
                    required: true,
                    message: "Độ tương phản không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập độ tương phản" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="price"
                label="Giá tiền"
                initialValue={data.price}
                rules={[
                  {
                    required: true,
                    message: "Giá tiền không được để trống",
                  },
                  { validator: checkPrice }
                ]}
                hasFeedback
              >
                <Input placeholder="Nhập giá"/>
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button block type="primary" id="create" htmlType="submit">
                      Cập nhật
                    </Button>
                  </div>
                  {/* <div className="col-6">
                    <Button block type="danger" id="create" htmlType="submit">
                      Lưu nháp
                    </Button>
                  </div> */}
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Screen;