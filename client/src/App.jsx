import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddContact from "./pages/AddContact";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import Private from "./components/Private";
import ErrorPage from "./pages/ErrorPage";

import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/home"
            element={
              <Private>
                <Home />
              </Private>
            }
          />

          <Route
            path="/add"
            element={
              <Private>
                <AddContact />
              </Private>
            }
          />

          <Route
            path="/chat"
            element={
              <Private>
                <ChatRoom />
              </Private>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <Private>
                <Profile />
              </Private>
            }
          />

          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


