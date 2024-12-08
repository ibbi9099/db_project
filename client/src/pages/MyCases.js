import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Table, message, Popconfirm } from "antd";
import axios from "axios";

const MyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch the user's cases
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

  // Handle file opening for a specific case
  const handleOpenFile = async (caseId) => {
    if (!caseId) {
      message.error("Case ID is missing");
      return;
    }

    try {
      const res = await axios.get(`/api/files/download/case/${caseId}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening file:", error.message);
      message.error("Something went wrong while opening the file.");
    }
  };

  // Handle case deletion
  const handleDeleteCase = async (caseId) => {
    setLoading(true); // Set loading state during deletion
    try {
      const res = await axios.delete(`/api/cases/${caseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        message.success("Case deleted successfully");
        fetchMyCases(); // Refresh the case list
      } else {
        message.error(res.data.message || "Failed to delete case");
      }
    } catch (error) {
      console.error("Error deleting case:", error);
      message.error("Something went wrong");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Fetch cases on component mount
  useEffect(() => {
    fetchMyCases();
  }, []);

  // Define table columns
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
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Open File Button */}
          <button
            className="open-file-button"
            onClick={() => handleOpenFile(record.CASEID)}
          >
            Open File
          </button>

          {/* Delete Button */}
          <Popconfirm
            title="Are you sure you want to delete this case?"
            onConfirm={() => handleDeleteCase(record.CASEID)}
            okText="Yes"
            cancelText="No"
          >
            <button
              className="delete-case-button"
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </Popconfirm>
        </div>
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

