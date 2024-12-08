import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import axios from "axios";
import Layout from "../components/Layout";

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setRequests(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching requests:", error.message);
      message.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const columns = [
    { title: "Title", dataIndex: "CASETITLE", key: "caseTitle" },
    { title: "Description", dataIndex: "CASEDESCRIPTION", key: "caseDescription" },
    { title: "Requested By", dataIndex: "REQUESTEDBY", key: "requestedBy" },
    { title: "Date Requested", dataIndex: "REQUESTEDDATE", key: "requestedDate" },
  ];

  return (
    <Layout>
      <h1 className="text-center">View Requests</h1>
      <Table
        dataSource={requests}
        columns={columns}
        rowKey="REQUESTID"
        loading={loading}
      />
    </Layout>
  );
};

export default ViewRequests;
