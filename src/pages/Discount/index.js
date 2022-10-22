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
// import { Formik, Field,Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
import moment from "moment";
import axios from "axios";
import 'toastr/build/toastr.min.css';
import toastrs from "toastr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { Option } = Select;
const { RangePicker } = DatePicker;
const url = 'http://localhost:8080/api/discount';


const Discount = () => {
  const [data, setData] = useState([{
    id:"",
    name:"",
    ratio:null,
    startDate:getDateTime(),
    endDate:getDateTime(),
    active:1,
  }]
  );
  const [formDefault, setValuesDefault] = useState({
    id:"",
    name:"",
    ratio:null,
    startDate:getDateTime(),
    endDate:getDateTime(),
    active:1,
  }
  );
  const [form, setValues] = useState({
    id:"",
    name:"",
    ratio:null,
    startDate:getDateTime(),
    endDate:getDateTime(),
    active:1,
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

  const notifySuccess=(message)=>{
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
  const notifyError=(message)=>{
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
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
         second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
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
      title: "Tỉ lệ (%)",
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
  const getData = () => {
    setLoading(true);
    axios.get(url+`?${qs.stringify(
      getRandomuserParams(tableParams)
    )}`)
      // .then((res) => res.json())
      .then((results ) => {
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
    if(form.ratio<0||form.ratio>100){
      notifyError('Tỉ lệ phải từ 0-100!');
    }else{
      e.preventDefault();
      axios.post(url,form)
        .then(res => {
            notifySuccess('Thêm bản ghi thành công')
            setAdd(false);
            getData();
            setValues(formDefault);
            console.log(res.data);
        }).catch((error)=>{
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
    if(form.ratio<0||form.ratio>100){
      notifyError('Tỉ lệ phải từ 0-100!');
    }else{
      e.preventDefault();
      axios.put(url+"/"+form.id, form)
      .then(res => {
        notifySuccess('Sửa bản ghi thành công')
        getData();
        setEditing(false);
        setValues(formDefault);
        console.log(res.data);
      }).catch((error)=>{
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
      axios.delete(url+"/"+id)
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
  const handle=(e) =>{
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  }
  //onChange Active
  const handleChange =(e) => {
    setValues({...form,
      active:e
    });
    console.log("active",e);
  };

  const handleChangeDate =(val,dateStrings) => {
    setValues({...form,
      startDate:dateStrings[0],
      endDate:dateStrings[1]
    });
  };
  const handleChangeDateSearch =(val,dateStrings)=> {
    if(dateStrings[0]!=null)
    setSearchStartDate(dateStrings[0]);
    if(dateStrings[1]!=null)
    setSearchEndDate(dateStrings[1]);
  };
  const onchangeSearch= (val,dateStrings) => {
    setSearchStartDate(dateStrings[0]);
    setSearchEndDate(dateStrings[1]);
  };

  //Calendar
  const setDates = (val,dateStrings) => {
    console.log(dateStrings);
    if(dateStrings[0]!=null)
    setValues({...form,
      startDate:dateStrings[0]
    });
    if(dateStrings[1]!=null)
    setValues({...form,
      endDate:dateStrings[1]
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
    tableParams.pagination.pageSize = 10;
    setLoading(true);
    axios.get(url+`?${qs.stringify(
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

  

  const clearSearchForm = () => {
    setSearchStartDate(getDateTime());
    setSearchEndDate(getDateTime());
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination.current= 1,
        ...tableParams.pagination.pageSize=10,
        ...tableParams.pagination.searchStartDate="",
        ...tableParams.pagination.searchEndDate=""
      }
    });
    getData();
  }
  const activeItem = (id) => {
    let activeItem = window.confirm('Chuyển trạng thái thành hoạt động?')
    if(activeItem){
      handleConfirmActive(id)
    }
  }
  const handleConfirmActive=(id) =>{
    axios.put(url+"/active/"+id)
      .then(res => {
        notifySuccess('Chuyển trạng thái hoạt động thành công!')
        getData();
        console.log(res.data);
      }
      )
  }

  // const validationSchema=Yup.object({
  //   name: Yup.string()
  //   .max(15, 'Must be 15 characters or less')
  //   .required('Name is required'),
  //   ratio: Yup.number().min(0,"Giá trị thấp nhất là 0").required("Không được để trống").nullable(),
  //   startDate: Yup.date()
  //   .transform(function transformDate(castValue, originalValue) {
  //     return originalValue ? new Date(originalValue) : castValue;
  //   })
  //   .typeError("Thời gian không đúng định dạng")
  //   .required("Không được để trống")
  //   .nullable(),
  //   endDate: Yup.date()
  //   .test(
  //     "is-greater-time",
  //     "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
  //     function (value) {
  //       const { discount } = this.data;
  //       if (discount && value) {
  //         let startDate = moment(discount?.startDate).format("dd-MM-yyyy HH:mm:ss");
  //         let endDate = moment(discount?.endDate).format("dd-MM-yyyy HH:mm:ss");
  //         if (startDate <= endDate) {
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       }
  //       return true;
  //     }
  //   )
  //   .transform(function transformDate(castValue, originalValue) {
  //     return originalValue ? new Date(originalValue) : castValue;
  //   })
  //   .typeError("Thời gian không đúng định dạng")
  //   .required("Không được để trống")
  //   .nullable(),

  //   })
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
            <Space direction="vertical" size={12} style={{width: "472px",borderRadius: "5px" }}>
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

          {/* Add */}
          <div className="row">
            <div className="col-12 mt-4">
              <Button
                className="offset-11 "
                type="primary"
                onClick={showModalAdd}
                style={{ borderRadius: "10px" }}
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
              >
                <div className="form group">
                  <div className="row">
                <div className="col-12 mt-1">
                  <label>Tiêu đề<span className="text-danger"> *</span></label>
                  <Input placeholder="Nhập tiêu đề" 
                  onChange={(e) => handle(e)} name="name" value={form.name} type="text"/>
                </div>
                <div className="col-12 mt-1">
                  <label>Tỉ lệ (%)<span className="text-danger"> *</span></label>
                  <Input placeholder="Nhập tỉ lệ" 
                  onChange={(e) => handle(e)} name="ratio" value={form.ratio} type="number" min="0" max="100"/>
                </div>
                <div className="col-12 mt-1">
                  <label>Thời gian giảm giá<span className="text-danger"> *</span></label>
                  <Space direction="vertical" size={12} style={{width: "472px",borderRadius: "5px" }}>
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
                <div className="col-12 mt-1">
                  <label>Trạng thái<span className="text-danger"> *</span></label>
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
              onChange={(e) => handle(e)} name="name" value={form.name} type="text"/>
            </div>
            <div className="col-12 mt-1">
              <label>Tỉ lệ (%)<span className="text-danger"> *</span></label>
              <Input placeholder="Nhập tỉ lệ" 
              onChange={(e) => handle(e)} name="ratio" value={form.ratio} type="number" min="0" max="100"/>
            </div>
            <div className="col-12 mt-1">
              <label>Thời gian giảm giá<span className="text-danger"> *</span></label>
              <Space direction="vertical" size={12} style={{width: "472px",borderRadius: "5px" }}>
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
            <div className="col-12 mt-1">
              <label>Trạng thái<span className="text-danger"> *</span></label>
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
