import {
    PlusCircleFilled,
    ReloadOutlined,
    UploadOutlined,
    EditOutlined,
    DeleteOutlined
  } from "@ant-design/icons";
  import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
  } from "firebase/storage";
  import { storage } from "../../image/firebase/firebase";
  import { v4 } from "uuid";
  import { Button, Input, Select, DatePicker, Space, Carousel, Image } from "antd";
  import { useState } from "react";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { useEffect } from "react";
  import qs from "qs";
  import moment from "moment";
  
  
  const children = [];
  const dateFormat = "YYYY/MM/DD";
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  
  function EditProduct() {
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [images, setImages] = useState([]);
    //const [images, setImages] = useState([{ name: "" }]);
  
    const imagesListRef = ref(storage, "images/");//all url
    const uploadFile = () => {
      if (imageUpload == null) return;
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      console.log("imageUpload",imageUpload)//File { name:,...}
      console.log("imageRef",imageRef)//_service: {…}, _location: {…}
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log("url",url)
          setImages((prev) => [...prev, url]);
          console.log("snapshot.ref",snapshot.ref)//_service: {…}, _location: {…}
          setImageUrls((prev) => [...prev, url]);//set url ->all url
        });
        console.log("imageUrls",imageUrls)
        const img1 = imageRef.fullPath;//images/name.jpg69813eb7-a589-45bf-88b3-edd21ce0dac2
        console.log("images",img1)
        alert("upload image success");
      });
    };
  
    //xử lú sau khi uploadfile
    useEffect(() => {
      listAll(imageUpload).then((response) => {
        console.log("imagesListRef",imagesListRef)
        response.items.forEach((item) => {
          console.log("item",item)
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
    const productEdit=JSON.parse(localStorage.getItem("productEdit"))
    

    const [data, setData] = useState({
      name: productEdit.name,
      quantity: productEdit.quantity,
      price: productEdit.price,
      imei: productEdit.imei,
      weight: productEdit.weight,
      size: productEdit.size,
      debut: productEdit.debut,
      p_n: productEdit.p_n,
      origin: productEdit.origin,
      categoryId: productEdit.categoryId,
      manufactureId: productEdit.manufactureId,
      length:productEdit.length,
      width:productEdit.width,
      height:productEdit.height,
      images:productEdit.images.map((item) => 
        ({name:item.name,
        product:null,
        return_id:null,
        exchange_id:null}))
      ,
      configuration: {
        processor: productEdit.configuration.processor,
        ram: productEdit.configuration.ram,
        slot : productEdit.configuration.slot,
        battery: productEdit.configuration.battery,
        security: productEdit.configuration.security,
        screen: productEdit.configuration.screenSize + " " + productEdit.configuration.resolution + " " + productEdit.configuration.frequency,
        optical: productEdit.configuration.optical,
        hard_drive: productEdit.configuration.hard_drive,
        win: productEdit.configuration.win,
        capacity: productEdit.configuration.capacity
      },
    }
    );
    const [form, setValues] = useState({
      name: data.name,
      quantity: data.quantity,
      price: data.price,
      imei: data.imei,
      weight: data.weight,
      size: data.size,
      debut: data.debut,
      p_n: data.p_n,
      origin: data.origin,
      categoryId: data.categoryId,
      manufactureId: data.manufactureId,
      length:data.length,
      width:data.width,
      height:data.height,
      images:data.images?data.images.map((item) => 
        ({name:item.name,
        product:null,
        return_id:null,
        exchange_id:null})):null
      ,
      processor: data.configuration.processor,
      ram: data.configuration.ram,
      slot : data.configuration.slot,
      battery: data.configuration.battery,
      security: data.configuration.security,
      screen: data.configuration.screenSize + " " + data.configuration.resolution + " " + data.configuration.frequency,
      optical: data.configuration.optical,
      hard_drive: data.configuration.hard_drive,
      win: data.configuration.win,
      capacity: data.configuration.capacity
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
      if (dateStrings!= null)
      setValues({
        ...form,
        debut: dateStrings
      });
    };
  
    const notify = () => {
      toast.success("Thêm sản phẩm thành công !", {
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
        `http://localhost:8080/api/manufactures?${qs.stringify(
          getRandomMuserParams(tableParams)
        )}`
      )
        .then((res) => res.json())
        .then((results) => {
          console.log(results.data.data);
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
  
    const loadDataCategory = () => {
      setLoading(true);
      fetch(
        `http://localhost:8080/api/category?${qs.stringify(
          getRandomMuserParams(tableParams)
        )}`
      )
        .then((res) => res.json())
        .then((results) => {
          console.log(results.data.data);
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
  
    useEffect(() => {
      loadDataCategory();
      loadDataManufacture();
      // console.log("image sau khi upload");
      productEdit.images.map((item) => 
        (imageUrls.push(item.name)));
      }, []);
    console.log("form",form);
  
    const handleClick = (e) => {
      e.preventDefault();
      fetch("http://localhost:8080/api/products/"+productEdit.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:productEdit.id,
          name: form.name,
          quantity: form.quantity,
          price: form.price,
          imei: form.imei,
          weight: form.weight,
          size: form.size,
          debut: form.debut,
          p_n: form.p_n,
          origin: form.origin,
          categoryId: form.categoryId,
          manufactureId: form.manufactureId,
          length:form.length,
          width:form.width,
          height:form.height,
          images:imageUrls.map((item) => 
            ({name:item,
            return_id:null,
            exchange_id:null}))
          ,
          configuration: {
            processor: form.processor,
            ram: form.ram,
            slot : form.slot,
            battery: form.battery,
            security: form.security,
            screen: (form.screenSize||form.resolution||form.frequency)?form.screenSize + " " + form.resolution + " " + form.frequency:null,
            optical: form.optical,
            hard_drive: form.hard_drive,
            win: form.win,
            capacity: form.capacity
          },
        }),
      }).then((res) => {
        res.json();
        notify();
      });
    };
   const handleClickRemove=(url)=>{
    const urlImg=imageUrls.filter(i=>i!==url)
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
        <div>
          <div className="row">
            <div className=" mt-4 col-4">
              <label>Tên sản phẩm</label>
              <Input
                placeholder="Tên sản phẩm"
                name="name"
                value={form.name}
                onChange={(e) => handle(e)}
              />
            </div>
            <div className="col-4 mt-4">
              <label>P/N</label>
              <Input
                placeholder="P/N"
                name="p_n"
                value={form.p_n}
                onChange={(e) => handle(e)}
              />
            </div>
            <div className="col-4 mt-4">
              <label>IMEI</label>
              <Input
                placeholder="IMEI"
                name="imei"
                value={form.imei}
                onChange={(e) => handle(e)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <label>Giá tiền</label>
              <Input
                placeholder="Giá tiền"
                name="price"
                value={form.price}
                onChange={(e) => handle(e)}
              />
            </div>
            <div className="col-4">
              <label>Số lượng</label>
              <Input
                placeholder="Số lượng"
                name="quantity"
                value={form.quantity}
                onChange={(e) => handle(e)}
              />
            </div>
            <div className="col-4">
              <label>Kích thước</label>
              <Input
                placeholder="Kích thước"
                name="size"
                value={form.size}
                onChange={(e) => handle(e)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <label>Độ dài</label>
              <Input
                placeholder="Độ dài"
                name="length"
                value={form.length}
                onChange={(e) => handle(e)}
              />
            </div>
            <div className="col-4">
              <label>Độ rộng</label>
              <Input
                placeholder="Độ rộng"
                name="width"
                value={form.width}
                onChange={(e) => handle(e)}
              />
            </div>
            <div className="col-4">
              <label>Cao</label>
              <Input
                placeholder="Cao"
                name="height"
                value={form.height}
                onChange={(e) => handle(e)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <label>Cân nặng</label>
              <Input
                placeholder="Cân nặng"
                name="weight"
                value={form.weight}
                onChange={(e) => handle(e)}
              />
            </div>
            <div className="col-4">
              <label>Năm sản xuất</label>
              <br />
              <Space direction="vertical">
                {/* <DatePicker
                  defaultValue={moment("2015/01/01", dateFormat)}
                  onChange={onChangeDate}
                  format={dateFormat}
                /> */}
                <DatePicker
                  format={dateFormat}
                  onChange={handleChangeDate}
                  onCalendarChange={setDates}
                  value={moment(form.debut, dateFormat)}
                  //type="date"
                />
              </Space>
            </div>
            <div className="col-4">
              <label>
                Thể loại
                <span className="text-danger me-2"> * </span>
              </label>
              <br />
              <select
                className="form-select"
                name="categoryId"
                value={form.categoryId}
                onChange={(e) => {
                //   const selectCategory = e.target.value;
                //   console.log("cate",e.target.value)
                //   setCategoryId(selectCategory);
                handle(e)
                }}
              >
                {category.map((cate) => (
                  <option key={cate.id} value={cate.id}>
                    {cate.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <label>Xuất xứ</label>
              <Input
                placeholder="Xuất xứ"
                name="origin"
                value={form.origin}
                onChange={(e) => handle(e)}
              />
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
              <label>Bộ vi xử lý</label>
              <Input
                placeholder="Bộ xử lý"
                name="processor"
                value={form.processor}
                onChange={(e) => handle(e)}
              />
            </div>
            <div className="col-4">
              <label>RAM</label>
              <select
                className="form-select"
                name="ram"
                value={form.ram}
                onChange={(e) => {
                  handle(e);
                }}
              >
                <option value="4GB">4GB</option>
                <option value="8GB">8GB</option>
                <option value="12GB">12GB</option>
                <option value="16GB">16GB</option>
                <option value="32GB">32GB</option>
                <option value="64GB">64GB</option>
              </select>
            </div>
            <div className="col-4">
              <label>Số khe cắm</label>
              <Input
                placeholder="Số khe cắm"
                name="slot"
                value={form.slot}
                onChange={(e) => handle(e)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <label>VGA</label>
              <select
                className="form-select"
                name="capacity"
                value={form.capacity}
                onChange={(e) => {
                    handle(e)
                }}
              >
                <option value="VGA ADM">VGA ADM</option>
                <option value="VGA NVIDIA">VGA NVIDIA</option>
                <option value="VGA Onboard">VGA Onboard</option>
              </select>
            </div>
  
            <div className="col-4">
              <label>Ổ cứng</label>
              <select
                className="form-select"
                name="hard_drive"
                value={form.hard_drive}
                onChange={(e) => {
                  handle(e)
                }}
              >
                <option value="120GB SSD">120GB - SSD</option>
                <option value="128GB SSD">128GB - SSD</option>
                <option value="256GB SSD">256GB - SSD</option>
                <option value="512GB SSD">512GB - SSD</option>
                <option value="1TB SSD">1TB - SSD</option>
                <option value="120GB HDD">120GB - HDD</option>
                <option value="128GB HDD">128GB - HDD</option>
                <option value="256GB HDD">256GB - HDD</option>
                <option value="512GB HDD">512GB - HDD</option>
                <option value="1TB HDD">1TB HDD</option>
              </select>
            </div>
            <div className="col-4">
              <label>Ổ quang</label>
              <Input
                placeholder="Ổ quang"
                name="optical"
                value={form.optical}
                onChange={(e) => handle(e)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <label>Bảo mật công nghệ</label>
              <Input
                placeholder="Bảo mật công nghệ"
                name="security"
                value={form.security}
                onChange={(e) => handle(e)}
              />
            </div>
            <div className="col-4">
              <label>Kích thước màn hình</label>
              <select
                className="form-select"
                name="creenSize"
                value={form.screenSize}
                onChange={(e) => {
                    handle(e)
                }}
              >
                <option value="11.6 inch">11.6 inch</option>
                <option value="12.3 inch">12.3 inch</option>
                <option value="12.5 inch">12.5 inch</option>
                <option value="12.4 inch">12.4 inch</option>
                <option value="13.3 inch">13.3 inch</option>
                <option value="13.5 inch">13.5 inch</option>
                <option value="13 inch">13 inch</option>
                <option value="14.5 inch">14.5 inch</option>
                <option value="13.6 inch">13.6 inch</option>
                <option value="13.4 inch">13.4 inch</option>
                <option value="15 inch">15 inch</option>
                <option value="14 inch">14 inch</option>
                <option value="15.6 inch">15.6 inch</option>
                <option value="16 inch">16 inch</option>
                <option value="17.3 inch">17.3 inch</option>
                <option value="17 inch">17 inch</option>
              </select>
            </div>
            <div className="col-4">
              <label>Độ phân giải màn hình</label>
              <select
                className="form-select"
                name="resolution"
                value={form.resolution}
                onChange={(e) => {
                    handle(e)
                }}
              >
                <option value="HD (1366 x 768)">HD (1366 x 768)</option>
                <option value="Full HD (1920 x 1080)">
                  Full HD (1920 x 1080)
                </option>
                <option value="WUXGA (1920 x 1200)">WUXGA (1920 x 1200)</option>
                <option value="QHD (2560 x 1440)">QHD (2560 x 1440)</option>
                <option value="WQXGA (2560 x 1600)">WQXGA (2560 x 1600)</option>
                <option value="Pixel Sense (2256 x 1504)">
                  Pixel Sense (2256 x 1504)
                </option>
                <option value="Pixel Sense (2736 x 1824)">
                  Pixel Sense (2736 x 1824)
                </option>
                <option value="Pixel Sense Display (2880 x 1920)">
                  Pixel Sense Display (2880 x 1920)
                </option>
                <option value="2.8K (2880x1800)">2.8K (2880x1800)</option>
                <option value="Retina (2560 x 1600)">Retina (2560 x 1600)</option>
                <option value="Retina (2560 x 1664)">Retina (2560 x 1664)</option>
                <option value="Retina (28880 x 1800)">
                  Retina (28880 x 1800)
                </option>
                <option value="4K (3840 x 2160)">4K (3840 x 2160)</option>
                <option value="Surface laptop go (1536 x 1024)">
                  Surface laptop go (1536 x 1024)
                </option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <label>Tần số màn hình</label>
              <select
                className="form-select"
                name="frequency"
                value={form.frequency}
                onChange={(e) => {
                    handle(e)
                }}
              >
                <option value="60 Hz">60 Hz</option>
                <option value="90 Hz">90 Hz</option>
                <option value="120 Hz">120 Hz</option>
                <option value="144 Hz">144 Hz</option>
                <option value="165 Hz">165 Hz</option>
                <option value="240 Hz">240 Hz</option>
                <option value="300 Hz">300 Hz</option>
                <option value="360 Hz">360 Hz</option>
              </select>
            </div>
            <div className="col-4">
              <label>Giao tiếp không giây</label>
              <Input placeholder="Giao tiếp không giây" />
            </div>
            <div className="col-4">
              <label>Pin</label>
              <Input
                placeholder="Pin"
                name="battery"
                value={form.battery}
                onChange={(e) => handle(e)}
              />
            </div>
          </div>
          <div className="row"></div>
          <div className="row">
            <div className="col-4">
              <label>Hệ điều hành</label>
              <select
                className="form-select"
                name="win"
                value={form.win}
                onChange={(e) => {
                    handle(e)
                }}
              >
                <option value="Window">Window</option>
                <option value="Linux">Linux</option>
                <option value="Mac OS">Mac OS</option>
                <option value="Docs">Docs</option>
              </select>
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
            <div className="col-4">
              <label>
                Hãng sản xuất
                <span className="text-danger me-2"> * </span>
              </label>
              <br />
              <select
                className="form-select"
                value={form.manufactureId}
                onChange={(e) => {
                    handle(e)
                }}
              >
                {manufacture.map((manufacture) => (
                  <option key={manufacture.id} value={manufacture.id}>
                    {manufacture.name}
                  </option>
                ))}
              </select>
              {form.manufactureId}
            </div>
          </div>
        </div>
  
        {/* image */}
        <div className="img">
        <input
          type="file"
          onChange={(event) => {
            setImageUpload(event.target.files[0]);
          }}
        />
        {/* stop */}
        <button onClick={uploadFile}> Upload Image</button>
        <Carousel autoplay>
        {imageUrls?imageUrls.map((url, index) => {
          return (<div style={contentStyle}>
                  <Image.PreviewGroup>
                      <Image src={url}>
                      </Image>
                      {/* <Avatar shape="square" size={200} src={item.name} /> */}
                      <div className="">
                        <button className="" onClick={() => handleClickRemove(url)}  ><DeleteOutlined size={18}></DeleteOutlined> Remove image</button>
                      </div>
                  </Image.PreviewGroup>
                </div>
                )
          }):""}
        </Carousel>
        
      </div>
  
        <div className="row">
          <div className="col-12 mb-3">
            <Button
              className="mt-2"
              type="primary"
              onClick={handleClick}
              style={{ borderRadius: "10px" }}
            >
              {" "}
              <EditOutlined /> Sửa
            </Button>
            <ToastContainer />
          </div>
        </div>
        <div className="row">
          {/* <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          /> */}
          {/* <button onClick={uploadFile}> Upload Image</button> */}
          {/* {imageUrls.map((url,index) => {
            return <img key={index} src={url} />;
          })} */}
        </div>
      </div>
    );
  }
  export default EditProduct;
  