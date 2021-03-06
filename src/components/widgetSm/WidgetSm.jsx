import React, { useEffect, useState } from "react";
import "./widgetSm.css";
import { Visibility } from "@material-ui/icons";
import chartApi from "../../api/chartAPI";
import { Table, Tag, Space } from "antd";
import numberWithCommas from "../../utils/numberWithCommas";
import { Link } from "react-router-dom";

export default function WidgetSm(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotoList =  () => {
      try {
       
        if (props?.info) {

          setLoading(false);
        }
      } catch (error) {
        console.log("error:", error);
      }
    };

    fetchTotoList();
  }, [props]);

  const columns = [
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      render: (text) => <div>{text.substring(0, 10)}...</div>,
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <div>{numberWithCommas(text)} $</div>,
    },
    {
      title: "Image",
      dataIndex: "image01",
      key: "image01",
      render: (text) => <img style={{ width: "80px" }} src={text}></img>,
    },
    {
      title: "Action",
      key: "action",
      render: (params) => (
        <Link to={"/product/" + params._id}>
          <button className="widgetSmButton">
            <Visibility className="widgetSmIcon" />
          </button>
        </Link>
      ),
    },
  ];
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Product Recent</span>
      <div className="dataProductRecent">
        <Table loading={loading} columns={columns} dataSource={props?.info?.mostRecent5Products} />
      </div>
    </div>
  );
}
