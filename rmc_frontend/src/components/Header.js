import React from "react";

const Header = () => {
  return (
    <header>
      <nav className="navbar">
        <a className="logo" href="/">
          <img src="/rmclogo.png" alt="Rate My Courses Logo" />
          <h1>Rate My Courses</h1>
        </a>
        {/* <div className="nav-links">
          <a
            href="https://www.instagram.com/rate_mycourses"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a href="mailto:ratemycoursess@gmail.com" className="icon-link">
            <i className="fas fa-envelope"></i>
          </a>
        </div> */}
      </nav>
    </header>
  );
};

export default Header;
