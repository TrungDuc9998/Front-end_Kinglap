import { Select, Input, Button, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import "../Order/table.css";
import { AutoComplete } from "antd";

const { Option } = Select;
const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
});

function Table1() {
  const [array, setArray] = useState([{}]);
  const [district, setDistrict] = useState([{}]);
  const [value, setValue] = useState("");
  const [valueDistrict, setValueDistrict] = useState("");
  const [valueWard, setValueWard] = useState("");
  const [Ward, setWard] = useState([{}]);
  const [districtId, setDistrictId] = useState(1542);
  const [wardCode, setWardCode] = useState(20314);
  const [shipping, setShipping] = useState(0);
  const [serviceId, setServiceId] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [ProvinceID, setProvinceID] = useState();
  const [result, setResult] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [valueProduct, setValueProduct] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });

  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("do validate" + e.target.value);
      setValueDistrict(e.target.value);
    }
  };

  const onChangeProduct = (event) => {
    setValueProduct(event.target.value);
    console.log("value product: " + event.target.value);
  };

  const onSearchProduct = (searchItem) => {
    setValueProduct(searchItem);
    console.log("product item: " + searchItem);
  };

  ///onchang data product

  const onChangeProvince = (event) => {
    setValue(event.target.value);
  };

  const onSearchProvince = (searchTerm, value) => {
    setValue(searchTerm);
    // our api to fetch the search result
    console.log("search ", searchTerm);
    console.log("value province id:" + value);
    setProvinceID(value);
    loadDataDistrict(value);
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

  //call API tỉnh thành

  const onChangeDistrict = (event) => {
    setValueDistrict(event.target.value);
    setIsDisabled(false);
  };

  const onSearchDistrict = (searchTerm, value) => {
    setValueDistrict(searchTerm);
    setDistrictId(value);
    // setValueDistrict(value)
    // our api to fetch the search result
    console.log("search District", searchTerm);
    console.log("value District", value);
    if (value != null) {
      loadDataWard(value);
    }
  };

  const loadDataDistrict = (value) => {
    console.log("load Province Id: " + value);
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
          province_id: value,
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
        console.log(result.data);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  //call API quận huyện

  const onChangeWard = (event) => {
    setValueWard(event.target.value);
  };

  const onSearchWard = (searchTerm, value) => {
    if (searchTerm != null) {
      setValueWard(searchTerm);
      console.log("search ward", searchTerm + "" + value);
    } else {
      valueWard = isDisabled;
    }

    // our api to fetch the search result

    if (value != null) {
      setShipping(value);
      SubmitShipping(value);
    }
  };

  const loadDataWard = (value) => {
    console.log("districtId:" + value);

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
            to_district: value,
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
            console.log("check Value: " + checkValue);
            console.log("service id sau khi set: " + serviceId);
            // if (serviceId != null) {
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
                  district_id: value,
                }),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.data === null) {
                  console.log("không có dữ liệu phù hợp");
                } else {
                  console.log("Success ward:", data.data);
                  setWard(data.data);
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
            // setWard(data.data);
          }
          // }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  //call API Phường xã

  const url = "http://localhost:8080/api/orders";

  const SubmitShipping = (value) => {
    console.log("service Id sau set: " + serviceId);
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
            to_ward_code: value,
            height: 15,
            length: 15,
            weight: 1000,
            width: 15,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Success shipping:", data.data);
          console.log(data.data.total);
          setShipping(data.data.total);
          // setWard(data.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  useEffect(() => {
    loadDataProvince();
    load();
    console.log("data product");
    // console.log(data);
    // console.log("array");
    // console.log(array);
  }, []);

  const load = () => {
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

  const submit_orderDetail = (e) => {
    e.preventDefault();
    axios
      .post(url, {
        orderId: data.orderId,
        productId: data.productId,
        quantity: data.quantity,
        price: data.price,
        status: data.status,
      })
      .then((res) => {
        window.location.reload();
        console.log(res.data);
      });
  };

  const options = [
    {
      value: "a",
      label1: "a",
    },
    {
      value: "aaa",
      label1: "aaa",
    },
    {
      value: "b",
      label1: "b",
    },
  ];
  return (
    <div>
      <div className="row">
        <div className="btn-search col-12 mt-3 mb-4 d-flex float-end">
          <div className="timk col-4 ">
            <div className="search-container">
              <div className="search-inner mb-2">
                <input
                  type="text"
                  //  style={border"1px solid #d9d9d9;"}
                  placeholder="Tên sản phẩm"
                  value={valueProduct}
                  onChange={onChangeProduct}
                  onClick={() => onSearchProduct(valueProduct)}
                />
                <div className="dropdown">
                  {data != null
                    ? data
                        .filter((item) => {
                          const searchTerm = valueProduct
                            .toString()
                            .toLowerCase();
                          const fullName =
                            item.name !== undefined
                              ? item.name.toLowerCase()
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
                            onClick={() => onSearchProduct(item.name)}
                            className="dropdown-row"
                            key={item.id}
                          >
                            {item.name}
                          </div>
                        ))
                    : ""}
                </div>
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
              <div className="form-group">
                <label>Tìm kiếm thông tin</label>
                <Input placeholder="Tìm kiếm theo số điện thoại hoặc email" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Tên khách hàng</label>
                <Input placeholder="Tên khách hàng" />
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="form-group">
              <label>Mã hóa đơn</label>
              <Input placeholder="Tìm kiếm theo số điện thoại hoặc email" />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>Thông tin người bán</label>
                <Input placeholder="Tên người bán" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Số điện thoại khách hàng</label>
                <Input placeholder="Tên khách hàng" />
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-6">
              <label>Tỉnh/ Thành Phố</label>
              <div className="search-container">
                <div className="search-inner mb-2">
                  <input
                    type="text"
                    //  style={border"1px solid #d9d9d9;"}
                    placeholder="Tên tỉnh thành"
                    value={value}
                    onChange={onChangeProvince}
                    onClick={() => onSearchProvince(value)}
                  />
                  <div className="dropdown">
                    {array
                      .filter((item) => {
                        const searchTerm = value.toString().toLowerCase();
                        const fullName =
                          item.ProvinceName !== undefined
                            ? item.ProvinceName.toLowerCase()
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
                          onClick={() =>
                            onSearchProvince(item.ProvinceName, item.ProvinceID)
                          }
                          className="dropdown-row"
                          key={item.ProvinceName}
                        >
                          {item.ProvinceName}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="search-container mb-2">
                <div className="search-inner">
                  <label>Tên quận huyện</label>
                  <input
                    type="text"
                    placeholder="Tên quận huyện"
                    value={valueDistrict}
                    onChange={onChangeDistrict}
                    onClick={() => onSearchDistrict(valueDistrict)}
                    onKeyDown={_handleKeyDown}
                  />
                </div>
                <div className="dropdown">
                  {district
                    .filter((item) => {
                      const searchTerm = valueDistrict.toString().toLowerCase();
                      const fullName =
                        item.DistrictName !== undefined
                          ? item.DistrictName.toLowerCase()
                          : "";

                      return (
                        searchTerm &&
                        fullName.startsWith(searchTerm) &&
                        fullName !== searchTerm
                      );
                    })
                    .slice(0, 5)
                    .map((item) => (
                      <div
                        onClick={() =>
                          onSearchDistrict(item.DistrictName, item.DistrictID)
                        }
                        className="dropdown-row"
                        key={item.DistrictID}
                      >
                        {item.DistrictName}
                      </div>
                    ))}
                </div>
              </div>
              <div className="search-container">
                <div className="search-inner">
                  <label>Tên phường xã</label>
                  <input
                    type="text"
                    placeholder="Tên phường xã"
                    value={valueWard}
                    disabled={isDisabled}
                    onChange={onChangeWard}
                    onClick={() => onSearchWard(valueWard)}
                  />
                  <div className="dropdown">
                    {Ward.filter((item) => {
                      const searchTerm = valueWard.toString().toLowerCase();
                      const fullName = item.WardName !== undefined 
                      ? item.WardName.toLowerCase() : "";

                      return (
                        searchTerm &&
                        fullName.startsWith(searchTerm) &&
                        fullName !== searchTerm 
                      );
                    })
                      .slice(0, 10)
                      .map((item) => (
                        <div
                          onClick={() =>
                            onSearchWard(item.WardName, item.WardCode)
                          }
                          className="dropdown-row"
                          key={item.WardName}
                        >
                          {item.WardName}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <br />
                <textarea
                  rows="7"
                  cols="39"
                  placeholder="Địa chỉ chi tiết ..."
                />
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>Khuyến mãi</label>
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="0" />
                  <span className="input-group-text">%</span>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Phí ship</label>
                <div className="input-group">
                  <input
                    type="text"
                    value={shipping}
                    onChange={(e) => setShipping(e.target.value)}
                    className="form-control"
                    placeholder="0"
                    disabled
                  />
                  <span className="input-group-text">VNĐ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-6">
              <div className="form-group">
                <label>Phương thức mua hàng</label>
                <select className="form-select">
                  <option>Chọn hình thức mua hàng</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Phương thức thanh toán</label>
                <select className="form-select">
                  <option>Chọn hình thức thanh toán</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="form-group">
              <br />
              <textarea rows="7" cols="85" placeholder="Ghi chú ..." />
            </div>
          </div>
        </div>

        <div className="col-7">
          <div className="title">
            <h3>Giỏ hàng</h3>
          </div>
          <div className="row">
            <div className="col-12 mt-3">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Laptop Gaming ...</td>
                    <td></td>
                    <td>300000000</td>
                    <td>300000000</td>
                    <td>1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="btn-submit">
          <Button className="text-center" type="button">
            Hoàn tất đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Table1;
