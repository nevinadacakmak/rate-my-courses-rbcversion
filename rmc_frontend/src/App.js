import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CourseList from "./components/CourseList";
import CoursePage from "./components/CoursePage";
import PrivacyPolicy from "./components/PrivacyPolicy";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<CourseList />} />{" "}
        <Route path="/courses/:courseId" element={<CoursePage />} />{" "}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
