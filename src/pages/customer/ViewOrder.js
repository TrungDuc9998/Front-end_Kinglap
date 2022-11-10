import axios from "axios";
import React, { useEffect, useState } from "react";
import product8 from '../../asset/images/products/product08.png'
import qs from "qs";
function ViewOrder() {
    const [orders, setOrders] = useState([])
    const [orderDetails, setOrderDetails] = useState([])
    const url = 'http://localhost:8080/api/orders';
    const [totalSet, setTotal] = useState(10);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5
        },
    });
    const getRandomuserParams = (params) => ({
        limit: params.pagination?.pageSize,
        page: params.pagination?.current,
    });
    const getData = () => {
        axios.get(url + `?${qs.stringify(
            getRandomuserParams(tableParams)
        )}`)
            .then((results) => {
                setOrders(results.data.data.data);
                setOrderDetails(results.data.data.data[0].orderDetails);
                // console.log(results.data.data.data)
                setTotal(results.data.data.total);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: totalSet,
                    }
                });
            });
    };
    useEffect(() => {
        getData();
    }, [JSON.stringify(tableParams)]);
    return (<>
        <div className="container mt-3">
            <div className="row">
                <div className="col-8">
                    <table className="table table-hover table-borderless">
                        <thead>
                            <tr>
                                <th scope="col">Mã đơn hàng</th>
                                <th scope="col">Địa chỉ nhận hàng</th>
                                <th scope="col">Hình thức thanh toán</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <th scope="row">{order.id}</th>
                                    <td>{order.address}</td>
                                    <td>{order.payment}</td>
                                    <td>{order.total}</td>
                                    <td>{order.status}</td>
                                    <td><button className="btn btn-danger">Hủy đơn</button></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
                <div className="col-4">
                    <table className="table table-hover table-borderless">
                        <thead>

                            <tr>
                                {/* <th scope="col"></th> */}
                                <th scope="col">Sản phẩm</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.map(detail => (
                                <tr>
                                    {/* <td><img src={product8} width='100px'></img></td> */}
                                    <td>{detail.productId}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{detail.money}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>)
}

export default ViewOrder;