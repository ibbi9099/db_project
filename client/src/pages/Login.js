import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await axios.post("/api/users/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token); // Save token to localStorage
        message.success("Logged in Successfully");
        navigate("/"); // Redirect to home or dashboard
      } else {
        setError(res.data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  const handleRegister = () => {
    navigate("/register"); // Navigate to the register page
  };

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
        color: "green",
        fontFamily: "'Poppins', sans-serif",
        padding: "20px",
      }}
    >
      {/* Overlay to darken the background for better readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      ></div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1
          style={{
            marginBottom: "20px",
            fontSize: "3rem",
            color: "#fff",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          CaseSphere
        </h1>
        <h2
          style={{
            marginBottom: "30px",
            fontSize: "1.5rem",
            color: "#fff",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Your Legal Research, Simplified
        </h2>
        {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
        <form
          onSubmit={handleLogin}
          style={{
            display: "inline-block",
            textAlign: "left",
            padding: "30px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            maxWidth: "400px",
            opacity: 0.9, // Slight transparency for the form
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                fontSize: "1rem",
                color: "#333",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                fontSize: "1rem",
                color: "#333",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1.1rem",
              marginBottom: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            Login
          </button>
          <div style={{ marginTop: "15px" }}>
            <span style={{ fontSize: "1rem", color: "#555" }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={handleRegister}
                style={{
                  background: "none",
                  border: "none",
                  color: "green",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Register
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
