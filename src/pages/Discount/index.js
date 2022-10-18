import { Table, Slider, Select, Input, Button, Modal, DatePicker, Radio, Space } from "antd";
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
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
import { Formik, Field,Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import moment from "moment";
import axios from "axios";
const { Option } = Select;
const { RangePicker } = DatePicker;
const url = 'http://localhost:8080/api/discount';


const Discount = () => {
  const [data, setData] = useState([{
    id:"",
    name:"",
    ratio:null,
    startDate:Date.now(),
    endDate:Date.now(),
    active:1,
  }]
  );
  const [formDefault, setValuesDefault] = useState({
    id:"",
    name:"",
    ratio:null,
    startDate:"2021-09-09 09:09:09",
    endDate:"2021-09-09 10:09:09",
    active:null,
  }
  );
  const [form, setValues] = useState({
    id:"",
    name:"",
    ratio:null,
    startDate:"2021-09-09 09:09:09",
    endDate:"2021-09-09 10:09:09",
    active:null,
  }
  );
  const [totalSet, setTotal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [isAdd, setAdd] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [modalText, setModalText] = useState("Content of the modal");
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
      searchStartDate:"",
      searchEndDate:""
    },
  });


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
      render: (startDate) => `${startDate}`,
      width: "20%",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      sorter: true,
      render: (endDate) => `${endDate}`,
      width: "20%",
    },
    {
      title: "Tỉ lệ",
      dataIndex: "ratio",
      sorter: true,
      render: (ratio) => `${ratio}`, 
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      with: "30%",
      render: (active) => {
        return (
          <>
            {active==1&& (
              <div
              className="bg-success text-center text-light"
              style={{ width: "100px", borderRadius: "5px" }}
            >
              Hoạt động
            </div>
            )}
            {active==0&& (
              <div
              className="bg-warning text-center text-light"
              style={{ width: "100px", borderRadius: "5px" }}
            >
              Không hoạt động
            </div>
            )}
            {active==2&& (
              <div
              className="bg-info text-center text-light"
              style={{ width: "100px", borderRadius: "5px" }}
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
      width: "30%",
      render: (id) => {
        return (
          <>
             {/* <EyeOutlined
              onClick={() => {
                // onView(record);
                console.log({id});
              }}
            /> */}
            <Button
              className="mt-2"
              type="dashed"
              onClick={() => activeItem(id)}
              style={{ borderRadius: "10px" }}
            >
            <ReloadOutlined />
            Active
          </Button>
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
      },
    },
  ];

  //APILoadList
  const fetchData = () => {
    setLoading(true);
    fetch(
      url+`?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results ) => {
        setData(results.data.data);
        setTotal(results.data.total);
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
    fetchData();
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
    axios.get(url+"/"+id)
      .then(res => {
        console.log(res.data.data);
        setValues(res.data.data);
      })
    setEditing(true);
  };

  const onView = (record) => {
    setView(true);
  };
  // const showModalEdit = () => {
  //   setEditing(true);
  // };


  const draft=()=>{
    axios.post(url+"/draft",form)
      .then(res => {
        window.alert('Save draft success!')
        fetchData();
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
      setAdd(false);
      setConfirmLoading(false);
    }, 2000);
  };
  function submitAdd(e) {
    e.preventDefault();
    axios.post(url,form)
      .then(res => {
          window.alert('Add success!')
          fetchData();
          setValues(formDefault);
          console.log(res.data);
      }).catch((error)=>{
        window.alert('Add fail!');
        return;
      })
  }

  //btn Edit
  const handleEdit = (e) => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    submitEdit(e);
    setTimeout(() => {
      setAdd(false);
      setConfirmLoading(false);
    }, 2000);
  };
  function submitEdit(e) {
      e.preventDefault();
      axios.put(url+"/"+form.id, form)
      .then(res => {
        window.alert('Edit success!')
        fetchData();
        setEditing(false);
        setValues(formDefault);
        console.log(res.data);
      }).catch((error)=>{
        window.alert('Edit fail!');
        return;
      })
    
  }

  //Delete
const onDelete = (id) => {
  Modal.confirm({
    title: "Xoá giảm giá",
    content: "Bạn có muốn xoá bản ghi này không?",
    onOk() {
      axios.delete(url+"/"+id)
      .then(res => {
        window.alert('Delete success!')
        fetchData();
        console.log(res.data);
      }).catch((errorMessage) => {
        window.alert('Delete fail!');
        return;
      })
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

  //OnChange Form
  const handle=(e) =>{
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  }
  //onChange Active
  const handleChange =(e) => {
    setValues({...form,
      active:e.value
    });
  };

  const handleChangeDate =(e) => {
    setValues({...form,
      startDate:e[0]._d,
      endDate:e[1]._d
    });
  };
  // const handleChangeDateSearch =(e) => {
  //   setSearchStartDate(e[0]._d);
  //   setSearchEndDate(e[1]._d);
  // };

  //Calendar
  const setDates = (val) => {
    console.log(val);
    if(val[0]!=null)
    setValues({...form,
      startDate:val[0]._d
    });
    if(val[1]!=null)
    setValues({...form,
      endDate:val[1]._d
    });
  };
  // const setDatesSearch = (e) => {
  //   console.log(e);
  //   if(e[0]!="")
  //   setSearchStartDate(e[0]._d);
  //   if(e[1]!="")
  //   setSearchEndDate(e[1]._d);
  // };
 
  

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setAdd(false);
    setEditing(false);
    setValues(formDefault);
  };

  //search
  const search = () => {
    tableParams.pagination.searchStartDate = searchStartDate;
    tableParams.pagination.searchEndDate = searchEndDate;
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/discount?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        setTotal(results.data.total);
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

  const changeSearchStartDate= (event) => {
    setSearchStartDate(event.target.value);
  };
  const changeSearchEndDate= (event) => {
    setSearchEndDate(event.target.value);
  };

  const clearSearchForm = () => {
    setSearchStartDate("");
    setSearchEndDate("");
  }
  const activeItem = id => {
    let activeItem = window.confirm('Active item?')
    if(activeItem){
      handleConfirmActive(id)
    }
  }
  function handleConfirmActive(id) {
    axios.put(url+"/active/"+id)
      .then(res => {
        window.alert('Active success!')
        fetchData();
        console.log(res.data);
      })
  }

  const validationSchema=Yup.object({
    name: Yup.string()
    .max(15, 'Must be 15 characters or less')
    .required('Name is required'),
    ratio: Yup.number().min(0,"Giá trị thấp nhất là 0").required("Không được để trống").nullable(),
    startDate: Yup.date()
    .transform(function transformDate(castValue, originalValue) {
      return originalValue ? new Date(originalValue) : castValue;
    })
    .typeError("Thời gian không đúng định dạng")
    .required("Không được để trống")
    .nullable(),
    endDate: Yup.date()
    .test(
      "is-greater-time",
      "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
      function (value) {
        const { discount } = this.data;
        if (discount && value) {
          let startDate = moment(discount?.startDate).format("dd-MM-yyyy HH:mm:ss");
          let endDate = moment(discount?.endDate).format("dd-MM-yyyy HH:mm:ss");
          if (startDate <= endDate) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      }
    )
    .transform(function transformDate(castValue, originalValue) {
      return originalValue ? new Date(originalValue) : castValue;
    })
    .typeError("Thời gian không đúng định dạng")
    .required("Không được để trống")
    .nullable(),

    })
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
          <Formik
            initialValues={data}
            validationSchema={validationSchema}
            enableReinitialize
            
            onChange={onChange}
            // onSubmit={data ? submitFormEdit : submitFormAdd}
            
            >{({ errors, status, touched }) => (
              <Form>
                <div className="row">
                <div className="row">
                  <div className="col-6 mt-4">
                    <label>Tiêu đề</label>
                    <br></br>
                    <Field  style={{width: "300px", borderRadius: "5px" }} placeholder="Nhập tiêu đề"  name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} value={data.name=== null ? "" :data.name} onChange={onChange}/>
                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                  </div>
                  <div className="col-xl-6 col-12 mt-4">
                    <label>Thời gian giảm giá: </label>
                    <br></br>
                    <Space direction="vertical" size={12}  style={{width: "300px", borderRadius: "5px" }}>
                      <RangePicker
                        size={"middle"}
                        showTime={{ format: 'HH:mm:ss' }}
                        name=""
                        //defaultValue={[moment(new Date(), "yyyy/MM/DD HH:mm:ss"), moment(new Date(), "yyyy/MM/DD HH:mm:ss")]}
                        format={"yyyy/MM/DD HH:mm:ss"}
                        onChange={onChangeDate}
                        onOk={onOk}
                      />
                    </Space>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mt-4">
                    <label>Tỉ lệ</label>
                    <br></br>
                    <Input  style={{width: "300px", borderRadius: "5px" }} placeholder="Nhập tỉ lệ" name="ratio" type="text" className={'form-control' + (errors.ratio && touched.ratio ? ' is-invalid' : '')} value={data.ratio=== null ? "" :data.ratio} onChange={onChange}/>
                  </div>
                  <div className="col-xl-6 col-12 mt-4">
                    <label>Trạng thái</label>
                    <br />
                    <Select
                      style={{width: "300px", borderRadius: "5px" }}
                      showSearch
                      placeholder="Chọn trạng thái"
                      optionFilterProp="children"
                      name="active" type="text" 
                      // className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} 
                      value={data.active=== null ? "" :data.active} onChange={onChange}
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Option value="1">Hoạt động</Option>
                      <Option value="0">Không hoạt động</Option>
                    </Select>
                  </div>
                </div>
                
                
              </div>
              <div className="row">
                  <div className="col-12 text-center ">
                    <Button
                      className="mt-2 mb-2"
                      type="primary-uotline"
                      // onClick={showModal}
                      style={{ borderRadius: "10px" }}
                    >
                    <ReloadOutlined/>Đặt lại
                    </Button>
                    <Button
                      className="mt-2 mb-2"
                      type="primary-success"
                      onClick={showModal}
                      style={{ borderRadius: "10px" }}
                    >
                    Save
                    </Button>
                  <Button
                      className="mx-2  mt-2 mb-2"
                      type="primary"
                      // onClick={showModal}
                      style={{ borderRadius: "10px" }}
                    >
                    <SearchOutlined />Tìm kiếm
                    </Button>
                  </div>
              </div>
              
              </Form>
          )}
          </Formik>
      </div> */}


        
      <div className="row">
        <div className="col-12 mt-4">
          {/* Add */}
          <Button
            className="offset-12 "
            type="primary"
            onClick={showModalAdd}
            style={{ borderRadius: "10px" }}
          >
            <PlusOutlined /> Thêm mới
          </Button>
          <div className="col-4 mt-3">
            <label>Từ khoá</label>
            {/* <Space direction="vertical" size={12} style={{width: "472px",borderRadius: "5px" }}>
                <RangePicker
                showTime={{ format: 'HH:mm:ss' }}
                format={"yyyy/MM/DD HH:mm:ss"}
                onChange={(e) => handleChangeDateSearch(e)} 
                onCalendarChange={(val) => setDatesSearch(val)}
                value={[moment(searchStartDate, "yyyy/MM/DD HH:mm:ss"), moment(searchEndDate, "yyyy/MM/DD HH:mm:ss")]}
                type="datetime"
                />
            </Space> */}
            <Input type="text" name="searchStartDate" value={searchStartDate} placeholder="Nhập ngày bắt đầu" onChange={changeSearchStartDate} />
            <Input type="text" name="searchEndDate" value={searchEndDate} placeholder="Nhập ngày kết thúc" onChange={changeSearchEndDate} />
          </div>
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
          <Modal
            title="Tạo mới"
            open={isAdd}
            onOk={handleAdd}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <div className="form group">
              <div className="row">
            <div className="col-12 mt-4">
              <label>Tiêu đề<span className="text-danger"> *</span></label>
              <br></br>
              <Input placeholder="Nhập tiêu đề" 
              onChange={(e) => handle(e)} name="name" value={form.name} type="text"/>
            </div>
            <div className="col-12 mt-4">
              <label>Tỉ lệ<span className="text-danger"> *</span></label>
              <br></br>
              <Input placeholder="Nhập tỉ lệ" 
              onChange={(e) => handle(e)} name="ratio" value={form.ratio} type="number" min="0" max="100"/>
            </div>
            <div className="col-12 mt-4">
              <label>Thời gian giảm giá<span className="text-danger"> *</span></label>
              <br></br>
              <Space direction="vertical" size={12} style={{width: "472px",borderRadius: "5px" }}>
                <RangePicker
                showTime={{ format: 'HH:mm:ss' }}
                //defaultValue={[moment(form.startDate, "yyyy/MM/DD HH:mm:ss"), moment(form.endDate, "yyyy/MM/DD HH:mm:ss")]}
                format={"yyyy/MM/DD HH:mm:ss"}
                onChange={(e) => handleChangeDate(e)} 
                // name={["startDate", "endDate"]} 
                onCalendarChange={(val) => setDates(val)}
                value={[moment(form.startDate, "yyyy/MM/DD HH:mm:ss"), moment(form.endDate, "yyyy/MM/DD HH:mm:ss")]}
                type="datetime"
                />
              </Space>
            </div>
            <div className="col-12 mt-4">
              <label>Trạng thái<span className="text-danger"> *</span></label>
              <br />
              <Select
                style={{width: "472px",borderRadius: "5px" }}
                showSearch
                placeholder="Chọn trạng thái"
                optionFilterProp="children"
                onChange={(e) => handleChange(e)} name="active" value={form.active}
                // onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value={1}>Hoạt động</Option>
                <Option value={0}>Không hoạt động</Option>
              </Select>
            </div>
          </div>
          <Button
              className="mt-2"
              onClick={() => draft()}
              style={{ borderRadius: "10px" }}
            >
            <ReloadOutlined />
            Nháp
          </Button>
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
            rowKey={(record) => console.log('record',record)}
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
            <div className="col-12 mt-4">
              <label>Tiêu đề<span className="text-danger"> *</span></label>
              <br></br>
              <Input placeholder="Nhập tiêu đề" 
              onChange={(e) => handle(e)} name="name" value={form.name} type="text"/>
            </div>
            <div className="col-12 mt-4">
              <label>Tỉ lệ<span className="text-danger"> *</span></label>
              <br></br>
              <Input placeholder="Nhập tỉ lệ" 
              onChange={(e) => handle(e)} name="ratio" value={form.ratio} type="number" min="0" max="100"/>
            </div>
            <div className="col-12 mt-4">
              <label>Thời gian giảm giá<span className="text-danger"> *</span></label>
              <br></br>
              <Space direction="vertical" style={{width: "472px",borderRadius: "5px" }}>
                <RangePicker
                showTime={{ format: 'HH:mm:ss' }}
                //defaultValue={[moment(form.startDate, "yyyy/MM/DD HH:mm:ss"), moment(form.endDate, "yyyy/MM/DD HH:mm:ss")]}
                format={"yyyy-MM-DD HH:mm:ss"}
                onChange={(e) => handleChangeDate(e)} 
                // name={["startDate", "endDate"]} 
                onCalendarChange={(val) => setDates(val)}
                value={[moment(form.startDate, "yyyy-MM-DD HH:mm:ss"), moment(form.endDate, "yyyy-MM-DD HH:mm:ss")]}
                type="datetime"
                />
              </Space>
            </div>
            <div className="col-12 mt-4">
              <label>Trạng thái<span className="text-danger"> *</span></label>
              <br />
              <Select
                style={{width: "472px", borderRadius: "5px" }}
                showSearch
                placeholder="Chọn trạng thái"
                optionFilterProp="children"
                onChange={(e) => handleChange(e)} name="active" value={form.active}
                // onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value={1}>Hoạt động</Option>
                <Option value={0}>Không hoạt động</Option>
                <Option value={2}>Nháp</Option>
              </Select>
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
