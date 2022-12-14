import { Table, Select, Input, Button, Modal, Form, InputNumber } from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import qs from "qs";
import React, { useEffect, useState, useRef } from "react";
import "./Processor.css";
import { toast } from "react-toastify";
const { Option } = Select;
const getRandomParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchCpuCompany: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});

const toastSuccessProcessor = (message) => {
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
  const [cpuCompany, setCpuCompany] = useState("2");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [isDraft, setIsDraft] = useState();

  const onReset = () => {
    form.resetFields();
  };

  const loadDataProcessor = () => {
    setSearchName("");
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);
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
  }, [cpuCompany != undefined, loading]);

  const onDelete = (record) => {
    Modal.confirm({
      icon: <CheckCircleOutlined />,
      title: "Xo?? RAM ",
      content: `B???n c?? mu???n xo?? ram ${record.cpuCompany} ${record.cpuTechnology} kh??ng?`,
      okText: "C??",
      cancelText: "Kh??ng",
      okType: "primary",
      onOk: () => {
        deleteProcessor(record);
      },
    });
  };

  const deleteProcessor = (record) => {
    fetch(`http://localhost:8080/api/staff/processors/${record.id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          toastSuccessProcessor("Xo?? th??nh c??ng !");
          loadDataProcessor();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const columns = [
    {
      title: "H??ng CPU",
      dataIndex: "cpuCompany",
      width: "10%",
    },
    {
      title: "C??ng ngh??? CPU",
      dataIndex: "cpuTechnology",
      width: "12%",
    },
    {
      title: "Lo???i CPU",
      dataIndex: "cpuType",
      width: "8%",
    },
    {
      title: "T???c ????? CPU",
      dataIndex: "cpuSpeed",
      width: "9%",
    },
    {
      title: "T???c ????? t???i ??a",
      dataIndex: "maxSpeed",
      width: "9%",
    },
    {
      title: "S??? nh??n",
      dataIndex: "multiplier",
      width: "7%",
    },
    {
      title: "S??? lu???ng",
      dataIndex: "numberOfThread",
      width: "7%",
    },
    {
      title: "B??? nh??? ?????m",
      dataIndex: "caching",
      width: "8.5%",
    },
    {
      title: "Tr???ng th??i",
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
                Ho???t ?????ng
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
                Kh??ng ho???t ?????ng
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
                Nh??p
              </div>
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
        if (data.status === "DRAFT") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  // setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/processors/${data.id}/active`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataProcessor());
                  toastSuccessProcessor("M??? kh??a th??nh c??ng!");
                }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  onEdit(data);
                }}
              />
              <DeleteOutlined
                onClick={() => onDelete(data)}
                style={{ color: "red", marginLeft: "12px" }}
              />
            </>
          );
        }
        if (data.status == "ACTIVE") {
          return (
            <>
              <LockOutlined
                style={{}}
                onClick={() => {
                  // setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/processors/${data.id}/inactive`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataProcessor());
                  toastSuccessProcessor("Kho?? th??nh c??ng !");
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
              <UnlockOutlined
                style={{}}
                onClick={() => {
                  // setLoading(true);
                  fetch(
                    `http://localhost:8080/api/staff/processors/${data.id}/active`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    }
                  ).then(() => loadDataProcessor());
                  toastSuccessProcessor("M??? kh??a th??nh c??ng!");
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
    onClearForm();
  };

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchName;
    tableParams.pagination.search2 = searchStatus;
    // setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);
        // setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const onSearch = (value) => {};
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = (data) => {
    setOpen(true);
  };

  const handleOk = () => {};

  const handleCancel = () => {
    setOpen(false);
  };

  const [dataEdit, setDataEdit] = useState({});
  const onEdit = (data) => {
    setDataEdit(data);
    setEditing(true);
    formEdit.setFieldsValue(data);
  };

  const handleSubmitProcessor = (data) => {
    if (isUpdate === false) {
      data.status = isDraft == true ? "ACTIVE" : "DRAFT";
      fetch("http://localhost:8080/api/staff/processors", {
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
            toastSuccessProcessor("Th??m m???i b??? x??? l?? th??nh c??ng !");
            onReset();
            setLoading(false);
            loadDataProcessor();
          }
          setOpen(false);
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
      status: dataEdit.status,
    };
    if (isUpdate === false) {
      data.status = "ACTIVE";
      fetch("http://localhost:8080/api/staff/processors/" + edit.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(edit),
      })
        .then((response) => loadDataProcessor())
        .then((data) => {
          toastSuccessProcessor("C???p nh???t b??? x??? l?? th??nh c??ng!");
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
    // setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);
        // setLoading(false);
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
    setSearchStatus(value);
  };

  const onChangeIsDraft = (value) => {
    setIsDraft(value);
  };

  const [clearForm] = Form.useForm();

  const onClearForm = () => {
    clearForm.resetFields();
    onchangeSearch();
  };

  const validateMessages = {
    required: "${label} kh??ng ???????c ????? tr???ng!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} ph???i l?? ki???u s???!",
    },
    number: {
      range: "${label} ph???i t??? ${min} ?????n ${max}",
    },
  };

  return (
    <div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "170px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-4 mt-4">
          <label>H??ng CPU</label>
          <Input
            name="searchName"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Nh???p h??ng CPU"
          />
        </div>
        <div className="col-4 mt-4">
          <Form
            form={clearForm}
            name="nest-messages"
            className="me-2 ms-2"
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item name="select">
              <label>Tr???ng th??i</label>
              <br />
              <Select
                allowClear={true}
                style={{ width: "400px", borderRadius: "5px" }}
                showSearch
                placeholder="Ch???n tr???ng th??i"
               
                optionFilterProp="children"
                onChange={changeSearchStatus}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value="ACTIVE" selected>
                  Ho???t ?????ng
                </Option>
                <Option value="INACTIVE">Kh??ng ho???t ?????ng</Option>
                <Option value="DRAFT">Nh??p</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className="col-12 text-center mb-4">
          <Button
            className="mt-2"
            type="primary-outline"
            onClick={clearSearchForm}
            shape="round"
          >
            <ReloadOutlined />
            ?????t l???i
          </Button>
          <Button
            className="mx-2  mt-2"
            type="primary"
            onClick={search}
            shape="round"
          >
            <SearchOutlined />
            T??m ki???m
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
            id="modal"
            title="T???o m???i b??? x??? l??"
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            width={700}
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Form
              form={form}
              validateMessages={validateMessages}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 10 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmitProcessor(values, isUpdate);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="cpuCompany"
                label="H??ng CPU"
                rules={[
                  {
                    required: true,
                    message: "H??ng CPU kh??ng ???????c ????? tr???ng",
                  },
                  { whitespace: true },
                  { min: 3 ,
                  message:"H??ng CPU t??? 3 k?? t??? tr??? l??n"},
                ]}
               
              >
                <Input placeholder="Nh???p h??ng CPU" ref={cpuCompany} />
              </Form.Item>
              <Form.Item
                name="cpuTechnology"
                label="C??ng ngh??? CPU"
                rules={[
                  {
                    required: true,
                    message: "C??ng ngh??? CPU kh??ng ???????c ????? tr???ng",
                  },
                ]}
                
              >
                <Input placeholder="Nh???p c??ng ngh??? CPU" />
              </Form.Item>

              <Form.Item
                name="cpuType"
                label="Lo???i CPU"
                rules={[
                  {
                    required: true,
                    message: "Lo???i CPU kh??ng ???????c ????? tr???ng",
                  },
                ]}
               
              >
                <Input placeholder="T???c ????? CPU" />
              </Form.Item>
              <Form.Item
                name="cpuSpeed"
                label="T???c ????? CPU"
                rules={[
                  {
                    required: true,
                    message: "T???c ????? CPU kh??ng ???????c ????? tr???ng",
                  },
                ]}
               
              >
                <Input placeholder="Nh???p t???c ????? CPU" />
              </Form.Item>
              <Form.Item
                name="maxSpeed"
                label="T???c ????? t???i ??a CPU"
                rules={[
                  {
                    required: true,
                    message: "T???c ????? t???i ??a kh??ng ???????c ????? tr???ng",
                  },
                ]}
               
              >
                <Input placeholder="T???c ????? t???i ??a CPU" />
              </Form.Item>
              <Form.Item
                name="multiplier"
                label="S??? nh??n"
                rules={[
                  {
                    type:"number",
                    min: 1,
                    max: 1000,
                    required: true,           
                  },
                ]}
               
              >
                <InputNumber style={{ width: "100%" }} placeholder="Nh???p s??? nh??n CPU" type="number" />
              </Form.Item>
              <Form.Item
                name="numberOfThread"
                label="S??? lu???ng CPU"
                rules={[
                  {
                    type:"number",
                    min: 1,
                    max: 1000,
                    required: true,   
                  },
                ]}
               
              >
                <InputNumber style={{ width: "100%" }} placeholder="Nh???p s??? lu???ng CPU" type="number" />
              </Form.Item>
              <Form.Item
                name="caching"
                label="B??? nh??? ?????m"
                rules={[
                  {
                    required: true,
                    message: "B??? nh??? ?????m CPU kh??ng ???????c ????? tr???ng",
                  },
                ]}
                
              >
                <Input placeholder="Nh???p b??? nh??? ?????m CPU" />
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
                      danger
                      onClick={() => onChangeIsDraft(false)}
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
                      style={{ width: "80px", marginLeft: "190px" }}
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
            dataSource={processors}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="C???p nh???t b??? x??? l??"
            open={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            okButtonProps={{
              style: {
                display: "none",
              },
            }}
            footer={null}
            width={700}
          >
            <Form
              form={formEdit}
              autoComplete="off"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 10 }}
              onFinish={(values) => {
                setIsUpdate(false);
                handleSubmitUpdate(values, isUpdate);
              }}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Form.Item
                className="mt-2"
                name="cpuCompany"
                label="H??ng CPU"
                initialValue={dataEdit.cpuCompany}
                rules={[
                  {
                    required: true,
                    message: "H??ng CPU kh??ng ???????c ????? tr???ng",
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
                label="C??ng ngh??? CPU"
                initialValue={dataEdit.cpuTechnology}
                rules={[
                  {
                    required: true,
                    message: "C??ng ngh??? CPU kh??ng ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="cpuType"
                label="Lo???i CPU"
                initialValue={dataEdit.cpuType}
                rules={[
                  {
                    required: true,
                    message: "Lo???i CPU kh??ng ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="cpuSpeed"
                label="T???c ????? CPU"
                initialValue={dataEdit.cpuSpeed}
                rules={[
                  {
                    required: true,
                    message: "T???c ????? CPU kh??ng ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="maxSpeed"
                label="T???c ????? t???i ??a CPU"
                initialValue={dataEdit.maxSpeed}
                rules={[
                  {
                    required: true,
                    message: "T???c ????? t???i ??a kh??ng ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="multiplier"
                label="S??? nh??n"
                initialValue={dataEdit.multiplier}
                rules={[
                  {
                    required: true,
                    message: "S??? nh??n CPU kh??ng ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="numberOfThread"
                label="S??? lu???ng CPU"
                initialValue={dataEdit.numberOfThread}
                rules={[
                  {
                    required: true,
                    message: "S??? lu???ng CPU kh??ng ???????c ????? tr???ng",
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="caching"
                label="B??? nh??? ?????m"
                initialValue={dataEdit.caching}
                rules={[
                  {
                    required: true,
                    message: "B??? nh??? ?????m CPU kh??ng ???????c ????? tr???ng",
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
                      style={{ width: "80px", marginLeft: "190px" }}
                    >
                      Hu???
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            // style={{borderRadius:"10px"}}
            title="Hi???n th???"
            open={isView}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
            }}
          >
            <label>
              T??n th??? lo???i
              <span className="text-danger"> *</span>
            </label>
            <Input placeholder="T??n th??? lo???i" />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Processor;
