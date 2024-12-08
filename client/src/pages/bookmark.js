import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Table, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Bookmarks = () => {
  const [bookmarkedCases, setBookmarkedCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        console.log("Fetched Bookmarked Cases with BookmarkID:", res.data.data); // Debugging log
        setBookmarkedCases(res.data.data);
      } else {
        message.error(res.data.message || "Failed to fetch bookmarked cases.");
      }
    } catch (error) {
      console.error("Error fetching bookmarked cases:", error.message);
      message.error("Something went wrong while fetching bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId) => {
    if (!bookmarkId || isNaN(bookmarkId)) {
      console.error("Invalid BookmarkID in frontend:", bookmarkId); // Debug log
      message.error("Invalid BookmarkID.");
      return;
    }

    try {
      console.log("Sending BookmarkID to backend:", bookmarkId); // Debugging log
      const res = await axios.delete(`/api/bookmarks/${bookmarkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        message.success("Bookmark removed successfully.");
        setBookmarkedCases((prev) => prev.filter((b) => b.BOOKMARKID !== bookmarkId));
      } else {
        message.error(res.data.message || "Failed to remove bookmark.");
      }
    } catch (error) {
      console.error("Error removing bookmark in frontend:", error.message);
      message.error("Something went wrong while removing bookmark.");
    }
  };

  const viewCaseDetails = (caseId) => {
    if (!caseId || isNaN(caseId)) {
      console.error("Invalid CaseID for navigation:", caseId); // Debug log
      message.error("Invalid CaseID.");
      return;
    }
    navigate(`/case/${caseId}`);
  };

  useEffect(() => {
    fetchBookmarks();
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
        <div>
          {/* Button to View Details */}
          <Button
            type="default"
            style={{ marginRight: "10px" }}
            onClick={() => viewCaseDetails(record.CASEID)}
          >
            View Details
          </Button>

          {/* Button to Remove Bookmark */}
          <Button
            type="primary"
            danger
            onClick={() => {
              console.log("BookmarkID to remove:", record.BOOKMARKID); // Debug log
              removeBookmark(record.BOOKMARKID);
            }}
          >
            Remove Bookmark
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center">Bookmarked Cases</h1>
      <Table
        dataSource={bookmarkedCases}
        columns={columns}
        loading={loading}
        rowKey="BOOKMARKID"
        style={{ marginTop: "20px" }}
      />
    </Layout>
  );
};

export default Bookmarks;
