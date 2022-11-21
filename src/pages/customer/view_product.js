import React, { useContext, useEffect, useState } from "react";
import product1 from '../../asset/images/products/product01.png'
import product2 from '../../asset/images/products/product02.png'
import product3 from '../../asset/images/products/product03.png'
import './css/view.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Tabs, Input, Modal } from 'antd'
import Context from "../../store/Context";
import { addToCart, addToCartByView, setCheckoutCart, viewProduct } from "../../store/Actions";
import { json, Link } from "react-router-dom";
import { Eye, Heart, Repeat, ShoppingCart } from "react-feather";
import axios from "axios";
import qs from "qs";
function ViewProduct() {
    const url = 'http://localhost:8080/api/products';
    const [totalSet, setTotal] = useState(10);
    const [products, setData] = useState([{
        id: "",
        name: "",
        price: null,
        quantity: null,
        active: 1,
        imei: null,
        weight: null,
        size: null,
        debut: null,
        categoryId: null,
        images: null
    }]
    );
    const getRandomuserParams = (params) => ({
        limit: params.pagination?.pageSize,
        page: params.pagination?.current,
    });
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5
        },
    });
    //APILoadList
    const getData = () => {
        axios.get(url + `?${qs.stringify(
            getRandomuserParams(tableParams)
        )}`)
            // .then((res) => res.json())
            .then((results) => {
                setData(results.data.data.data);
                //console.log(products[0].images[0].name)
                setTotal(results.data.data.total);
                //localStorage.setItem("products",JSON.stringify(products))
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: totalSet,
                    }
                });
            });
    };

    //LoadList
    useEffect(() => {
        getData();
    }, [JSON.stringify(tableParams)]);

    console.log("pro", products)


    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [quantity, setQuantity] = useState(1);
    const onChangeInputQuantity = (event) => {
        setQuantity(event.target.value);
    }
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
    const [state, dispatch] = useContext(Context);
    console.log('state', state.cartCheckout);
    const product = JSON.parse(localStorage.getItem('product_view'));
    console.log(product)
    const handleAddToCart = (product, quantity) => {
        dispatch(addToCartByView({ product, quantity }))
        notifySuccess('Thêm vào giỏ hàng thành công!')
    }
    const handleClickAddToCart = (product, quantity) => {
        handleAddToCart(product, quantity)
    }

    const handleClickBuyNow = (product) => {
        product.quantity = quantity;
        dispatch(setCheckoutCart([product]))
    }


    return (
        <>
            <ToastContainer />
            <div className="container mt-2">
                <div className="row">
                    <div className="col-2 bg-success">ádasdas</div>
                    <div className="col-5 img-content">
                        <div id="carouselExampleCaptions" className="carousel carousel-dark slide" data-bs-ride="false">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img src={product1} className="d-block w-100" alt="..." />

                                </div>
                                <div className="carousel-item">
                                    <img src={product2} className="d-block w-100" alt="..." />

                                </div>
                                <div className="carousel-item">
                                    <img src={product3} className="d-block w-100" alt="..." />
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className="col-5 info">
                        <div className="product-details">
                            <p className="product-name" style={{ fontWeight: "600", fontSize: '25px' }}>{product.name}</p>
                            <div>
                                <h3 className="product-price">${product.price}<del className="product-old-price ms-3">$3000</del></h3>
                                <span className="product-available">In Stock</span>
                            </div>
                            <p>Mô tả sản phẩm</p>
                            <Input
                                value={quantity}
                                className="m-2"
                                type="number"
                                onChange={onChangeInputQuantity}
                                style={{ width: '30%' }}
                                placeholder="Số lượng"
                                min={1}
                                max={10}
                            />

                            <div className="add-to-cart">
                                <button className="btn-add-to-cart" onClick={() => handleClickAddToCart(product, quantity)}> add to cart</button>
                                <Link to={'/user/checkout'}><button className="btn-add-to-cart ms-2" onClick={() => handleClickBuyNow(product)}>buy now</button></Link>
                            </div>
                            <div>
                                <p style={{ fontSize: '20px', fontWeight: '600' }}>Thông số kĩ thuật</p>
                                <table class="table table-bordered table-hover table-striped">
                                    <tbody>
                                        <tr>
                                            <th scope="row">Màn hình</th>
                                            <td>{product.configuration.screen}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">CPU</th>
                                            <td>{product.configuration.processor}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">RAM</th>
                                            <td>{product.configuration.ram}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Ổ cứng</th>
                                            <td>{product.configuration.hard_drive}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Đồ họa</th>
                                            <td>{product.configuration.screen}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Hệ điều hành</th>
                                            <td>{product.configuration.win}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <a className="text-center" style={{ fontSize: '16px', textDecoration: 'none' }} onClick={showModal} > Xem chi tiết</a>
                                <Modal title={`Chi tiết thông số kĩ thuật ` + product.name} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={{ padding: '0' }}>
                                    <div class="card">
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Thông tin hàng hóa
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>P/N: {product.p_n}</li>
                                                <hr></hr>
                                                <li>Xuất xứ: {product.origin}</li>
                                                <hr></hr>
                                                <li>Thời gian bảo hành: {product.origin}</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Thương hiệu: {product.manufactureId}</li>
                                                <hr></hr>
                                                <li>Thời điểm ra mắt: {product.debut}</li>
                                                <hr></hr>
                                                <li>Hướng dẫn bảo quản: Để nơi khô ráo, nhẹ tay</li>
                                            </div>
                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Thiết kế trọng lượng
                                        </div>
                                        <div class="card-body">
                                            <li>Kích thước: {product.width} x {product.height} x {product.length}</li>
                                            <li>Trọng lượng sản phẩm: {product.weight}kg</li>
                                            <li>Chất liệu: thiếu chất liệu</li>
                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Bộ xử lí
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>

                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            RAM
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>

                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Màn Hình
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>

                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Đồ họa
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>
                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Lưu trữ
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>
                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Bảo mật
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>
                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Giao tiếp & kết nối
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>
                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Âm thanh
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>
                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Bàn phím & TouchPad
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>
                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Thông tin pin & sạc
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>
                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Hệ điều hành
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>
                                        </div>
                                        <div class="card-header" style={{ textAlign: 'left' }}>
                                            Phụ kiện trong hộp
                                        </div>
                                        <div class="card-body row">
                                            <div className="col-6">
                                                <li>Hãng CPU: thiếu</li>
                                                <li>Công nghệ CPU: thiếu</li>
                                                <li>Tốc độ CPU: thiếu</li>
                                                <li>Tốc độ tối đa CPU: thiếu</li>
                                            </div>
                                            <div className="col-6">
                                                <li>Số nhân: thiếu</li>
                                                <li>Số luồng: thiếu</li>
                                                <li>Bộ nhớ đệm: thiếu</li>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>

                    {/* <div className="col-md-12" style={{ height: '400px' }} >
                        <div className="product-tab">
                            <Tabs
                                centered="true"
                                defaultActiveKey="1"
                                // onChange={onChange}
                                className="tab-nav"
                                items={[
                                    {
                                        label: `Description`,
                                        key: 'tab1',
                                        children: <div>
                                            Mô tả
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                        </div>
                                    },
                                    {
                                        label: `Detail`,
                                        key: 'tab2',
                                        children: "tab2"
                                    }
                                ]} />
                        </div>
                    </div> */}
                    <div className="mb-5 mt-5">
                        <div className="col-12 text-center mb-4"><p style={{ fontSize: '30px', fontWeight: '600' }}>RELATED PRODUCTS</p></div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="row" style={{ paddingLeft: "10%" }}>
                                    {products.map(pro => (
                                        <div className="product col-2" key={pro.id}>
                                            <div className="product-img">
                                                <img src={product1} alt="" />
                                                <div className="product-label">
                                                    <span className="sale">-30%</span>
                                                    <span className="new">NEW</span>
                                                </div>
                                            </div>
                                            <div className="product-body">
                                                <p className="product-category">Category</p>
                                                <h3 className="product-name" ><a href="/user/product">{pro.name}</a></h3>
                                                <h4 className="product-price">VNĐ {pro.price} <del className="product-old-price">$990.00</del></h4>
                                                <div className="product-rating">
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                                <div className="product-btns">
                                                    <button className="add-to-wishlist"><Heart size={14}></Heart><span className="tooltipp">add to wishlist</span></button>
                                                    <button className="add-to-compare"><Repeat size={14}></Repeat><span className="tooltipp">add to compare</span></button>
                                                    <button className="quick-view"><Eye size={14}></Eye><span className="tooltipp">quick view</span></button>
                                                </div>
                                            </div>
                                            <div className="add-to-cart">
                                                <button className="add-to-cart-btn" ><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>)
}

export default ViewProduct