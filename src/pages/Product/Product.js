import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, Input, Modal, Select, Table, Image } from "antd";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toastrs from "toastr";
import "toastr/build/toastr.min.css";
import * as XLSX from "xlsx/xlsx.mjs";
const EXTENSIONS = ["xlsx", "xls", "csv"];
const { Option } = Select;

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchProductKey: params.pagination?.search1,
  searchStatus: params.pagination?.search2,
  searchPrice: params.pagination?.search3,
  searchPn: params.pagination?.search4,
});

const Product = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [id, setId] = useState();
  //import

  const [fileImp, setFileImp] = useState();
  const [dataImport, setDataImport] = useState();
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
      search3: "",
      search4: "",
    },
  });
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
  };
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
  };

  var i = 0;

  const onScroll = (e) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 400) {
      load();
    }
  };

  const columns = [
    {
      title: "H??nh ???nh",
      dataIndex: "id",
      dataIndex: "data",
      width: "7%",
      render: (id, data) => {
        return (
          <>
            {/* {data?.images.length} */}
            <Image width={100} src={data?.images[0]?.name} />
          </>
        );
      },
    },
    {
      title: "T??n s???n ph???m",
      width: "30%",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (data) => `${data.name} (${data.debut})`,
    },
    {
      title: "Xu???t x???",
      dataIndex: "origin",
      width: "10%",
      render: (origin) => `${origin.name}`,
    },
    {
      title: "Gi?? ti???n",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      width: "10%",
      render: (price) => (
        <>
          {price.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}
        </>
      ),
    },
    {
      title: "S??? l?????ng",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: "10%",
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "status",
      width: "9%",
      render: (status) => {
        if (status == "ACTIVE") {
          return (
            <>
              <div
                className="ant-tag ant-tag-green pt-1 pb-1 text-center"
                style={{ width: "120px", padding: "3px" }}
              >
                Ho???t ?????ng
              </div>
            </>
          );
        }
        if (status == "INACTIVE") {
          return (
            <>
              <div
                className="ant-tag ant-tag-red pt-1 pb-1 text-center"
                style={{ width: "120px", padding: "3px" }}
              >
                Kh??ng ho???t ?????ng
              </div>
            </>
          );
        }
      },
    },
    {
      title: "K??ch ho???t",
      dataIndex: "id",
      dataIndex: "data",
      width: "7%",
      render: (id, data) => {
        if (data.status == "ACTIVE") {
          return (
            <>
              <UnlockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/products/inactive/${data.id}`,
                    { method: "PUT" }
                  ).then(() => load());
                  toastrs.options = {
                    timeOut: 6000,
                  };
                  notifySuccess("Kh??a th??nh c??ng!");
                }}
              />
            </>
          );
        } else {
          return (
            <>
              <LockOutlined
                onClick={() => {
                  setLoading(true);
                  fetch(
                    `http://localhost:8080/api/products/active/${data.id}`,
                    { method: "PUT" }
                  ).then(() => load());
                  toastrs.options = {
                    timeOut: 6000,
                  };
                  notifySuccess("M??? kh??a th??nh c??ng!");
                }}
              />
            </>
          );
        }
      },
    },
    {
      title: "Thao t??c",
      dataIndex: "id",
      dataIndex: "data",
      width: "12%",
      render: (id, data) => {
        return (
          <>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                getProductById(data.id, 1);
              }}
            />
            {/* <DeleteOutlined
              onClick={() => onDelete(data.id)}
              style={{ color: "red", marginLeft: 12 }}
            /> */}
            <CopyOutlined
              style={{ color: "red", marginLeft: 12, fontSize: "20px" }}
              onClick={() => {
                getProductById(data.id, 2);
              }}
            />
            <EyeOutlined
              onClick={() => {
                getProductById(data.id, 3);
              }}
              style={{ color: "blue", marginLeft: 12, fontSize: "20px" }}
            />
          </>
        );
      },
    },
  ];

  const getProductById = (id, check) => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem("productEdit", JSON.stringify(res));
        if (check === 2) {
          navigate(`/admin/product/copy/${res.id}`);
        } else if (check === 3) {
          navigate(`/admin/product/view/${res.id}`);
        } else {
          navigate(`/admin/product/edit/${res.id}`);
        }
      });
  };

  const load = () => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results.data.data);
        setData(results.data.data);
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
    load();
  }, []);
  //data mappro import
  useEffect(() => {
    loadDataCategory();
    loadDataManufacture();
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
  }, []);

  const handleTableChange = (pagination) => {
    tableParams.pagination = pagination;
    tableParams.pagination.search1 = searchProductKey;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.search3 = searchPrice;
    tableParams.pagination.search4 = searchPn;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
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

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [importSuccess, setImportSuccess] = useState(true);
  const [searchProductKey, setSearchProductKey] = useState();
  const [searchPn, setSearchPn] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const [searchPrice, setSearchPrice] = useState();
  const [searchImei, setSearchImei] = useState();
  const [username, setUsername] = useState();
  const [status, setStatus] = useState();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const navigate = useNavigate();

  const search = () => {
    tableParams.pagination.search1 = searchProductKey;
    tableParams.pagination.search2 = searchStatus;
    tableParams.pagination.search3 = searchPrice;
    tableParams.pagination.search4 = searchPn;
    tableParams.pagination.current = 1;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.data.data);
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

  const clearSearchForm = () => {
    load();
    setSearchProductKey("");
    setSearchStatus("");
    setSearchPn("");
    setSearchPrice("");
  };

  const changeSearchProductKey = (event) => {
    setSearchProductKey(event.target.value);
  };

  const changeSearchPn = (event) => {
    setSearchPn(event.target.value);
  };

  const changeSearchStatus = (value) => {
    setSearchStatus(value);
  };

  const changeSearchPrice = (value) => {
    setSearchPrice(value);
  };

  const changeSearchImei = (value) => {
    setSearchImei(value.target.value);
  };

  const onEdit = (id, username, status) => {
    setId(id);
    setEditing(true);
    setUsername(username);
    setStatus(status);
  };

  const onDelete = (id) => {
    setId(id);
    setDelete(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  //xuat excel
  // const downloadExcel=()=>{
  //   const newData=data.map(row=>{
  //     delete row.tableData
  //     return row
  //   })
  //   const workSheet=XLSX.utils.json_to_sheet(newData)
  //   const workBook=XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(workBook,workSheet,"products")
  //   //Buffer
  //   let buf=XLSX.write(workBook,{bookType:"xlsx",type:"buffer"})
  //   //Binary string
  //   XLSX.write(workBook,{bookType:"xlsx",type:"binary"})
  //   //Download
  //   XLSX.writeFile(workBook,"ProductsData.xlsx")
  // }

  const getExention = (file) => {
    const parts = file.name.split(".");
    const extension = parts[parts.length - 1];
    return EXTENSIONS.includes(extension); // return boolean
  };

  const convertToJson = (headers, data) => {
    const rows = [];
    data.forEach((row) => {
      let rowData = {};
      row.forEach((element, index) => {
        rowData[headers[index]] = element;
      });
      rows.push(rowData);
    });
    console.log("rows", rows);
    return rows;
  };

  const loadDataManufacture = () => {
    fetch(
      `http://localhost:8080/api/auth/manufactures?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
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
        getRandomuserParams(tableParams)
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
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

  const loadDataStorage = () => {
    fetch(
      `http://localhost:8080/api/storage_details?${qs.stringify(
        getRandomuserParams(tableParams)
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
        getRandomuserParams(tableParams)
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
      )}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
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

  //import
  const handleImport = (data, index) => {
    console.log(data);
    const row = index + 1;
    var mess = "Import th???t b???i b???n ghi th??? " + row;
    const quantity = Number(data.quantity);
    console.log(quantity);
    data.images = [data.images].map((item) => ({
      name: item,
      product: null,
      return_id: null,
      exchange_id: null,
    }));
    category.forEach((item) =>
      item.name.trim() == data.category ? (data.category = item.id) : ""
    );
    dataColor.forEach((item) =>
      item.name.trim() == data.productColors ? (data.color = item.id) : ""
    );
    dataOrigin.forEach((item) =>
      item.name.trim() == data.origin ? (data.origin = item.id) : ""
    );
    dataRam.forEach((item) =>
      item.ramCapacity.trim() +
        " " +
        item.typeOfRam.trim() +
        " " +
        item.ramSpeed.trim() +
        " " +
        item.maxRamSupport.trim() ==
      data.ram
        ? (data.ram = item.id)
        : ""
    );
    processors.forEach((item) =>
      item.cpuCompany.trim() +
        " " +
        item.cpuTechnology.trim() +
        " " +
        item.cpuType.trim() +
        " " +
        item.cpuSpeed.trim() ==
      data.processor
        ? (data.processor = item.id)
        : ""
    );
    dataScreen.forEach((item) =>
      item.size.trim() +
        " " +
        item.screenTechnology.trim() +
        " " +
        item.resolution.trim() +
        " " +
        item.screenType.trim() ==
      data.screen
        ? (data.screen = item.id)
        : ""
    );
    dataCard.forEach((item) =>
      item.trandemark.trim() +
        " " +
        item.model.trim() +
        " " +
        item.memory.trim() ==
      data.card
        ? (data.card = item.id)
        : ""
    );
    dataWin.forEach((item) =>
      item.name.trim() + " - " + item.version.trim() == data.win
        ? (data.win = item.id)
        : ""
    );
    dataCard.forEach((item) =>
      item.trandemark.trim() +
        " " +
        item.model.trim() +
        " " +
        item.memory.trim() ==
      data.cardOnboard
        ? (data.cardOnboard = item.id)
        : ""
    );
    dataStorage.forEach((item) =>
      item.storageType.name.trim() +
        " " +
        item.type.trim() +
        " " +
        item.capacity.trim() ==
      data.storage
        ? (data.storage = item.id)
        : ""
    );
    battery.forEach((item) =>
      item.batteryType.trim() +
        " " +
        item.battery.trim() +
        " " +
        item.charger.trim() ==
      data.battery
        ? (data.battery = item.id)
        : ""
    );
    manufacture.forEach((item) =>
      item.name.trim() == data.manufacture ? (data.manufacture = item.id) : ""
    );
    dataAccessory.forEach((item) =>
      item.name.trim() == data.accessoryProducts
        ? (data.accessoryId = item.id)
        : ""
    );

    const product = {
      //id:data.id,
      name: data.name,
      quantity: Number(data.quantity),
      price: Number(data.price),
      imei: data.imei,
      weight: Number(data.weight),
      height: Number(data.height),
      width: Number(data.width),
      length: Number(data.length),
      debut: data.debut,
      categoryId: [data.category],
      manufactureId: data.manufacture,
      images: data.images,
      status: data.status,
      processorId: data.processor,
      screenId: data.screen,
      cardId: data.card,
      originId: data.origin,
      colorId: [data.color],
      batteryId: data.battery,
      ramId: data.ram,
      winId: data.win,
      material: data.material,
      cardOnboard: data.cardOnboard,
      accessoryId: [data.accessoryId],
      security: data.security,
      description: data.description,
      storageId: data.storage,
    };

    console.log(product);

    fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('data response');
        console.log(response.data);
        if(response.data) {
          console.log('v??o set image success');
        }
        console.log(importSuccess);
        if(response.errors){
          notifyError(mess);
        } 
      })
      .catch((error) => {
        notifyError(mess);
        console.log("Error:", error);
      });
  };
  const uploadExcel = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      //parse data

      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });

      //get first sheet
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      //convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      // console.log(fileData)
      const headers = fileData[0];
      const heads = headers.map((head) => ({ title: head, field: head }));
      // setColDefs(heads)

      //removing header
      fileData.splice(0, 1);

      setDataImport(convertToJson(headers, fileData));
    };

    if (file) {
      if (getExention(file)) {
        reader.readAsBinaryString(file);
      } else {
        notifyError("?????nh d???ng file kh??ng h???p l???, ch???n Excel, CSV file");
        //setDataImport([])
      }
    } else {
      setDataImport([]);
      // setColDefs([])
    }
  };
  const importExcel = (e) => {
    console.log("dataImport", dataImport);
    dataImport
      ? dataImport.map((pro, index) => {
          handleImport(pro, index);
        })
      : notifyError("H??y ch???n file excel c???n import");
    setDataImport();
    console.log(importSuccess);
    if(importSuccess == true && dataImport != undefined) {
      notifySuccess('Import th??nh c??ng !');
      load();
    }else {
      // notifyError('import th???t b???i !')
    }
    const file = document.querySelectorAll('input[name="file"]');
    file[0].value = null;
    load();
  };

  return (
    <div>
      <ToastContainer />
      <div className="row">
        <div className="col-1" style={{ width: "10px" }}>
          <MenuFoldOutlined style={{ fontSize: "20px" }} />
        </div>
        <div className="col-11">
          <h4 className="text-danger fw-bold">Danh s??ch s???n ph???m</h4>
        </div>
      </div>
      <div
        className="row"
        style={{
          borderRadius: "20px",
          height: "150px",
          border: "1px solid #d9d9d9",
          background: "#fafafa",
        }}
      >
        <div className="row">
          <div className="col-3 mt-1">
            <label>T??m ki???m theo t??? kh??a</label>
            <Input
              type="text"
              name="searchProductKey"
              value={searchProductKey}
              placeholder="Nh???p t??? kh??a"
              onChange={changeSearchProductKey}
            />
          </div>
          <div className="col-3 mt-1">
            <label>P/N</label>
            <br />
            <Input
              type="text"
              name="searchPn"
              value={searchPn}
              placeholder="Nh???p P/N"
              onChange={changeSearchPn}
            />
          </div>
          <div className="col-3 mt-1">
            <label>Tr???ng th??i</label>
            <br />
            <Select
              allowClear={true}
              style={{ width: "400px", borderRadius: "5px" }}
              showSearch
              placeholder="Ch???n tr???ng th??i"
              optionFilterProp="children"
              onChange={changeSearchStatus}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="ACTIVE">Ho???t ?????ng</Option>
              <Option value="INACTIVE">Kh??ng ho???t ?????ng</Option>
            </Select>
          </div>
          <div className="col-3 mt-1">
            <label>M???c gi??</label>
            <br />
            <Select
              allowClear={true}
              style={{ width: "400px", borderRadius: "5px" }}
              showSearch
              placeholder="Ch???n m???c gi??"
              optionFilterProp="children"
              onChange={changeSearchPrice}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="9999999">D?????i 10 tri???u</Option>
              <Option value="10000000">T??? 10 - 15 tri???u</Option>
              <Option value="15000000">T??? 15 - 20 tri???u</Option>
              <Option value="20000000">Tr??n 20 tri???u</Option>
            </Select>
          </div>
          <div className="col-12 text-center ">
            <Button
              className="mt-2"
              type="primary-uotline"
              onClick={clearSearchForm}
              style={{ borderRadius: "10px" }}
            >
              <ReloadOutlined />
              ?????t l???i
            </Button>
            <Button
              className="mx-2  mt-2"
              type="primary"
              onClick={search}
              style={{ borderRadius: "10px" }}
            >
              <SearchOutlined />
              T??m ki???m
            </Button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-2">
          <Button
            className="offset-11 "
            type="primary"
            onClick={() => {
              navigate("/admin/product/create");
            }}
            style={{ borderRadius: "10px" }}
          >
            <PlusOutlined />
            Th??m m???i
          </Button>
          {/* <Button
            className="offset-11 "
            type="primary"
            onClick={() => {
              downloadExcel()
            }}
            style={{ borderRadius: "10px" }}
          >
            <PlusOutlined />
            Xu???t Excel
          </Button> */}
          <input
            type="file"
            name="file"
            value={fileImp}
            onChange={uploadExcel}
          />
          <Button
            className="mx-2"
            type="primary"
            onClick={() => {
              importExcel();
            }}
            style={{ borderRadius: "10px" }}
          >
            <PlusOutlined />
            Import Excel
          </Button>
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
            title="X??a s???n ph???m"
            open={isDelete}
            onCancel={() => {
              setDelete(false);
            }}
            onOk={() => {
              fetch(`http://localhost:8080/api/users/${id}`, {
                method: "DELETE",
              }).then(() => load());
              setDelete(false);
              toastrs.options = {
                timeOut: 6000,
              };
              toastrs.clear();
              notifySuccess("X??a th??nh c??ng!");
            }}
          >
            B???n mu???n x??a ng?????i d??ng n??y ch????
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Product;
