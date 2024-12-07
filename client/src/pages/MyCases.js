import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Table, message } from "antd";
import axios from "axios";

const MyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyCases = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/cases/my-cases", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Cases response from backend:", res.data.data); // Debug the response

      if (res.data.success) {
        setCases(res.data.data);
      } else {
        message.error(res.data.message || "Failed to fetch cases");
      }
    } catch (error) {
      console.error("Error fetching my cases:", error);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Directly open the file in a new tab
  const handleOpenFile = async (caseId) => {
    if (!caseId) {
      message.error("Case ID is missing");
      console.error("Error: Case ID is undefined or null");
      return;
    }
  
    try {
      // Directly request the file
      const res = await axios.get(`/api/files/download/case/${caseId}`, {
        responseType: "blob", // Expect binary data
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      // Create a blob URL for the PDF and open it in a new tab
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening file:", error.message);
      message.error("Something went wrong while opening the file.");
    }
  };
  useEffect(() => {
    fetchMyCases();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "TITLE",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "DESCRIPTION",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "CATEGORY",
      key: "category",
    },
    {
      title: "Date Added",
      dataIndex: "DATEADDED",
      key: "dateAdded",
    },
    {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <button
            className="open-file-button"
            onClick={() => handleOpenFile(record.CASEID)}
          >
            Open File
          </button>
        ),
      },
  ];
  

  return (
    <Layout>
      <h1 className="text-center">My Cases</h1>
      <Table
        dataSource={cases}
        columns={columns}
        loading={loading}
        rowKey="CASEID"
      />
    </Layout>
  );
};

export default MyCases;
