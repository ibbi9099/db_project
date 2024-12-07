import React, { useState } from "react";
import Layout from "../components/Layout";
import { Col, Form, Input, Row, message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";

const AddCase = () => {
  const { user } = useSelector((state) => state.user);
  const [form] = Form.useForm(); // Form instance for resetting fields
  const [file, setFile] = useState(null);

  const handleFinish = async (values) => {
    if (!file) {
      message.error("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("file", file);

    try {
      const res = await axios.post("/api/cases/add", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        message.success("Case added successfully!");
        form.resetFields(); // Clear the form fields
        setFile(null); // Clear the file input
      } else {
        message.error(res.data.message || "Failed to add the case.");
      }
    } catch (error) {
      console.error("Error adding case:", error);
      message.error("Something went wrong.");
    }
  };

  return (
    <Layout>
      <h1 className="text-center">Add New Case</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3" form={form}>
        <h4>Case Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Case Title"
              name="title"
              rules={[{ required: true, message: "Please enter the case title" }]}
            >
              <Input placeholder="Case title" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Case Description"
              name="description"
              rules={[{ required: true, message: "Please provide a case description" }]}
            >
              <Input.TextArea rows={4} placeholder="Case description" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please enter the case category" }]}
            >
              <Input placeholder="Case category" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Upload File">
              <Upload
                beforeUpload={(file) => {
                  setFile(file);
                  return false; // Prevent default upload behavior
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
              {file && <p>Selected File: {file.name}</p>}
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <button className="btn btn-success" type="submit">
            Submit
          </button>
        </div>
      </Form>
    </Layout>
  );
};

export default AddCase;
