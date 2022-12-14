import {
  Table,
  Slider,
  Select,
  Input,
  Button,
  Modal,
  DatePicker,
  Radio,
  Space,
  Form,
  InputNumber,
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
  const [isDraft, setIsDraft] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [data, setData] = useState();
  const [formDefault, setValuesDefault] = useState({
    id: "",
    name: "",
    version: "",
    status: "ACTIVE",
  });
  const [form, setValues] = useState({
    id: "",
    name: "",
    version: "",
    status: "",
  });

  const [searchName, setSearchName] = useState();
  const [searchVersion, setSearchVersion] = useState();
  //loadParam getList
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchName: params.pagination?.searchName,
    searchVersion: params.pagination?.searchVersion,
  });
  //ph??n trang Table
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchName: "",
      searchVersion: "",
    },
  });

  const columns = [
    {
      title: "T??n h??? ??i???u h??nh",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "Version",
      dataIndex: "version",
      width: "20%",
    },
    {
      title: "Ng??y t???o",
      dataIndex: "createdAt",
      render(createdAt) {
        return <Moment format="DD-MM-YYYY">{createdAt}</Moment>;
      },
      width: "10%",
    },
    {
      title: "Ng??y c???p nh???t",
      dataIndex: "updatedAt",
      render(updatedAt) {
        return <Moment format="DD-MM-YYYY">{updatedAt}</Moment>;
      },
      width: "15%",
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "status",
      width: "15%",
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
                style={{ width: "100px", borderRadius: "5px", padding: "5px" }}
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
      width: "10%",
      render: (id, data) => {
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/admin/wins/close/${data.id}`,
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
                    `http://localhost:8080/api/admin/wins/open/${data.id}`,
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
                    `http://localhost:8080/api/admin/wins/open/${data.id}`,
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
      width: "10%",
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
        url + `/auth/wins?${qs.stringify(getRandomuserParams(tableParams))}`,
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
      name: value.name,
      version: value.version,
      status: isDraft == true ? "ACTIVE" : "DRAFT",
    };
    axios
      .post(url + "/staff/wins", form, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        notifySuccess("Th??m m???i h??? ??i???u h??ng th??nh c??ng");
        // setAdd(false);
        setOpen(false);
        getData();
        setValues(formDefault);
        formE.setFieldsValue(formDefault);
      })
      .catch((error) => {
        notifyError("Th??m m???i h??? ??i???u h??ng th???t b???i!");
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
    // e.preventDefault();
    const dataEdit = {
      id: form.id,
      name: value.name,
      version: value.version,
      status: form.status,
    };
    axios
      .put(url + "/staff/wins/" + dataEdit.id, dataEdit, {
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
          .delete(url + "/admin/wins/" + id, {
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
  };
  const search = () => {
    setTableParams(
      (tableParams.pagination.current = 1),
      (tableParams.pagination.pageSize = 10),
      (tableParams.pagination.searchName = searchName),
      (tableParams.pagination.searchVersion = searchVersion)
    );
    getData();
  };

  const clearSearchForm = () => {
    setSearchName("");
    setTableParams({
      ...tableParams,
      pagination: {
        ...(tableParams.pagination.current = 1),
        ...(tableParams.pagination.pageSize = 10),
        ...(tableParams.pagination.searchName = ""),
        ...(tableParams.pagination.searchVersion = ""),
      },
    });
    getData();
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
        <div className="col-10 mt-3 mb-3">
          <label>T??? kho??</label>
          <div className="row">
            <div className="col-4 mt-3">
              <Input
                placeholder="Nh???p t??n h??? ??i???u h??nh"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div className="col-4 mt-3">
              <Input
                placeholder="Nh???p version"
                value={searchVersion}
                onChange={(e) => setSearchVersion(e.target.value)}
              />
            </div>
            <div className="col-4 mt-3">
              <Button
                className="mb-2 mx-2"
                type="primary"
                onClick={search}
                shape="round"
              >
                <SearchOutlined />
                T??m ki???m
              </Button>
              <Button
                className="mb-2"
                type="primary-uotline"
                onClick={clearSearchForm}
                shape="round"
              >
                <ReloadOutlined />
                ?????t l???i
              </Button>
            </div>
          </div>
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
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={650}
            footer={null}
          >
            <Form
              form={formE}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                handleAdd(values);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="name"
                label="T??n h??? ??i???u h??nh"
                rules={[
                  {
                    required: true,
                    message: "T??n h??? ??i???u h??nh kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                ]}
              >
                <Input placeholder="Nh???p t??n h??? ??i???u h??nh" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="version"
                label="Version"
                rules={[
                  {
                    required: true,
                    message: "Version kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                ]}
              >
                <Input placeholder="Nh???p version" />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-4">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      id="create"
                      onClick={() => onChangeIsDraft(true)}
                      style={{ width: "100px", marginLeft: "170px" }}
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
                      id="create"
                      onClick={() => onChangeIsDraft(false)}
                      danger
                      style={{ width: "100px", marginLeft: "160px" }}
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
                      style={{ width: "80px", marginLeft: "150px" }}
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
            dataSource={data}
            rowKey={(record) => record.id}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="C???p nh???t"
            open={isEditing}
            onCancel={handleCancel}
            width={550}
            footer={null}
          >
            <Form
              form={formE}
              //autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 13 }}
              onFinish={(values) => {
                handleEdit(values);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="name"
                label="T??n h??? ??i???u h??nh"
                rules={[
                  {
                    required: true,
                    message: "T??n h??? ??i???u h??nh kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                ]}
              >
                <Input placeholder="Nh???p t??n h??? ??i???u h??nh" />
              </Form.Item>
              <Form.Item
                className="mt-2"
                name="version"
                label="Version"
                rules={[
                  {
                    required: true,
                    message: "Version kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                ]}
              >
                <Input placeholder="Nh???p version" />
              </Form.Item>
              <Form.Item className="text-center">
                <div className="row">
                  <div className="col-6">
                    <Button
                      block
                      type="primary"
                      className="create"
                      htmlType="submit"
                      shape="round"
                      style={{ width: "100px" }}
                    >
                      C???p nh???t
                    </Button>
                  </div>
                  <div className="col-6">
                    <Button
                      block
                      shape="round"
                      className="cancel"
                      onClick={handleCancel}
                      style={{ width: "80px" }}
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
