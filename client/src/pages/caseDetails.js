import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import Layout from "../components/Layout";

const CaseDetails = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
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
        <h1>Loading Case Details...</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          style={{
            backgroundColor: "green",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)} // Go back to the previous page
        >
          Back to Search Cases
        </button>
      </div>
      <h1>Case Details</h1>
      <p><strong>Title:</strong> {caseData.TITLE}</p>
      <p><strong>Description:</strong> {caseData.DESCRIPTION}</p>
      <p><strong>Category:</strong> {caseData.CATEGORY}</p>
      <p><strong>Added By:</strong> {caseData.ADDEDBY}</p>
      <p><strong>Date Added:</strong> {caseData.DATEADDED}</p>

      {caseData.FILEID ? (
        <button
          style={{
            backgroundColor: "green",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
          onClick={() => handleOpenFile(caseData.CASEID)}
        >
          Open File
        </button>
      ) : (
        <p>No file available for this case</p>
      )}
    </Layout>
  );
};

export default CaseDetails;
