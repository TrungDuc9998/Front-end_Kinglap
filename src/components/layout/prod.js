import { useState } from "react";
import { useEffect } from "react";
import qs from 'qs';
import { Card, Drawer, Input } from "antd";
import Meta from "antd/lib/card/Meta";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { click } from "@testing-library/user-event/dist/click";
import { ToastContainer, toast } from "react-toastify";

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

const Prod = () => {
    const [dataProduct, setDataProduct] = useState([]);
    const [dataSelect, setDataSelect] = useState([]);
    const getRandomuserParams = (params) => ({
        limit: params.pagination?.pageSize,
        page: params.pagination?.current,
        searchUsername: params.pagination?.search1,
        searchStatus: params.pagination?.searchStatus,
    });
    const [tableParamPro, setTableParamPro] = useState({
        pagination: {
            current: 1,
            pageSize: 6,
            search1: "",
            search2: "",
            searchStatus: "ACTIVE",
        },
    });
    const onClickNext = () => {
        // console.log("click");
        // setTableParamPro({
        //     pagination: {
        //         current: 2,
        //         pageSize: 6,
        //         search1: "",
        //         search2: "",
        //         searchStatus: "ACTIVE",
        //     },
        // })
        // getData();
    }
    const getData = () => {
        fetch(
            `http://localhost:8080/api/products?${qs.stringify(
                getRandomuserParams(tableParamPro)
            )}`
        )
            .then((res) => res.json())
            .then((results) => {
                setDataProduct(results.data.data);
            });
    }
    const getDataProductById = (id) => {
        fetch(`http://localhost:8080/api/products/${id}?`)
            .then((res) => res.json())
            .then((results) => {
                setShowData(results)
            });
    };
    const formatCash = (str) => {
        if (str.length > 1) {
            return str
                .split("")
                .reverse()
                .reduce((prev, next, index) => {
                    return (index % 3 ? next : next + ",") + prev;
                });
        } else {
            return "";
        }
    };
    const onChangeInputPN = (value) => {
        console.log("input", value.target.value)

    }
    const [product, setShowData] = useState();
    const onClickEye = (data) => {
        getDataProductById(data.id);
        showDrawer();
    }
    const onClickCart = (data) => {
        console.log("data click", data)
        dataSelect.push(data);
        console.log("selected", dataSelect)
        toastSuccess("Th??nh c??ng");

    }
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    useEffect(() => { getData() }, [])
    return (
        <>
            <div className="row">
                <div className="col-3">
                    <Input placeholder="Nh???p m?? s???n ph???m" onChange={onChangeInputPN} />
                </div>
            </div>
            <div className="row">
                {dataProduct ? dataProduct.map(item => (
                    <div className="col-4 mt-2">
                        <Card
                            style={{ height: '325px' }}
                            cover={
                                <img
                                    style={{ height: '179px' }}
                                    alt="example"
                                    src={item?.images[0]?.name ? item.images[0].name : ""}
                                />
                            }
                            actions={[
                                <EyeOutlined key="setting" style={{ fontSize: '20px', color: '#009999' }} onClick={() => onClickEye(item)} />,
                                <ShoppingCartOutlined key="edit" style={{ fontSize: '25px', color: '#08c' }} onClick={() => onClickCart(item)}></ShoppingCartOutlined>,
                            ]}
                        >
                            <Meta
                                title={item.name}
                                description={item.price}
                            />
                        </Card>
                    </div>
                )) : ""}
                <div style={{ width: '100%' }} className="d-flex justify-content-evenly">
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="page-item">
                                <a class="page-link" aria-label="Previous">
                                    <span aria-hidden="true">Previous</span>
                                </a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" aria-label="Next" onClick={onClickNext}>
                                    <span aria-hidden="true">Next</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <Drawer title={product?.name}
                size="large"
                placement="right" onClose={onClose} open={open}>
                <div className="card">
                    <div className="card-header" style={{ textAlign: "left" }}>
                        Th??ng tin h??ng h??a
                    </div>
                    <div className="card-body row">
                        <div className="col-6">
                            <li>Xu???t x???: {product?.origin.name}</li>
                            <li>Th????ng hi???u: {product?.manufacture.name} </li>
                        </div>
                        <div className="col-6">
                            <li>Th???i ??i???m ra m???t:{product?.debut} </li>
                            <li>H?????ng d???n b???o qu???n: ????? n??i kh?? r??o, nh??? tay</li>
                        </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                        Thi???t k??? tr???ng l?????ng
                    </div>
                    <div className="card-body">
                        <li>
                            K??ch th?????c: {product?.width} x {product?.height} x{" "}
                            {product?.length}
                        </li>
                        <li>Tr???ng l?????ng s???n ph???m: {product?.weight}kg</li>
                        <li>Ch???t li???u: {product?.material}</li>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                        B??? x??? l??
                    </div>
                    <div className="card-body row">
                        <div className="col-6">
                            <li>H??ng CPU: {product?.processor?.cpuCompany}</li>
                            <li>
                                C??ng ngh??? CPU: {product?.processor?.cpuTechnology}
                            </li>
                            <li>T???c ????? CPU: {product?.processor?.cpuSpeed}</li>
                            <li>T???c ????? t???i ??a CPU: {product?.processor?.maxSpeed}</li>
                        </div>
                        <div className="col-6">
                            <li>Lo???i CPU: {product?.processor?.cpuType}</li>
                            <li>S??? nh??n: {product?.processor?.multiplier}</li>
                            <li>S??? lu???ng: {product?.processor?.numberOfThread}</li>
                            <li>B??? nh??? ?????m: {product?.processor?.caching}</li>
                        </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                        RAM
                    </div>
                    <div className="card-body row">
                        <div className="col-6">
                            <li>Dung l?????ng RAM: {product?.ram?.ramCapacity}</li>
                            <li>Lo???i RAM: {product?.ram?.typeOfRam}</li>
                            <li>T???c ????? RAM: {product?.ram?.ramSpeed}</li>
                            <li>S??? khe c???m r???i: {product?.ram?.looseSlot}</li>
                        </div>
                        <div className="col-6">
                            <li>S??? khe RAM c??n l???i: {product?.ram?.remainingSlot}</li>
                            <li>S??? RAM onboard: {product?.ram?.onboardRam}</li>
                            <li>H??? tr??? RAM t???i ??a: {product?.ram?.maxRamSupport}</li>
                        </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                        M??n H??nh
                    </div>
                    <div className="card-body row">
                        <div className="col-6">
                            <li>K??ch th?????c m??n h??nh: {product?.screen?.size}</li>
                            <li>
                                C??ng ngh??? m??n h??nh: {product?.screen?.screenTechnology}
                            </li>
                            <li>????? ph??n gi???i: {product?.screen?.resolution}</li>
                            <li>T???n s??? qu??t: {product?.screen?.scanFrequency}</li>
                            <li>T???m n???n: {product?.screen?.backgroundPanel}</li>
                        </div>
                        <div className="col-6">
                            <li>????? s??ng: {product?.screen?.brightness}</li>
                            <li>????? ph??? m??u: {product?.screen?.colorCoverage}</li>
                            <li>T??? l??? m??n h??nh: {product?.screen?.resolution}</li>
                            <li>
                                M??n h??nh c???m ???ng: {product?.screen?.backgroundPanel}
                            </li>
                            <li>????? t????ng ph???n: {product?.screen?.contrast}</li>
                        </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                        ????? h???a
                    </div>
                    <div className="card-body row">
                        <div className="col-6">
                            <li>
                                <span style={{ fontSize: "20px", fontWeight: "600" }}>
                                    Card onboard
                                </span>
                            </li>
                            <li>H??ng: {product?.cardOnboard?.trandemark}</li>
                            <li>Model: {product?.cardOnboard?.model}</li>
                            <li>B??? nh???: {product?.cardOnboard?.memory}</li>
                        </div>
                        <div className="col-6">
                            <li>
                                <span style={{ fontSize: "20px", fontWeight: "600" }}>
                                    Card r???i
                                </span>
                            </li>
                            <li>H??ng: {product?.card?.trandemark}</li>
                            <li>Model: {product?.card?.model}</li>
                            <li>B??? nh???: {product?.card?.memory}</li>
                        </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                        L??u tr???
                    </div>
                    <div className="card-body row">
                        <div className="col-6">
                            <li>
                                Ki???u ??? c???ng: {product?.storage?.storageDetail?.type}
                            </li>
                            <li>S??? khe c???m: {product?.storage?.number}</li>
                            <li>
                                Lo???i SSD:
                                {product?.storage?.storageDetail.storageType.name}
                            </li>
                            <li>
                                Dung l?????ng: {product?.storage?.storageDetail.capacity}
                            </li>
                        </div>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                        B???o m???t
                    </div>
                    <div className="card-body row">
                        <li>{product?.security}</li>
                    </div>
                    <div className="card-header" style={{ textAlign: "left" }}>
                        H??? ??i???u h??nh
                    </div>
                    <div className="card-body row">
                        <li>OS: {product?.win.name}</li>
                        <li>Version: {product?.win.version}</li>
                    </div>
                </div>
            </Drawer>
        </>
    )
}

export default Prod;