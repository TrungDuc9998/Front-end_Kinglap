import { Table, Space, Select, Input, Button, Modal } from "antd";
import React, { useState } from "react";
import { AudioOutlined } from "@ant-design/icons";
//select
const { Option } = Select;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];
const data = [];

for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

//xử lý search
const { Search } = Input;
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1890ff",
    }}
  />
);

const onSearch = (value) => console.log(value);

function CreateOrder() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }

            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }

            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  return (
    <div className="row bg-primary" style={{ borderRadius: "10px" }}>
      <div className="col-12">
        <div className="row">
          <div className="col-4">
            <label>Người đặt</label>
            <Input placeholder="Người đặt" />
          </div>
          <div className="col-4">
            <label>Hình thức nhận hàng</label>
            <br />
            <Select
              defaultValue="lucy"
              style={{
                width: 200,
              }}
              onChange={handleChange}
            >
              <Option value="jack">Tại cửa hàng</Option>
              <Option value="lucy">Tại nhà</Option>
             
            </Select>
          </div>
          <div className="col-4">
            <label>Hình thức thanh toán</label>
            <Input placeholder="Người đặt" />
          </div>
        </div>
      </div>
      <div className="col-12 mt-2">
        <Space direction="vertical">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{
              width: 200,
            }}
          />
        </Space>
      </div>
      <div className="col-12 mt-2">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      </div>
    </div>
  );
}

export default CreateOrder;
