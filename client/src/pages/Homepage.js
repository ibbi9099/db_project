import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from the backend
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/users/getUserData",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setUserData(res.data); // Save the user data
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to load user data");
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "1.5rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "red", // Change this color to highlight errors
          fontFamily: "'Poppins', sans-serif",
          fontSize: "1.5rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <Layout>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        ></div>

        {/* Main Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            maxWidth: "600px",
            width: "90%",
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
            opacity: 0.9,
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#333333",  // Charcoal Gray
              marginBottom: "20px",
            }}
          >
            Welcome to CaseSphere
          </h1>
          <h2 style={{ fontSize: "1.5rem", color: "#333333" }}>
            Hello, {userData?.name}!
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#666666", // Lighter Gray
              marginTop: "10px",
              lineHeight: "1.5",
            }}
          >
            Thank you for joining CaseSphere. Here you can access all your
            research tools, cases, and personalized resources to simplify your
            legal work.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
