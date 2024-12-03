import React, { useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Define getUser using useCallback to avoid re-creation
  const getUser = useCallback(async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/users/getUserData",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token") // Correct template string usage
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data)); // Set user data in Redux
      } else {
        localStorage.removeItem("token"); // Remove token if invalid
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      localStorage.removeItem("token"); // Remove token on error
    }
  }, [dispatch]);

  // Fetch user data if not already in Redux state
  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, getUser]);

  // Redirect to login if token is missing
  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}