import React, { useState, useEffect } from "react";
import "./newProduct.scss";
import { useFormik } from "formik";

import productApi from "../../api/productApi.js";

import categoryApi from "../../api/categoryApi";
import colorApi from "../../api/colorApi";
import sizeApi from "../../api/sizeApi";

//notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Button, Checkbox, Col, Input, Radio, Row, Select, Space } from "antd";

//firebase
import { storage } from "../../firebase";

import { Link, useHistory } from "react-router-dom";

import newImage from "../../assets/images/newImage.jpg";

import { ToTopOutlined } from "@ant-design/icons";
import brandsApi from "../../api/brandApi";

const { Option } = Select;

export default function NewProduct() {
  const [listCate, setListCate] = useState();

  const [listColor, setListColor] = useState();

  const [listSize, setListSize] = useState();
  const [listBrand, setListBrand] = useState([]);

  const [progress, setProgress] = useState(0);
  const [progress2, setProgress2] = useState(0);

  const [url, setUrl] = useState("");
  const [url2, setUrl2] = useState("");

  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      sizeArray: [],
      color: [],
      category: [],
      image01: "",
      image02: "",
      brand: "",
    },
    onSubmit: (values) => {
      console.log("this value", values);

      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    try {
      const response = await productApi.add(values);
      if (response) {
        toast.success("Thêm sản phầm thành công!");

        setTimeout(() => {
          // localStorage.clear();
          history.push("/products");
          // window.location.reload();
        }, 1000);
      }
    } catch (error) {
      toast.error("Add fail because " + error.message, { autoClose: false });
    }
  };

  useEffect(() => {
    const fetchTotoList = async () => {
      try {
        const category = await categoryApi.getAll();
        const size = await sizeApi.getAll();
        const color = await colorApi.getAll();
        const brand = await brandsApi.getAll();

        setListBrand(brand.brands);
        setListCate(category.categories);
        setListSize(size.sizes);
        setListColor(color.colors);
      } catch (error) {
        console.log("error:", error);
      }
    };

    fetchTotoList();
  }, []);

  const _handleCheckBoxChange = (e) => {
    let target = e.target.id;
    // let color={_id:target}
    let newArray = [...formik.values.color, target];
    if (formik.values.color.includes(target)) {
      newArray = newArray.filter((color) => color !== target);
    }

    formik.setFieldValue("color", newArray);
  };

  const _handleCateChange = (e) => {
    let target = e.target.id;
    console.log(e.target.value);
    // let color={_id:target}
    let newArray = [...formik.values.category, target];
    if (formik.values.category.includes(target)) {
      newArray = newArray.filter((cate) => cate !== target);
    }

    formik.setFieldValue("category", e.target.value);
  };

  const _handleSizeChange = (e, id, type) => {
    const aSize = {
      size: "",
      quantity: "",
    };

    let newArray = [...formik.values.sizeArray, aSize];

    if (type === "size") {
      let target = e.target.id;

      aSize.size = target;
      newArray = [...formik?.values?.sizeArray, aSize];

      if (formik?.values?.sizeArray?.some((e) => e?.size === target)) {
        newArray = newArray?.filter((size) => size?.size !== e.target.id);
      }
      formik.setFieldValue("sizeArray", newArray);
    }

    if (type === "quantity") {
      let target = e.target.value;
      aSize.quantity = target;

      const x = formik?.values?.sizeArray?.find((x) => x?.size === id);
      if (x !== undefined) {
        x.quantity = target;
      }

      newArray = [
        ...formik?.values?.sizeArray?.filter((x) => x?.size !== id),
        x,
      ];
    }
    formik.setFieldValue("sizeArray", newArray);
  };

  const _handleFun = (e) => {
    //formik.setFieldValue("image01", "ecec");
  };

  const [image, setImage] = useState();

  const handImage = (e) => {
    let imageUp;
    if (e?.target?.files[0]) {
      setImage(e.target.files[0]);
      imageUp = e.target.files[0];
    }

    const uploadTask = storage.ref(`images/${imageUp.name}`).put(imageUp);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(imageUp.name)
          .getDownloadURL()
          .then((url) => {
            formik.setFieldValue("image01", url);
            setUrl(url);
          });
      }
    );
  };

  const handImage2 = (e) => {
    let imageUp;
    if (e?.target?.files[0]) {
      setImage(e.target.files[0]);
      imageUp = e.target.files[0];
    }

    const uploadTask = storage.ref(`images/${imageUp.name}`).put(imageUp);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress2 = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress2(progress2);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(imageUp.name)
          .getDownloadURL()
          .then((url) => {
            formik.setFieldValue("image02", url);
            setUrl2(url);
          });
      }
    );
  };

  const handleChangeSizeArr = (values) => {
    const listSizeArr = formik.values.sizeArray;
    const temp = values.map((item) => ({
      size: item,
      quantity: listSizeArr.find((temp) => temp.size === item)
        ? listSizeArr.find((temp) => temp.size === item).quantity
        : 0,
    }));

    formik.setFieldValue("sizeArray", temp);
  };

  const handleChangeInputNumberSize = (e, item) => {
    let itemChange = formik.values.sizeArray.find(
      (value) => value.size === item._id
    );

    itemChange = { ...itemChange, quantity: e.target.value };

    let finalArr = formik.values.sizeArray.filter(
      (value) => value.size !== item._id
    );
    finalArr.push(itemChange);

    formik.setFieldValue("sizeArray", finalArr);
  };

  return (
    <div className="new">
      <ToastContainer autoClose={5000} />
      <h1 className="new__title">New Product</h1>
      <form
        onSubmit={formik.handleSubmit}
        action="submit"
        className="new__form"
      >
        <div className="new__form__item">
          <div className="new__form__item__detail">
            <label className="new__form__item__detail__title">Name</label>
            <Input
              className="new__form__item__detail__input"
              id="title"
              name="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              type="text"
              required
              placeholder="Name product"
            />
          </div>

          <div className="new__form__item__detail">
            <label className="new__form__item__detail__title">Price</label>
            <Input
              className="new__form__item__detail__input"
              id="price"
              name="price"
              onChange={formik.handleChange}
              value={formik.values.price}
              type="number"
              placeholder="Price product"
              required
            />
          </div>

          <div className="new__form__item__detail">
            <label className="new__form__item__detail__title">Brand</label>
            <Select
              style={{ width: "100%" }}
              onChange={(e) => formik.setFieldValue("brand", e)}
            >
              {listBrand.map((item) => (
                <Option value={item._id}>{item.name}</Option>
              ))}
            </Select>
          </div>
          <div className="new__form__item__detail">
            <label className="new__form__item__detail__title">
              Description
            </label>
            <textarea
              className="new__form__item__detail__description"
              id="description"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
              type="text"
              placeholder="Description"
              required
            />
          </div>
        </div>

        <div></div>

        <div className="new__form__design">
          <div className="new__form__design__detail">
            <label className="new__form__design__detail__title">Size</label>
            <Checkbox.Group
              style={{
                width: "100%",
              }}
              onChange={(e) => handleChangeSizeArr(e)}
              // // options={listColor?.map((item) => item._id)}
              value={formik.values.sizeArray.map((item) => item.size)}
            >
              {listSize?.map((item, index) => (
                <Row key={index} style={{ marginBottom: "10px" }}>
                  <Col
                    span={12}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Checkbox value={item._id}>{item.sizeNumber}</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Input
                      type={"number"}
                      min={0}
                      disabled={
                        !formik.values.sizeArray.find(
                          (tempId) => tempId.size === item._id
                        )
                      }
                      placeholder="Quantity"
                      onChange={(e) => handleChangeInputNumberSize(e, item)}
                      value={
                        formik.values.sizeArray.find(
                          (temp) => temp.size === item._id
                        )
                          ? formik.values.sizeArray.find(
                              (temp) => temp.size === item._id
                            ).quantity
                          : "0"
                      }
                    ></Input>
                  </Col>
                </Row>
              ))}
            </Checkbox.Group>

            {/* {listSize?.map((item, index) => (
              // <option key={index} value={item._id}>
              //   {item.sizeNumber}
              // </option>
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
                key={index}
              >
                <div>
                  <input
                    onChange={(e) => _handleSizeChange(e, item._id, "size")}
                    value={item._id}
                    type="checkbox"
                    id={item._id}
                    name={item._id}
                    style={{ marginRight: "5px" }}
                  />
                </div>
                <div>
                  <label for={item._id}>
                    {item.sizeNumber}
                    <input
                      style={{ marginLeft: "20px" }}
                      onChange={(e) =>
                        _handleSizeChange(e, item._id, "quantity")
                      }
                      id={item._id}
                      value={
                        formik?.values?.sizeArray?.find(
                          (x) => x?.size === item?._id
                        )?.quantity || ""
                      }
                      type="text"
                      placeholder="Quantity"
                    />
                  </label>
                </div>
              </div>
            ))} */}
          </div>

          <div className="new__form__design__detail">
            <label className="new__form__design__detail__title">Color</label>

            <Checkbox.Group
              style={{
                width: "100%",
              }}
              onChange={(e) => formik.setFieldValue("color", e)}
              // options={listColor?.map((item) => item._id)}
              value={formik.values.color}
            >
              <Row>
                {listColor?.map((item) => (
                  <Col span={12}>
                    <Checkbox value={item._id}>{item.colorValue}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>

            {/* {listColor?.map((item, index) => (
              // <option key={index} value={item._id}>{item.colorValue}</option>
              // <div key={index}>
              //   <label>
              //     <input type="checkbox" name="checked" value={item._id} />
              //     {item.colorValue}
              //   </label>
              // </div>

              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  style={{ marginRight: "10px" }}
                  onChange={_handleCheckBoxChange}
                  value={item._id}
                  type="checkbox"
                  id={item._id}
                  name={item._id}
                />
                <label
                  style={{
                    color: `black`,
                  }}
                  for={item._id}
                >
                  {item.colorValue}
                </label>
              </div>
            ))} */}
          </div>

          <div className="new__form__design__detail">
            <label className="new__form__design__detail__title">Category</label>

            <Radio.Group onChange={(e) => _handleCateChange(e)}>
              <Space direction="vertical">
                {listCate?.map((item, index) => (
                  <Radio key={index} value={item._id}>
                    {item.name}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            {/* {listCate?.map((item, index) => (
              // <option key={index} value={item._id}>
              //   {item.name}
              // </option>
              <div>
                <input
                  style={{ marginRight: "10px" }}
                  onChange={_handleCateChange}
                  value={item._id}
                  type="radio"
                  id={item._id}
                  name={item._id}
                />
                <label for={item._id}>{item.name}</label>
                <br />
              </div>
            ))} */}
          </div>
        </div>

        <div className="new__form__image">
          <div className="new__form__image__item">
            <label htmlFor="image01" className="new__form__image__title">
              {" "}
              <div>
                {" "}
                <ToTopOutlined
                  className="new__form__image__title__icon"
                  style={{ fontSize: "70px" }}
                />
              </div>
              Image 1
            </label>
            <input
              style={{ display: "none" }}
              id="image01"
              type="file"
              onChange={handImage}
              required
            ></input>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <img
                style={{ width: "200px", height: "200px" }}
                src={url ? url : newImage}
                alt=""
              />
              <progress style={{ width: "100%" }} value={progress} max="100" />
            </div>
          </div>

          <div className="new__form__image__item">
            <label htmlFor="image02" className="new__form__image__title">
              <div>
                {" "}
                <ToTopOutlined
                  className="new__form__image__title__icon"
                  style={{ fontSize: "70px" }}
                />
              </div>
              Image 2:
            </label>
            <input
              required
              style={{ display: "none" }}
              id="image02"
              type="file"
              onChange={handImage2}
            ></input>
            {/* <button style={{width:"80px", height:"30px"}} onClick={_handleUpload}> upload</button> */}

            <div style={{ display: "flex", flexDirection: "column" }}>
              <img
                style={{ width: "200px" }}
                src={url2 ? url2 : newImage}
                alt=""
              />
              <progress style={{ width: "100%" }} value={progress2} max="100" />
            </div>
          </div>
        </div>

        {/* <div className="new__form__btnBox">
          <button
            style={{}}
            onClick={() => _handleFun()}
            type="submit"
            className="new__form__btnBox__btnCreate"
          >
            Create
          </button>

          <Link to="/products">
            <button className="new__form__btnBox__btnCancel">Cancel</button>
          </Link>
        </div> */}

        <div className="new__form__btnBox">
          <Link to="/products">
            <Button className="new__form__btnBox__btnCancel">Cancel</Button>
          </Link>
          <Button
            style={{}}
            onClick={() => _handleFun()}
            htmlType="submit"
            className="new__form__btnBox__btnCreate"
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}
