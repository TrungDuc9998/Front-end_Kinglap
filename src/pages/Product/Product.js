import {
  DeleteOutlined,
  EditOutlined, LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined
} from "@ant-design/icons";
import { Button, Input, Modal, Select, Table, Image, List,Avatar } from "antd";
import VirtualList from 'rc-virtual-list';
import qs from "qs";
import React, { useEffect, useState } from "react";
import 'toastr/build/toastr.min.css';
import toastrs from "toastr";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});

const Product = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [id, setId] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: '',
      search2: '',
    },
  });

  var i = 0;

  const onScroll = (e) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 400) {
      load();
    }
  };

  const columns = [
    {
        title: "Ảnh",
        dataIndex: "images",
        key: 'images',
        width: "20%",
        render: (_,{images}) => (
            <List>
            <VirtualList
              data={images}
              height={200}
              itemHeight={150}
              itemKey="id"
              onScroll={onScroll}
            >
              {(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    avatar={
                        <Image.PreviewGroup>
                            <Image src={item.name}>
                            </Image>
                            {/* <Avatar shape="square" size={200} src={item.name} /> */}
                            
                        </Image.PreviewGroup>
                    }
                  />
                </List.Item>
              )}
            </VirtualList>
          </List>
            // <>{images.map(item => {
            //     return (
            //         <InfiniteScroll
            //             dataLength={images.length}
            //             next={load}
            //             hasMore={images.length < 50}
            //             loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            //             endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            //             scrollableTarget="scrollableDiv"
            //         >
            //             <Image.PreviewGroup>
            //                 <Image width={200} key={item} src={item.name} />
            //             </Image.PreviewGroup>
            //         </InfiniteScroll>
                    
                
            //     )
            //   })}
            // </>
        ) 
    }, 
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "Imei",
      dataIndex: "imei",
      width: "20%",
    },
    {
      title: "Xuất xứ",
      dataIndex: "origin",
      width: "20%",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      width: "20%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: "10%",
    },
    {
      title: "Ngày phát hành",
      dataIndex: "debut",
      width: "10%",
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      width: "10%",
    },
    {
      title: "Nặng",
      dataIndex: "weight",
      width: "10%",
    },
    {
      title: "Cao",
      dataIndex: "height",
      width: "10%",
    },
    {
      title: "Chiều dài",
      dataIndex: "length",
      width: "10%",
    },
    {
      title: "Chiều rộng",
      dataIndex: "width",
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      with: "25%",
      render: (status) => {
        if (status == 'ACTIVE') {
          return (
            <>
              <div
                className="bg-success text-center text-light"
                style={{ width: "100px", borderRadius: "5px" }}
              >
                Không khóa
              </div>
            </>
          );
        }
        if (status == 0) {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "100px", borderRadius: "5px" }}
              >
                Đã khóa
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
      width: "10%",
      render: (id, data) => {
        if (data.status == 1) {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/users/close/${data.id}`, { method: "PUT" }).then(() => load());
                  toastrs.options = {
                    timeOut: 6000,
                  }
                  toastrs.success("Khóa thành công!");
                }}
              />
            </>
          );
        } else {
          return (
            <>
              <LockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/users/open/${data.id}`, { method: "PUT" }).then(() => load());
                  toastrs.options = {
                    timeOut: 6000
                  }
                  toastrs.success("Mở khóa thành công!");
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
      render: (id, data) => {
        return (
          <>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onEdit(data.id, data.username, data.status);
              }}
            />
            <DeleteOutlined
              onClick={() => onDelete(data.id)}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      }
    },
  ];

  const load = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results.data.data);
        setData(results.data.data);
        setLoading(false);
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
    load();
  }, []);

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchUsername;
    tableParams.pagination.search2 = searchStatus;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };


  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [searchUsername, setSearchUsername] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const [username, setUsername] = useState();
  const [status, setStatus] = useState();
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();
  const [password3, setPassword3] = useState();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const navigate = useNavigate();

  const search = () => {
    tableParams.pagination.search1 = searchUsername;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          }
        })
      });
  }

  const clearSearchForm = () => {
    setSearchUsername("");
    searchStatus("");
  }

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    if (password2 === password1) {
      fetch(
        `http://localhost:8080/api/users`, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, newPassword: password1, status: 1 }) }).then((res) => res.json())
        .then((results) => {
          toastrs.options = {
            timeOut: 6000
          }
          toastrs.clear();
          if (results.data == null) {
            toastrs.error(results.message);
          } else {
            toastrs.success("Thêm mới thành công!");
            load();
            setUsername("");
            setPassword3("");
            setPassword1("");
            setPassword2("");
            setOpen(false);
          }
        });
    } else {
      toastrs.options = {
        timeOut: 6000
      }
      toastrs.clear();
      toastrs.error("Xác nhận tài khoản không chính xác!");
    }
  };

  const changeSearchUserName = (event) => {
    setSearchUsername(event.target.value);
  };



  const changeSearchStatus = (value) => {
    setSearchStatus(value);
  };

  const changeUsername = (event) => {
    setUsername(event.target.value);
  };

  const changePassword1 = (event) => {
    setPassword1(event.target.value);
  };

  const changePassword2 = (event) => {
    setPassword2(event.target.value);
  };

  const changePassword3 = (event) => {
    setPassword3(event.target.value);
  };

  const onEdit = (id, username, status) => {
    setId(id);
    setEditing(true);
    setUsername(username);
    setStatus(status);
  };

  const onDelete = (id) => {
    setId(id);
    setDelete(true);
  };

  const handleCancel = () => {
    setOpen(false);
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
        <div className="col-4 mt-3">
          <label>Từ khoá</label>
          <Input type="text" name="searchUsername" value={searchUsername} placeholder="Nhập tên tài khoản người dùng" onChange={changeSearchUserName} />
        </div>
        <div className="col-4 mt-3">
          <label>Trạng thái</label>
          <br />
          <Select allowClear={true}
            style={{ width: "400px", borderRadius: "5px" }}
            showSearch
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            onChange={changeSearchStatus}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="0">Đã khóa</Option>
            <Option value="1">Không khóa</Option>
          </Select>
        </div>
        <div className="col-12 text-center ">
          <Button
            className="mt-2"
            type="primary-uotline"
            onClick={clearSearchForm}
            style={{ borderRadius: "10px" }}
          >
            <ReloadOutlined />
            Đặt lại
          </Button>
          <Button
            className="mx-2  mt-2"
            type="primary"
            onClick={search}
            style={{ borderRadius: "10px" }}
          >
            <SearchOutlined />
            Tìm kiếm
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4">
          <Button
            className="offset-11 "
            type="primary"
            onClick={() => {
              navigate('/admin/product/create')
            }}
            style={{ borderRadius: "10px" }}
          >
            <PlusOutlined />
            Thêm mới
          </Button>
          <Modal
            title="Tạo mới"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <label>
              Tài khoản
              <span className="text-danger"> *</span>
            </label>
            <Input type="text" name="username" value={username} placeholder="Nhập tài khoản" onChange={changeUsername} />
            <label>
              Mật khẩu
              <span className="text-danger"> *</span>
            </label>
            <Input type="password" name="password1" value={password1} placeholder="Nhập mật khẩu" onChange={changePassword1} />
            <label>
              Xác nhận mật khẩu
              <span className="text-danger"> *</span>
            </label>
            <Input type="password" name="password2" value={password2} placeholder="Nhập lại mật khẩu" onChange={changePassword2} />
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
            rowKey={(record) => record++}
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
            onOk={() => {
              if (password1 == null || password2 == null || password3 == null) {
                toastrs.options = {
                  timeOut: 6000
                }
                toastrs.clear();
                toastrs.error("Vui lòng nhập đầy đủ thông tin!");
              } else {
                if (password2 != password1) {
                  toastrs.options = {
                    timeOut: 6000
                  }
                  toastrs.clear();
                  toastrs.error("Nhập lại mật khẩu không chính xác!");
                } else {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/users/${id}`, { method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, password: password3, newPassword: password1, status: status }) }).then((res) => res.json())
                    .then((results) => {
                      toastrs.options = {
                        timeOut: 6000
                      }
                      toastrs.clear();
                      if (results.data == null) {
                        toastrs.error(results.message);
                      } else {
                        toastrs.success("Cập nhật thành công!");
                        load();
                        setUsername("");
                        setPassword3("");
                        setPassword1("");
                        setPassword2("");
                        setEditing(false);
                      }
                    });
                }
              }
            }}
          >
            <label>
              Tài khoản
            </label>
            <Input type="text" name="username" value={username} placeholder="Nhập tài khoản" onChange={changeUsername} disabled={true} />
            <label>
              Mật khẩu cũ
              <span className="text-danger"> *</span>
            </label>
            <Input type="password" name="password3" value={password3} placeholder="Nhập mật khẩu cũ" onChange={changePassword3} />
            <label>
              Mật khẩu mới
              <span className="text-danger"> *</span>
            </label>
            <Input type="password" name="password1" value={password1} placeholder="Nhập mật khẩu mới" onChange={changePassword1} />
            <label>
              Xác nhận mật khẩu
              <span className="text-danger"> *</span>
            </label>
            <Input type="password" name="password2" value={password2} placeholder="Nhập lại mật khẩu" onChange={changePassword2} />
          </Modal>
          <Modal
            title="Xóa người dùng"
            visible={isDelete}
            onCancel={() => {
              setDelete(false);
            }}
            onOk={() => {
              fetch(
                `http://localhost:8080/api/users/${id}`, { method: 'DELETE' }).then(() => load());
              setDelete(false);
              toastrs.options = {
                timeOut: 6000
              }
              toastrs.clear();
              toastrs.success("Xóa thành công!");
            }}
          >
            Bạn muốn xóa người dùng này chứ?
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Product;
