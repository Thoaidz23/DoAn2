import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from './reportWebVitals';
import App from "./customer/views/App";
import AdminApp from "./admin/App";
import "./customer/styles/index.scss";
import { AuthProvider, AuthContext } from "./customer/context/AuthContext"; // ✅ đúng path
import "bootstrap/dist/css/bootstrap.min.css"

const root = ReactDOM.createRoot(document.getElementById("root"));

// Đặt trong component con để đảm bảo AuthProvider đã được render
function RoleBasedAppContent() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <App></App>
  }

  return user.role === 1 ? <AdminApp /> : <App />;
  // return <AdminApp></AdminApp>
}

function RoleBasedApp() {
  return (
    <AuthProvider>
      <RoleBasedAppContent />
    </AuthProvider>
  );
}

root.render(
  <React.StrictMode>
    <RoleBasedApp />
  </React.StrictMode>
);

reportWebVitals();
