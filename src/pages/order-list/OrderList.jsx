import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import "./order-list.css";

import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";

import todoApi from "../../api/todoApi";

import { useDispatch } from "react-redux";
import { deleteUser } from "../../redux/user/userAction";

import { Table, Tag, Space } from "antd";

import orderApi from "../../api/orderApi";
import { setOrder } from "../../redux/order/orderAction";
import numberWithCommas from "../../utils/numberWithCommas";
import moment from "moment";

export default function OrderList() {
  const dispatch = useDispatch();

  const [showStatus, setShowStatus] = useState(1);

  const [loading, setLoading] = useState(true);

  const listOrders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    const fetchTotoList = async () => {
      try {
        const response = await orderApi.getAll();
        if (response) {
          dispatch(setOrder(response.orders));
          setLoading(false);
        }
      } catch (error) {
        console.log("error:", error);
      }
    };

    fetchTotoList();
  }, []);

  console.log(listOrders);

  const columns = [
    {
      title: "Name",
      dataIndex: "user",
      key: "user",
      render: (text) => <div>{text?.name}</div>,
    },
    {
      title: "Phone",
      dataIndex: "user",
      key: "user",
      render: (text) => <div>{text?.phone}</div>,
    },
    {
      title: "Email",
      dataIndex: "user",
      key: "user",
      render: (text) => <div>{text?.email}</div>,
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Order Code",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Total Money",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (text) => <div>{numberWithCommas(text)} $</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (params) => (
        <Space size="middle">
          <Link to={"/order/" + params._id}>
            <button className="userListEdit">Edit</button>
          </Link>
          <DeleteOutline
            style={{ display: "none" }}
            className="userListDelete"
            onClick={() => handleDelete(params._id)}
          />
        </Space>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      await todoApi.delete(id);
      dispatch(deleteUser(id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="userList">
      <div className="userTitleContainer">
        <h1 className="userTitle">List Order</h1>
      </div>
      <div className="status-container">
        <div
          onClick={() => setShowStatus(1)}
          className={`status-item ${showStatus === 1 ? "active" : ""}`}
        >
          Pending
        </div>
        <div
          onClick={() => setShowStatus(2)}
          className={`status-item ${showStatus === 2 ? "active" : ""}`}
        >
          Shipping
        </div>
        <div
          onClick={() => setShowStatus(3)}
          className={`status-item ${showStatus === 3 ? "active" : ""}`}
        >
          Succeeded
        </div>

        <div
          onClick={() => setShowStatus(4)}
          className={`status-item ${showStatus === 4 ? "active" : ""}`}
        >
          Cancel
        </div>
      </div>

      {showStatus === 1 && (
        <Table
          loading={loading}
          columns={columns}
          pagination={{ pageSize: 5 }}
          dataSource={listOrders
            .filter((e) => e.status === "pending")
            .sort(
              (a, b) =>
                new Date(moment(b.orderDate, "DD/MM/yyyy")) -
                new Date(moment(a.orderDate, "DD/MM/yyyy"))
            )}
        />
      )}

      {showStatus === 2 && (
        <Table
          loading={loading}
          columns={columns}
          pagination={{ pageSize: 5 }}
          dataSource={listOrders
            .filter((e) => e.status === "shipping")
            .sort(
              (a, b) =>
                new Date(moment(b.orderDate, "DD/MM/yyyy")) -
                new Date(moment(a.orderDate, "DD/MM/yyyy"))
            )}
        />
      )}

      {showStatus === 3 && (
        <Table
          loading={loading}
          columns={columns}
          pagination={{ pageSize: 5 }}
          dataSource={listOrders
            .filter((e) => e.status === "succeeded")
            .sort(
              (a, b) =>
                new Date(moment(b.orderDate, "DD/MM/yyyy")) -
                new Date(moment(a.orderDate, "DD/MM/yyyy"))
            )}
        />
      )}

      {showStatus === 4 && (
        <Table
          loading={loading}
          columns={columns}
          pagination={{ pageSize: 5 }}
          dataSource={listOrders
            .filter((e) => e.status === "failed")
            .sort(
              (a, b) =>
                new Date(moment(b.orderDate, "DD/MM/yyyy")) -
                new Date(moment(a.orderDate, "DD/MM/yyyy"))
            )}
        />
      )}
    </div>
  );
}
