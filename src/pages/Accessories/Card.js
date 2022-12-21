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
import { Table, Slider, Select, Input, Button, Modal, Form } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Card() {
    const [data, setData] = useState();
    const columns = [
        {
            title: "Hãng",
            dataIndex: "trandemark",
            width: "22%",
        },
        {
            title: "Model",
            dataIndex: "model",
            width: "22%",
        },
        {
            title: "Bộ nhớ",
            dataIndex: "memory",
            width: "22%",
        },
        {
            title: "Thao tác",
            dataIndex: "Thao tác",
            width: "12%",
            render: (record, card) => {
                return (
                    <>
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

    const [formEdit] = Form.useForm();
    const [isUpdate, setIsUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        const form = {
            trandemark: trandemark,
            memory: memory,
            model: model
        }
        fetch("http://localhost:8080/api/card", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        }).then((results) => {
            getData();
            notifySuccess('Thêm mới card thành công');
        })
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            getData();
        }, 2000);
    };

    const toastSuccess = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSubmit = (data) => {
        if (isUpdate === false) {
            data.status = "ACTIVE";
            fetch("http://localhost:8080/api/card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
                .then((response) => getData())
                .then((data) => {
                    toastSuccess("Thêm mới thành công !");
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            setOpen(false);
        }
    };

    const handleSubmitUpdate = (data, form) => {
        const edit = {
            id: dataEdit.id,
            memory: data.memory,
            model: data.model,
            trandemark: data.trandemark,
        }
        if (isUpdate === false) {
            data.status = "ACTIVE";
            fetch(`http://localhost:8080/api/card/` + edit.id, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(edit)
            })
                .then((response) => getData())
                .then((data) => {
                    toastSuccess("Cập nhật thành công!");
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            setEditing(false);
        }
    };

    const search = () => {
        tableParams.pagination.memory = memorySearch;
        tableParams.pagination.trandemark = trandemarkSearch;
        tableParams.pagination.current = 1;
        setLoading(true);
        fetch(
            `http://localhost:8080/api/card?${qs.stringify(
                getRandomuserParams(tableParams)
            )}`
        )
            .then((res) => res.json())
            .then((results) => {
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
            pageSize: 10,
            memory: '',
            trandemark: ''
        },
    });
    const [totalSet, setTotal] = useState(10);
    const url = "http://localhost:8080/api/card";

    const getData = () => {
        axios.get(url + `?${qs.stringify(
            getRandomuserParams(tableParams)
        )}`)
            .then((results) => {
                setData(results.data.data.data)
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
        model: ''
    }

    const [dataEdit, setDataEdit] = useState({});
    const onEdit = (data) => {
        setEditing(true);
        setDataEdit(data);
        formEdit.setFieldsValue(data);
    };

    const Update = () => {
        cardEdit.trandemark = trandemarkE;
        cardEdit.memory = memoryE;
        cardEdit.model = modelE;
        cardEdit.id = cardId;
        fetch(`http://localhost:8080/api/card/` + cardEdit.id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cardEdit),
        }).then((results) => {
            notifySuccess('Thêm card 1 mới thành công');
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

    const [trandemarkE, setTrandemarkE] = useState('')
    const [modelE, setModelE] = useState('')
    const [memoryE, setMemoryE] = useState('')

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
        model: ''
    })
    const showModalCancel = (card) => {
        setCardDel(card);
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
        <div>
            <div
                className="row"
                style={{
                    borderRadius: "20px",
                    height: "120px",
                    border: "1px solid #d9d9d9",
                    background: "#fafafa",
                    alignItems: "center"
                }}
            >
                <div className="col-4">
                    <Input placeholder="Hãng" value={trandemarkSearch} onChange={onChangeInputTrandemarkSearch} />
                </div>
                <div className="col-4">
                    <Input placeholder="Bộ nhớ" value={memorySearch} onChange={onChangeInputMemorySearch} />
                </div>
                <div className="col-4">
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
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                        width={650}
                        okButtonProps={{
                            style: {
                                display: "none",
                            },
                        }}
                        cancelText={"Đóng"}
                    >
                        <Form
                            initialValues={{
                            }}
                            autoComplete="off"
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}
                            onFinish={(values) => {
                                setIsUpdate(false);
                                handleSubmit(values, isUpdate);
                            }}
                            onFinishFailed={(error) => {
                                console.log({ error });
                            }}
                        >
                            <Form.Item
                                name="trandemark"
                                label="Hãng"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tên hãng không được để trống",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Hãng ..." />
                            </Form.Item>
                            <Form.Item
                                name="model"
                                label="Model"
                                rules={[
                                    {
                                        required: true,
                                        message: "Model không được để trống",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Model ..." />
                            </Form.Item>
                            <Form.Item
                                name="memory"
                                label="Bộ nhớ"
                                rules={[
                                    {
                                        required: true,
                                        message: "Bộ nhớ không được để trống",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Bộ nhớ ..." />
                            </Form.Item>
                            <Form.Item className="text-center">
                                <div className="row">
                                    <div className="col-6">
                                        <Button block type="primary" id="create" htmlType="submit">
                                            Tạo mới
                                        </Button>
                                    </div>
                                </div>
                            </Form.Item>
                        </Form>
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
                        open={isEditing}
                        onCancel={() => {
                            setEditing(false);
                        }}
                        okButtonProps={{
                            style: {
                                display: "none",
                            },
                        }}
                        cancelText={"Đóng"}
                        width={650}
                    >
                        <Form
                            form={formEdit}
                            autoComplete="off"
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}
                            onFinish={(values) => {
                                setIsUpdate(false);
                                handleSubmitUpdate(values, isUpdate);
                            }}
                            onFinishFailed={(error) => {
                                console.log({ error });
                            }}>
                            <Form.Item
                                name="trandemark"
                                label="Hãng"
                                initialValue={dataEdit.trandemark}
                                rules={[
                                    {
                                        required: true,
                                        message: "Tên hãng không được để trống",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="model"
                                label="Model"
                                initialValue={dataEdit.model}
                                rules={[
                                    {
                                        required: true,
                                        message: "Model không được để trống",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="memory"
                                label="Bộ nhớ"
                                initialValue={dataEdit.memory}
                                rules={[
                                    {
                                        required: true,
                                        message: "Bộ nhớ không được để trống",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item className="text-center">
                                <div className="row">
                                    <div className="col-6">
                                        <Button block type="primary" id="create" htmlType="submit">
                                            Cập nhật
                                        </Button>
                                    </div>
                                </div>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        // style={{borderRadius:"10px"}}
                        title="Hiển thị"
                        open={isView}
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