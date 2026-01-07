// src/App.jsx
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import ChatBot from "./components/ChatBot";
import FAQPage from "./pages/FAQPage";
import IssuePage from "./pages/IssuePage";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";

function App() {
  useEffect(() => {}, []);
  const [currentPage, setCurrentPage] = useState("Home");

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow flex">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="chat" element={<ChatBot />} />
          <Route path="issue" element={<IssuePage />} />
          <Route path="faq" element={<FAQPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
