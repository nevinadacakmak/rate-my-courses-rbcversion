import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddCourse = () => {
    window.location.href =
      "mailto:contact@ratemycourses.org?subject=Course%20Suggestion";
  };

  const handleChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm); // Call onSearch on every change
  };

  return (
    <div className="search-form-container">
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search for UTSC courses by code or title..."
          value={searchTerm}
          onChange={handleChange}
        />
      </form>
      {/* <button className="add-course-button" onClick={handleAddCourse}>
        Need a course? Add one
      </button> */}
    </div>
  );
};

export default Search;
