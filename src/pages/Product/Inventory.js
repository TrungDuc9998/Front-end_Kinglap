import { Table, Select, Input, Button, Image, Modal } from "antd";
import {
  EyeOutlined,
  MenuFoldOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import qs from "qs";
import toastrs from "toastr";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState, useRef } from "react";
const { Option } = Select;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchName: params.pagination?.search1,
});

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [isView, setView] = useState(false);
  const [product, setProduct] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
    },
  });
  useEffect(() => {
    loadDataInventory();
  }, []);

  const loadDataInventory = () => {
    fetch(
      `http://localhost:8080/api/admin/statistical/inventory?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setInventory(results);
        setTableParams({
          pagination: {
            current: results.current_page,
            pageSize: 10,
            total: results.total,
          },
        });
      });
  };

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "id",
      width: "5%",
    },
    // {
    //   title: "Hình ảnh",
    //   dataIndex: "image",
    //   width: "10%",
    //   render(image) {
    //     return <Image className="mt-5" width={90} src={image} />;
    //   },
    // },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      sorter: true,
      width: "20%",
    },
    {
      title: "Hãng sản xuất",
      dataIndex: "manufacture",
      sorter: true,

      width: "10%",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
      width: "10%",
      render(price) {
        return (
          <>
            {price.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "total",
      sorter: true,
      width: "10%",
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      width: "5%",
      render: (id) => {
        return (
          <EyeOutlined
            style={{ fontSize: "20px", color: "red" }}
            onClick={() => {
              showModalData(id);
            }}
          />
        );
      },
    },
  ];

  const showModalData = (id) => {
    console.log("id truyền vào", id);
    fetch(
      `http://localhost:8080/api/products/${id}?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProduct(results);
      });
    setView(true);
  };

  return (
    <div>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Sản phẩm lỗi</h4>
        </div>
      </div>
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
        <div className="col-4 mt-3">
          <label>Từ khoá</label>
          <Input
            type="text"
            name="searchName"
            placeholder="Nhập tên sản phẩm"
            // onChange={changeSearchName}
          />
        </div>
        <div className="col-4 mt-3">
          <label>Hãng sản xuất</label>
          <br />
          <Select
            allowClear={true}
            style={{ width: "300px", borderRadius: "5px" }}
            showSearch
            placeholder="Chọn hãng"
            optionFilterProp="children"
            // onChange={changeSearchStatus}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="CHO_XAC_NHAN" selected>
              Chờ xác nhận
            </Option>
            <Option value="CHO_LAY_HANG">Chờ lấy hàng</Option>
            <Option value="DANG_GIAO">Đang giao</Option>
            <Option value="DA_NHAN">Đã nhận</Option>
            <Option value="DA_HUY">Đã hủy</Option>
          </Select>
        </div>

        <div className="col-12 text-center mt-4">
          <Button
            className="mt-2"
            type="primary-uotline"
            // onClick={clearSearchForm}
            style={{ borderRadius: "10px" }}
          >
            <ReloadOutlined />
            Đặt lại
          </Button>
          <Button
            className="mx-2  mt-2"
            type="primary"
            // onClick={search}
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
            rowKey={(record) => record.id}
            dataSource={inventory}
            pagination={tableParams.pagination}
          />
          <Modal
            title={`Chi tiết thông số kĩ thuật ` + product?.name}
            open={isView}
            onCancel={() => {
              setView(false);
            }}
            width={750}
          >
            <div className="text-center mb-2">
              <Image
                className="mt-5"
                width={190}
                src={product?.images[0]?.name}
              />
            </div>
            <div className="card">
              <div className="card-header" style={{ textAlign: "left" }}>
                Thông tin hàng hóa
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Xuất xứ: {product?.origin.name}</li>
                  <li>Thương hiệu: {product?.manufacture.name} </li>
                  <li>Thời điểm ra mắt:{product?.debut} </li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Thiết kế trọng lượng
              </div>
              <div className="card-body">
                <li>
                  Kích thước: {product?.width} x {product?.height} x{" "}
                  {product?.length}
                </li>
                <li>Trọng lượng sản phẩm: {product?.weight}kg</li>
                <li>Chất liệu: {product?.material}</li>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Bộ xử lí
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Hãng CPU: {product?.processor.cpuCompany}</li>
                  <li>Công nghệ CPU: {product?.processor.cpuTechnology}</li>
                  <li>Tốc độ CPU: {product?.processor.cpuSpeed}</li>
                  <li>Tốc độ tối đa CPU: {product?.processor.maxSpeed}</li>
                </div>
                <div className="col-6">
                  <li>Loại CPU: {product?.processor.cpuType}</li>
                  <li>Số nhân: {product?.processor.multiplier}</li>
                  <li>Số luồng: {product?.processor.numberOfThread}</li>
                  <li>Bộ nhớ đệm: {product?.processor.caching}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                RAM
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Dung lượng RAM: {product?.ram.ramCapacity}</li>
                  <li>Loại RAM: {product?.ram.typeOfRam}</li>
                  <li>Tốc độ RAM: {product?.ram.ramSpeed}</li>
                  <li>Số khe cắm rời: {product?.ram.looseSlot}</li>
                </div>
                <div className="col-6">
                  <li>Số khe RAM còn lại: {product?.ram.remainingSlot}</li>
                  <li>Số RAM onboard: {product?.ram.onboardRam}</li>
                  <li>Hỗ trợ RAM tối đa: {product?.ram.maxRamSupport}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Màn Hình
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Kích thước màn hình: {product?.screen.size}</li>
                  <li>
                    Công nghệ màn hình: {product?.screen.screenTechnology}
                  </li>
                  <li>Độ phân giải: {product?.screen.resolution}</li>
                  <li>Tần số quét: {product?.screen.scanFrequency}</li>
                  <li>Tấm nền: {product?.screen.backgroundPanel}</li>
                </div>
                <div className="col-6">
                  <li>Độ sáng: {product?.screen.brightness}</li>
                  <li>Độ phủ màu: {product?.screen.colorCoverage}</li>
                  <li>Tỷ lệ màn hình: {product?.screen.resolution}</li>
                  <li>Màn hình cảm ứng: {product?.screen.backgroundPanel}</li>
                  <li>Độ tương phản: {product?.screen.contrast}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Đồ họa
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>
                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                      Card onboard
                    </span>
                  </li>
                  <li>Hãng: {product?.cardOnboard.trandemark}</li>
                  <li>Model: {product?.cardOnboard.model}</li>
                  <li>Bộ nhớ: {product?.cardOnboard.memory}</li>
                </div>
                <div className="col-6">
                  <li>
                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                      Card rời
                    </span>
                  </li>
                  <li>Hãng: {product?.card.trandemark}</li>
                  <li>Model: {product?.card.model}</li>
                  <li>Bộ nhớ: {product?.card.memory}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Lưu trữ
              </div>
              <div className="card-body row">
                <div className="col-6">
                  <li>Kiểu ổ cứng: {product?.storage.storageDetail.type}</li>
                  <li>Số khe cắm: {product?.storage.number}</li>
                  <li>
                    Loại SSD:
                    {product?.storage.storageDetail.storageType.name}
                  </li>
                  <li>Dung lượng: {product?.storage.storageDetail.capacity}</li>
                </div>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Bảo mật
              </div>
              <div className="card-body row">
                <li>{product?.security}</li>
              </div>
              <div className="card-header" style={{ textAlign: "left" }}>
                Hệ điều hành
              </div>
              <div className="card-body row">
                <li>OS: {product?.win.name}</li>
                <li>Version: {product?.win.version}</li>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
