import { Table, Slider, Select, Input, Button, Modal, Form } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState } from "react";
// import Product from "../Product/index";
import moment from "moment";
import axios from "axios";
import "toastr/build/toastr.min.css";
import toastrs from "toastr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Moment from "react-moment";
const url = "http://localhost:8080/api";
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
  };
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
  };
  const [formE] = Form.useForm();
  const [totalSet, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [data, setData] = useState([
    {
      id: "",
      size: "",
      screenTechnology: "",
      resolution: "",
      screenType: "",
      scanFrequency: "",
      backgroundPanel: "",
      brightness: "",
      colorCoverage: "",
      screenRatio: "",
      touchScreen: "",
      contrast: "",
      status: "ACTIVE",
    },
  ]);
  const [formDefault, setValuesDefault] = useState({
    id: "",
    size: "",
    screenTechnology: "",
    resolution: "",
    screenType: "",
    scanFrequency: "",
    backgroundPanel: "",
    brightness: "",
    colorCoverage: "",
    screenRatio: "",
    touchScreen: "",
    contrast: "",
    status: "ACTIVE",
  });
  const [form, setValues] = useState({
    id: "",
    size: "",
    screenTechnology: "",
    resolution: "",
    screenType: "",
    scanFrequency: "",
    backgroundPanel: "",
    brightness: "",
    colorCoverage: "",
    screenRatio: "",
    touchScreen: "",
    contrast: "",
    status: "ACTIVE",
  });

  const [searchScreenType, setSearchScreenType] = useState();
  const [searchSize, setSearchSize] = useState();
  const [isDraft, setIsDraft] = useState();
  const [searchScreenTechnology, setSearchScreenTechnology] = useState();
  //loadParam getList
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchScreenType: params.pagination?.searchScreenType,
    searchSize: params.pagination?.searchSize,
    searchScreenTechnology: params.pagination?.searchScreenTechnology,
  });
  //ph??n trang Table
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchScreenType: "",
      searchSize: "",
      searchScreenTechnology: "",
    },
  });

  const columns = [
    {
      title: "Lo???i m??n h??nh",
      dataIndex: "screenType",
      width: "10%",
    },
    {
      title: "C??ng ngh???",
      dataIndex: "screenTechnology",
      width: "17%",
    },
    {
      title: "????? ph??n gi???i",
      dataIndex: "resolution",
      width: "13.5%",
    },
    {
      title: "K??ch th?????c",
      dataIndex: "size",
      width: "8.5%",
    },
    {
      title: "T???n s??? qu??t",
      dataIndex: "scanFrequency",
      width: "10%",
    },
    {
      title: "T???m n???n",
      dataIndex: "backgroundPanel",
      width: "7%",
    },
    {
      title: "????? s??ng",
      dataIndex: "brightness",
      width: "8%",
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "status",
      width: "10%",
      render: (status) => {
        if (status == "DRAFT") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100px", borderRadius: "5px", padding: "5px" }}
              >
                Nh??p
              </div>
            </>
          );
        } else if (status == "ACTIVE") {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100px", borderRadius: "5px", padding: "5px" }}
              >
                Ho???t ?????ng
              </div>
            </>
          );
        } else if (status == "INACTIVE") {
          return (
            <>
              <div
                className="bg-secondary text-center text-light"
                style={{
                  width: "100px",
                  borderRadius: "5px",
                  padding: "5px",
                  padding: "5px",
                }}
              >
                Kh??ng ho???t ?????ng
              </div>
            </>
          );
        }
      },
    },
    {
      title: "K??ch ho???t",
      dataIndex: "id",
      dataIndex: "data",
      width: "7%",
      render: (id, data) => {
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/screens/close/${data.id}`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => getData());
                  toastrs.options = {
                    timeOut: 6000,
                  };
                  toast.success("Kh??a th??nh c??ng!", {
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
                    `http://localhost:8080/api/admin/screens/open/${data.id}`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => getData());
                  toastrs.options = {
                    timeOut: 6000,
                  };
                  toast.success("M??? kh??a th??nh c??ng!", {
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
        } else if (data.status == "DRAFT") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/screens/open/${data.id}`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => getData());
                  toastrs.options = {
                    timeOut: 6000,
                  };
                  toast.success("Kh??a th??nh c??ng!", {
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
      title: "Thao t??c",
      dataIndex: "id",
      dataIndex: "data",
      width: "9%",
      render: (id, data) => {
        return (
          <>
            {data.status == "DRAFT" ? (
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
            ) : (
              <EditOutlined
                  style={{ marginLeft: 12 }}
                  onClick={() => {
                    onEdit(data);
                  }}
                />
            )}
          </>
        );
      },
    },
  ];

  //APILoadList
  const getData = () => {
    setLoading(true);
    axios
      .get(
        url + `/auth/screens?${qs.stringify(getRandomuserParams(tableParams))}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((results) => {
        setData(results.data.data.data);
        setTotal(results.data.data.total);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalSet,
          },
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

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const onEdit = (data) => {
    showModalEdit(data);
    setEditing(true);
  };

  //btn Add
  const handleAdd = (value) => {
    const form = {
      size: value.size,
      screenTechnology: value.screenTechnology,
      resolution: value.resolution,
      screenType: value.screenType,
      scanFrequency: value.scanFrequency,
      backgroundPanel: value.backgroundPanel,
      brightness: value.brightness,
      colorCoverage: value.colorCoverage,
      screenRatio: value.screenRatio,
      touchScreen: value.touchScreen,
      contrast: value.contrast,
      status: isDraft == true ? "ACTIVE" : "DRAFT",
    };
    axios
      .post(url + "/staff/screens", form, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        notifySuccess("Th??m b???n ghi m??n h??nh th??nh c??ng");
        // setAdd(false);
        setOpen(false);
        getData();
        setValues(formDefault);
        formE.setFieldsValue(formDefault);
      })
      .catch((error) => {
        notifyError("Th??m b???n ghi m??n h??nh th???t b???i!");
        return;
      });
  };
  //loadFormEdit
  const showModalEdit = (data) => {
    setValues(data);
    formE.setFieldsValue(data);
  };

  //btn Edit
  const handleEdit = (value) => {
    const dataEdit = {
      id: form.id,
      size: value.size,
      screenTechnology: value.screenTechnology,
      resolution: value.resolution,
      screenType: value.screenType,
      scanFrequency: value.scanFrequency,
      backgroundPanel: value.backgroundPanel,
      brightness: value.brightness,
      colorCoverage: value.colorCoverage,
      screenRatio: value.screenRatio,
      touchScreen: value.touchScreen,
      contrast: value.contrast,
      status: form.status,
    };
    axios
      .put(url + "/staff/screens/" + dataEdit.id, dataEdit, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        notifySuccess("S???a b???n ghi th??nh c??ng");
        getData();
        setEditing(false);
        setValues(formDefault);
        formE.setFieldsValue(formDefault);
      })
      .catch((error) => {
        notifyError("S???a b???n ghi th???t b???i!");
        return;
      });
  };

  //Delete
  const onDelete = (id) => {
    Modal.confirm({
      title: "Xo?? gi???m gi??",
      content: "B???n c?? mu???n xo?? b???n ghi n??y kh??ng?",
      onOk() {
        axios
          .delete(url + "/admin/screens/" + id, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            notifySuccess("X??a b???n ghi th??nh c??ng!");
            getData();
          })
          .catch((errorMessage) => {
            notifyError("X??a b???n ghi kh??ng th??nh c??ng!");
            return;
          });
      },
      onCancel() {},
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setEditing(false);
    setValues(formDefault);
    formE.setFieldsValue(formDefault);
  };
  const search = () => {
    setTableParams(
      (tableParams.pagination.current = 1),
      (tableParams.pagination.pageSize = 10),
      (tableParams.pagination.searchScreenType = searchScreenType),
      (tableParams.pagination.searchSize = searchSize),
      (tableParams.pagination.searchScreenTechnology = searchScreenTechnology)
    );
    getData();
  };

  const clearSearchForm = () => {
    setSearchSize("");
    setSearchScreenType("");
    setSearchScreenTechnology("");
    setTableParams({
      ...tableParams,
      pagination: {
        ...(tableParams.pagination.current = 1),
        ...(tableParams.pagination.pageSize = 10),
        ...(tableParams.pagination.searchSize = ""),
        ...(tableParams.pagination.searchScreenType = ""),
        ...(tableParams.pagination.searchScreenTechnology = ""),
      },
    });
    getData();
  };
  const checkPrice = (_, value) => {
    if (value >= 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Gi?? ph???i l???n h??n ho???c b???ng 0!"));
  };

  const onChangeIsDraft = (value) => {
    setIsDraft(value);
  };

  return (
    <div>
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
          <label>T??? kho??</label>
          <div className="row">
            <div className="col-4 mt-4">
              <label>Lo???i m??n h??nh</label>
              <Input
                placeholder="Nh???p lo???i m??n h??nh"
                value={searchScreenType}
                onChange={(e) => setSearchScreenType(e.target.value)}
              />
            </div>
            <div className="col-4 mt-4">
              <label>K??ch th?????c m??n h??nh</label>
              <Input
                placeholder="Nh???p th?????c m??n h??nh"
                value={searchSize}
                onChange={(e) => setSearchSize(e.target.value)}
              />
            </div>
            <div className="col-4 mt-4">
              <label>C??ng ngh??? m??n h??nh</label>
              <Input
                placeholder="Nh???p c??ng ngh??? m??n h??nh"
                value={searchScreenTechnology}
                onChange={(e) => setSearchScreenTechnology(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-12 mb-4 text-center ">
          <Button
            className="mx-2  mt-2 "
            type="primary"
            onClick={search}
            shape="round"
          >
            <SearchOutlined />
            T??m ki???m
          </Button>
          <Button
            className="mt-2"
            type="primary-outline"
            onClick={clearSearchForm}
            shape="round"
          >
            <ReloadOutlined />
            ?????t l???i
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4">
          <Button
            className="offset-11 "
            type="primary"
            onClick={showModal}
            shape="round"
          >
            <PlusOutlined /> Th??m m???i
          </Button>
          <Modal
            title="T???o m???i"
            open={open}
            // onOk={handleAdd}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            width={900}
          >
            <Form
              form={formE}
              autoComplete="off"
              layout="vertical"
              onFinish={(values) => {
                handleAdd(values);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <div className="row">
                <div className="col-6">
                  <Form.Item
                    className="mt-2"
                    name="size"
                    label="K??ch th?????c m??n h??nh"
                    rules={[
                      {
                        required: true,
                        message: "K??ch th?????c m??n h??nh kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p k??ch th?????c m??n h??nh" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenTechnology"
                    label="C??ng ngh??? m??n h??nh"
                    rules={[
                      {
                        required: true,
                        message: "C??ng ngh??? m??n h??nh kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p c??ng ngh??? m??n h??nh" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="resolution"
                    label="????? ph??n gi???i"
                    rules={[
                      {
                        required: true,
                        message: "????? ph??n gi???i kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p ????? ph??n gi???i" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenType"
                    label="Lo???i m??n h??nh"
                    rules={[
                      {
                        required: true,
                        message: "Lo???i m??n h??nh kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                      { min: 3 },
                    ]}
                  >
                    <Input placeholder="Nh???p lo???i m??n h??nh" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="scanFrequency"
                    label="T???n s??? qu??t"
                    rules={[
                      {
                        required: true,
                        message: "T???n s??? qu??t kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p t???n s??? qu??t" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="contrast"
                    label="????? t????ng ph???n"
                    rules={[
                      {
                        required: true,
                        message: "????? t????ng ph???n kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p ????? t????ng ph???n" />
                  </Form.Item>
                </div>
                <div className="col-6">
                  <Form.Item
                    className="mt-2"
                    name="backgroundPanel"
                    label="T???m n???n"
                    rules={[
                      {
                        required: true,
                        message: "T???m n???n kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p t???m n???n" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="brightness"
                    label="????? s??ng"
                    rules={[
                      {
                        required: true,
                        message: "????? s??ng kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p ????? s??ng" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="colorCoverage"
                    label="????? ph??? m??u"
                    rules={[
                      {
                        required: true,
                        message: "????? ph??? m??u kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p ????? ph??? m??u" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenRatio"
                    label="T??? l??? m??n h??nh"
                    rules={[
                      {
                        required: true,
                        message: "T??? l??? m??n h??nh kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p t??? l??? m??n h??nh" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="touchScreen"
                    label="M??n h??nh c???m ???ng"
                    rules={[
                      {
                        required: true,
                        message: "M??n h??nh c???m ???ng kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p m??n h??nh c???m ???ng" />
                  </Form.Item>
                </div>
              </div>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-4">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      id="create"
                      style={{ width: "100px", marginLeft: "230px" }}
                    >
                      T???o m???i
                    </Button>
                  </div>
                  <div className="col-4">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      onClick={() => onChangeIsDraft(false)}
                      danger
                      style={{ width: "100px", marginLeft: "-60px" }}
                    >
                      T???o nh??p
                    </Button>
                  </div>
                  <div className="col-4">
                    <Button
                      block
                      className="cancel"
                      shape="round"
                      onClick={handleCancel}
                      style={{ width: "80px", marginLeft: "-430px" }}
                    >
                      Hu???
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
            title="C???p nh???t"
            open={isEditing}
            width={900}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={formE}
              autoComplete="off"
              layout="vertical"
              onFinish={(values) => {
                handleEdit(values);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <div className="row">
                <div className="col-6">
                  <Form.Item
                    className="mt-2"
                    name="size"
                    label="K??ch th?????c m??n h??nh"
                    rules={[
                      {
                        required: true,
                        message: "K??ch th?????c m??n h??nh kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p k??ch th?????c m??n h??nh" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenTechnology"
                    label="C??ng ngh??? m??n h??nh"
                    rules={[
                      {
                        required: true,
                        message: "C??ng ngh??? m??n h??nh kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p c??ng ngh??? m??n h??nh" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="resolution"
                    label="????? ph??n gi???i"
                    rules={[
                      {
                        required: true,
                        message: "????? ph??n gi???i kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p ????? ph??n gi???i" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenType"
                    label="Lo???i m??n h??nh"
                    rules={[
                      {
                        required: true,
                        message: "Lo???i m??n h??nh kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p lo???i m??n h??nh" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="touchScreen"
                    label="M??n h??nh c???m ???ng"
                    rules={[
                      {
                        required: true,
                        message: "M??n h??nh c???m ???ng kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p m??n h??nh c???m ???ng" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="contrast"
                    label="????? t????ng ph???n"
                    rules={[
                      {
                        required: true,
                        message: "????? t????ng ph???n kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p ????? t????ng ph???n" />
                  </Form.Item>
                </div>
                <div className="col-6">
                  <Form.Item
                    className="mt-2"
                    name="scanFrequency"
                    label="T???n s??? qu??t"
                    rules={[
                      {
                        required: true,
                        message: "T???n s??? qu??t kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p t???n s??? qu??t" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="backgroundPanel"
                    label="T???m n???n"
                    rules={[
                      {
                        required: true,
                        message: "T???m n???n kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p t???m n???n" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="brightness"
                    label="????? s??ng"
                    rules={[
                      {
                        required: true,
                        message: "????? s??ng kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p ????? s??ng" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="colorCoverage"
                    label="????? ph??? m??u"
                    rules={[
                      {
                        required: true,
                        message: "????? ph??? m??u kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p ????? ph??? m??u" />
                  </Form.Item>
                  <Form.Item
                    className="mt-2"
                    name="screenRatio"
                    label="T??? l??? m??n h??nh"
                    rules={[
                      {
                        required: true,
                        message: "T??? l??? m??n h??nh kh??ng ???????c ????? tr???ng",
                      },
                      { whitespace: true },
                    ]}
                  >
                    <Input placeholder="Nh???p t??? l??? m??n h??nh" />
                  </Form.Item>
                </div>
              </div>

              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      id="create"
                      style={{ width: "100px", marginLeft: "230px" }}
                    >
                      C???p nh???t
                    </Button>
                  </div>
                  <div className="col-6">
                    <Button
                      block
                      className="cancel"
                      shape="round"
                      onClick={handleCancel}
                      style={{ width: "80px", marginLeft: "-440px" }}
                    >
                      Hu???
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

export default Screen;
