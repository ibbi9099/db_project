import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import axios from "axios";
import Layout from "../components/Layout";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await axios.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setProfileData(res.data.data);
          setFormData({
            name: res.data.data.NAME || "",
            password: "",
            educationalInstitute: res.data.data.EDUCATIONALINSTITUTE || "",
            specialization: res.data.data.SPECIALIZATION || "",
            experienceYears: res.data.data.EXPERIENCEYEARS || "",
          });
        } else {
          message.error(res.data.message || "Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
        message.error("Something went wrong while fetching profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        message.success("Profile updated successfully");
      } else {
        message.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      message.error("Something went wrong while updating profile.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <h1 className="text-center" style={{ marginBottom: "30px" }}>
          Profile
        </h1>
        <form
          onSubmit={handleFormSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            border: "1px solid #d9d9d9",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fafafa",
          }}
        >
          {/* Email (Read-only) */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold" }}>Email:</label>
            <input
              type="email"
              value={profileData.EMAIL}
              disabled
              style={{
                backgroundColor: "#f0f0f0",
                cursor: "not-allowed",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold" }}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold" }}>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter new password (optional)"
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          {/* Educational Institute (Law Students Only) */}
          {profileData.USER_TYPE === "LawStudent" && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold" }}>Educational Institute:</label>
              <input
                type="text"
                name="educationalInstitute"
                value={formData.educationalInstitute}
                onChange={handleInputChange}
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #d9d9d9",
                }}
              />
            </div>
          )}

          {/* Specialization and Experience Years (Lawyers Only) */}
          {profileData.USER_TYPE === "Lawyer" && (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold" }}>Specialization:</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  style={{
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #d9d9d9",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold" }}>Experience Years:</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  style={{
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #d9d9d9",
                  }}
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              backgroundColor: "#1890ff",
              color: "#fff",
              padding: "10px",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          >
            Update Profile
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
