import React, { useEffect, useState } from "react";
import { Select, Table, message } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const { Option } = Select;

const SearchCases = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/cases/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setCategories(res.data.categories);
        } else {
          message.error(res.data.message || "Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Something went wrong while fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = async (value) => {
    setSelectedCategory(value);
    setLoading(true);
    try {
      const res = await axios.get(`/api/cases/search?category=${value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCases(res.data.data);
      } else {
        message.error(res.data.message || "Failed to fetch cases for this category");
      }
    } catch (error) {
      console.error("Error searching cases:", error);
      message.error("Something went wrong while searching cases.");
    } finally {
      setLoading(false);
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
      title: "Added By",
      dataIndex: "ADDEDBY",
      key: "addedBy",
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
        <Link to={`/case/${record.CASEID}`}>
          <button className="open-file-button">View Details</button>
        </Link>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center">Search Cases by Category</h1>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Select
          placeholder="Select a category"
          style={{ width: 300 }}
          onChange={handleCategoryChange}
          value={selectedCategory}
          allowClear
        >
          {categories.map((cat) => (
            <Option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Option>
          ))}
        </Select>
      </div>
      {cases.length > 0 ? (
        <Table
          dataSource={cases}
          columns={columns}
          loading={loading}
          rowKey="CASEID"
        />
      ) : (
        <div className="text-center">
          {selectedCategory && !loading
            ? "No cases found for the selected category."
            : "Please select a category to view cases."}
        </div>
      )}
    </Layout>
  );
};

export default SearchCases;
