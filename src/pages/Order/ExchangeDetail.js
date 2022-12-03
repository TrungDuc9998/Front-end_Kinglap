import React, { useState, useEffect } from "react";
import { Button, Image, Modal } from "antd";
import { Link, useParams } from "react-router-dom";
import { CheckCircleOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";

const toastSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

function exchangeDetail() {
  const [dataExchange, setDataExchange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState();
  let { id } = useParams();

  useEffect(() => {
    loadDataExchangeDetail(id);
    loadDataExchange(id);
    setDataExchange(
      dataExchange.map((d) => {
        return {
          select: false,
          id: d.id,
          quantity: d.quantity,
          status: d.status,
        };
      })
    );
  }, []);

  const loadDataExchange = (id) => {
    setLoading(true);
    fetch(`http://localhost:8080/api/auth/returns/${id}/detail`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setData(res.data);
      });
  };

  const onConfirm = () => {
    const isPut = true;
    Modal.confirm({
      icon: <CheckCircleOutlined className="text-success" />,
      title: "Xác nhận đổi đơn hàng",
      content: `Bạn có muốn xác nhận đổi đơn hàng này không ?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        handleSubmit(isPut);
      },
    });
  };

  const onCancel = () => {
    const isPut = false;
    Modal.confirm({
      icon: <CheckCircleOutlined className="text-success" />,
      title: "Huỷ xác nhận đổi đơn hàng",
      content: `Bạn có huỷ muốn xác nhận đổi đơn hàng này không ?`,
      okText: "Có",
      cancelText: "Không",
      okType: "primary",
      onOk: () => {
        handleSubmit(isPut);
      },
    });
  };

  const loadDataExchangeDetail = (id) => {
    setLoading(true);
    fetch(`http://localhost:8080/api/returns/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setDataExchange(res);
      });
  };

  const onChangeStudent = (check) => {
    let checked = check;
    setDataExchange(
      dataExchange.map((d) => {
        d.select = checked;
        return d;
      })
    );
    console.log(dataExchange);
  };

  const onChangeStudent1 = (check, d) => {
    console.log(d);
    let checked = check;
    setDataExchange(
      dataExchange.map((data) => {
        if (d.id === data.id) {
          data.select = checked;
        }
        return data;
      })
    );
    console.log(dataExchange);
  };

  const handleSubmit = (isPut) => {
    const exchangeDetails = [];
    console.log(dataExchange);
    dataExchange
      .filter((item) => item.select === true)
      .forEach((item) => {
        console.log(item.productId.id);
        exchangeDetails.push({
          id: item.id,
          productId: item.productId.id,
          orderDetailId: item.orderDetail.id,
          quantity: item.quantity,
          status: isPut === true ? "DA_XAC_NHAN" : "KHONG_XAC_NHAN",
        });
      });

    fetch(`http://localhost:8080/api/returns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: 1,
        reason: "a",
        description: "a",
        isCheck: 1,
        status: isPut === true ? "DA_XU_LY" : "KHONG_XU_LY",
        returnDetailEntities: exchangeDetails,
      }),
    }).then((res) => loadDataExchangeDetail(id));
    if(isPut === true) {
      toastSuccess('Xác nhận yêu cầu thành công !' )
    }else {
      toastSuccess('Huỷ yêu cầu thành công !')
    }
   
  };

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Chi tiết đơn đổi</h4>
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
        <div className="col-12">
          <div className="row">
            <div className="col-6 mt-4 ps-4">
              <div className="mt-2 ms-5 text-success">
                Mã đơn đổi: <b>{data?.id}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
                Mã hoá đơn: <b>{data?.orderId}</b>
              </div>
              <div className="mt-2 ms-5 text-success">
                Lý do: <b>{data?.reason}</b>{" "}
              </div>
            </div>
            <div className="col-6 mt-4 mb-5 text-success">
              <div className="mt-2 text-success">
                Ngày gửi yêu cầu: <b>{data?.createdAt}</b>
              </div>
              <div className="mt-2 text-success">
                Trạng thái:{" "}
                <b>
                  {data?.status != "CHUA_XU_LY"
                    ? data?.status === "DA_XU_LY"
                      ? "Đã xử lý"
                      : "Không xử lý"
                    : "Chưa xử lý"}
                </b>
              </div>
              <div className="mt-2 text-success">
                Ghi chú : <b>{data?.description}</b>
              </div>
            </div>
          </div>
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
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th scope="col">
                  <input
                    disabled={disabled}
                    type="checkbox"
                    onChange={(e) => onChangeStudent(e.target.checked)}
                  ></input>
                </th>
                <th scope="col">Id</th>
                <th scope="col">Hình ảnh</th>
                <th scope="col">Sản phẩm trước đó</th>
                <th>Giá tiền</th>
                <th>Hình ảnh</th>
                <th scope="col">Đổi sang</th>
                <th>Giá tiền</th>
                <td>Trạng thái</td>
              </tr>
            </thead>
            <tbody>
              {dataExchange?.map((d, i) => (
                <tr key={d.id}>
                  <th scope="row">
                    <input
                      disabled={disabled}
                      onChange={(event) => {
                        onChangeStudent1(event.target.checked, d);
                      }}
                      type="checkbox"
                      checked={d.select}
                    ></input>
                  </th>
                  <td>{d.id}</td>
                  <td>
                    <Image
                      width={100}
                      src={d.orderDetail.product?.images[0]?.name}
                    />{" "}
                  </td>
                  <td>{d.orderDetail.product.name}</td>
                  <td>
                    {d.orderDetail.product.price.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td>
                    <Image width={100} src={d.productId.images[0].name} />{" "}
                  </td>
                  <td>{d.productId.name}</td>
                  <td>
                    {d.productId.price.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td>
                    {d.status != "YEU_CAU" ? (
                      d.status === "DA_XAC_NHAN" ? (
                        <div
                          className="bg-success text-center text-light"
                          style={{
                            width: "150px",
                            borderRadius: "5px",
                            padding: "4px",
                          }}
                        >
                          Đã xác nhận
                        </div>
                      ) : (
                        <div
                          className="bg-danger text-center text-light"
                          style={{
                            width: "150px",
                            borderRadius: "5px",
                            padding: "4px",
                          }}
                        >
                          Huỷ
                        </div>
                      )
                    ) : (
                      <div
                        className="bg-warning text-center text-light"
                        style={{
                          width: "150px",
                          borderRadius: "5px",
                          padding: "4px",
                        }}
                      >
                        Yêu cầu xác nhận
                      </div>
                    )}
                    {/* {d.status} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-12 text-center mb-3 mt-2">
          <Button onClick={onConfirm} type="primary">
            Xác nhận
          </Button>
          <Button onClick={onCancel} className="ms-2" type="primary" danger>
            Huỷ yêu cầu
          </Button>
        </div>
      </div>
    </div>
  );
}

export default exchangeDetail;
