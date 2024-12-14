import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 RateMyCourses. All rights reserved.</p>
      <p>
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
      </p>
      <div className="nav-links">
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
        <a href="https://www.linkedin.com/company/rate-my-courses" className="icon-link">
          <i class="fa-brands fa-linkedin"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
