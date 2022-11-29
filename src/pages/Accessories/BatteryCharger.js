import { Table, Slider, Select, Input, Button, Modal, DatePicker, Radio, Space } from "antd";
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
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

const onDelete = (record) => {
  Modal.confirm({
    title: "Xoá thể loại",
    content: "Bạn có muón xoá bản ghi này không?",
  });
};

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
  const [category, setCategory] = useState([]);
  const [totalSet, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [data, setData] = useState([{
    id: "",
    batteryType: "",
    battery: "",
    charger: "",
    price: null,
    categoryId: null,
    active: 1,
  }]
  );
  const [formDefault, setValuesDefault] = useState({
    id: "",
    batteryType: "",
    battery: "",
    charger: "",
    price: null,
    categoryId: null,
    active: 1,
  }
  );
  const [form, setValues] = useState({
    id: "",
    batteryType: "",
    battery: "",
    charger: "",
    price: null,
    categoryId: null,
    active: 1,
  }
  );
  //loadParam getList
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
  });
  //phân trang Table
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const loadDataCategory = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/category?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results.data.data);
        setCategory(results.data.data);
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "Loại pin",
      dataIndex: "batteryType",
      sorter: true,
      width: "20%",
    },
    {
      title: "Dung lượng pin",
      dataIndex: "battery",
      sorter: true,
      width: "20%",
    },
    {
      title: "Nguồn cấp",
      dataIndex: "charger",
      sorter: true,
      width: "20%",
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: true,
      render: (price) => `${price}`,
      width: "20%",
    },
    {
      title: "Danh mục",
      dataIndex: "categoryId",
      sorter: true,
      render: (categoryId) => `${categoryId}`,
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
      title: "Thao tác",
      dataIndex: "id",
      width: "20%",
      render: (id) => {
        return (
          <>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onEdit(id);
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

  //APILoadList
  const getData = () => {
    setLoading(true);
    axios.get(url + `/staff/batteryCharger?${qs.stringify(
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
    loadDataCategory();
  }, [JSON.stringify(tableParams)]);

  //OnChange Form
  const handle = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  }


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

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const onEdit = (record) => {
    showModalEdit(record);
    setEditing(true);
  };

  //btn Add
  const handleAdd = (e) => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    submitAdd(e);
    setTimeout(() => {
      setConfirmLoading(false);
    }, 2000);
  };
  function submitAdd(e) {
    if (form.ratio < 0 || form.ratio > 100) {
      notifyError('Tỉ lệ phải từ 0-100!');
    } else {
      e.preventDefault();
      axios.post(url+"/admin/batteryCharger", form)
        .then(res => {
          notifySuccess('Thêm bản ghi thành công')
          // setAdd(false);
          setOpen(false);
          getData();
          setValues(formDefault);
          console.log(res.data);
        }).catch((error) => {
          notifyError('Yêu cầu nhập đủ các trường!');
          return;
        })
    }

  }
  //loadFormEdit
  const showModalEdit = (id) => {
    axios.get(url + "/admin/batteryCharger/" + id)
      .then(res => {
        console.log(res.data.data);
        setValues(res.data.data);
      })
  };

  //btn Edit
  const handleEdit = (e) => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    submitEdit(e);
    setTimeout(() => {
      setConfirmLoading(false);
    }, 2000);
  };
  function submitEdit(e) {
    if (form.ratio < 0 || form.ratio > 100) {
      notifyError('Tỉ lệ phải từ 0-100!');
    } else {
      // e.preventDefault();
      axios.put(url + "/admin/batteryCharger/" + form.id, form)
        .then(res => {
          notifySuccess('Sửa bản ghi thành công')
          getData();
          setEditing(false);
          setValues(formDefault);
          console.log(res.data);
        }).catch((error) => {
          notifyError('Yêu cầu nhập đủ các trường!');
          return;
        })
    }

  }


  //Delete
  const onDelete = (id) => {
    Modal.confirm({
      title: "Xoá giảm giá",
      content: "Bạn có muốn xoá bản ghi này không?",
      onOk() {
        axios.delete(url + "/admin/batteryCharger/" + id)
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
  };
  return (
    <div>
      <ToastContainer />
      {/* <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "150px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-4 mt-4">
          <label>Loại pin</label>
          <Input placeholder="Nhập loại pin" />
        </div>
        <div className="col-4 mt-4">
          <label>Dung lượng pin</label>
          <Input placeholder="Nhập dung lượng pin" />
        </div>
        <div className="col-4 mt-4">
          <label>Power supply</label>
          <Input placeholder="Nhập power supply" />
        </div>
        <div className="col-4 mt-4">
          <label>Giá</label>
          <Input placeholder="Nhập giá" 
          value={form.price}
          // onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="col-4 mt-4">
          <label>Trạng thái</label>
          <br />
          <Select
            style={{ width: "300px", borderRadius: "5px" }}
            showSearch
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="jack">Hoạt động</Option>
            <Option value="lucy">Không hoạt động</Option>
          </Select>
        </div>
        <div className="col-12 text-center ">
        <Button
            className="mt-2"
            type="primary-uotline"
            // onClick={showModal}
            style={{ borderRadius: "10px" }}
          >
          <ReloadOutlined/>Đặt lại
          </Button>
        <Button
            className="mx-2  mt-2"
            type="primary"
            // onClick={showModal}
            style={{ borderRadius: "10px" }}
          >
          <SearchOutlined />Tìm kiếm
          </Button>
        </div>
      </div> */}
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
            onOk={handleAdd}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <div className="col-4 mt-4">
              <label>Loại pin</label>
              <Input placeholder="Nhập loại pin" onChange={(e) => handle(e)} type="text" name="batteryType" value={form.batteryType}/>
            </div>
            <div className="col-4 mt-4">
              <label>Dung lượng pin</label>
              <Input placeholder="Nhập dung lượng pin" onChange={(e) => handle(e)} type="text" name="battery" value={form.battery}/>
            </div>
            <div className="col-4 mt-4">
              <label>Power supply</label>
              <Input placeholder="Nhập power supply" onChange={(e) => handle(e)} type="text" name="charger" value={form.charger}/>
            </div>
            <div className="col-4 mt-4">
              <label>Giá</label>
              <Input placeholder="Nhập giá" 
              name="price"
              value={form.price}
              onChange={(e) => handle(e)}
              />
            </div>
            <div className="col-4 mt-4">
            <label>
              Thể loại
              <span className="text-danger me-2"> * </span>
            </label>
            <br />
            <select
              className="form-select"
              name="categoryId"
              value={form.categoryId}
              onChange={(e) => handle(e)}
            >
              {category.map((cate) => (
                <option key={cate.id} value={cate.id}>
                  {cate.name}
                </option>
              ))}
            </select>
          </div>
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
            //rowKey={(record) => console.log('record',record)}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
          <Modal
            title="Cập nhật"
            visible={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            onOk={(e) => {
              handleEdit(e);
              setEditing(false);
            }}
          >
            <div className="col-4 mt-4">
              <label>Loại pin</label>
              <Input placeholder="Nhập loại pin" onChange={(e) => handle(e)} type="text" name="batteryType" value={form.batteryType}/>
            </div>
            <div className="col-4 mt-4">
              <label>Dung lượng pin</label>
              <Input placeholder="Nhập dung lượng pin" onChange={(e) => handle(e)} type="text" name="battery" value={form.battery}/>
            </div>
            <div className="col-4 mt-4">
              <label>Power supply</label>
              <Input placeholder="Nhập power supply" onChange={(e) => handle(e)} type="text" name="charger" value={form.charger}/>
            </div>
            <div className="col-4 mt-4">
              <label>Giá</label>
              <Input placeholder="Nhập giá" 
              name="price"
              value={form.price}
              onChange={(e) => handle(e)}
              />
            </div>
            <div className="col-4 mt-4">
            <label>
              Thể loại
              <span className="text-danger me-2"> * </span>
            </label>
            <br />
            <select
              className="form-select"
              name="categoryId"
              value={form.categoryId}
              onChange={(e) => handle(e)}
            >
              {category.map((cate) => (
                <option key={cate.id} value={cate.id}>
                  {cate.name}
                </option>
              ))}
            </select>
          </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default BatteryCharger;