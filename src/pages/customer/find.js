import { Card, Checkbox, Col, Radio, Row, Select, Space } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import qs from 'qs';
import axios from "axios";
import product1 from '../../asset/images/products/product01.png'
import { elements } from "chart.js";
import { addToCart, viewProduct } from "../../store/Actions";
import { useContext } from "react";
import Context from "../../store/Context";
import { ToastContainer, toast } from 'react-toastify';
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./css/find.css";



const Find = () => {
    // click product
    const handelCLickProduct = (product) => {
        dispatch(viewProduct(product))
        console.log('state', state)
    }

    // add to cart
    const notifySuccess = (message) => {
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
    }
    const notifyError = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
    const [state, dispatch] = useContext(Context);
    const handleAddToCart = (product) => {
        const findCart = (JSON.parse(localStorage.getItem('carts')) ? JSON.parse(localStorage.getItem('carts')) : []).find(value => {
            return value.id === product.id
        })
        console.log("findCart", findCart)
        if (findCart != null) {
            if (findCart.quantity < 5) {
                dispatch(addToCart(product))
                notifySuccess('Thêm vào giỏ hàng thành công!')
            } else {
                notifyError('Đã tồn tại 5 sản phẩm trong giỏ hàng! Liên hệ cửa hàng để đặt mua số lượng lớn')
            }
        } else {
            dispatch(addToCart(product))
            notifySuccess('Thêm vào giỏ hàng thành công!')
        }


    }
    const handleClickAddToCart = (product) => {
        handleAddToCart(product)
    }

    const [dataProducts, setDataProducts] = useState();
    const [dataProductsFind1, setDataProductsFind1] = useState(dataProducts);
    const [dataProductsFind, setDataProductsFind] = useState(dataProducts);
    const getDataProducts = () => {
        axios.get(`http://localhost:8080/api/products` + `?${qs.stringify(
            getRandomMuserParams(tableParams)
        )}`)
            // .then((res) => res.json())
            .then((results) => {
                setDataProducts(results.data.data.data);
                setDataProductsFind(results.data.data.data);
                setDataProductsFind1(results.data.data.data);
                setTableParams({
                    pagination: {
                        current: results.data.current_page,
                        pageSize: 12,
                        total: results.data.total,
                    },
                });
            });
    };

    const getRandomMuserParams = (params) => ({
        limit: params.pagination?.pageSize,
        page: params.pagination?.current,
        searchStatus: params.pagination?.searchStatus,
    });
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            searchStatus: "ACTIVE",
        },
    });
    const loadDataTrandemark = () => {
        fetch(
            `http://localhost:8080/api/auth/manufactures?${qs.stringify(
                getRandomMuserParams(tableParams)
            )}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token"),
            },
        }
        )
            .then((res) => res.json())
            .then((results) => {
                setDataTrandemark(results.data.data);
                setTableParams({
                    pagination: {
                        current: results.data.current_page,
                        pageSize: 10,
                        total: results.data.total,
                    },
                });
            });
    };



    const onChangeTrandemark = (idTrandemark) => {
        console.log('checked = ', idTrandemark);
        const id = idTrandemark;
        const fin = [];
        if (idTrandemark.length == 0) {
            setDataProductsFind(dataProducts);
            setDataProductsFind1(dataProducts);
            findw(value, dataProducts);
        }
        if (idTrandemark.length > 0) {
            id.forEach(item => {
                const fi = dataProducts.filter((pro) => pro.manufacture.id == item);
                fin.push(...fi);
            });
            console.log(fin);
            setDataProductsFind(fin);
            setDataProductsFind1(fin);
            findw(value, fin);
        }

    };
    const [value, setValue] = useState(0);
    const onChangeRadioPrice = (e) => {
        setValue(e.target.value);
        if (e.target.value == 0) {
            console.log(dataProductsFind1);
            setDataProductsFind(dataProductsFind1);
        } else if (e.target.value == 1) {
            setDataProductsFind(dataProductsFind1.filter((pro) => pro.price < 10000000));

        } else if (e.target.value == 2) {
            setDataProductsFind(dataProductsFind1.filter((pro) => pro.price >= 10000000 && pro.price <= 15000000));
        }
        else if (e.target.value == 3) {
            setDataProductsFind(dataProductsFind1.filter((pro) => pro.price >= 15000000 && pro.price <= 20000000));

        } else if (e.target.value == 4) {
            setDataProductsFind(dataProductsFind1.filter((pro) => pro.price > 20000000));
        }
    };
    const findw = (value, a) => {
        if (value == 1) {
            setDataProductsFind(a.filter((pro) => pro.price < 10000000));

        } else if (value == 2) {
            setDataProductsFind(a.filter((pro) => pro.price >= 10000000 && pro.price <= 15000000));
        }
        else if (value == 3) {
            setDataProductsFind(a.filter((pro) => pro.price >= 15000000 && pro.price <= 20000000));

        } else if (value == 4) {
            setDataProductsFind(a.filter((pro) => pro.price > 20000000));
        }
    }

    const [dataTrandemark, setDataTrandemark] = useState([]);
    function formatCash(str) {
        if (str.length > 1) {
            return str.split('').reverse().reduce((prev, next, index) => {
                return ((index % 3) ? next : (next + ',')) + prev
            })
        } else {
            return ""
        }
    }


    useEffect(() => {
        getDataProducts();
        loadDataTrandemark();
    }, []);
    return <>
        <div className="container">
            <ToastContainer />
            <div className="row">
                <div className="col-3">
                    <Card
                        className="mt-2"
                        title="Hãng sản xuất"
                        style={{
                            width: 300,
                        }}
                    >
                        <Checkbox.Group
                            style={{
                                width: '100%',
                            }}
                            onChange={onChangeTrandemark}
                        >
                            <Row>
                                {dataTrandemark ? dataTrandemark.map(item => (
                                    <Col span={12}>
                                        <Checkbox value={item.id}>{item.name}</Checkbox>
                                    </Col>
                                )) : ""}
                            </Row>
                        </Checkbox.Group>
                    </Card>
                    <Card
                        className="mt-2"
                        title="Mức giá"
                        style={{
                            width: 300,
                        }}
                    >
                        <Radio.Group onChange={onChangeRadioPrice} value={value}>
                            <Space direction="vertical">
                                <Radio value={0}>Tất cả</Radio>
                                <Radio value={1}>Dưới 10 triệu</Radio>
                                <Radio value={2}>Từ 10-15 Triệu</Radio>
                                <Radio value={3}>Từ 15-20 triệu</Radio>
                                <Radio value={4}>Trên 20 triệu</Radio>
                            </Space>
                        </Radio.Group>
                    </Card>
                </div>
                <div className="col-9">
                    <div className="row" style={{ marginTop: "20px" }}>
                        <h3 style={{ fontWeight: 700 }}>LAPTOP</h3>
                        <hr></hr>
                        <>
                            <Swiper
                                slidesPerView={6}
                                spaceBetween={10}
                                freeMode={true}
                                pagination={{
                                    clickable: true,
                                }}
                                modules={[FreeMode, Pagination]}
                                className="mySwiper"
                            >
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/1/4/637769104385571970_Macbook-Apple@2x.jpg" /></a></SwiperSlide>
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/11/22/637732077455069770_Asus@2x.jpg" /></a></SwiperSlide>
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/7/15/637619564183327279_HP@2x.png" /></a></SwiperSlide>
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340494668267616_Lenovo@2x.jpg" /></a></SwiperSlide>
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340493755614653_MSI@2x.jpg" /></a></SwiperSlide>
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/9/16/637674058450623615_Gigabyte@2x.jpg" /></a></SwiperSlide>
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340494666861275_Dell@2x.jpg" /></a></SwiperSlide>
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340494666704995_Acer@2x.jpg" /></a></SwiperSlide>
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/14/637987475787766575_LG.jpg" /></a></SwiperSlide>
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/1/13/637461259692529909_Microsoft@2x.png" /></a></SwiperSlide>
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/12/11/637748124762643705_Chuwi@2x.jpg" /></a></SwiperSlide>
                                <SwiperSlide className="bg-image hover-zoom"><a href="#"><img className="w-100" width={150} src="https://images.fpt.shop/unsafe/fit-in/108x40/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/8/26/637340491898901930_Masstel@2x.jpg" /></a></SwiperSlide>
                            </Swiper>
                        </>
                    </div>
                    <div className="row" style={{ margin: "50px 0px" }}>
                        <h3 style={{ fontWeight: 700 }}>LAPTOP THEO YÊU CẦU</h3>
                        <div className="d-flex justify-content-between">
                            <div className="col-2" style={{ textAlign: "center" }}>
                                <div className="categoryFind">
                                    <a href="#">
                                        <img src="https://images.fpt.shop/unsafe/fit-in/125x125/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/19/637991744177742277_img-gaming.png" />
                                        <h6 style={{ margin: "20px 0px", fontWeight: 700 }}>Gaming</h6>
                                    </a>
                                </div>
                            </div>
                            <div className="col-2" style={{ textAlign: "center" }}>
                                <div className="categoryFind">
                                    <a href="#">
                                        <img src="https://images.fpt.shop/unsafe/fit-in/125x125/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/6/637980583313032986_SV-Văn phòng.png" />
                                        <h6 style={{ margin: "20px 0px", fontWeight: 700 }}>Sinh viên - Văn phòng</h6>
                                    </a>
                                </div>
                            </div>
                            <div className="col-2" style={{ textAlign: "center" }}>
                                <div className="categoryFind">
                                    <a href="#">
                                        <img src="https://images.fpt.shop/unsafe/fit-in/125x125/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/19/637991745714018004_img-thietkedohoa.png" />
                                        <h6 style={{ margin: "20px 0px", fontWeight: 700 }}>Thiết kế đồ họa</h6>
                                    </a>
                                </div>
                            </div>
                            <div className="col-2" style={{ textAlign: "center" }}>
                                <div className="categoryFind">
                                    <a href="#">
                                        <img src="https://images.fpt.shop/unsafe/fit-in/125x125/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/19/637991744678844250_img-mongnhe.png" />
                                        <h6 style={{ margin: "20px 0px", fontWeight: 700 }}>Mỏng nhẹ</h6>
                                    </a>
                                </div>
                            </div>
                            <div className="col-2" style={{ textAlign: "center" }}>
                                <div className="categoryFind">
                                    <a href="#">
                                        <img src="https://images.fpt.shop/unsafe/fit-in/125x125/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/19/637991745141508369_img-doanhnhan.png" />
                                        <h6 style={{ margin: "20px 0px", fontWeight: 700 }}>Doanh nhân</h6>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {dataProductsFind ? dataProductsFind.map((item) => (
                            <div className="col-md-3 col-xs-6" key={item.id}>
                                <div className="product">
                                    <div className="product-img">
                                        <img src={item.images ? item.images[0]?.name : product1} alt="" />
                                        <div className="product-label">
                                            {item.discount ? (<span className="sale">{item.discount.ratio}%</span>) : ""}
                                        </div>
                                    </div>
                                    <div className="product-body">
                                        <p className="product-category">{item.categoryProducts?.category?.name ? item.categoryProducts.category.name : ""}</p>
                                        <h3 className="product-name" onClick={() => handelCLickProduct(item)} ><a href="/user/product">{item.name}</a></h3>
                                        <h4 className="product-price">{formatCash(item.price + "")} VNĐ {item.discount ? <del className="product-old-price">{formatCash(item.price / ((100 - item.discount.ratio) / 100) + "")} VNĐ</del> : ""}</h4>
                                    </div>
                                    <div className="add-to-cart">
                                        <button className="add-to-cart-btn" onClick={() => handleClickAddToCart(item)}> Thêm vào giỏ hàng</button>
                                    </div>
                                </div>
                            </div>
                        )) : "Không có sản phẩm"}

                    </div>
                </div>
            </div>
        </div>
    </>
}
export default Find;