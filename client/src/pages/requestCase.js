import React, {useEffect,useState} from "react";
import Layout from "./../components/Layout";
import { Col, Form, Input, Row, Select, DatePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";

const RequestCase = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]); // State to store fetched lawyers

  // Fetch lawyers from backend
  const fetchLawyers = async () => {
    try {
      const res = await axios.get("/api/users/lawyers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setLawyers(res.data.data); // Set fetched lawyers to state
      } else {
        message.error(res.data.message || "Failed to fetch lawyers");
      }
    } catch (error) {
      console.error("Error fetching lawyers:", error);
      message.error("Something went wrong while fetching lawyers");
    }
  };

  useEffect(() => {
    fetchLawyers(); // Fetch lawyers when the component loads
  }, []);


  // Handle form submission
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/request-case/create',
        { ...values, userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Case request submitted successfully!");
        navigate("/request-case");
      } else {
        message.error(res.data.message || "Failed to submit case request");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error submitting case request:", error);
      message.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <h1 className="text-center">Request Case</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <h4>Personal Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please enter your first name" }]}
            >
              <Input placeholder="Your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Please enter your last name" }]}
            >
              <Input placeholder="Your last name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Email"
              name="email"
              initialValue={user?.email}
              rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
            >
              <Input placeholder="Your email address" disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Phone No"
              name="phone"
              rules={[{ required: true, message: "Please enter your phone number" }]}
            >
              <Input placeholder="Your contact number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item label="Address" name="address">
              <Input placeholder="Your address" />
            </Form.Item>
          </Col>
        </Row>

        <h4>Case Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Case Title"
              name="caseTitle"
              rules={[{ required: true, message: "Please enter the case title" }]}
            >
              <Input placeholder="Case title" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Case Description"
              name="caseDescription"
              rules={[{ required: true, message: "Please provide a case description" }]}
            >
              <Input.TextArea rows={4} placeholder="Case description" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Case Type"
              name="caseType"
              rules={[{ required: true, message: "Please select the case type" }]}
            >
              <Select placeholder="Select case type">
                <Select.Option value="civil">Civil</Select.Option>
                <Select.Option value="criminal">Criminal</Select.Option>
                <Select.Option value="family">Family</Select.Option>
                <Select.Option value="corporate">Corporate</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
          <Form.Item
              label="Lawyer Assigned"
              name="lawyerId"
              rules={[{ required: true, message: "Please select a lawyer" }]}
            >
              <Select placeholder="Select a lawyer">
                {lawyers.map((lawyer) => (
                  <Select.Option key={lawyer.USERID} value={lawyer.NAME}>
                    {lawyer.NAME}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Requested Date"
              name="requestedDate"
              rules={[{ required: true, message: "Please select a date" }]}>
              <DatePicker style={{ width: "100%" }} placeholder="Select date" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            {/* <Form.Item label="Priority Level" name="priorityLevel">
              <Select placeholder="Select priority level">
                <Select.Option value="high">High</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="low">Low</Select.Option>
              </Select>
            </Form.Item> */}
          </Col>
        </Row>

        {/* <h4>Optional Timings:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Start Time" name="startTime">
              <TimePicker style={{ width: "100%" }} placeholder="Select start time" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="End Time" name="endTime">
              <TimePicker style={{ width: "100%" }} placeholder="Select end time" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}></Col>
        </Row> */}

        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </Form>
    </Layout>
  );
};

export default RequestCase;