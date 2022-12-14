import { Table, Calendar, Cascader, Select, Input, Button, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import { Html5Filled } from "@ant-design/icons";
import '../Order/table.css';

const { Option } = Select;


const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchUsername: params.pagination?.search1,
    searchStatus: params.pagination?.search2,
  });

  function UpdateOrder() {
    const url = 'http://localhost:8080/api/orders';
    const [data, setData] = useState({
      userId: "1",
      total: "0",
      payment: "",
      address: "",
      status: 1,
      orderId: "",
      productId: "",
      quantity: "",
      price: "",
      status: 1
    });
  
  
    const [loading, setLoading] = useState(false);
  
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 10,
        search1: '',
        search2: '',
      },
    });
  
    const [dataSP, setDataSP] = useState([{}]);
  
    const load = () => {
      setLoading(true);
      fetch(
        `http://localhost:8080/api/products?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`
      )
        .then((res) => res.json())
        .then((results) => {
          setDataSP(results.data.data);
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
      setDataSP(
        dataSP.map(d => {
          return {
            select: false,
            id: d.id,
            name: d.name,
            price: d.price,
            quantity: d.quantity
          }
        })
      )
    }, []);
  
    const submit = (e) => {
      e.preventDefault();
      axios.post(url, {
        userId: data.userId,
        total: data.total,
        payment: data.payment,
        address: data.address,
        status: data.status,
        orderDetail: [{
          orderId: data.orderId,
          productId: data.productId,
          quantity: data.quantity,
          price: data.price,
          status: data.status
        }
        ]
      })
        .then(res => {
          submit_orderDetail();
          window.location.reload();
          console.log(res.data);
        })
    }
  
    const submit_orderDetail = (e) => {
      e.preventDefault();
      axios.post(url, {
        orderId: data.orderId,
        productId: data.productId,
        quantity: data.quantity,
        price: data.price,
        status: data.status,
      })
        .then(res => {
          window.location.reload();
          console.log(res.data);
        })
    }
  
    return (
      <div>
        <div className="row">
          <div className="btn-search col-12 mt-3 mb-4 d-flex float-end">
            <div className="timk col-4 ">
              <div className="form-group">
                <Input type="search" placeholder="T??m ki???m s???n ph???m" />
              </div>
            </div>
            {/* <button type="submit">Th??m s???n ph???m</button> */}
          </div>
          <div className="col-5">
            <div className="title">
              <h3>Th??ng tin kh??ch h??ng</h3>
            </div>
  
            <div className="row mt-3">
              <div className="col-">
                <div className="form-group">
                  <label>T??n kh??ch h??ng</label>
                  <Input placeholder="T??n kh??ch h??ng" />
                </div>
              </div>
            </div>
  
            <div className="row mt-3">
              <div className="form-group">
                <label>M?? h??a ????n</label>
                <Input placeholder="T??m ki???m theo s??? ??i???n tho???i ho???c email" />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <div className="form-group">
                  <label>Th??ng tin ng?????i b??n</label>
                  <Input placeholder="T??n ng?????i b??n" />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>S??? ??i???n tho???i kh??ch h??ng</label>
                  <Input placeholder="T??n kh??ch h??ng" />
                </div>
              </div>
            </div>
  
            <div className="row mt-3">
              <div className="col-6">
                <div className="form-group">
                  <label>?????a ch???</label>
                  <select class="form-select">
                    <option selected>Th??nh ph???/t???nh...</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                  <br></br>
                  <select class="form-select">
                    <option selected>Qu???n/huy???n...</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                  <br></br>
                  <select class="form-select">
                    <option selected>Ph?????ng/x??...</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <br />
                  <textarea rows="7" cols="39" placeholder="?????a ch??? chi ti???t ..." />
                </div>
              </div>
            </div>
  
            <div className="row mt-3">
              <div className="col-6">
                <div className="form-group">
                  <label>Khuy???n m??i</label>
                  <div className="input-group">
                    <input type="text" class="form-control" placeholder="0" />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Toonge ti???n s???n ph???m</label>
                  <div className="input-group">
                    <input type="text" class="form-control" placeholder="0" />
                    <span class="input-group-text">VN??</span>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="row mt-3">
              <div className="col-6">
                <div className="form-group">
                  <label>Ph????ng th???c mua h??ng</label>
                  <select class="form-select">
                    <option selected>Ch???n h??nh th???c mua h??ng</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Ph????ng th???c thanh to??n</label>
                  <select class="form-select">
                    <option selected>Ch???n h??nh th???c thanh to??n</option>
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
                <textarea rows="7" cols="85" placeholder="Ghi ch?? ..." />
              </div>
            </div>
          </div>
  
          <div className="col-7">
            <div className="title"><h3>Gi??? h??ng</h3></div>
            <div className="row">
              <div className="col-12 mt-3">
                <table className="table table-striped">
                  <thead>
                    <th>#</th>
                    <th>S???n ph???m</th>
                    <th>S??? l?????ng</th>
                    <th>????n gi??</th>
                    <th>Th??nh ti???n</th>
                    <th>Thao t??c</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Laptop Gaming ...</td>
                      <td>
  
                      </td>
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
            <Button className="text-center" type="button" onClick={submit} >
              Ho??n t???t ?????t h??ng
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  export default UpdateOrder;
  