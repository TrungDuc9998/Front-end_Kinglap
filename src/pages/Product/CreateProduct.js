import {
  PlusCircleFilled,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Input, Select, Upload,Space } from "antd";
const { Option } = Select;

const children = [];

for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const handleChange = (value) => {
  console.log(`selected ${value}`);
};


function CreateProduct() {
  return (
    <div
      className="row "
      style={{
        borderRadius: "20px",
        height: "100%",
        border: "1px solid #d9d9d9",
        background: "#fafafa",
      }}
    >
     
      <div className="row mt-4">
        <div className="col-4">
          <label>Tên sản phẩm</label>
          <Input placeholder="Tên sản phẩm" />
        </div>
        <div className="col-4">
          <label>P/N</label>
          <Input placeholder="P/N" />
        </div>
        <div className="col-4">
          <label>Thời gian bảo hành</label>
          <Input placeholder="Thời gian bảo hàng" />
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <label>Giá tiền</label>
          <Input placeholder="Giá tiền" />
        </div>
        <div className="col-4">
          <label>Số lượng</label>
          <Input placeholder="Số lượng" />
        </div>
        <div className="col-4">
          <label>Kích thước</label>
          <Input placeholder="Kích thước" />
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <label>Cân nặng</label>
          <Input placeholder="Cân nặng" />
        </div>
        <div className="col-4">
          <label>Năm sản xuất</label>
          <Input placeholder="Năm sản xuất" />
        </div>
        <div className="col-4">
          <label>
            Thương hiệu
            <span className="text-danger me-2"> * </span>
          </label>
          <br />
          <Select
            showSearch
            style={{
              width: 200,
            }}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.includes(input)}
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            <Option value="1">Dell</Option>
            <Option value="2">Acer</Option>
            <Option value="3">Asus</Option>
            <Option value="4">Macbook</Option>
            <Option value="5">Lenovo</Option>
            <Option value="6">HP</Option>
          </Select>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <label>Xuất xứ</label>
          <Input placeholder="Xuất xứ" />
        </div>
        <div className="col-4">
          <label>Màu sắc</label>
          <Input placeholder="Màu sắc" />
        </div>
        <div className="col-4">
          <label>Chất liệu</label>
          <Input placeholder="Chất liệu" />
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <label>Kiểu dáng</label>
          <Input placeholder="Kiểu dáng" />
        </div>
        <div className="col-4">
          <label>Bộ vi xử lý</label>
          <Input placeholder="Bộ xử lý" />
        </div>
        <div className="col-4">
          <label>Bộ nhớ trong</label>
          <Input placeholder="Bộ nhớ trong" />
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <label>Số khe cắm</label>
          <Input placeholder="Số khe cắm" />
        </div>
        <div className="col-4">
          <label>VGA</label>
          <Input placeholder="VGA" />
        </div>
        <div className="col-4">
          <label>Ổ cứng</label>
          <Input placeholder="Ổ cứng" />
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <label>Ổ quang</label>
          <Input placeholder="Ổ quang" />
        </div>
        <div className="col-4">
          <label>Bảo mật công nghệ</label>
          <Input placeholder="Bảo mật công nghệ" />
        </div>
        <div className="col-4">
          <label>Màn hình</label>
          <Input placeholder="Màn hình" />
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <label>Giao tiếp không giây</label>
          <Input placeholder="Giao tiếp không giây" />
        </div>
        <div className="col-4">
          <label>Pin</label>
          <Input placeholder="Pin" />
        </div>
        <div className="col-4">
          <label>Cân nặng</label>
          <Input placeholder="Màn hình" />
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <label>Hệ điều hành</label>
          <Input placeholder="Hệ điều hành" />
        </div>

        <div className="col-4">
          <label>
            Phụ kiện trong hộp
            <span className="text-danger"> * </span>
          </label>
          <Select
            mode="tags"
            style={{
              width: "100%",
            }}
            placeholder="Tags Mode"
            onChange={handleChange}
          >
            {children}
          </Select>
        </div>
        <div className="col-4 mt-4">
          <Space
            direction="vertical"
            style={{
              width: "100%",
            }}
            size="large"
          >
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture"
              maxCount={6}
              multiple
            >
              <Button icon={<UploadOutlined />}>Upload (Max: 6)</Button>
            </Upload>
          </Space>
        </div>
      </div>
      <div className="row">
        
      </div>
      <div className="row">
        <div className="col-12 mb-3">
          <Button
            className="mt-2"
            type="primary"
            // onClick={showModal}
            style={{ borderRadius: "10px" }}
          >
            {" "}
            <PlusCircleFilled /> Thêm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
