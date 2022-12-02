import axios from "axios";
import qs from "qs";
import { useEffect, useState } from "react";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Table, Slider, Select, Input, Button, Modal } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Card() {
    const [data, setData] = useState();
    const columns = [
        {
            title: "Hãng",
            dataIndex: "trandemark",
            sorter: true,
            width: "20%",
        },
        {
            title: "Model",
            dataIndex: "model",
            sorter: true,
            width: "20%",
        },
        {
            title: "Bộ nhớ",
            dataIndex: "memory",
            sorter: true,
            width: "20%",
        },
        {
            title: "Giá",
            dataIndex: "price",
            sorter: true,
            width: "20%",
        },
        {
            title: "Thao tác",
            dataIndex: "Thao tác",
            width: "30%",
            render: (record, card) => {
                return (
                    <>
                        <EyeOutlined
                            onClick={() => {
                                onView(card);
                            }}
                        />
                        <EditOutlined
                            style={{ marginLeft: 12 }}
                            onClick={() => {
                                onEdit(card);
                            }}
                        />
                        <DeleteOutlined
                            onClick={
                                () => showModalCancel(card)
                            }
                            style={{ color: "red", marginLeft: 12 }}
                        />
                    </>
                );
            },
        },
    ];

    const onChange = (value) => {
        console.log(`selected ${value}`);
    };


    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState("Content of the modal");

    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        const form = {
            trandemark: trandemark,
            memory: memory,
            price: price,
            model: model
        }
        console.log(form)
        fetch("http://localhost:8080/api/card", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        }).then((results) => {
            // console.log(results)
            getData();
            notifySuccess('Thêm mới thành công');
        })

        setModalText("The modal will be closed after two seconds");
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            getData();
        }, 2000);
    };

    const onView = (record) => {
        console.log("record", record)
        setView(true);
    };

    const handleCancel = () => {
        console.log("Clicked cancel button");
        setOpen(false);
    };

    const search = () => {
        tableParams.pagination.memory = memorySearch;
        tableParams.pagination.trandemark = trandemarkSearch;
        tableParams.pagination.current = 1;
        setLoading(true);
        console.log("param", tableParams);
        fetch(
            `http://localhost:8080/api/card?${qs.stringify(
                getRandomuserParams(tableParams)
            )}`
        )
            .then((res) => res.json())
            .then((results) => {
                console.log("res", results.data.data);
                // setData(results.data.data);
                setLoading(false);
                setTableParams({
                    pagination: {
                        current: 1,
                        pageSize: 10,
                        total: results.data.total,
                    },
                });
            });
    };



    const getRandomuserParams = (params) => ({
        limit: params.pagination?.pageSize,
        page: params.pagination?.current,
        trandemark: params.pagination?.trandemarkSearch,
        memory: params.pagination?.memorySearch,
    });
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
            memory: '',
            trandemark: ''
        },
    });
    const [totalSet, setTotal] = useState(10);
    const url = "http://localhost:8080/api/card";
    const [cards, setCards] = useState([]);

    const getData = () => {
        axios.get(url + `?${qs.stringify(
            getRandomuserParams(tableParams)
        )}`)
            .then((results) => {
                setData(results.data.data.data)
                console.log(cards);
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

    const cardEdit = {
        id: '',
        trandemark: '',
        memory: '',
        price: '',
        model: ''
    }
    const onEdit = (card) => {
        setMemoryE(card.memory);
        setTrandemarkE(card.trandemark);
        setModelE(card.model);
        setPriceE(card.price)
        setCardId(card.id)
        setEditing(true);
    };
    const Update = () => {
        cardEdit.trandemark = trandemarkE;
        cardEdit.memory = memoryE;
        cardEdit.price = priceE;
        cardEdit.model = modelE;
        cardEdit.id = cardId;
        fetch(`http://localhost:8080/api/card/` + cardEdit.id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cardEdit),
        }).then((results) => {
            console.log(results)
            notifySuccess('Thêm mới thành công');
            setLoading(true);
        })
    }

    const [isEditing, setEditing] = useState(false);
    const [isDelete, setDelete] = useState(false);
    const [isView, setView] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    const [trandemark, setTrandemark] = useState('')
    const [model, setModel] = useState('')
    const [price, setPrice] = useState()
    const [memory, setMemory] = useState('')
    const [cardId, setCardId] = useState('')
    const [memorySearch, setMemorySearch] = useState('')
    const [trandemarkSearch, setTrandemarkSearch] = useState('')
    const onChangeInputTrandemark = (event) => {
        setTrandemark(event.target.value);
    }
    const onChangeInputTrandemarkSearch = (event) => {
        setTrandemarkSearch(event.target.value);
    }
    const onChangeInputMemorySearch = (event) => {
        setMemorySearch(event.target.value);
    }
    const onChangeInputModel = (event) => {
        setModel(event.target.value);
    }
    const onChangeInputPrice = (event) => {
        setPrice(event.target.value);
    }
    const onChangeInputMemory = (event) => {
        setMemory(event.target.value);
    }


    const [trandemarkE, setTrandemarkE] = useState('')
    const [modelE, setModelE] = useState('')
    const [priceE, setPriceE] = useState('')
    const [memoryE, setMemoryE] = useState('')
    const onChangeInputTrandemarkE = (event) => {
        setTrandemarkE(event.target.value);
    }
    const onChangeInputModelE = (event) => {
        setModelE(event.target.value);
    }
    const onChangeInputPriceE = (event) => {
        setPriceE(event.target.value);
    }
    const onChangeInputMemoryE = (event) => {
        setMemoryE(event.target.value);
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
    const [cardDel, setCardDel] = useState({
        id: '',
        trandemark: "",
        memory: '',
        price: '',
        model: ''
    })
    const showModalCancel = (card) => {
        setCardDel(card);
        console.log(cardDel)
        setDelete(true);
    };

    const Delete = (card) => {
        axios.delete(`http://localhost:8080/api/card/` + card.id)
            .then((resualt) => {
                notifySuccess("Xóa thành công");
                getData();
            })
    }
    return (<>
        <ToastContainer />
        <div>
            <div
                className="row"
                style={{
                    borderRadius: "20px",
                    height: "150px",
                    border: "1px solid #d9d9d9",
                    background: "#fafafa",
                }}
            >
                <div className="col-4 mt-5">
                    <Input placeholder="Hãng" value={trandemarkSearch} onChange={onChangeInputTrandemarkSearch} />
                </div>
                <div className="col-4 mt-5">
                    <Input placeholder="Bộ nhớ" value={memorySearch} onChange={onChangeInputMemorySearch} />
                </div>
                <div className="col-4 mt-5">
                    <Button
                        type="primary-uotline"
                        // onClick={showModal}
                        style={{ borderRadius: "10px" }}
                    >
                        <ReloadOutlined />Đặt lại
                    </Button>
                    <Button
                        className="mx-2 "
                        type="primary"
                        onClick={search}
                        style={{ borderRadius: "10px" }}
                    >
                        <SearchOutlined />Tìm kiếm
                    </Button>
                </div>
            </div>
            <div className="row">
                <div className="col-12 mt-4">
                    <Button
                        className="offset-11 "
                        type="primary"
                        onClick={showModal}
                        style={{ borderRadius: "10px" }}
                    >
                        <PlusOutlined /> Thêm mới
                    </Button>
                    <Modal
                        title="Tạo mới"
                        open={open}
                        onOk={handleOk}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                    >
                        <div className="form group row p-2">
                            <div className="col-6">
                                <label>Hãng</label>
                                <Input placeholder="Hãng"
                                    value={trandemark}
                                    onChange={onChangeInputTrandemark} />
                                <label>Model</label>
                                <Input placeholder="Model"
                                    value={model}
                                    onChange={onChangeInputModel} />
                            </div>
                            <div className="col-6">
                                <label>Bộ nhớ</label>
                                <Input placeholder="Bộ nhớ" value={memory} onChange={onChangeInputMemory} />
                                <label>Giá</label>
                                <Input placeholder="Giá" value={price} onChange={onChangeInputPrice} />
                            </div>

                        </div>
                    </Modal>
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
                    <Table
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={data}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={handleTableChange}
                    />
                    <Modal
                        title="Cập nhật"
                        visible={isEditing}
                        onCancel={() => {
                            setEditing(false);
                        }}
                        onOk={() => {
                            Update(cardEdit);
                            setEditing(false);
                        }}
                    >
                        <div className="form group row p-2">
                            <div className="col-6">
                                <label>Hãng</label>
                                <Input placeholder="Hãng"
                                    value={trandemarkE}
                                    onChange={onChangeInputTrandemarkE}
                                />
                                <label>Model</label>
                                <Input placeholder="Model"
                                    value={modelE}
                                    onChange={onChangeInputModelE}
                                />
                            </div>
                            <div className="col-6">
                                <label>Bộ nhớ</label>
                                <Input placeholder="Bộ nhớ" value={memoryE}
                                    onChange={onChangeInputMemoryE}
                                />
                                <label>Giá</label>
                                <Input placeholder="Giá" value={priceE}
                                    onChange={onChangeInputPriceE}
                                />
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        // style={{borderRadius:"10px"}}
                        title="Hiển thị"
                        visible={isView}
                        onCancel={() => {
                            setView(false);
                        }}
                        onOk={() => {
                            setView(false);
                        }}
                    >
                        <label>
                            Tên thể loại
                            <span className="text-danger"> *</span>
                        </label>
                        <Input placeholder="Tên thể loại" />
                    </Modal>


                    <Modal className="p-5"
                        title="Xác nhận"
                        open={isDelete}
                        onCancel={() => {
                            setDelete(false);
                        }}
                        onOk={() => {
                            Delete(cardDel);
                            setDelete(false);
                            // setLoading(true);

                        }}
                    >
                        <label className="m-3">
                            Bạn có muốn xóa???
                            <span className="text-danger"> !!!!!</span>
                        </label>
                    </Modal>
                </div>
            </div>
        </div >

    </>)
}
export default Card;