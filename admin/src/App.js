import React, { useState, useEffect } from "react";
import "./assets/css/app/index.css";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import AuthWrapper from "./auth/AuthWrapper";
import ROLE from "./auth/Role";
import Dashboard from "./pages/Dashboard";
import Tenants from "./pages/Tenant/Tenants";
import EditTenant from "./pages/Tenant/EditTenant";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import Tenant from "./pages/Tenant/Tenant";
import Landlords from "./pages/Landlord/Landlords";
import Login from "pages/Login";
import Register from "pages/Register";
import ForgotPassword from "pages/ForgotPassword";
import Properties from "pages/Properties";
import { SignalWifiStatusbarNullSharp } from "@mui/icons-material";
import Landlord from "pages/Landlord/Landlord";
import NotFound from "pages/404";
import NewProperty from "pages/Properties/NewProperty";
import PropertyDetail from "pages/Properties/PropertyDetail";
import { StompSessionProvider, useSubscription } from "react-stomp-hooks";
import { toast, ToastContainer } from "react-toastify";

function App() {
  const [isSignedIn, setSignedIn] = useState(
    localStorage.getItem("token") ? true : false
  );

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).role.roleName
      : ""
  );

  const fetchData = async () => {
    const data = await localStorage.getItem("user");
    const json = JSON.parse(data);
    if (json) {
      setUser(json);
      setRole(json.role.roleName);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const authContext = { isSignedIn, setSignedIn, user, setUser, role, setRole };

  useSubscription("/topic/landlords", (msg) => {
    let msgdata = JSON.parse(msg.body);
    if (localStorage.getItem("user")) {
      let user = JSON.parse(localStorage.getItem("user"));
      if (msgdata.to === user.id) {
        toast.success(msgdata.message);
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <AuthContext.Provider value={authContext}>
        <Routes>
          <Route path="*" element={<NotFound />} />

          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route
            path="/"
            element={
              <AuthWrapper role={[ROLE.Admin, ROLE.Landlord]}>
                <Dashboard role={role} />
              </AuthWrapper>
            }
          />
          <Route
            path="/tenants"
            element={
              <AuthWrapper role={[ROLE.Admin]}>
                <Tenants />
              </AuthWrapper>
            }
          />
          <Route
            path="admin/tenants/:id"
            element={
              <AuthWrapper role={[ROLE.Admin]}>
                <Tenant />
              </AuthWrapper>
            }
          />
          <Route
            path="/tenants/new"
            element={
              <AuthWrapper role={[ROLE.Admin]}>
                <EditTenant />
              </AuthWrapper>
            }
          />
          <Route
            path="/landlords"
            element={
              <AuthWrapper role={[ROLE.Admin]}>
                <Landlords />
              </AuthWrapper>
            }
          />
          <Route
            path="admin/landlords/:id"
            element={
              <AuthWrapper role={[ROLE.Admin]}>
                <Landlord />
              </AuthWrapper>
            }
          />
          <Route
            path="/landlords/new"
            element={
              <AuthWrapper role={[ROLE.Admin]}>
                <EditTenant />
              </AuthWrapper>
            }
          />
          <Route
            path="/properties"
            element={
              <AuthWrapper role={[ROLE.Landlord]}>
                <Properties />
              </AuthWrapper>
            }
          />

          {/* <Route
            path="/properties/:id"
            element={
              <AuthWrapper role={[ROLE.Landlord]}>
                <PropertyDetail />
              </AuthWrapper>
            }
          /> */}

          <Route
            path="/properties/new"
            element={
              <AuthWrapper role={[ROLE.Landlord]}>
                <NewProperty />
              </AuthWrapper>
            }
          />
        </Routes>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
