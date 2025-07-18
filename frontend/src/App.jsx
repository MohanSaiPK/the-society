import React from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
// import Login from "./pages/LoginPages/Login";
// import Register from "./pages/LoginPages/Register";
import AppRoutes from "./routes/AppRoutes";
// import your dashboards here

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
