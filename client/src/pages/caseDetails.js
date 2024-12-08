import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import Layout from "../components/Layout";

const CaseDetails = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const res = await axios.get(`/api/cases/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setCaseData(res.data.data);
          checkBookmark(); // Check if the case is bookmarked
        } else {
          message.error(res.data.message || "Failed to fetch case details");
        }
      } catch (error) {
        console.error("Error fetching case details:", error);
        message.error("Something went wrong while fetching case details.");
      }
    };
    fetchCaseDetails();
  }, [id]);

  const checkBookmark = async () => {
    try {
      const res = await axios.get("/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        const bookmarked = res.data.data.some((bookmark) => bookmark.CaseID === parseInt(id));
        setIsBookmarked(bookmarked);
      }
    } catch (error) {
      console.error("Error checking bookmark status:", error.message);
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await axios.post(
        "/api/bookmarks/add",
        { caseId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success("Case bookmarked successfully");
        setIsBookmarked(true);
      } else {
        message.error(res.data.message || "Failed to bookmark case");
      }
    } catch (error) {
      console.error("Error bookmarking case:", error.message);
      message.error("Something went wrong while bookmarking the case.");
    }
  };

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

  if (!caseData) {
    return (
      <Layout>
        <h1 style={{ textAlign: "center", marginTop: "50px" }}>Loading Case Details...</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          style={{
            backgroundColor: "#1890ff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
        <button
          style={{
            backgroundColor: isBookmarked ? "gray" : "#52c41a",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: isBookmarked ? "not-allowed" : "pointer",
          }}
          onClick={isBookmarked ? null : handleBookmark}
          disabled={isBookmarked}
        >
          {isBookmarked ? "Bookmarked" : "Bookmark Case"}
        </button>
      </div>
      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Case Details</h1>
        <p>
          <strong>Title:</strong> {caseData.TITLE}
        </p>
        <p>
          <strong>Description:</strong> {caseData.DESCRIPTION}
        </p>
        <p>
          <strong>Category:</strong> {caseData.CATEGORY}
        </p>
        <p>
          <strong>Added By:</strong> {caseData.ADDEDBY}
        </p>
        <p>
          <strong>Date Added:</strong> {caseData.DATEADDED}
        </p>

        {caseData.FILEID ? (
          <button
            style={{
              backgroundColor: "#52c41a",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onClick={() => handleOpenFile(caseData.CASEID)}
          >
            Open File
          </button>
        ) : (
          <p style={{ textAlign: "center", color: "#ff4d4f" }}>
            No file available for this case
          </p>
        )}
      </div>
    </Layout>
  );
};

export default CaseDetails;
