import { Button, DatePicker, Form, Input, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import {
  getDownloadURL,
  listAll, ref,
  uploadBytes
} from "firebase/storage";
import moment from "moment";
import qs from "qs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 } from "uuid";
import { storage } from "../../image/firebase/firebase";

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
});

const children = [];
const dateFormat = "YYYY/MM/DD";
const handleChange = (value) => {
  console.log(`selected ${value}`);
};

function EditProduct() {
  const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [images, setImages] = useState([]);
  const [screenSize, setScreenSize] = useState("11.6 inch");
  const [resolution, setResolution] = useState("HD (1366 x 768)");
  const [frequency, setFrequency] = useState("60 Hz");
  const [name, setName] = useState();
  const [p_n, setPN] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [size, setSize] = useState();
  const [weight, setWeight] = useState();
  const [length, setLength] = useState();
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();
  const [debut, setDebut] = useState(getDate);
  const [description, setDescription] = useState();
  const [origin, setOrigin] = useState();
  const [imei, setImei] = useState();
  const [security, setSecurity] = useState();
  const [hard_drive, setHardDrive] = useState("120GB SSD");
  const [screen, setScreen] = useState();
  const [win, setWin] = useState("Window");
  const [slot, setSlot] = useState();
  const [optical, setOptical] = useState();
  const [processor, SetProcessor] = useState();
  const [battery, setBattery] = useState();
  const [capacity, setCapacity] = useState("VGA ADM");
  const [ram, setRam] = useState("4GB");
  const [categoryId, setCategoryId] = useState(1);
  const [manufactureId, setManufactureId] = useState(1);
  const [dataOrigin, setDataOrigin] = useState();
  const [processors, setProcessors] = useState([]);
  const [dataScreen, setDataScreen] = useState([]);
  const [dataRam, setDataRam] = useState([]);
  const [dataCard, setDataCard] = useState([]);
  const [dataStorage, setDataStorage] = useState([]);
  const [dataAccessory, setDataAccessory] = useState([]);
  const [dataColor, setDataColor] = useState([]);
  //const [images, setImages] = useState([{ name: "" }]);

  const [clearForm] = Form.useForm();

  const onReset = () => {
    clearForm.resetFields();
    clearForm.setFieldValue();
  };

  const imagesListRef = ref(storage, "images/");//all url
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    console.log("imageUpload", imageUpload)//File { name:,...}
    console.log("imageRef", imageRef)//_service: {…}, _location: {…}
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log("url", url)
        setImages((prev) => [...prev, url]);
        console.log("snapshot.ref", snapshot.ref)//_service: {…}, _location: {…}
        setImageUrls((prev) => [...prev, url]);//set url ->all url
      });
      console.log("imageUrls", imageUrls)
      const img1 = imageRef.fullPath;//images/name.jpg69813eb7-a589-45bf-88b3-edd21ce0dac2
      console.log("images", img1)
      alert("upload image success");
    });
  };

  //xử lú sau khi uploadfile
  useEffect(() => {
    listAll(imageUpload).then((response) => {
      console.log("imagesListRef", imagesListRef)
      response.items.forEach((item) => {
        console.log("item", item)
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
          setImages((prev) => [...prev, url]);
        });
      });
    });
    console.log("--------------- ảnh ------------");
    imageUrls.forEach((image) => console.log(image));
  }, [images]);

  const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  //xử lý hình ảnh
  // const [screenSize, setScreenSize] = useState("11.6 inch");
  // const [resolution, setResolution] = useState("HD (1366 x 768)");
  // const [frequency, setFrequency] = useState("60 Hz");
  const [loading, setLoading] = useState(false);
  // const [name, setName] = useState();
  // const [p_n, setPN] = useState();
  // const [price, setPrice] = useState();
  // const [quantity, setQuantity] = useState();
  // const [size, setSize] = useState();
  // const [weight, setWeight] = useState();
  // const [length, setLength] = useState();
  // const [height, setHeight] = useState();
  // const [width, setWidth] = useState();
  // const [debut, setDebut] = useState(getDate);
  // const [origin, setOrigin] = useState();
  // const [imei, setImei] = useState();
  // const [security, setSecurity] = useState();
  // const [hard_drive, setHardDrive] = useState("120GB SSD");
  // const [screen, setScreen] = useState();
  // const [win, setWin] = useState("Window");
  // const [slot, setSlot] = useState();
  // const [optical, setOptical] = useState();
  // const [processor, SetProcessor] = useState();
  // const [battery, setBattery] = useState();
  // const [capacity, setCapacity] = useState("VGA ADM");
  // const [ram, setRam] = useState("4GB");
  const [category, setCategory] = useState([]);
  // const [categoryId, setCategoryId] = useState(1);
  const [manufacture, setManufacture] = useState([]);
  // const [manufactureId, setManufactureId] = useState(1);
  const productEdit = JSON.parse(localStorage.getItem("productEdit"))


  const [data, setData] = useState({
    name: productEdit?.name,
    quantity: productEdit?.quantity,
    price: productEdit?.price,
    imei: productEdit?.imei,
    weight: productEdit?.weight,
    size: productEdit?.size,
    debut: productEdit?.debut,
    material: productEdit?.material,
    p_n: productEdit?.p_n,
    origin: productEdit?.origin,
    category: productEdit?.category,
    manufacture: productEdit?.manufacture,
    description: productEdit?.description,
    accessoryProducts: productEdit?.accessoryProducts,
    productColors: productEdit?.productColors,
    storage: productEdit?.storage,
    length: productEdit?.length,
    width: productEdit?.width,
    height: productEdit?.height,
    images: productEdit?.images.map((item) =>
    ({
      name: item.name,
      product: null,
      return_id: null,
      exchange_id: null
    }))
    ,
    configuration: {
      processor: productEdit?.processor,
      ram: productEdit?.ram,
      slot: productEdit?.slot,
      battery: productEdit?.battery,
      security: productEdit?.security,
      screen: productEdit?.screen,
      card: productEdit?.card,
      cardOnboard: productEdit?.cardOnboard,
      hard_drive: productEdit?.hard_drive,
      win: productEdit?.win,
      capacity: productEdit?.capacity
    },
  }
  );

  const [form, setValues] = useState({
    name: data?.name,
    quantity: data?.quantity,
    price: data?.price,
    imei: data?.imei,
    weight: data?.weight,
    size: data?.size,
    debut: data?.debut,
    p_n: data?.p_n,
    origin: data?.origin,
    category: data?.category,
    manufacture: data?.manufacture,
    material: data?.material,
    length: data?.length,
    width: data?.width,
    height: data?.height,
    images: data?.images ? data.images.map((item) =>
    ({
      name: item.name,
      product: null,
      return_id: null,
      exchange_id: null
    })) : null
    ,
    processor: data?.configuration.processor,
    ram: data?.configuration.ram,
    slot: data?.configuration.slot,
    battery: data?.configuration.battery,
    security: data?.configuration.security,
    screen: data?.configuration.screen,
    storage: data?.storage,
    card: data?.configuration.card,
    description: data?.description,
    accessoryProducts: data?.accessoryProducts,
    productColors: data?.productColors,
    cardOnboard: data?.configuration.cardOnboard,
    hard_drive: data?.configuration.hard_drive,
    win: data?.configuration.win,
    capacity: data?.configuration.capacity
  }
  );

  const handle = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  }
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });
  function getDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month.toString().length == 1) {
      month = '0' + month;
    }
    if (day.toString().length == 1) {
      day = '0' + day;
    }
    var date = year + '/' + month + '/' + day;
    return date;
  }

  // const onChangeDate = (date, dateString) => {
  //   console.log(dateString);
  //   setDebut(dateString);
  // };
  const handleChangeDate = (val, dateStrings) => {
    setValues({
      ...form,
      debut: dateStrings
    });
    //setDebut(dateStrings);
  };

  //Calendar
  const setDates = (val, dateStrings) => {
    console.log(dateStrings);
    if (dateStrings != null)
      setValues({
        ...form,
        debut: dateStrings
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

  const notify = () => {
    toast.success("Sửa sản phẩm thành công !", {
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

  const getRandomMuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    searchUsername: params.pagination?.search1,
    searchStatus: params.pagination?.search2,
  });

  const loadDataManufacture = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/manufactures?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setManufacture(results.data.data);
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

  const loadDataColor = () => {
    fetch(
      `http://localhost:8080/api/auth/colors?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataColor(results.data.data);
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

  const loadDataCategory = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/category?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setCategory(results.data.data);
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

  const loadDataRam = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/rams?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataRam(results.data.data);
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

  const loadDataScreen = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/screens?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataScreen(results.data.data);
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

  const loadDataProcess = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/auth/processors?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setProcessors(results.data.data);
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

  const loadDataOrigin = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/staff/origin?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataOrigin(results.data.data);
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

  const loadDataCard = () => {
    fetch(
      `http://localhost:8080/api/card?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataCard(results.data.data);
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

  const loadDataBattery = () => {
    fetch(
      `http://localhost:8080/api/auth/batteryCharger?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setBattery(results.data.data);
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

  const loadDataAccessor = () => {
    fetch(
      `http://localhost:8080/api/auth/accessory?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataAccessory(results.data.data);
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

  const dateFormat = 'YYYY';

  const loadDataStorage = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/storage_details?${qs.stringify(
        getRandomMuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setDataStorage(results.data.data);
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
    loadDataCategory();
  }, [images]);
  console.log("form", form);

  const handleClick = (values) => {
    console.log(values)
    fetch("http://localhost:8080/api/products/" + productEdit.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        quantity: values.quantity,
        price: values.price,
        imei: values.imei,
        weight: values.weight,
        length: values.length,
        width: values.width,
        debut: form?.debut,
        height: values.height,
        size: values.size,
        status: form?.status,
        p_n: values.p_n,
        material: values.material,
        images: form?.images ? form?.images.map((item) =>
        ({
          name: item.name,
          product: null,
          return_id: null,
          exchange_id: null
        })) : null
        ,
        processorId: values.processorId,
        RamId: values.ramId,
        batteryId: values.batteryId,
        security: values.security,
        screenId: values.screenId,
        originId: values.originId,
        categoryId: values.categoryId,
        manufactureId: values.manufactureId,
        storageId: values.storageId,
        cardId: values.cardId,
        cardOnboard: values.cardOnboard,
        description: values.description,
        accessoryId: values.accessoryId,
        colorId: values.colorId,
        win: values.win,
      }),
    }).then(() => {
      localStorage.removeItem("productEdit")
      toastSuccess("Cập nhật sản phẩm thành công!");
      setTimeout(() => {
        navigate("/admin/product");
      }, 3000);
    });
  };
  const handleClickRemove = (url) => {
    const urlImg = imageUrls.filter(i => i !== url)
    console.log("urlImg", urlImg)
      (setImageUrls(urlImg));
  }
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
          form={clearForm}
          className="me-2 ms-2"
          initialValues={{
            cpuCompany: name,
          }}
          layout="vertical"
          autoComplete="off"
          onFinish={(values) => {
            handleClick(values);
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
                initialValue={form.imei}
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
                initialValue={form.category?.id}
                rules={[
                  {
                    required: true,
                    message: "Thể loại sản phẩm không được để trống",
                  },
                ]}
              >
                <Select placeholder="Chọn thể loại">
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
                initialValue={form.price}
                rules={[
                  {
                    required: true,
                    message: "Giá tiền không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input
                  type="number"
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
                initialValue={form.quantity}
                rules={[
                  {
                    required: true,
                    message: "Số lượng không được để trống",
                  },
                ]}
                hasFeedback
              >
                <Input
                  type="number"
                  style={{ width: "100%" }}
                  placeholder="Nhập số lượng"
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
                initialValue={form.productColors?.map((item) => (item.color.id))}
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
                initialValue={form.length}
                rules={[
                  {
                    required: true,
                    message: "Chiều dài không được để trống",
                  },
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
                initialValue={form.width}
                rules={[
                  {
                    required: true,
                    message: "Chiều rộng được để trống",
                  },
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
                initialValue={form.height}
                rules={[
                  {
                    required: true,
                    message: "Chiều cao không được để trống",
                  },
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
                initialValue={form.weight}
                rules={[
                  {
                    required: true,
                    message: "Cân nặng không được để trống",
                  },
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
                initialValue={moment(form.debut)}
                rules={[
                  {
                    required: true,
                    message: "Năm sản xuất không được để trống!",
                  },
                ]}
              >
                <DatePicker picker="year" format={dateFormat} />
              </Form.Item>
            </div>
            <div className="col-2">
              <Form.Item
                className=""
                name="originId"
                label="Xuất xứ"
                requiredMark="optional"
                initialValue={form.origin?.id}
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
                initialValue={form.material}
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
                initialValue={form.ram?.id}
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
                initialValue={form.processor?.id}
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
                initialValue={form.screen?.id}
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
                initialValue={form.card?.id}
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
                initialValue={form.win}
                rules={[
                  {
                    required: true,
                    message: "Hệ điều hành không được để trống",
                  },
                ]}
              >
                <Select placeholder="Chọn hệ điều hành">
                  <Select.Option value="Linux">Linux</Select.Option>
                  <Select.Option value="Window">Window</Select.Option>
                  <Select.Option value="MacOS">MacOS</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-4">
              <Form.Item
                name="cardOnboard"
                label="Card onboard"
                requiredMark="optional"
                initialValue={form.cardOnboard?.id}
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
                initialValue={form.storage?.id}
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
                initialValue={form.battery?.id}
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
                initialValue={form.manufacture?.id}
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
                initialValue={form.security}
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
                initialValue={form.accessoryProducts?.map((item) => (item.accessory.id))}
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
              <Form.Item label="Mô tả sản phẩm" name="description" initialValue={form.description} onChange={(e) => setDescription(e.target.value)}>
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
              Cập nhật
            </Button>
            <Button htmlType="button" className="ms-2" onClick={onReset}>
              Làm mới
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
export default EditProduct;
