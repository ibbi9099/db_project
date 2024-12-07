import React, { useEffect } from "react";
import "../styles/LayoutStyles.css";
import { lawyerMenu, studentMenu } from "../Data/SideOption";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import { setUser } from "../redux/features/userSlice";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)));
      }
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setUser(null));
    message.success("Logged Out Successfully");
    navigate("/login");
  };

  const SidebarMenu =
    user?.userType === "Lawyer"
      ? lawyerMenu
      : user?.userType === "LawStudent"
      ? studentMenu
      : [];

  if (!SidebarMenu.length) {
    return (
      <div>
        Invalid user type. Please log out and log in again.
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h1 className="app-logo">CaseSphere</h1>
          <hr />
        </div>
        <div className="menu">
          {SidebarMenu.map((menu, index) => {
            const isActive = location.pathname === menu.path;
            return (
              <div key={index} className={`menu-item ${isActive && "active"}`}>
                <i className={menu.icon}></i>
                <Link to={menu.path}>{menu.name}</Link>
              </div>
            );
          })}

          {/* Add "My Cases" Button for Lawyers */}
          {user?.userType === "Lawyer" && (
  <>
    {/* <div className="menu-item">
      <i className="fa-solid fa-folder-open"></i>
      <Link to="/my-cases">My Cases</Link>
    </div> */}
    {/* <div className="menu-item">
      <i className="fa-solid fa-plus"></i>
      <Link to="/add-case">Add Case</Link>
    </div> */}
  </>
)}


          <div className="menu-item" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="content">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <i className="fa-solid fa-bell"></i>
            <Link to="/profile">{user?.name || "Profile"}</Link>
          </div>
          <h3>
            {user?.userType === "LawStudent"
              ? "Student Dashboard"
              : user?.userType === "Lawyer"
              ? "Lawyer Dashboard"
              : user?.userType === "Admin"
              ? "Admin Dashboard"
              : "Dashboard"}
          </h3>
        </header>

        {/* Main Body */}
        <section className="body">{children}</section>
      </main>
    </div>
  );
};

export default Layout;
