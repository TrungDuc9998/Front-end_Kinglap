import { Select, Input, Button, Checkbox, InputNumber, Space } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import "../Order/table.css";
import { Table, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});

function Table1() {
  const [quantity, setQuantity] = useState();
  const [array, setArray] = useState([{}]);
  const [district, setDistrict] = useState([{}]);
  const [isDelete, setDelete] = useState(false);
  const [id, setId] = useState();
  const [Ward, setWard] = useState([{}]);
  const [districtId, setDistrictId] = useState(1);
  const [wardCode, setWardCode] = useState(1);
  const [shipping, setShipping] = useState(0);
  const [serviceId, setServiceId] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [ProvinceID, setProvinceID] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [dataCart, setDataCart] = useState();
  const [dataClient, setDataClient] = useState();
  const [valueProduct, setValueProduct] = useState("");
  const [valueClient, setValueClient] = useState("");
  const [total, setTotal] = useState(0);
  const [valueProvince, setValueProvince] = useState();
  const [valueDistrict, setValueDistrict] = useState();
  const [payment, setPayment] = useState();
  const [valueWard, setValueWard] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });

  const handleChangePayment = (value) => {
    setPayment(value);
    console.log("value payment:" + value);
  };

  const handleSubmitOrder = () => {
    const order = {
      payment: payment,
      total: total,
      userId: 1,
      address:
        valueProvince !== undefined
          ? valueWard + ", " + valueDistrict + ", " + valueProvince
          : "TẠI CỬA HÀNG",
    };
    fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment: order.payment,
        userId: order.userId,
        total: order.total,
        address: order.address,
      }),
    }).then((res) => {
      // res.json();
      console.log("đặt hàng thành công !:");
      console.log(res.data);
    });
    console.log(order);
  };

  // event,item.productId,item.productId.price,item.id,item.useId
  const onChangeInputNumber = (value, productId, price, id, useId) => {
    const cart = {
      total: value * price,
      useId: useId,
      quantity: value,
      productId: productId,
    };
    fetch(`http://localhost:8080/api/carts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: cart.productId,
        userId: cart.useId,
        quantity: cart.quantity,
        total: cart.total,
      }),
    }).then((res) => {
      // res.json();
      console.log("load data cart:");
      console.log(res.data);
      loadDataCart();
      let total = 0;
      dataCart?.forEach((item) => (total += item.total));
      console.log("tổng tiền sau khi tính: " + total);
      setTotal(total);
      // notify();
    });
  };

  const SubmitCartData = (value) => {
    console.log(value);
    fetch("http://localhost:8080/api/carts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: value,
        userId: 1,
        quantity: 0,
        total: 0,
      }),
    }).then((res) => {
      // res.json();
      console.log("load data cart:");
      console.log(res.data);
      loadDataCart();
    });
  };

  const onDelete = (id) => {
    setId(id);
    setDelete(true);
  };
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: dataCart?.map((item) => item.productId.name)[0],
      width: "45%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      with: "25%",
      render: (id, data) => {
        return (
          <>
            <InputNumber
              min={0}
              max={100}
              defaultValue={0}
              value={quantity}
              onChange={onChangeInputNumber}
            />
          </>
        );
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      width: "10%",
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      dataIndex: "data",
      width: "20%",
      render: (id, data) => {
        return (
          <>
            <DeleteOutlined
              onClick={() => onDelete(data.id)}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onChange = (value) => {
    console.log("province value onChange: " + value);
    setProvinceID(value);
    loadDataDistrict(value);
  };
  const onSearch = (value) => {
    if (value.target.innerText !== "") {
      setValueProvince(value.target.innerText);
      loadDataDistrict();
    }
  };

  const onChangeDistricts = (value) => {
    if (value != null) {
      setIsDisabled(false);
    }
    setDistrictId(value);
    loadDataWard(value);
  };

  const onSearchDistricts = (value) => {
    if (value.target.innerText !== "") {
      setValueDistrict(value.target.innerText);
      console.log("value district id:" + value.target.innerText);
      loadDataWard();
    }
  };

  const onChangeWards = (value) => {
    if (value === "") {
      setIsDisabled(true);
    }
    console.log("value ward code: ", value);
    setWardCode(value);
    SubmitShipping(value);
  };

  const onSearchWards = (value) => {
    if (value.target.innerText !== "") {
      setValueWard(value.target.innerText);
      SubmitShipping();
    }
  };

  const onChangeProduct = (value) => {
    setValueProduct(value);
    SubmitCartData(value);
    let total = 0;
    dataCart?.forEach((item) => (total += item.total));
    console.log("tổng tiền sau khi tính: " + total);
    setTotal(total);
    console.log("value product: " + value);
  };

  const onSearchProduct = (searchItem) => {
    console.log("value product click" + valueProduct);
  };

  const onChangeClient = (event) => {
    setValueClient(event.target.value);
    console.log("value client: " + event.target.value);
  };

  const onSearchClient = (searchItem) => {
    setValueClient(searchItem);
    console.log("value client: " + searchItem);
  };

  const loadDataProvince = () => {
    fetch(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.status);
      })
      .then((result) => {
        console.log(result.data);
        setArray(result.data);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const loadDataDistrict = (value) => {
    console.log("load Province Id: " + value);
    console.log("value load Provence Id: " + ProvinceID);
    fetch(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
        },
        body: JSON.stringify({
          province_id: value ? value : ProvinceID != 1,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.status);
      })
      .then((result) => {
        setDistrict(result.data);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const loadDataWard = (value) => {
    console.log("districtId khi service:" + value);
    if (value != null) {
      fetch(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
          },
          body: JSON.stringify({
            shop_id: 3379752,
            from_district: 1542,
            to_district: value ? value : districtId != 1,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.data === null) {
            console.log("không có dữ liệu giao hàng phù hợp");
            setIsDisabled(true);
          } else {
            console.log("Success service:", data.data);
            console.log("data service id: " + data.data[0].service_id);
            const checkValue = data.data[0].service_id;
            setServiceId(checkValue);
            fetch(
              "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
                },
                body: JSON.stringify({
                  district_id: value ? value : districtId != 1,
                }),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.data === null) {
                  console.log("không có dữ liệu phù hợp");
                } else {
                  setWard(data.data);
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const url = "http://localhost:8080/api/orders";

  const SubmitShipping = (value) => {
    if (value != null) {
      fetch(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            service_id: serviceId,
            token: "e2b079d4-5279-11ed-8008-c673db1cbf27",
          },
          body: JSON.stringify({
            service_id: serviceId,
            insurance_value: 500000,
            coupon: null,
            from_district_id: 3440,
            to_district_id: districtId,
            to_ward_code: value | (setWardCode != 1),
            height: 15,
            length: 15,
            weight: 1000,
            width: 15,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setShipping(data.data.total);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  useEffect(() => {
    loadDataProvince();
    loadDataProduct();
    loadDataClient();
    loadDataCart();
  }, [total != undefined]);

  const loadDataClient = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/users?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataClient(results.data.data);
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
  const loadDataCart = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/carts?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataCart(results.data.data);
        console.log("-------------- data cart -------------");
        console.log(results.data.data);
        setLoading(false);
        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
        // let total = 0;
        // dataCart?.forEach((item) => (total += item.total));
        // console.log("tổng tiền sau khi tính: " + total);
      });
  };

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchUsername;
    tableParams.pagination.search2 = searchStatus;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/carts?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataCart(results.data.data);
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

  const loadDataProduct = () => {
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

  return (
    <div>
      <div className="row">
        <div className="btn-search col-12 mt-3 mb-4 d-flex float-end">
          <div className="timk col-4 ">
            <div className="search-container">
              <div className="search-inner mb-2">
                <Select
                  showSearch
                  placeholder="Tên sản phẩm"
                  optionFilterProp="children"
                  style={{
                    width: 400,
                  }}
                  onChange={onChangeProduct}
                  onClick={onSearchProduct}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {data != undefined
                    ? data.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))
                    : ""}
                </Select>
              </div>
            </div>
          </div>
          {/* <button type="submit">Thêm sản phẩm</button> */}
        </div>
        <div className="col-5">
          <div className="title">
            <h3>Thông tin khách hàng</h3>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="search-container">
                <div className="search-inner mb-2">
                  <label>Tên khách hàng</label>
                  <input
                    type="text"
                    placeholder="Tên khách hàng"
                    value={valueClient}
                    onChange={onChangeClient}
                    onClick={() => onSearchClient(valueClient)}
                  />
                  <div className="dropdown">
                    {dataClient != null
                      ? dataClient
                          .filter((item) => {
                            const searchTerm = valueClient
                              .toString()
                              .toLowerCase();
                            const fullName =
                              item.username !== undefined
                                ? item.username.toLowerCase()
                                : "";
                            return (
                              searchTerm &&
                              fullName.startsWith(searchTerm) &&
                              fullName !== searchTerm
                            );
                          })
                          .slice(0, 10)
                          .map((item) => (
                            <div
                              onClick={() => onSearchClient(item.username)}
                              className="dropdown-row"
                              key={item.id}
                            >
                              {item.username}
                            </div>
                          ))
                      : ""}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>Thông tin người bán</label>
                <Input placeholder="Hà Trung Kiên" />
              </div>
            </div>
           
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <label>Tỉnh/ Thành Phố</label>
              <Select
                showSearch
                placeholder="Tỉnh/thành phố"
                optionFilterProp="children"
                style={{
                  width: 240,
                }}
                onChange={onChange}
                onClick={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {array.map((item) => (
                  <Option key={item.ProvinceID} value={item.ProvinceID}>
                    {item.ProvinceName}
                  </Option>
                ))}
              </Select>
              <div className="search-container mb-2">
                <div className="search-inner">
                  <label>Tên quận huyện</label>
                  <Select
                    showSearch
                    placeholder="Quận/huyện"
                    optionFilterProp="children"
                    style={{
                      width: 240,
                    }}
                    onChange={onChangeDistricts}
                    onClick={onSearchDistricts}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {district.map((item) => (
                      <Option key={item.DistrictID} value={item.DistrictID}>
                        {item.DistrictName}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="search-container">
                <div className="search-inner">
                  <label>Tên phường xã</label>
                  <Select
                    showSearch
                    placeholder="Phường/xã"
                    optionFilterProp="children"
                    style={{
                      width: 240,
                    }}
                    onChange={onChangeWards}
                    onClick={onSearchWards}
                    disabled={isDisabled}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {Ward.map((item) => (
                      <Option key={item.WardCode} value={item.WardCode}>
                        {item.WardName}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <br />
                <TextArea rows={4} placeholder={"Địa chỉ chi tiết"} />
              </div>
              <div className="form-group">
                <label>Tổng tiền</label>
                <br />
                <Input
                  disabled={true}
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>Khuyến mãi</label>
                <Space direction="vertical">
                  <InputNumber addonAfter={"%"} defaultValue={0} />
                </Space>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Phí ship</label>
                <Space direction="vertical">
                  <InputNumber
                    value={shipping}
                    disabled
                    addonAfter={"VND"}
                    defaultValue={100}
                  />
                </Space>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>Phương thức mua hàng</label>
                <br/>
                <Select
                placeholder="Hình thức mua hàng"
                style={{
                  width: 230,
                }}
                onChange={handleChangePayment}
              >
                <Option value="TẠI CỬA HÀNG">Tại cửa hàng</Option>
                <Option value="TẠI CỬA HÀNG">Giao hàng tại nhà</Option>
              </Select>
              </div>
            </div>
            <div className="col-6">
            <label>Hình thức thanh toán</label>
              <Select
                placeholder="Hình thức thanh toán"
                style={{
                  width: 230,
                }}
                onChange={handleChangePayment}
              >
                <Option value="TẠI CỬA HÀNG">Tại cửa hàng</Option>
                <Option value="TÀI KHOẢN ATM">Tài khoản ATM</Option>
                <Option value="TÀI KHOẢN VN PAY">Tài khoản VN PAY</Option>
              </Select>
            </div>
          </div>

          <div className="row mt-3">
            <div className="form-group">
              <br />
              <TextArea rows={6} />
            </div>
          </div>
        </div>

        <div className="col-7">
          <div className="title">
            <h3>Giỏ hàng</h3>
          </div>
          <div className="row">
            <div className="col-12 mt-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {dataCart?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index}</td>
                        <td>{item.productId.name}</td>
                        <td>{item.productId.price}</td>
                        <td key={item.productId.id}>
                          <InputNumber
                            onChange={(event) =>
                              onChangeInputNumber(
                                event,
                                item.productId.id,
                                item.productId.price,
                                item.id,
                                item.userId
                              )
                            }
                            value={quantity}
                            key={item.productId.id}
                            defaultValue={0}
                            min={1}
                            max={10}
                          />
                          {/* <InputNumber
                            min={1}
                            max={10}
                            defaultValue={1}
                            value= {quantity}
                            // onChange={onChangeInputNumber}
                          /> */}
                        </td>
                        <td>{item.total}</td>
                        <td>
                          <DeleteOutlined
                            onClick={() => onDelete(item.id)}
                            style={{ color: "red", marginLeft: 12 }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* <Table
                columns={columns}
                rowKey={(record) => record++}
                dataSource={dataCart}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
              /> */}
              <Modal
                title="Xóa sản phẩm "
                visible={isDelete}
                onCancel={() => {
                  setDelete(false);
                }}
                onOk={() => {
                  fetch(`http://localhost:8080/api/carts/${id}`, {
                    method: "DELETE",
                  }).then(() => loadDataCart());
                  setDelete(false);
                  // toastSuccess("Xóa sản phẩm thành công!");
                }}
              >
                Bạn muốn xoá sản phẩm khỏi giỏ hàng không ?
              </Modal>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="btn-submit">
          <Button
            className="text-center"
            type="button"
            onClick={handleSubmitOrder}
          >
            Hoàn tất đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Table1;
