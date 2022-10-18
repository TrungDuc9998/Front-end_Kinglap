import { Table, Slider, Select, Input, Button, Modal } from "antd";
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
import CategoryServices from "../../services/Category.services";
import axios from "axios";
import { Pagination } from 'antd';
import { useParams } from "react-router-dom";
import { Toast } from "bootstrap";
const { Option } = Select;


const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});


const Category = () => {
  const [employees, setEmployees] = useState([]);
  const init = () => {
    CategoryServices.getAll()
      .then(response => {
        setEmployees(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.log('Something went wrong', error);
      })
  }
  useEffect(() => {
    init();
  }, []);
  const url = 'http://localhost:8080/api/category';
  const [data, setData] = useState({
    id: "",
    name: "",
    active: 1,
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isView, setView] = useState(false);
  const [searchName, setSearchName] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const [name, setName] = useState();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [rs, setrs] = useState({
    id: "",
    name: "",
    createdAt: "",
    updatedAt: Date.now(),
    active: 1,
  })
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: '',
      search2: '',
    },
  });

  const onChange = (value) => {
    setSearchStatus(value);
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

  const handleOk = (e) => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    submit(e);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleupdateOk = (e) => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    submitupdate(e);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const submitupdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/api/category/${rs.id}`, {
      id: rs.id,
      name: rs.name,
      createdAt: rs.createdAt,
      updatedAt: rs.updatedAt,
      active: 1,
    })

      .then(res => {
        init();
        console.log(res.rs);
      })
  }

  function handle(e) {
    const newdata = { ...data }
    newdata[e.target.id] = e.target.value
    setData(newdata)
    console.log(newdata)
  }

  function handleupdate(e, id) {
    const newdata = { ...rs }
    newdata[e.target.id] = e.target.value
    setrs(newdata)
    console.log(newdata)
  }

  function submit(e) {
    e.preventDefault();
    axios.post(url, {
      id: data.id,
      name: data.name,
      active: 1,
    })

      .then(res => {
        init();
        console.log(res.data);
      })
  }

  const onEdit = (e, id) => {
    console.log(id);
    fetch(`http://localhost:8080/api/category/${id}`)
      .then(resposne => resposne.json())
      .then(res => setrs(res))
    setEditing(true);
  };

  const onView = (record) => {
    setView(true);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };


  const search = () => {
    tableParams.pagination.search1 = searchName;
    if (searchStatus) {
      tableParams.pagination.search2 = searchStatus;
    }
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/category?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setEmployees(results.data.data)
        setData(results.data.data);
        setLoading(false);
        // setTableParams({
        //   pagination: {
        //     current: results.data.current_page,
        //     pageSize: 10,
        //     total: results.data.total,
        //   },
        // });
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          }
        })
      });
  }

  const changeSearchName = (event) => {
    setSearchName(event.target.value);
  };

  // useEffect(() => {
  //   getPage()
  // }, [])

  const onDelete = (e, id) => {
    e.preventDefault();
    console.log(id);
    <Modal
      // open={open}
      onOk1={axios.delete(`http://localhost:8080/api/category/${id}`)
        .then(res => {
          init();
          console.log(res.data);
        })}
      // confirmLoading={confirmLoading}
      onCancel1={setOpen(false)}
    >
      {Modal.confirm({
        title: "Xoá thể loại",
        content: "Bạn có muón xoá bản ghi này không?",
      })}
    </Modal>
  };
  return (
    <div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "150px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="col-4 mt-4">
          <label>Tên thể loại</label>
          {/* <Input placeholder="Nhập tên thể loại" name="name" value={name} onChange={changeUsername} /> */}
          <Input type="text" name="searcName" value={searchName} placeholder="Nhập tên thể loại" onChange={changeSearchName} />
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
            <Option value="1" >Hoạt động</Option>
            <Option value="0">Không hoạt động</Option>
          </Select>
        </div>
        <div className="col-12 text-center ">
          <Button
            className="mt-2"
            type="primary-uotline"
            // onClick={search}
            style={{ borderRadius: "10px" }}
          >
            <ReloadOutlined />Đặt lại
          </Button>
          <Button
            className="mx-2  mt-2"
            type="primary"
            onClick={search}
            style={{ borderRadius: "10px" }}
          >
            <SearchOutlined />Tìm kiếm
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
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <div className="form group">
              <label>Tên thể loại</label>
              <Input placeholder="Tên thể loại" onChange={(e) => handle(e)} id="name" value={data.name} />
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
          {/* <Table
            columns={columns}
            rowKey={(record) => record.login.uuid}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          /> */}
          <table className="table" >
            <thead>
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Create Date</th>
                <th>Update Date</th>
                <th>Active</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {
                employees.map((employee, index) => (
                  <tr key={employee.id}>
                    <td>{index + 1}</td>
                    <td>{employee.name}</td>
                    <td>{employee.createdAt}</td>
                    <td>{employee.updatedAt}</td>
                    <td>
                      <>
                        {employee.active == 1 && (
                          <div
                            className="bg-success text-center text-light"
                            style={{ width: "100px", borderRadius: "5px" }}
                          >
                            Hoạt động
                          </div>
                        )}
                        {employee.active == 0 && (
                          <div
                            className="bg-warning text-center text-light"
                            style={{ width: "100px", borderRadius: "5px" }}
                          >
                            Không hoạt động
                          </div>
                        )}
                      </>
                    </td>
                    <td>
                      {
                        <>
                          <EyeOutlined
                            onClick={() => {
                              onView();
                            }}
                          />
                          <EditOutlined
                            style={{ marginLeft: 12 }}
                            onClick={(e) => {
                              onEdit(e, employee.id);
                            }}
                          />
                          <DeleteOutlined
                            onClick={(e) => onDelete(e, employee.id)}
                            style={{ color: "red", marginLeft: 12 }}
                          />
                        </>
                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          <Pagination defaultCurrent={1} total={50} />;

          <Modal
            title="Cập nhật"
            visible={isEditing}
            onCancel={() => {
              setEditing(false);
            }}
            onOk={handleupdateOk}
          >
            <label>
              Tên thể loại
              <span className="text-danger"> *</span>
            </label>
            <Input placeholder="Tên thể loại" onChange={(e) => handleupdate(e)} id="name" value={rs.name} />
          </Modal>

          <Modal
            // style={{borderRadius:"10px"}}
            title="Hiển thị"
            visible={isView}
            onCancel={() => {
              setView(false);
            }}
            onOk={() => {
              setView(false);
            }}
          >
            <label>
              Tên thể loại
              <span className="text-danger"> *</span>
            </label>
            <Input placeholder="Tên thể loại" />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Category;
