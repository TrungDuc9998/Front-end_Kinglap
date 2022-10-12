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
  } from "antd";
  import {
      CheckCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
  } from "@ant-design/icons";
  import qs from "qs";
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  const { Option } = Select;
  //date
  const { RangePicker } = DatePicker;
  
  const onDelete = (record) => {
    Modal.confirm({
      title: "Xoá thể loại",
      content: "Bạn có muón xoá bản ghi này không?",
    });
  };
  
  const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });
  
  const OrderCancel = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [isView, setView] = useState(false);
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 10,
      },
    });
  
    const columns = [
      {
        title: "Mã đơn đặt",
        dataIndex: "name",
        sorter: true,
        render: (name) => `${name.first} ${name.last}`,
        width: "20%",
      },
      {
        title: "Người đặt",
        dataIndex: "name",
        sorter: true,
        render: (name) => `${name.first} ${name.last}`,
        width: "20%",
      },
      {
        title: "Ngày tạo",
        dataIndex: "name",
        sorter: true,
        render: (name) => `${name.first} ${name.last}`,
        width: "15%",
      },
      {
        title: "Tổng tiền",
        dataIndex: "name",
        sorter: true,
        render: (name) => `${name.first} ${name.last}`,
        width: "20%",
      },
      {
        title: "Hình thức đặt",
        dataIndex: "name",
        sorter: true,
        render: (name) => `${name.first} ${name.last}`,
        width: "15%",
      },
      // {
      //   title: "Email",
      //   dataIndex: "email",
      // },
      {
        title: "Trạng thái",
        dataIndex: "Trạng thái",
        with: "40%",
        render: (record) => {
          return (
            <>
              <div
                className="bg-danger text-center text-light"
                style={{ width: "150px", borderRadius: "5px" }}
              >
                Đã huỷ hàng
              </div>
              
            </>
          );
        },
      },
    //   {
    //     title: "Thao tác",
    //     dataIndex: "Thao tác",
    //     width: "30%",
    //     render: (record) => {
    //       return (
    //         <>
              
    //           <CheckCircleOutlined 
    //             style={{ marginLeft: 12 }}
    //             onClick={() => {
    //               onEdit(record);
    //             }}
    //           />
    //           <DeleteOutlined
    //             onClick={() => onDelete(record)}
    //             style={{ color: "red", marginLeft: 12 }}
    //           />
    //         </>
    //       );
    //     },
    //   },
    ];
  
    const fetchData = () => {
      setLoading(true);
      fetch(
        `https://randomuser.me/api?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`
      )
        .then((res) => res.json())
        .then(({ results }) => {
          setData(results);
          setLoading(false);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: 200, // 200 is mock data, you should read it from server
              // total: data.totalCount,
            },
          });
        });
    };
  
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
      setEditing(true);
    };
  
    const onView = (record) => {
      setView(true);
    };
  
    const handleCancel = () => {
      console.log("Clicked cancel button");
      setOpen(false);
    };
  
    //xử lý date
    const [size, setSize] = useState("middle");
  
    const handleSizeChange = (e) => {
      setSize(e.target.value);
    };
    const navigate = useNavigate();
    const [keyOrder,setKey] = useState("/order/create")
    return (
  
      <div>
        <div
          className="row"
          style={{
            borderRadius: "20px",
            height: "auto",
            paddingBottom: "40px",
            border: "1px solid #d9d9d9",
            background: "#fafafa",
          }}
        >
          <div className="col-4 mt-4">
            <label>Tên sản phẩm</label>
            <Input placeholder="Nhập tên sản phẩm" />
          </div>
          <div className="col-4 mt-4">
            <label>Tên thể loại</label>
            <br />
            <Select
              style={{ width: "300px", borderRadius: "5px" }}
              showSearch
              placeholder="Chọn thể loại"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="jack">Laptop</Option>
              <Option value="lucy">Linh kiện</Option>
              <Option value="lucy">Phụ kiện</Option>
            </Select>
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
          <div className="col-6">
            <label>Người đặt</label>
            <Input placeholder="Tên người đặt" />
          </div>
          <div className="col-6 mt-4">
            <label>Thời gian đặt: </label>
            <Space className="mx-2" direction="vertical" size={12}>
              <RangePicker size={"middle"} />
            </Space>
          </div>
          <div className="col-12 text-center ">
            <Button
              className="mt-2"
              type="primary-uotline"
              // onClick={showModal}
              style={{ borderRadius: "10px" }}
            >
              <ReloadOutlined />
              Đặt lại
            </Button>
            <Button
              className="mx-2  mt-2"
              type="primary"
              // onClick={showModal}
              style={{ borderRadius: "10px" }}
            >
              <SearchOutlined />
              Tìm kiếm
            </Button>
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
              rowKey={(record) => record.login.uuid}
              dataSource={data}
              pagination={tableParams.pagination}
              loading={loading}
              onChange={handleTableChange}
            />
            <Modal
              title="Xác nhận"
              visible={isEditing}
              onCancel={() => {
                setEditing(false);
              }}
              onOk={() => {
                setEditing(false);
              }}
            >
              Bạn có muốn xác nhận đơn hàng không ?
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
             
              Laptop G3 15 3500 : 3
              <br/>
              Laptop G3 15 3500 : 2
              <br/>
              Laptop G3 15 3500 : 1
              <br/>
              Laptop G3 15 3500 : 0
            </Modal>
          </div>
        </div>
      </div>
    );
  };
  
  export default OrderCancel;
  