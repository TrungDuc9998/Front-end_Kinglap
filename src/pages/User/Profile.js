import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Checkbox, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

const toastSuccess = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};

function Profile() {
  const [userName, setUserName] = useState();

  useEffect(() => {
    if (localStorage.getItem("information") != undefined) {
      setUserName(localStorage.getItem("username"));
    }
  }, []);

  const onFinish = (values) => {
    console.log("Success:", values);
    handleSubmitUpdate(values)
  };

  const handleSubmitUpdate = (data) => {
    const id = JSON.parse(localStorage.getItem("information"))[0]?.id;
    const edit = {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
    };
    fetch("http://localhost:8080/api/auth/information/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    })
      .then((response) => response.json())
      .then((results) => {
        if (results.data == null) {
           
        } else {
          localStorage.removeItem("information");
          toastSuccess("Cập nhật thông tin thành công!");
          localStorage.setItem("information", JSON.stringify([results.data]));
         
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
     <ToastContainer></ToastContainer>
      <div className="row bg-light">
        <div className="col-4 mt-5 mb-3 text-center">
          <Avatar size={260} icon={<UserOutlined />} />
          <br />
          <span className="fs-5 text-danger fw-bold">
            Tài khoản: {userName}
          </span>
          <br />
          <span className="fs-6">Vai trò: {localStorage.getItem("roles")}</span>
        </div>
        <div className="col-6">
          <Form
            style={{ marginTop: "5%", marginLeft: "13%" }}
            name="basic"
            layout="vertical"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 26,
            }}
            initialValues={{
              fullName: JSON.parse(localStorage.getItem("information"))[0]?.fullName,
              phoneNumber: JSON.parse(localStorage.getItem("information"))[0]?.phoneNumber,
              email: JSON.parse(localStorage.getItem("information"))[0]?.email,
              address: JSON.parse(localStorage.getItem("information"))[0]?.address,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Họ và tên"
              name="fullName"
              //   initialValue={fullName}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Vui lòng  nhập địa chỉ!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 9,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
