import { useContext, useEffect } from "react";
import { useState } from "react";
import { Select, Image, Card, Collapse } from "antd";
import qs from "qs";
import { useParams } from "react-router-dom";
const { Panel } = Collapse;
import Context from "../../../store/Context";
import {
  addToCart,
  setCheckoutCart,
  viewProduct,
} from "../../../store/Actions";
const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  searchUsername: params.pagination?.search1,
  searchStatus: params.pagination?.searchStatus,
});

function Compare() {
  const initValue = "abc";
  let { id } = useParams();
  const [def, setDef] = useState(initValue);
  const [data, setData] = useState([]);
  const [pro1, setPro1] = useState();
  const [pro2, setPro2] = useState();
  const [state, dispatch] = useContext(Context);
  const [dataProduct, setDataProduct] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      search1: "",
      search2: "",
    },
  });

  useEffect(() => {
    loadDataProduct();
    loadDataProductById(id);
    console.log(def);
  }, [def]);

  const handelCLickProduct = (product) => {
    // console.log("handleClickProduct:", product);
    // if(product === undefined) {
    //   console.log("handleClickProduct:", dataProduct);
    //   dispatch(viewProduct(dataProduct));
    //   console.log("state", state);
    // }else {
    //   dispatch(viewProduct(product));
    //   console.log("state", state);
    // }
  };

  const onChangeProduct = (value) => {
    data.forEach((element) => {
      if (element.id === value) {
        getProductById(element.id, true);
      }
    });
  };

  const onSearchProduct = (searchItem) => {
    console.log("value product click" + searchItem);
  };

  const onChangeProduct2 = (value) => {
    data.forEach((element) => {
      if (element.id === value) {
        console.log("vào iff");
        console.log(element);
        getProductById(element.id, false);
      }
    });
    console.log(value);
  };
  const getProductById = (id, check) => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (check === true) {
          setPro1(res);
        } else {
          setPro2(res);
        }
      });
  };

  const onSearchProduct2 = (searchItem) => {
    console.log("value product click" + searchItem);
  };

  const loadDataProduct = () => {
    console.log("vào load data product");
    fetch(
      `http://localhost:8080/api/products?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setData(results.data.data);
      });
    setDef("B");
  };

  const loadDataProductById = (id) => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setDataProduct(results);
      });
  };

  const onChangeCollapse = (key) => {};

  return (
    <div className="container">
      <div className="row">
        <h4 className="text-center mt-5 fw-bold text-danger">SO SÁNH</h4>
        <h4 className="text-center mb-3">
          {pro1?.name != undefined
            ? pro2?.name != undefined
              ? pro1?.name + " VS " + pro2?.name
              : pro1?.name + " VS ..."
            : pro2 === undefined
            ? dataProduct?.name + " VS ..."
            : dataProduct?.name + "VS" + pro2?.name}
        </h4>
        <hr />
      </div>
      <div className="row">
        <div className="col-12 col-sm-6 ps-5">
          <Select
            allowClear
            showSearch
            placeholder="Tên sản phẩm"
            optionFilterProp="children"
            style={{
              width: "70%",
            }}
            value={pro1?.name == undefined ? dataProduct?.name : pro1?.name}
            // options={data}
            onChange={onChangeProduct}
            onClick={onSearchProduct}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {data != undefined
              ? data.map((item, index) => (
                  <Option key={index} value={item.id}>
                    {item.name}
                    {/* <Image
                      width={90}
                      src={item.images[0].name + " " + item.name}
                    />{" "} */}
                  </Option>
                ))
              : ""}
          </Select>
          <div className="text-center" style={{ width: "70%", height: "60%" }}>
            {pro1 === undefined ? (
              <Image
                className="mt-5"
                width={350}
                src={dataProduct?.images[0]?.name}
              />
            ) : (
              <Image className="mt-5" width={350} src={pro1?.images[0]?.name} />
            )}

            <div className="mt-3 fw-bold mb-3">
              {pro1?.price != undefined ? (
                <div>
                  <h5 className="fw-bold">
                    Giá tiền:
                    <i className="text-danger">
                      {pro1?.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </i>
                  </h5>
                  <h3
                    className="product-name"
                    style={{ fontSize: "16px", textDecoration: "none" }}
                    onClick={() => handelCLickProduct(pro1)}
                  >
                    <a href="/user/product" className="text-primary">
                      Xem chi tiết
                    </a>
                  </h3>
                </div>
              ) : (
                <div>
                  <h5 className="fw-bold">
                    Giá tiền:
                    <i className="text-danger">
                      {dataProduct?.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </i>
                  </h5>
                  <a
                    className="text-center mb-5"
                    style={{ fontSize: "16px", textDecoration: "none" }}
                    onClick={() => handelCLickProduct(pro1)}
                  >
                    <a href="/user/product"> Xem chi tiết</a>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 ps-5">
          <Select
            allowClear
            showSearch
            placeholder="Tên sản phẩm"
            optionFilterProp="children"
            style={{
              width: "70%",
            }}
            onChange={onChangeProduct2}
            onClick={onSearchProduct2}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {data != undefined
              ? data.map((item, index) => (
                  <Option key={index} value={item.id}>
                    {item.name}
                    {/* <Image
                      width={90}
                      src={item.images[0].name + " " + item.name}
                    />{" "} */}
                  </Option>
                ))
              : ""}
          </Select>
          <div className="text-center" style={{ width: "70%", height: "40%" }}>
            <Image className="mt-5" width={350} src={pro2?.images[0]?.name} />
            <div className="mt-3 fw-bold mb-3">
              {pro2?.price != undefined ? (
                <div>
                  <h5 className="fw-bold">
                    Giá tiền:
                    <i className="text-danger">
                      {pro2?.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </i>
                  </h5>
                  <h3
                    className="product-name"
                    style={{ fontSize: "16px", textDecoration: "none" }}
                    onClick={() => handelCLickProduct(pro2)}
                  >
                    <a href="/user/product" className="text-primary">
                      Xem chi tiết
                    </a>
                  </h3>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row bg-light">
        <div className="col-12 mt-5 mb-5">
          <Collapse defaultActiveKey={["1"]} onChange={onChangeCollapse}>
            <Panel header="Thông tin hàng hoá" key="1">
              <div className="row">
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Xuất xứ:{" "}
                    <i className="text-danger">
                      {pro1 === undefined
                        ? dataProduct?.origin.name
                        : pro1?.origin.name}
                    </i>{" "}
                  </p>
                  <p>Thời gian bảo hành: </p>
                  <p>
                    Thương hiệu:{" "}
                    <i className="text-danger">
                      {pro1 === undefined
                        ? dataProduct?.manufacture.name
                        : pro1?.manufacture.name}
                    </i>{" "}
                  </p>
                  <p>
                    Thời điểm ra mắt:{" "}
                    <i className="text-danger">
                      {" "}
                      {pro1 === undefined ? dataProduct?.debut : pro1?.debut}
                    </i>{" "}
                  </p>
                </div>
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Xuất xứ: <i className="text-danger">{pro2?.origin.name}</i>{" "}
                  </p>
                  <p>Thời gian bảo hành: </p>
                  <p>
                    Thương hiệu:{" "}
                    <i className="text-danger">{pro2?.manufacture.name}</i>{" "}
                  </p>
                  <p>
                    Thời điểm ra mắt:{" "}
                    <i className="text-danger">{pro2?.debut}</i>{" "}
                  </p>
                </div>
              </div>
            </Panel>
            <Panel header="Thiết kế trọng lượng" key="2">
              <div className="row">
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Kích thước:
                    <i className="text-danger">
                      {pro1?.width != undefined
                        ? pro1?.width +
                          " x " +
                          pro1?.height +
                          " x " +
                          pro1?.length
                        : ""}

                      {pro1 != undefined
                        ? pro1?.width != undefined
                          ? pro1?.width +
                            " x " +
                            pro1?.height +
                            " x " +
                            pro1?.length
                          : ""
                        : dataProduct?.width +
                          " x " +
                          dataProduct?.height +
                          " x " +
                          dataProduct?.length}
                    </i>
                  </p>
                  <p>
                    Trọng lượng sản phẩm:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1.weight + " kg"
                        : dataProduct?.weight + " kg"}
                    </i>
                  </p>
                  <p>
                    Chất liệu:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1.material
                        : dataProduct?.material}
                    </i>
                  </p>
                </div>
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Kích thước:
                    <i className="text-danger">
                      {pro2?.width != undefined
                        ? pro2?.width +
                          " x " +
                          pro2?.height +
                          " x " +
                          pro2?.length
                        : ""}
                    </i>
                  </p>
                  <p>
                    Trọng lượng sản phẩm:{" "}
                    <i className="text-danger">
                      {pro2?.weight != undefined ? pro2.weight + " kg" : ""}
                    </i>
                  </p>
                  <p>
                    Chất liêu:<i className="text-danger">{pro2?.material}</i>{" "}
                  </p>
                </div>
              </div>
            </Panel>
            <Panel header="Bộ xử lý" key="3">
              <div className="row">
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Hãng CPU:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.processor.cpuCompany
                        : dataProduct?.processor.cpuCompany}
                    </i>{" "}
                  </p>
                  <p>
                    Công nghệ CPU:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.processor.cpuTechnology
                        : dataProduct?.processor.cpuTechnology}
                    </i>{" "}
                  </p>
                  <p>
                    Tốc độ CPU:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.processor.cpuSpeed
                        : dataProduct?.processor.cpuSpeed}
                    </i>{" "}
                  </p>
                  <p>
                    Tốc độ tối đa CPU:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.processor.maxSpeed
                        : dataProduct?.processor.maxSpeed}
                    </i>{" "}
                  </p>
                  <p>
                    Loại CPU:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.processor.cpuType
                        : dataProduct?.processor.cpuType}
                    </i>{" "}
                  </p>
                  <p>
                    Số nhân:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.processor.multiplier
                        : dataProduct?.processor.multiplier}
                    </i>{" "}
                  </p>
                  <p>
                    Số luồng:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.processor.numberOfThread
                        : dataProduct?.processor.numberOfThread}
                    </i>{" "}
                  </p>
                  <p>
                    Bộ nhớ đệm:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.processor.caching
                        : dataProduct?.processor.caching}
                    </i>{" "}
                  </p>
                </div>
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Hãng CPU:
                    <i className="text-danger">
                      {pro2?.processor.cpuCompany}
                    </i>{" "}
                  </p>
                  <p>
                    Công nghệ CPU:
                    <i className="text-danger">
                      {pro2?.processor.cpuTechnology}
                    </i>{" "}
                  </p>
                  <p>
                    Tốc độ CPU:
                    <i className="text-danger">
                      {pro2?.processor.cpuSpeed}
                    </i>{" "}
                  </p>
                  <p>
                    Tốc độ tối đa CPU:
                    <i className="text-danger">
                      {pro2?.processor.maxSpeed}
                    </i>{" "}
                  </p>
                  <p>
                    Loại CPU:
                    <i className="text-danger">
                      {pro2?.processor.cpuType}
                    </i>{" "}
                  </p>
                  <p>
                    Số nhân:
                    <i className="text-danger">
                      {pro2?.processor.multiplier}
                    </i>{" "}
                  </p>
                  <p>
                    Số luồng:
                    <i className="text-danger">
                      {pro2?.processor.numberOfThread}
                    </i>{" "}
                  </p>
                  <p>
                    Bộ nhớ đệm:
                    <i className="text-danger">
                      {pro2?.processor.caching}
                    </i>{" "}
                  </p>
                </div>
              </div>
            </Panel>
            <Panel header="Ram" key="4">
              <div className="row">
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Dung lượng RAM:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.ram.ramCapacity
                        : dataProduct?.ram.ramCapacity}
                    </i>{" "}
                  </p>
                  <p>
                    Loại RAM:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.ram.ramCapacity
                        : dataProduct?.ram.ramCapacity}
                    </i>{" "}
                  </p>
                  <p>
                    Tốc độ RAM:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.ram.ramSpeed
                        : dataProduct?.ram.ramSpeed}
                    </i>{" "}
                  </p>
                  <p>
                    Số khe cắm rời:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.ram.looseSlot
                        : dataProduct?.ram.looseSlot}
                    </i>{" "}
                  </p>
                  <p>
                    Số khe cắm còn lại:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.ram.remainingSlot
                        : dataProduct?.ram.remainingSlot}
                    </i>{" "}
                  </p>
                  <p>
                    Số RAM onboard:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.ram.onboardRam
                        : dataProduct?.ram.onboardRam}
                    </i>{" "}
                  </p>
                  <p>
                    Hỗ trợ RAM tối đa:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.ram.maxRamSupport
                        : dataProduct?.ram.maxRamSupport}
                    </i>{" "}
                  </p>
                </div>
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Dung lượng RAM:
                    <i className="text-danger">{pro2?.ram.ramCapacity}</i>{" "}
                  </p>
                  <p>
                    Loại RAM:
                    <i className="text-danger">{pro2?.ram.typeOfRam}</i>{" "}
                  </p>
                  <p>
                    Tốc độ RAM:
                    <i className="text-danger">{pro2?.ram.ramSpeed}</i>{" "}
                  </p>
                  <p>
                    Số khe cắm rời:
                    <i className="text-danger">{pro2?.ram.looseSlot}</i>{" "}
                  </p>
                  <p>
                    Số khe cắm còn lại:
                    <i className="text-danger">
                      {pro2?.ram.remainingSlot}
                    </i>{" "}
                  </p>
                  <p>
                    Số RAM onboard:
                    <i className="text-danger">{pro2?.ram.onboardRam}</i>{" "}
                  </p>
                  <p>
                    Hỗ trợ RAM tối đa:
                    <i className="text-danger">
                      {pro2?.ram.maxRamSupport}
                    </i>{" "}
                  </p>
                </div>
              </div>
            </Panel>
            <Panel header="Màn hình" key="5">
              <div className="row">
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Kích thước màn hình:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.screen.size
                        : dataProduct?.screen.size}
                      {pro1?.screen.size}
                    </i>{" "}
                  </p>
                  <p>
                    Công nghệ màn hình:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.screen.screenTechnology
                        : dataProduct?.screen.screenTechnology}
                    </i>{" "}
                  </p>
                  <p>
                    Loại màn hình:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.screen.screenType
                        : dataProduct?.screen.screenType}
                    </i>{" "}
                  </p>
                  <p>
                    Độ phân giải:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.screen.resolution
                        : dataProduct?.screen.resolution}
                    </i>{" "}
                  </p>
                  <p>
                    Tần số quét:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.screen.scanFrequency
                        : dataProduct?.screen.scanFrequency}
                    </i>{" "}
                  </p>
                  <p>
                    Tấm nền:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.screen.backgroundPanel
                        : dataProduct?.screen.backgroundPanel}
                    </i>{" "}
                  </p>
                  <p>
                    Độ sáng:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.screen.brightness
                        : dataProduct?.screen.brightness}
                    </i>{" "}
                  </p>
                  <p>
                    Độ phủ màu:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.screen.colorCoverage
                        : dataProduct?.screen.colorCoverage}
                    </i>{" "}
                  </p>
                  <p>
                    Tỷ lệ màn hình:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.screen.screenRatio
                        : dataProduct?.screen.screenRatio}
                    </i>{" "}
                  </p>
                  <p>
                    Màn hình cảm ứng:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.screen.touchScreen
                        : dataProduct?.screen.touchScreen}
                    </i>{" "}
                  </p>
                </div>
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Kích thước màn hình:
                    <i className="text-danger">{pro2?.screen.size}</i>{" "}
                  </p>
                  <p>
                    Công nghệ màn hình:
                    <i className="text-danger">
                      {pro2?.screen.screenTechnology}
                    </i>{" "}
                  </p>
                  <p>
                    Loại màn hình:
                    <i className="text-danger">
                      {pro2?.screen.screenType}
                    </i>{" "}
                  </p>
                  <p>
                    Độ phân giải:
                    <i className="text-danger">
                      {pro2?.screen.resolution}
                    </i>{" "}
                  </p>
                  <p>
                    Tần số quét:
                    <i className="text-danger">
                      {pro2?.screen.scanFrequency}
                    </i>{" "}
                  </p>
                  <p>
                    Tấm nền:
                    <i className="text-danger">
                      {pro2?.screen.backgroundPanel}
                    </i>{" "}
                  </p>
                  <p>
                    Độ sáng:
                    <i className="text-danger">
                      {pro2?.screen.brightness}
                    </i>{" "}
                  </p>
                  <p>
                    Độ phủ màu:
                    <i className="text-danger">
                      {pro2?.screen.colorCoverage}
                    </i>{" "}
                  </p>
                  <p>
                    Tỷ lệ màn hình:
                    <i className="text-danger">
                      {pro2?.screen.resolution}
                    </i>{" "}
                  </p>
                  <p>
                    Màn hình cảm ứng:
                    <i className="text-danger">
                      {pro2?.screen.resolution}
                    </i>{" "}
                  </p>
                </div>
              </div>
            </Panel>
            <Panel header="Card" key="6">
              <div className="row">
                <div className="col-12 col-sm-6 ps-5">
                  <div className="row">
                    <div className="col-12 col-sm-6">
                      <li>
                        <span style={{ fontSize: "20px", fontWeight: "600" }}>
                          Card onboard
                        </span>
                      </li>
                      <p>
                        Hãng:
                        <i className="text-danger">
                          {pro1 != undefined
                            ? pro1?.cardOnboard.trandemark
                            : dataProduct?.cardOnboard.trandemark}
                        </i>{" "}
                      </p>
                      <p>
                        Model:
                        <i className="text-danger">
                          {pro1 != undefined
                            ? pro1?.cardOnboard.model
                            : dataProduct?.cardOnboard.model}
                        </i>{" "}
                      </p>
                      <p>
                        Bộ nhớ:
                        <i className="text-danger">
                          {pro1 != undefined
                            ? pro1?.cardOnboard.memory
                            : dataProduct?.cardOnboard.memory}
                        </i>{" "}
                      </p>
                    </div>
                    <div className="col-12 col-sm-6">
                      <li>
                        <span style={{ fontSize: "20px", fontWeight: "600" }}>
                          Card rời
                        </span>
                      </li>
                      <p>
                        Hãng:
                        <i className="text-danger">
                          {pro1 != undefined
                            ? pro1?.card.memory
                            : dataProduct?.card.memory}
                        </i>{" "}
                      </p>
                      <p>
                        Model:
                        <i className="text-danger">
                          {pro1 != undefined
                            ? pro1?.card.model
                            : dataProduct?.card.model}
                        </i>{" "}
                      </p>
                      <p>
                        Bộ nhớ:
                        <i className="text-danger">
                          {pro1 != undefined
                            ? pro1?.card.memory
                            : dataProduct?.card.memory}
                        </i>{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 ps-5">
                  <div className="row">
                    <div className="col-12 col-sm-6">
                      <li>
                        <span style={{ fontSize: "20px", fontWeight: "600" }}>
                          Card onboard
                        </span>
                      </li>
                      <p>
                        Hãng:
                        <i className="text-danger">
                          {pro2?.cardOnboard.trandemark}
                        </i>{" "}
                      </p>
                      <p>
                        Model:
                        <i className="text-danger">
                          {pro2?.cardOnboard.model}
                        </i>{" "}
                      </p>
                      <p>
                        Bộ nhớ:
                        <i className="text-danger">
                          {pro2?.cardOnboard.memory}
                        </i>{" "}
                      </p>
                    </div>
                    <div className="col-12 col-sm-6">
                      <li>
                        <span style={{ fontSize: "20px", fontWeight: "600" }}>
                          Card rời
                        </span>
                      </li>
                      <p>
                        Hãng:
                        <i className="text-danger">
                          {pro2?.card.trandemark}
                        </i>{" "}
                      </p>
                      <p>
                        Model:
                        <i className="text-danger">{pro2?.card.model}</i>{" "}
                      </p>
                      <p>
                        Bộ nhớ:
                        <i className="text-danger">{pro2?.card.memory}</i>{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
            <Panel header="Lưu trữ" key="7">
              <div className="row">
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    kiểu ổ cứng:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.storage.storageDetail.type
                        : dataProduct?.storage.storageDetail.type}
                    </i>{" "}
                  </p>
                  <p>
                    Số khe cắm:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.storage.number
                        : dataProduct?.storage.number}
                    </i>{" "}
                  </p>
                  <p>
                    Loại SSD:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.storage.storageDetail.storageType.name
                        : dataProduct?.storage.storageDetail.storageType.name}
                    </i>{" "}
                  </p>
                  <p>
                    Dung lượng:
                    <i className="text-danger">
                      {pro1 != undefined
                        ? pro1?.storage.storageDetail.capacity
                        : dataProduct?.storage.storageDetail.capacity}
                    </i>{" "}
                  </p>
                </div>
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    kiểu ổ cứng:
                    <i className="text-danger">
                      {pro2?.storage.storageDetail.type}
                    </i>{" "}
                  </p>
                  <p>
                    Số khe cắm:
                    <i className="text-danger">{pro2?.storage.number}</i>{" "}
                  </p>
                  <p>
                    Loại SSD:
                    <i className="text-danger">
                      {pro2?.storage.storageDetail.storageType.name}
                    </i>{" "}
                  </p>
                  <p>
                    Dung lượng:
                    <i className="text-danger">
                      {pro2?.storage.storageDetail.capacity}
                    </i>{" "}
                  </p>
                </div>
              </div>
            </Panel>
            <Panel header="Bảo mật" key="8">
              <div className="row">
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    <i className="text-danger">
                      *{" "}
                      {pro1?.security != undefined
                        ? pro1?.security
                        : dataProduct?.security}
                    </i>{" "}
                  </p>
                </div>
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    <i className="text-danger">* {pro2?.security}</i>{" "}
                  </p>
                </div>
              </div>
            </Panel>
            <Panel header="Hệ điều hành" key="9">
              <div className="row">
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Hãng CPU:
                    <i className="text-danger">
                      {pro1?.processor.cpuCompany}
                    </i>{" "}
                  </p>
                  <p>
                    Công nghệ CPU:
                    <i className="text-danger">
                      {pro1?.processor.cpuTechnology}
                    </i>{" "}
                  </p>
                  <p>
                    Tốc độ CPU:
                    <i className="text-danger">
                      {pro1?.processor.cpuSpeed}
                    </i>{" "}
                  </p>
                  <p>
                    Tốc độ tối đa CPU:
                    <i className="text-danger">
                      {pro1?.processor.maxSpeed}
                    </i>{" "}
                  </p>
                </div>
                <div className="col-12 col-sm-6 ps-5">
                  <p>
                    Hãng CPU:
                    <i className="text-danger">
                      {pro2?.processor.cpuCompany}
                    </i>{" "}
                  </p>
                  <p>
                    Công nghệ CPU:
                    <i className="text-danger">
                      {pro2?.processor.cpuTechnology}
                    </i>{" "}
                  </p>
                  <p>
                    Tốc độ CPU:
                    <i className="text-danger">
                      {pro2?.processor.cpuSpeed}
                    </i>{" "}
                  </p>
                  <p>
                    Tốc độ tối đa CPU:
                    <i className="text-danger">
                      {pro2?.processor.maxSpeed}
                    </i>{" "}
                  </p>
                </div>
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    </div>
  );
}

export default Compare;
