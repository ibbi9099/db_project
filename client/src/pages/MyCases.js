import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Table, message, Button } from "antd";
import axios from "axios";

const MyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cases added by the logged-in lawyer
  const fetchMyCases = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/cases/my-cases", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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

  useEffect(() => {
    fetchMyCases();
  }, []);

  const handleDownload = async (fileId, fileName) => {
    try {
      const res = await axios.get(`/api/files/download/${fileId}`, {
        responseType: "blob", // Ensures the response is treated as a file
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      message.error("Failed to download the file.");
    }
  };
  

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
      render: (_, record) => {
        return record.FILEID ? (
          <a
            href={`/api/files/download/${record.FILEID}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View File
          </a>
        ) : (
          "No File Available"
        );
      },
    },
  ];
  
  return (
    <Layout>
      <h1 className="text-center">My Cases</h1>
      <Table
        dataSource={cases}
        columns={columns}
        loading={loading}
        rowKey="CaseID"
      />
    </Layout>
  );
};

export default MyCases;
