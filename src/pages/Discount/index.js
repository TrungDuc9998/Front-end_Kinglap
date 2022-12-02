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
const { Option } = Select;
const { RangePicker } = DatePicker;
const url = 'http://localhost:8080/api/discount';
const urlStaff = 'http://localhost:8080/api/staff/discount';
const urlAdmin = 'http://localhost:8080/api/admin/discount';
const url_Pro = 'http://localhost:8080/api/products';

export function compareTime(endDate) {
  const now = new Date();
  if (new Date(endDate) > now) {
    return 1
  }
  return 0
}

const Discount = () => {
  const [data, setData] = useState([{
    id: "",
    name: "",
    ratio: null,
    startDate: getDateTime(),
    endDate: getDateTime(),
    active: 1,
  }]
  );
  const [formDefault, setValuesDefault] = useState({
    id: "",
    name: "",
    ratio: null,
    startDate: getDateTime(),
    endDate: getDateTime(),
    active: 1,
  }
  );
  const [form, setValues] = useState({
    id: "",
    name: "",
    ratio: null,
    startDate: getDateTime(),
    endDate: getDateTime(),
    active: 1,
  }
  );
  const [totalSet, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [isAdd, setAdd] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchStartDate, setSearchStartDate] = useState(getDateTime());
  const [searchEndDate, setSearchEndDate] = useState(getDateTime());
  const [modalText, setModalText] = useState("Content of the modal");
  const [dataProduct, setDataProduct] = useState();
  const [dataDiscount, setDataDiscount] = useState();
  const [checked, setChecked] = useState([]);

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

  function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
      month = '0' + month;
    }
    if (day.toString().length == 1) {
      day = '0' + day;
    }
    if (hour.toString().length == 1) {
      hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
      minute = '0' + minute;
    }
    if (second.toString().length == 1) {
      second = '0' + second;
    }
    var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
  }
  //loadParam getList
  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchStartDate: params.pagination?.searchStartDate,
    searchEndDate: params.pagination?.searchEndDate,
  });
  //phân trang Table
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      searchStartDate: "",
      searchEndDate: ""
    },
  });

  // Call API product 
  const handAPIProduct = () => {
    axios.get(url_Pro + "/all").then((res) => {
      console.log(res.data);
      setDataProduct(res.data);
    });
    setView(true);
  }

  // Call API Product
  const showDataProduct = (id) => {
    console.log(id);

    axios.get(url + "/" + id).then((res) => {
      console.log(">>>>>>>>>", res.data);
      setDataDiscount(res.data);
    });
    handAPIProduct()
  }

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "name",
      sorter: true,
      render: (name) => `${name}`,
      width: "20%",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      sorter: true,
      render(startDate) {
        return (
          <Moment format="DD-MM-YYYY HH:mm:ss">
            {startDate}
          </Moment>
        );
      },
      width: "20%",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      sorter: true,
      render(endDate) {
        return (
          <Moment format="DD-MM-YYYY HH:mm:ss">
            {endDate}
          </Moment>
        );
      },
      width: "20%",
    },
    {
      title: "Tỉ lệ (%)",
      dataIndex: "ratio",
      sorter: true,
      render: (ratio) => `${ratio}`,
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      with: "35%",
      render: (active) => {
        return (
          <>
            {active == 1 && (
              <div
                className="bg-success text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "5px" }}
              >
                Hoạt động
              </div>
            )}
            {active == 0 && (
              <div
                className="bg-secondary text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "5px" }}
              >
                Không hoạt động
              </div>
            )}
            {active == 2 && (
              <div
                className="bg-danger text-center text-light"
                style={{ width: "150px", borderRadius: "5px", padding: "5px" }}
              >
                Nháp
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      width: "15%",
      render: (id, data) => {
        if (data.active == 2) {
          return (
            <>
              <UnlockOutlined
                className="mt-2"
                type="dashed"
                onClick={() => activeItem(id, data)}
                style={{ borderRadius: "10px" }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalEdit(id);
                }}
              />
              <DeleteOutlined
                onClick={() => onDelete(id)}
                style={{ color: "red", marginLeft: 12 }}
              />
            </>
          );
        } else if (data.active == 1 || data.active == 0) {
          return (
            <>
              <UnlockOutlined
                className="mt-2"
                type="dashed"
                onClick={() => activeItem(id, data)}
                style={{ borderRadius: "10px" }}
              />
              <EditOutlined
                style={{ marginLeft: 12 }}
                onClick={() => {
                  showModalEdit(id);
                }}
              />
            </>
          )
        }
      },
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      width: "10%",
      render: (id, data) => {
        if (data.active == 1) {
          return (
            <Button type="danger" style={{ borderRadius: "7px" }} onClick={() => { showDataProduct(id) }}>Áp dụng</Button>
          )
        }
      }
    }
  ];

  //APILoadList
  const getData = () => {
    setLoading(true);
    axios.get(url + `?${qs.stringify(
      getRandomuserParams(tableParams)
    )}`)
      // .then((res) => res.json())
      .then((results) => {
        results.data.data.data.forEach((x) => {
          x.active = x.active === 2 ? x.active : compareTime(x.endDate)
        })
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

  const showModalAdd = () => {
    setAdd(true);
  };
  //loadFormEdit
  const showModalEdit = (id) => {
    axios.get(urlStaff + "/" + id)
      .then(res => {
        console.log(res.data.data);
        setValues(res.data.data);
      })
    setEditing(true);
  };

  const onView = (record) => {
    setView(true);
  };

  const draft = () => {
    axios.post(urlStaff + "/draft", form)
      .then(res => {
        notifySuccess('Lưu bản nháp thành công!')
        setAdd(false);
        getData();
        setValues(formDefault);
        console.log(res.data);
      })
  }

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
      axios.post(urlStaff, form)
        .then(res => {
          notifySuccess('Thêm bản ghi thành công')
          setAdd(false);
          getData();
          setValues(formDefault);
          console.log(res.data);
        }).catch((error) => {
          notifyError('Yêu cầu nhập đủ các trường!');
          return;
        })
    }

  }

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
      e.preventDefault();
      axios.put(urlStaff + "/" + form.id, form)
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
        axios.delete(urlAdmin + "/" + id)
          .then(res => {
            notifySuccess('Xóa bản ghi thành công!')
            getData();
            console.log(res.data);
          }).catch((errorMessage) => {
            notifyError('Chỉ xóa bản nháp!');
            return;
          })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  //OnChange Form
  const handle = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  }
  //onChange Active
  const handleChange = (e) => {
    setValues({
      ...form,
      active: e
    });
    console.log("active", e);
  };

  const handleChangeDate = (val, dateStrings) => {
    setValues({
      ...form,
      startDate: dateStrings[0],
      endDate: dateStrings[1]
    });
  };
  const handleChangeDateSearch = (val, dateStrings) => {
    if (dateStrings[0] != null)
      setSearchStartDate(dateStrings[0]);
    if (dateStrings[1] != null)
      setSearchEndDate(dateStrings[1]);
  };
  const onchangeSearch = (val, dateStrings) => {
    setSearchStartDate(dateStrings[0]);
    setSearchEndDate(dateStrings[1]);
  };

  //Calendar
  const setDates = (val, dateStrings) => {
    console.log(dateStrings);
    if (dateStrings[0] != null)
      setValues({
        ...form,
        startDate: dateStrings[0]
      });
    if (dateStrings[1] != null)
      setValues({
        ...form,
        endDate: dateStrings[1]
      });
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setAdd(false);
    setEditing(false);
    setValues(formDefault);
    setView(false);
  };


  //search
  const search = () => {
    tableParams.pagination.searchStartDate = searchStartDate;
    tableParams.pagination.searchEndDate = searchEndDate;
    tableParams.pagination.current = 1;
    tableParams.pagination.pageSize = 10;
    setLoading(true);
    axios.get(url + `?${qs.stringify(
      getRandomuserParams(tableParams)
    )}`)
      // .then((res) => res.json())
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
  }

  // Call API DiscountProduct
  const handDiscountProduct = () => {
    const checkbox1 = document.querySelectorAll('input[name="checkbox');
    checkbox1.forEach((checkbox) => {
      if (checkbox.checked == true) {
        checked.push(checkbox.value);
      }
      setChecked(checked);
    })
    console.log(checked);

    axios.put(url_Pro + "/discountProduct/" + dataDiscount.data.id,
      checked
    ).then((res) => {
      console.log(">>>>>>>>>DiscountProduct", res.data);
      setDataDiscount(res.data);
      handAPIProduct();
      handleCancel()
    });
  }

  const clearSearchForm = () => {
    setSearchStartDate(getDateTime());
    setSearchEndDate(getDateTime());
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination.current = 1,
        ...tableParams.pagination.pageSize = 10,
        ...tableParams.pagination.searchStartDate = "",
        ...tableParams.pagination.searchEndDate = ""
      }
    });
    getData();
  }
  const activeItem = (id, data) => {
    Modal.confirm({
      title: "Chuyển trạng thái",
      content: "Bạn có muốn chuyển trạng thái",
      onOk() {
        handleConfirmActive(id, data)
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }
  const handleConfirmActive = (id, data) => {
    if (data.active == 0 || data.active == 2) {
      axios.put(urlAdmin + "/active/" + id)
        .then(res => {
          notifySuccess('Chuyển trạng thái hoạt động thành công!')
          getData();
          console.log(res.data);
        }
        )
    } else if (data.active == 1) {
      axios.put(urlAdmin + "/inactive/" + id)
        .then(res => {
          notifySuccess('Chuyển trạng thái không hoạt động thành công!')
          getData();
          console.log(res.data);
        }
        )
    }
  }
  return (
    <div>
      <ToastContainer />
      <div className="row">
        <div className="col-12 mt-4">
          <div
            className="row"
            style={{
              borderRadius: "20px",
              height: "150px",
              border: "1px solid #d9d9d9",
              background: "#fafafa",
            }}
          >

            <div className="col-4 mt-3">
              <label>Từ khoá</label>
              <Input type="text" name="searchName" value={data.name} placeholder="Nhập tên tài khoản người dùng" onChange={onchangeSearch} />
            </div>

            <div className="col-4 mt-3 ">
              <label>Thời gian</label>
              <Space direction="vertical" size={12} style={{ width: "472px", borderRadius: "5px" }}>
                <RangePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format={"yyyy-MM-DD HH:mm:ss"}
                  onChange={onchangeSearch}
                  onCalendarChange={handleChangeDateSearch}
                  value={[moment(searchStartDate, "yyyy-MM-DD HH:mm:ss"), moment(searchEndDate, "yyyy-MM-DD HH:mm:ss")]}
                  type="datetime"
                />
              </Space>
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

          {/* Modal Áp dụng mã giảm giá */}
          <Modal
            title="Áp dụng mã giảm giá"
            visible={isView}
            // onOk={handleAdd}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel} style={{ borderRadius: "7px" }}>
                Hủy
              </Button>,
              <Button type="danger" onClick={handDiscountProduct}
                style={{ borderRadius: "7px" }}>
                Áp dụng
              </Button>
            ]}
          >
            {/* console.log(id); */}
            <div className="row">
              <div className="col-12">
                {/* <h1>abc{dataDiscount?.id}</h1> */}
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Tên sản phẩm</th>
                      <th scope="col">Giá tiền</th>
                      <th scope="col">Số lượng</th>
                      <th scope="col">Mã máy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataProduct?.map((item, index) => {
                      // console.log("ratio", id);
                      return (
                        <tr key={index}>
                          <td><input type={"checkbox"} name="checkbox" value={item.id} ></input></td>
                          <td>{item.name}</td>
                          <td>{item.price}</td>
                          <td>{item.quantity}</td>
                          <td>{item.imei}</td>
                          {/* <td>{item.price - (item.price * item.discount)}</td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Modal>


          {/* Add */}
          <div className="row">
            <div className="col-12 mt-4">
              <Button
                className="offset-11 "
                type="primary"
                onClick={showModalAdd}
                style={{ borderRadius: "5px" }}
              >
                <PlusOutlined />
                Thêm mới
              </Button>

              <Modal
                title="Tạo mới"
                visible={isAdd}
                onOk={handleAdd}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={[
                  <Button key="back" onClick={handleCancel}>
                    Hủy
                  </Button>,
                  <Button type="danger" onClick={draft}>
                    Nháp
                  </Button>,
                  <Button key="submit" type="primary" loading={loading} onClick={handleAdd}>
                    Thêm mới
                  </Button>,
                ]}
              >
                <div className="form group">
                  <div className="row">
                    <div className="col-12 mt-1">
                      <label>Tiêu đề<span className="text-danger"> *</span></label>
                      <Input placeholder="Nhập tiêu đề"
                        onChange={(e) => handle(e)} name="name" value={form.name} type="text" />
                    </div>
                    <div className="col-12 mt-1">
                      <label>Tỉ lệ (%)<span className="text-danger"> *</span></label>
                      <Input placeholder="Nhập tỉ lệ"
                        onChange={(e) => handle(e)} name="ratio" value={form.ratio} type="number" min="0" max="100" />
                    </div>
                    <div className="col-12 mt-1">
                      <label>Thời gian giảm giá<span className="text-danger"> *</span></label>
                      <Space direction="vertical" size={12} style={{ width: "472px", borderRadius: "5px" }}>
                        <RangePicker
                          showTime={{ format: 'HH:mm:ss' }}
                          format={"yyyy-MM-DD HH:mm:ss"}
                          onChange={handleChangeDate}
                          onCalendarChange={setDates}
                          value={[moment(form.startDate, "yyyy-MM-DD HH:mm:ss"), moment(form.endDate, "yyyy-MM-DD HH:mm:ss")]}
                          type="datetime"
                        />
                      </Space>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>

          </div>
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

          {/* Edit */}

          <Modal
            title="Cập nhật"
            visible={isEditing}
            onOk={handleEdit}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <div className="form group">
              <div className="row">
                <div className="col-12 mt-1">
                  <label>Tiêu đề<span className="text-danger"> *</span></label>
                  <Input placeholder="Nhập tiêu đề"
                    onChange={(e) => handle(e)} name="name" value={form.name} type="text" />
                </div>
                <div className="col-12 mt-1">
                  <label>Tỉ lệ (%)<span className="text-danger"> *</span></label>
                  <Input placeholder="Nhập tỉ lệ"
                    onChange={(e) => handle(e)} name="ratio" value={form.ratio} type="number" min="0" max="100" />
                </div>
                <div className="col-12 mt-1">
                  <label>Thời gian giảm giá<span className="text-danger"> *</span></label>
                  <Space direction="vertical" size={12} style={{ width: "472px", borderRadius: "5px" }}>
                    <RangePicker
                      showTime={{ format: 'HH:mm:ss' }}
                      format={"yyyy-MM-DD HH:mm:ss"}
                      onChange={handleChangeDate}
                      onCalendarChange={setDates}
                      value={[moment(form.startDate, "yyyy-MM-DD HH:mm:ss"), moment(form.endDate, "yyyy-MM-DD HH:mm:ss")]}
                      type="datetime"
                    />
                  </Space>
                </div>
              </div>

            </div>
          </Modal>


        </div>
      </div>
    </div>
  );
};

export default Discount;