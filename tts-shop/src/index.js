import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
// <<<<<<< HEAD
// import AppAdmin from "./admin/App";  
// // import App from "./customer/views/App";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./customer/styles/index.scss";

// const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(
//   <React.StrictMode>
//     {/* <App />  */}
//     <AppAdmin></AppAdmin>
// =======
import reportWebVitals from './reportWebVitals';
import App from "./customer/views/App";
import AdminApp from "./admin/App";
// import "./customer/styles/index.scss";
import { AuthProvider, AuthContext } from "./customer/context/AuthContext"; // ✅ đúng path
import "bootstrap/dist/css/bootstrap.min.css"

const root = ReactDOM.createRoot(document.getElementById("root"));

// Đặt trong component con để đảm bảo AuthProvider đã được render
function RoleBasedAppContent() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <App></App>
  }

return (user.role === 1 || user.role === 2 || user.role === 4) ? <AdminApp /> : <App />;

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
{/* >>>>>>> 0d7c14b921872557a90b959dc78a0c4d476e0b1e */}
  </React.StrictMode>
);

reportWebVitals();
