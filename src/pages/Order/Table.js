import { Table, Calendar, Cascader, Select, Input, Button } from "antd";
import React, { useState } from "react";
const { Option } = Select;

//xử lý auto search
const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
          {
            value: "xiasha",
            label: "Xia Sha",
            disabled: true,
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua men",
          },
        ],
      },
    ],
  },
];

const onChange = (value, selectedOptions) => {
  console.log(value, selectedOptions);
};

const filter = (inputValue, path) =>
  path.some(
    (option) =>
      option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );

//xử lý table
const columns = [
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
  },
  {
    title: "Hình ảnh",
    dataIndex: "name",
  },
  {
    title: "Giá tiền",
    dataIndex: "age",
  },
  {
    title: "Số lượng",
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

//xử lý option select
const handleChange = (value) => {
  console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
};
function Table1() {
  //xứ lý table
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
    <div>
      <div className="row">
        <div className="col-4">
          <div className="form-group">
            <label>Người đặt</label>
            <Input placeholder="Tên người đặt" />
          </div>
        </div>
        <div className="col-4">
          <div className="form-group">
            <label>Số điện thoại</label>
            <Input placeholder="Số điện thoại" />
          </div>
        </div>
        <div className="col-4">
          <div className="form-group">
            <label>Hình thức thanh toán</label>
            <br />
            <Select
              labelInValue
              defaultValue={{
                value: "lucy",
                label: "Hình thức thanh toán",
              }}
              style={{
                width: 395,
              }}
              onChange={handleChange}
            >
              <Option value="jack">Thanh toán tại cửa hàng</Option>
              <Option value="lucy">Thanh toán bằng tài khoản ngân hàng</Option>
              <Option value="lucy1">Thanh toán bằng VN Pay</Option>
            </Select>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-4">
          <div className="form-group">
            <label>Hình thức nhận hàng</label>
            <br />
            <Select
              labelInValue
              defaultValue={{
                value: "lucy",
                label: "Hình thức nhận hàng",
              }}
              style={{
                width: 395,
              }}
              onChange={handleChange}
            >
              <Option value="jack">Tại cửa hàng</Option>
              <Option value="lucy">Tại nhà</Option>
            </Select>
          </div>
        </div>
        <div className="col-8">
          <label>Địa chỉ</label>
          <Input placeholder="Địa chỉ nhận hàng" />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-2">
          <Cascader
            options={options}
            onChange={onChange}
            placeholder="Please select"
            showSearch={{
              filter,
            }}
            onSearch={(value) => console.log(value)}
          />
        </div>
        <div className="col-4 offset-6">
          <h3 className="text-danger">Tổng tiền: 10.000.0000 vnd</h3>
        </div>
        
        <div className="col-12">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12 offset-4">
          <Button className="text-center mx-2" type="primary-outline">
            Huỷ bỏ
          </Button>
          <Button className="text-center mx-2" type="primary">
            Hoàn tất đặt hàng
          </Button>
          <Button className="text-center mx-2" type="danger">
            Lưu nháp
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Table1;
