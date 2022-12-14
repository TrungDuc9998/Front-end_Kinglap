import {
  Table,
  Form,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Radio,
  Space,
} from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
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

const BatteryCharger = () => {
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
  const [formEdit] = Form.useForm();
  const [totalSet, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDraft, setIsDraft] = useState();
  const [data, setData] = useState([
    {
      id: "",
      batteryType: "",
      battery: "",
      charger: "",

      categoryId: null,
      active: "ACTIVE",
    },
  ]);
  const [formDefault, setValuesDefault] = useState({
    id: "",
    batteryType: "",
    battery: "",
    charger: "",

    categoryId: null,
    active: "ACTIVE",
  });
  const [form, setValues] = useState({
    id: "",
    batteryType: "",
    battery: "",
    charger: "",
    categoryId: null,
    active: "ACTIVE",
  });

  const [searchBatteryType, setSearchBatteryType] = useState();
  const [searchBattery, setSearchBattery] = useState();
  const [searchCharger, setSearchCharger] = useState();
  //loadParam getList
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchBatteryType: params.pagination?.searchBatteryType,
    searchBattery: params.pagination?.searchBattery,
    searchCharger: params.pagination?.searchCharger,
  });
  //ph??n trang Table
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchBatteryType: "",
      searchBattery: "",
      searchCharger: "",
    },
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

  const columns = [
    {
      title: "Lo???i pin",
      dataIndex: "batteryType",
      width: "17.5%",
    },
    {
      title: "Dung l?????ng pin",
      dataIndex: "battery",
      width: "17.5%",
    },
    {
      title: "Ngu???n c???p",
      dataIndex: "charger",
      width: "17.5%",
    },
    {
      title: "Ng??y t???o",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY">{createdAt}</Moment>;
      },
      width: "17.5%",
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "status",
      width: "13%",
      render: (status) => {
        if (status == "DRAFT") {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
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
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
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
                style={{ width: "100%", borderRadius: "5px", padding: "5px" }}
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
      width: "8%",
      render: (id, data) => {
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/batteryCharger/close/${data.id}`,
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
                    `http://localhost:8080/api/admin/batteryCharger/open/${data.id}`,
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
                    `http://localhost:8080/api/admin/batteryCharger/open/${data.id}`,
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
        url +
          `/auth/batteryCharger?${qs.stringify(
            getRandomuserParams(tableParams)
          )}`,
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
  }, []);

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

  const [dataEdit, setDataEdit] = useState({});
  const onEdit = (data) => {
    setDataEdit(data);
    setEditing(true);
    formEdit.setFieldsValue(data);
  };

  const handleSubmit = (data) => {
    if (isUpdate === false) {
      data.status = isDraft == true ? "ACTIVE" : "DRAFT";
      fetch("http://localhost:8080/api/staff/batteryCharger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((results) => {
          if (results.status === 200) {
            toastSuccess("Th??m m???i th??nh c??ng !");
            getData();
            onClearForm();
          }
        });
      setOpen(false);
    }
  };

  const handleSubmitUpdate = (data) => {
    const edit = {
      id: dataEdit.id,
      battery: data.battery,
      batteryType: data.batteryType,
      charger: data.charger,
      status: data.status,
    };
    if (isUpdate === false) {
      data.status = "ACTIVE";
      fetch("http://localhost:8080/api/admin/batteryCharger/" + edit.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(edit),
      })
        .then((response) => getData())
        .then((data) => {
          toastSuccess("C???p nh???t th??nh c??ng!");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setEditing(false);
    }
  };

  //Delete
  const onDelete = (id) => {
    Modal.confirm({
      title: "Xo?? gi???m gi??",
      content: "B???n c?? mu???n xo?? b???n ghi n??y kh??ng?",
      okText:"C??",
      cancelText: "Kh??ng",
      onOk() {
        axios
          .delete(url + "/admin/batteryCharger/" + id, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            if (res.status == 200) {
              notifySuccess("X??a b???n ghi th??nh c??ng!");
              getData();
            }
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
  };
  const search = () => {
    setTableParams(
      (tableParams.pagination.current = 1),
      (tableParams.pagination.pageSize = 10),
      (tableParams.pagination.searchBatteryType = searchBatteryType),
      (tableParams.pagination.searchBattery = searchBattery),
      (tableParams.pagination.searchCharger = searchCharger)
    );
    getData();
  };

  const clearSearchForm = () => {
    setSearchBattery("");
    setSearchBatteryType("");
    setSearchCharger("");
    setTableParams({
      ...tableParams,
      pagination: {
        ...(tableParams.pagination.current = 1),
        ...(tableParams.pagination.pageSize = 10),
        ...(tableParams.pagination.searchBattery = ""),
        ...(tableParams.pagination.searchBatteryType = ""),
        ...(tableParams.pagination.searchCharger = ""),
      },
    });
    getData();
  };

  const onChangeIsDraft = (value) => {
    setIsDraft(value);
  };

  const [clearForm] = Form.useForm();

  const onClearForm = () => {
    clearForm.resetFields();
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
        <div className="row">
          <div className="col-4 mt-4">
            <label>Lo???i pin</label>
            <Input
              placeholder="Nh???p lo???i pin"
              value={searchBatteryType}
              onChange={(e) => setSearchBatteryType(e.target.value)}
            />
          </div>
          <div className="col-4 mt-4">
            <label>Dung l?????ng pin</label>
            <Input
              placeholder="Nh???p dung l?????ng pin"
              value={searchBattery}
              onChange={(e) => setSearchBattery(e.target.value)}
            />
          </div>
          <div className="col-4 mt-4">
            <label>Power supply</label>
            <Input
              placeholder="Nh???p power supply"
              value={searchCharger}
              onChange={(e) => setSearchCharger(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 mt-3 mb-2 text-center ">
          <Button
            className="mx-2  mt-2"
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
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={650}
          >
            <Form
              initialValues={{}}
              form={clearForm}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
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
                name="batteryType"
                label="Lo???i pin"
                rules={[
                  {
                    required: true,
                    message: "Lo???i pin kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                  { min: 3, message: "Lo???i pin l???n h??n 3 k?? t???" },
                ]}
              >
                <Input placeholder="Nh???p lo???i pin" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="battery"
                label="Dung l?????ng pin"
                rules={[
                  {
                    required: true,
                    message: "Dung l?????ng pin kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                  { min: 3, message: "Dung l?????ng pin l???n h??n 3 k?? t???" },
                ]}
              >
                <Input placeholder="Nh???p dung l?????ng pin" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="charger"
                label="Power supply"
                rules={[
                  {
                    required: true,
                    message: "Ngu???n c???p kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                  { min: 3, message: "Ngu???n c???p l???n h??n 3 k?? t???" },
                ]}
              >
                <Input placeholder="Nh???p power supply" />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-4">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      onClick={() => onChangeIsDraft(true)}
                      style={{ width: "100px", marginLeft: "190px" }}
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
                      style={{ width: "100px", marginLeft: "180px" }}
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
                      style={{ width: "80px", marginLeft: "170px" }}
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
            onCancel={handleCancel}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            width={650}
          >
            <Form
              form={formEdit}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
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
                name="batteryType"
                label="Lo???i pin"
                initialValue={dataEdit.batteryType}
                rules={[
                  {
                    required: true,
                    message: "Lo???i pin kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="battery"
                label="Dung l?????ng pin"
                initialValue={dataEdit.battery}
                rules={[
                  {
                    required: true,
                    message: "Dung l?????ng pin kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="charger"
                label="Power supply"
                initialValue={dataEdit.charger}
                rules={[
                  {
                    required: true,
                    message: "Power supply kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                  { min: 3 },
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
                      style={{ width: "80px", marginLeft: "170px" }}
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

export default BatteryCharger;
