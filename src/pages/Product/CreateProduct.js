import {
    PlusCircleFilled,
    ReloadOutlined,
    UploadOutlined,
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
import { Button, Input, Select, DatePicker, Space } from "antd";
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

function CreateProduct() {
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [images, setImages] = useState([{ name: "" }]);
    const [image, SetImage] = useState();
    const imagesListRef = ref(storage, "images/");
    const uploadFile = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            // getDownloadURL(snapshot.ref).then((url) => {
            //   setImageUrls((prev) => [...prev, url]);
            // });
            console.log(imageUpload);
            console.log(imageRef.fullPath);
            console.log(imageRef.fullPath.slice(7));
            const img1 = imageRef.fullPath.slice(7);
            images.push((name = img1));
            // setImages((prev) => [...prev, img]);
            // setImages(imageRef.fullPath.slice(7));
            alert("upload image success");
        });
    };

    useEffect(() => {
        listAll(imagesListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageUrls((prev) => [...prev, url]);
                });
            });
        });
        console.log("--------------- ảnh ------------");
        images.forEach((image) => console.log(image));
    }, []);
    //xử lý hình ảnh
    const [screenSize, setScreenSize] = useState();
    const [resolution, setResolution] = useState();
    const [frequency, setFrequency] = useState();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState();
    const [p_n, setPN] = useState();
    const [price, setPrice] = useState();
    const [quantity, setQuantity] = useState();
    const [size, setSize] = useState();
    const [weight, setWeight] = useState();
    const [debut, setDebut] = useState();
    const [origin, setOrigin] = useState();
    const [imei, setImei] = useState();
    const [secutity, setSecutity] = useState();
    const [hard_drive, setHardDrive] = useState();
    const [screen, setScreen] = useState();
    const [win, setWin] = useState();
    const [slot, setSlot] = useState();
    const [optical, setOptical] = useState();
    const [processor, SetProcessor] = useState();
    const [battery, setBattery] = useState();
    const [capacity, setCapacity] = useState();
    const [ram, setRam] = useState();
    const [category, setCategory] = useState([]);
    const [categoryId, setCategoryId] = useState();
    const [manufacture, setManufacture] = useState([]);
    const [manufactureId, SetManufactureId] = useState();
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            search1: "",
            search2: "",
        },
    });

    const onChangeDate = (date, dateString) => {
        console.log(dateString);
        setDebut(dateString);
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
        console.log("image sau khi upload");
        console.log(images);
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
        uploadFile();
        const product = {
            name,
            quantity,
            price,
            imei,
            weight,
            size,
            debut,
            p_n,
            origin,
            categoryId,
            manufactureId,
            configurationEntity: {
                processor,
                ram,
                slot,
                battery,
                secutity,
                screen: screenSize + " " + resolution + " " + frequency,
                optical,
                hard_drive,
                win,
                capacity,
            },
        };
        console.log(product);
        fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: product.name,
                quantity: product.quantity,
                price: product.price,
                imei: product.imei,
                weight: product.weight,
                size: product.size,
                debut: product.debut,
                p_n: product.p_n,
                origin: product.origin,
                categoryId: categoryId,
                manufactureId: manufactureId,
                configurationEntity: {
                    processor: product.configurationEntity.processor,
                    ram: product.configurationEntity.ram,
                    slot: product.configurationEntity.slot,
                    battery: product.configurationEntity.battery,
                    secutity: product.configurationEntity.secutity,
                    screen: product.configurationEntity.screen,
                    optical: product.configurationEntity.optical,
                    hard_drive: product.configurationEntity.hard_drive,
                    win: product.configurationEntity.win,
                    capacity: product.configurationEntity.capacity
                },
            }),
        }).then((res) => {
            res.json();
            notify();
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
            <div>
                <div className="row">
                    <div className=" mt-4 col-4">
                        <label>Tên sản phẩm</label>
                        <Input
                            placeholder="Tên sản phẩm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="col-4 mt-4">
                        <label>P/N</label>
                        <Input
                            placeholder="P/N"
                            value={p_n}
                            onChange={(e) => setPN(e.target.value)}
                        />
                    </div>
                    <div className="col-4 mt-4">
                        <label>IMEI</label>
                        <Input
                            placeholder="IMEI"
                            value={imei}
                            onChange={(e) => setImei(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label>Giá tiền</label>
                        <Input
                            placeholder="Giá tiền"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="col-4">
                        <label>Số lượng</label>
                        <Input
                            placeholder="Số lượng"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>
                    <div className="col-4">
                        <label>Kích thước</label>
                        <Input
                            placeholder="Kích thước"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label>Cân nặng</label>
                        <Input
                            placeholder="Cân nặng"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>
                    <div className="col-4">
                        <label>Năm sản xuất</label>
                        <br />
                        <Space direction="vertical">
                            <DatePicker
                                defaultValue={moment("2015/01/01", dateFormat)}
                                onChange={onChangeDate}
                                format={dateFormat}
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
                            value={categoryId}
                            onChange={(e) => {
                                const selectCategory = e.target.value;
                                setCategoryId(selectCategory);
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
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
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
                            value={processor}
                            onChange={(e) => SetProcessor(e.target.value)}
                        />
                    </div>
                    <div className="col-4">
                        <label>RAM</label>
                        <select
                            className="form-select"
                            value={ram}
                            onChange={(e) => {
                                const selectCategory = e.target.value;
                                setRam(selectCategory);
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
                            value={slot}
                            onChange={(e) => setSlot(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label>VGA</label>
                        <select
                            className="form-select"
                            value={capacity}
                            onChange={(e) => {
                                const selectCategory = e.target.value;
                                setCapacity(selectCategory);
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
                            value={hard_drive}
                            onChange={(e) => {
                                const selectCategory = e.target.value;
                                setHardDrive(selectCategory);
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
                            value={optical}
                            onChange={(e) => setOptical(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label>Bảo mật công nghệ</label>
                        <Input
                            placeholder="Bảo mật công nghệ"
                            value={secutity}
                            onChange={(e) => setSecutity(e.target.value)}
                        />
                    </div>
                    <div className="col-4">
                        <label>Kích thước màn hình</label>
                        <select
                            className="form-select"
                            value={screenSize}
                            onChange={(e) => {
                                const selectCategory = e.target.value;
                                setScreenSize(selectCategory);
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
                            value={resolution}
                            onChange={(e) => {
                                const selectCategory = e.target.value;
                                setResolution(selectCategory);
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
                            value={frequency}
                            onChange={(e) => {
                                const selectCategory = e.target.value;
                                setFrequency(selectCategory);
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
                            value={battery}
                            onChange={(e) => setBattery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row"></div>
                <div className="row">
                    <div className="col-4">
                        <label>Hệ điều hành</label>
                        <select
                            className="form-select"
                            value={win}
                            onChange={(e) => {
                                const selectCategory = e.target.value;
                                setWin(selectCategory);
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
                            value={manufactureId}
                            onChange={(e) => {
                                const selectCategory = e.target.value;
                                SetManufactureId(selectCategory);
                            }}
                        >
                            {manufacture.map((manufacture) => (
                                <option key={manufacture.id} value={manufacture.id}>
                                    {manufacture.name}
                                </option>
                            ))}
                        </select>
                        {manufactureId}
                    </div>
                </div>
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
                        <PlusCircleFilled /> Thêm
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
export default CreateProduct;