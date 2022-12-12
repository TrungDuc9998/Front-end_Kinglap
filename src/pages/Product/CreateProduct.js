import {
  PlusCircleFilled,
  DeleteOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../image/firebase/firebase";
import { v4 } from "uuid";
import { Button, Input, Select, DatePicker, Space, Image, Form } from "antd";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import qs from "qs";
import "./product.css";
import moment from "moment";

const { TextArea } = Input;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
});

const toastError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

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

function CreateProduct() {
  
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [length, setLength] = useState();
  const [width, setWidth] = useState();
  const [imei, setImei] = useState();
  const [battery, setBattery] = useState();
  const [category, setCategory] = useState([]);
  const [manufacture, setManufacture] = useState([]);
  const [dataOrigin, setDataOrigin] = useState();
  const [processors, setProcessors] = useState([]);
  const [dataScreen, setDataScreen] = useState([]);
  const [dataRam, setDataRam] = useState([]);
  const [dataCard, setDataCard] = useState([]);
  const [dataStorage, setDataStorage] = useState([]);
  const [dataAccessory, setDataAccessory] = useState([]);
  const [dataColor, setDataColor] = useState([]);
  const [dataWin, setDataWin] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [images, setImages] = useState([]);
  const imagesListRef = ref(storage, "images/"); //all url
  const uploadFile = () => {

    console.log('image upload');
    console.log(imageUpload);

    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    // console.log("imageRef",imageRef)//_service: {…}, _location: {…}
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImages((prev) => [...prev, url]);
        console.log("snapshot.ref", snapshot.ref); //_service: {…}, _location: {…}
        setImageUrls((prev) => [...prev, url]); //set url ->all url
      });
      toastSuccess("upload ảnh thành công !");
    });
  };

  const [form] = Form.useForm();

  //xử lý sau khi uploadfile
  useEffect(() => {
    listAll(imageUpload).then((response) => {
      // console.log("imagesListRef",imagesListRef)
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
          setImages((prev) => [...prev, url]);
        });
      });
    });
    loadDataOrigin();
    loadDataProcess();
    loadDataScreen();
    loadDataRam();
    loadDataCard();
    loadDataBattery();
    loadDataManufacture();
    loadDataAccessor();
    loadDataStorage();
    loadDataColor();
    loadDataWin();
  }, [images]);

  const loadDataWin = () => {
    fetch(
      `http://localhost:8080/api/auth/wins?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataWin(results.data.data);
      });
  };

  const loadDataColor = () => {
    fetch(
      `http://localhost:8080/api/auth/colors?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataColor(results.data.data);
      });
  };

  const loadDataBattery = () => {
    fetch(
      `http://localhost:8080/api/auth/batteryCharger?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setBattery(results.data.data);

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataAccessor = () => {
    fetch(
      `http://localhost:8080/api/auth/accessory?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataAccessory(results.data.data);

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataCard = () => {
    fetch(
      `http://localhost:8080/api/card?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataCard(results.data.data);

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataRam = () => {
    fetch(
      `http://localhost:8080/api/auth/rams?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataRam(results.data.data);

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataOrigin = () => {
    fetch(
      `http://localhost:8080/api/staff/origin?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataOrigin(results.data.data);

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataScreen = () => {
    fetch(
      `http://localhost:8080/api/auth/screens?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataScreen(results.data.data);

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  function getDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    if (day.toString().length == 1) {
      day = "0" + day;
    }
    var date = year + "/" + month + "/" + day;
    return date;
  }

  const getRandomMuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchUsername: params.pagination?.search1,
    searchStatus: params.pagination?.search2,
  });

  const loadDataStorage = () => {
    fetch(
      `http://localhost:8080/api/storage_details?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataStorage(results.data.data);

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataProcess = () => {
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataManufacture = () => {
    fetch(
      `http://localhost:8080/api/staff/manufactures?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setManufacture(results.data.data);

        setTableParams({
          pagination: {
            current: results.data.current_page,
            pageSize: 10,
            total: results.data.total,
          },
        });
      });
  };

  const loadDataCategory = () => {
    fetch(
      `http://localhost:8080/api/staff/category?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setCategory(results.data.data);

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
    loadDataCategory();
    loadDataManufacture();
  }, []);

  const onReset = () => {
    form.resetFields();
  };

  const handleSubmit = (data) => {
    console.log(data);
    data.status = "ACTIVE";
    data.debut = moment(data.debut).format("yyyy");
    const quantity = Number(data.quantity);
    console.log(quantity);
    data.images = imageUrls.map((item) => ({
      name: item,
      product: null,
      return_id: null,
      exchange_id: null,
    }));

    const product = {
      name: data.name,
      quantity: Number(data.quantity),
      price: Number(data.price),
      imei: data.imei,
      weight: Number(data.weight),
      height: Number(data.height),
      width: Number(data.width),
      length: Number(data.length),
      debut: data.debut,
      categoryId: data.categoryId,
      manufactureId: data.manufactureId,
      images: data.images,
      status: "ACTIVE",
      processorId: data.processorId,
      screenId: data.screenId,
      cardId: data.cardId,
      originId: data.originId,
      colorId: data.colorId,
      batteryId: data.batteryId,
      ramId: data.ramId,
      winId: data.win,
      material: data.material,
      cardOnboard: data.cardOnboard,
      accessoryId: data.accessoryId,
      security: data.security,
      description: data.description,
      storageId: data.storageId,
    };

    console.log(product);

    fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((results) => {
        if (results.status === 200) {
          onReset();
          toastSuccess("Thêm mới thành công !");
        } else {
          toastError("Thêm mới sản phẩm thất bại !");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div
      className="row"
      style={{
        borderRadius: "20px",
        height: "100%",
        border: "1px solid #d9d9d9",
        background: "#fafafa",
      }}
    >
      <ToastContainer></ToastContainer>
      <div>
        <Form
          form={form}
          className="me-2 ms-2"
          initialValues={{
            cpuCompany: name,
          }}
          layout="vertical"
          autoComplete="off"
          onFinish={(values) => {
            handleSubmit(values);
            console.log({ values });
          }}
          onFinishFailed={(error) => {
            console.log({ error });
          }}
        >
          <div className="row">
            <div className=" mt-4 col-4">
              <Form.Item
                className="mt-2"
                name="name"
                label="Tên sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Tên sản phẩm không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Nhập tên sản phẩm"
                  value={name}
                />
              </Form.Item>
            </div>
            <div className=" mt-4 col-4">
              <Form.Item
                className="mt-2"
                name="imei"
                label="Mã máy"
                rules={[
                  {
                    required: true,
                    message: "Mã máy không được để trống",
                  },
                  { whitespace: true, message: "Giá trị lớn hơn 3 ký tự" },
                  { min: 3, message: "Giá trị lớn hơn 3 ký tự" },
                ]}
                hasFeedback
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Nhập mã máy"
                  value={imei}
                />
              </Form.Item>
            </div>
            <div className="col-4 mt-4">
              <Form.Item
                className="mt-2"
                name="categoryId"
                label="Thể loại sản phẩm"
                requiredMark="optional"
                rules={[
                  {
                    required: true,
                    message: "Thể loại sản phẩm không được để trống",
                  },
                ]}
              >
                <Select mode="multiple" placeholder="Chọn thể loại">
                  {category.map((cate) => (
                    <Select.Option value={cate.id}>{cate.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="  col-4">
              <Form.Item
                className="mt-2"
                name="price"
                label="Giá tiền"
                rules={[
                  {
                    required: true,
                    message: "Giá tiền không được để trống",
                  },
                  { whitespace: true },
                  { min: 6 },
                ]}
                hasFeedback
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Nhập giá tiền"
                  value={price}
                />
              </Form.Item>
            </div>
            <div className=" col-4">
              <Form.Item
                className="mt-2"
                name="quantity"
                label="Số lượng"
                rules={[
                  {
                    required: true,
                    message: "Giá tiền không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input
                  type="number"
                  style={{ width: "100%" }}
                  placeholder="Nhập giá tiền"
                  value={quantity}
                />
              </Form.Item>
            </div>
            <div className="col-4 ">
              <Form.Item
                className="mt-2"
                name="colorId"
                label="Màu sắc"
                requiredMark="optional"
                rules={[
                  {
                    required: true,
                    message: "Màu sắc không được để trống",
                  },
                ]}
              >
                <Select mode="multiple" placeholder="Chọn màu">
                  {dataColor?.map((item) => (
                    <Select.Option value={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
              <Form.Item
                name="length"
                label="Chiều dài"
                rules={[
                  {
                    required: true,
                    message: "Chiều dài không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Chiều dài"
                  type="number"
                  value={length}
                />
              </Form.Item>
            </div>
            <div className=" col-2">
              <Form.Item
                name="width"
                label="Chiều rộng"
                rules={[
                  {
                    required: true,
                    message: "Chiều rộng được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Chiều rộng"
                  value={width}
                  type="number"
                />
              </Form.Item>
            </div>
            <div className=" col-2">
              <Form.Item
                name="height"
                label="Chiều cao"
                rules={[
                  {
                    required: true,
                    message: "Chiều cao không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Chiều cao"
                  type="number"
                />
              </Form.Item>
            </div>
            <div className=" col-2">
              <Form.Item
                name="weight"
                label="Cân nặng"
                rules={[
                  {
                    required: true,
                    message: "Cân nặng không được để trống",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Cân nặng"
                  type="number"
                />
              </Form.Item>
            </div>
            <div className="col-2">
              <Form.Item
                label="Năm sản xuất"
                name="debut"
                rules={[
                  {
                    required: true,
                    message: "Năm sản xuất không được để trống",
                  },
                ]}
              >
                <DatePicker picker="year" />
              </Form.Item>
            </div>
            <div className="col-2">
              <Form.Item
                className=""
                name="originId"
                label="Xuất xứ"
                requiredMark="optional"
                rules={[
                  {
                    required: true,
                    message: "Xuất xứ không được để trống",
                  },
                ]}
              >
                <Select placeholder="Chọn xuất xứ">
                  {dataOrigin?.map((cate) => (
                    <Select.Option value={cate.id}>{cate.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Form.Item
                name="material"
                label="Chất liệu"
                rules={[
                  {
                    required: true,
                    message: "Chất liệu không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input style={{ width: "100%" }} placeholder="Nhập chất liệu" />
              </Form.Item>
            </div>
            <div className="col-4">
              <Form.Item
                name="ramId"
                label="Ram"
                requiredMark="optional"
                rules={[
                  {
                    required: true,
                    message: "Ram không được để trống",
                  },
                ]}
              >
                <Select placeholder="Chọn ram">
                  {dataRam?.map((item) => (
                    <Select.Option value={item.id}>
                      {item.ramCapacity +
                        " " +
                        item.typeOfRam +
                        " " +
                        item.ramSpeed +
                        " " +
                        item.maxRamSupport}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-4">
              <Form.Item
                name="processorId"
                label="CPU"
                requiredMark="optional"
                rules={[
                  {
                    required: true,
                    message: "CPU không được để trống",
                  },
                ]}
              >
                <Select placeholder="Chọn CPU">
                  {processors?.map((item) => (
                    <Select.Option value={item.id}>
                      {item.cpuCompany +
                        " " +
                        item.cpuTechnology +
                        " " +
                        item.cpuType +
                        " " +
                        item.cpuSpeed}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Form.Item
                name="screenId"
                label="Màn hình"
                requiredMark="optional"
                rules={[
                  {
                    required: true,
                    message: "Màn hình không được để trống",
                  },
                ]}
              >
                <Select placeholder="Chọn màn hình">
                  {dataScreen?.map((item) => (
                    <Select.Option value={item.id}>
                      {item.size +
                        " " +
                        item.screenTechnology +
                        " " +
                        item.resolution +
                        " " +
                        item.screenType}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-4">
              <Form.Item
                name="cardId"
                label="Card rời"
                rules={[
                  {
                    required: true,
                    message: "Card rời không được để trống",
                  },
                ]}
                requiredMark="optional"
              >
                <Select placeholder="Chọn card rời">
                  {dataCard?.map((item) => (
                    <Select.Option value={item.id}>
                      {item.trandemark + " " + item.model + " " + item.memory}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-4">
              <Form.Item
                name="win"
                label="Hệ điều hành"
                requiredMark="optional"
                rules={[
                  {
                    required: true,
                    message: "Hệ điều hành không được để trống",
                  },
                ]}
              >
                <Select placeholder="Chọn hệ điều hành">
                  {dataWin?.map((item) => (
                    <Select.Option value={item.id}>
                      {item.name + " - " + item.version}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-4">
              <Form.Item
                name="cardOnboard"
                label="Card onboard"
                requiredMark="optional"
                rules={[
                  {
                    required: true,
                    message: "Card rời không được để trống",
                  },
                ]}
              >
                <Select placeholder="Chọn card onboard">
                  {dataCard?.map((item) => (
                    <Select.Option value={item.id}>
                      {item.trandemark + " " + item.model + " " + item.memory}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-4">
              <Form.Item
                name="storageId"
                label="Lưu trữ"
                rules={[
                  {
                    required: true,
                    message: "Lưu trữ không được để trống",
                  },
                ]}
                requiredMark="optional"
              >
                <Select placeholder="Chọn ổ cứng">
                  {dataStorage?.map((item) => (
                    <Select.Option value={item.id}>
                      {item.storageType.name +
                        " " +
                        item.type +
                        " " +
                        item.capacity}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-4">
              <Form.Item
                name="batteryId"
                label="Pin"
                requiredMark="optional"
                rules={[
                  {
                    required: true,
                    message: "Pin không được để trống",
                  },
                ]}
              >
                <Select placeholder="Chọn loại pin">
                  {battery?.map((item) => (
                    <Select.Option value={item.id}>
                      {item.batteryType +
                        " " +
                        item.battery +
                        " " +
                        item.charger}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Form.Item
                name="manufactureId"
                label="Hãng sản xuất"
                requiredMark="optional"
                rules={[
                  {
                    required: true,
                    message: "Hãng sản xuất không được để trống",
                  },
                ]}
              >
                <Select placeholder="Chọn loại pin">
                  {manufacture?.map((item) => (
                    <Select.Option value={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-4">
              <Form.Item
                className=""
                name="security"
                label="Bảo mật"
                rules={[
                  {
                    required: true,
                    message: "Bảo mật không được để trống",
                  },
                  { whitespace: true },
                  { min: 3 },
                ]}
                hasFeedback
              >
                <Input style={{ width: "100%" }} placeholder="Bảo mật" />
              </Form.Item>
            </div>
            <div className="col-4">
              <Form.Item
                name="accessoryId"
                label="Phụ kiện trong hộp"
                requiredMark="optional"
                rules={[
                  {
                    required: true,
                    message: "Phụ kiện không được để trống",
                  },
                ]}
              >
                <Select mode="multiple" placeholder="Chọn các phụ kiện">
                  {dataAccessory?.map((item) => (
                    <Select.Option value={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <Form.Item label="Mô tả sản phẩm" name="description">
                <TextArea rows={4} />
              </Form.Item>
            </div>
            <div className="col-7">
              <div className="row mt-5">
                <div className="col-6">
                  <input
                    className="form-control"
                    type="file"
                    onChange={(event) => {
                      setImageUpload(event.target.files[0]);
                    }}
                  />
                </div>
                <div className="col-4">
                  <Button onClick={uploadFile} className="mt-1">
                    {" "}
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
            <div></div>
          </div>
          <Form.Item className="text-center mt-4">
            <Button
              block
              type="primary"
              htmlType="submit"
              style={{ width: "100px" }}
            >
              Tạo mới
            </Button>
            <Button htmlType="button" className="ms-2" onClick={onReset}>
              Làm mới
            </Button>
          </Form.Item>
        </Form>
        <div className="img"></div>
        <div className="row"></div>
        <div className="row"></div>
      </div>
    </div>
  );
}
export default CreateProduct;
