import React, { useEffect, useState } from "react";
import Search from "./Search";

const CourseList = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/courses/`); // Django API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        console.log(data);

        // Fix: Access 'courses' from the fetched data object
        if (data && Array.isArray(data.courses)) {
          setCourses(data.courses); // Set courses from data.courses
          setFilteredCourses(data.courses); // Set filtered courses from data.courses
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const filtered =
      category === "All"
        ? courses
        : courses.filter((course) => course.category === category);
    setFilteredCourses(filtered);
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error}</p>;

  const categories = [
    "All",
    "Anthropology",
    "Arts, Culture and Media",
    "Biological Sciences",
    "Computer and Mathematical Sciences",
    "English",
    "Global Development Studies",
    "Health and Society",
    "Historical and Cultural Studies",
    "Human Geography",
    "Language Studies",
    "Management",
    "Philosophy",
    "Physical and Environmental Sciences",
    "Political Science",
    "Psychology",
    "Sociology",
  ];

  return (
    <div className="course-list">
      <h2>Available UTSC Courses</h2>
      <Search onSearch={handleSearch} />

      <div className="course-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-button ${selectedCategory === category ? "active" : ""
              }`}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="courses">
        {filteredCourses.map((course) => (
          <div className="course-card" key={course.code}>
            <h3>
              <a href={`/courses/${course.code}`}>
                {course.code}: {course.title}
              </a>
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
