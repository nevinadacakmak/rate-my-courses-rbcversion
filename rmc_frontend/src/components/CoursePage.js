import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Review from "./Review";
import DistributionChart from "./DistributionChart";

const CoursePage = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    semester: "",
    difficulty_rating: 1,
    overall_rating: 1,
    professor: "",
    online_course: false,
    attendance_mandatory: "Mandatory",
    lectures_recorded: false,
    workload: "Medium",
    // exam_format: "MCQ & SA",
    textbook_required: false,
    take_again: false,
    grade: "",
    description: "",
    tags: [],
  });
  const [distribution, setDistribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reviewFormRef = useRef(null); // Reference for the review form

  const tagOptions = [
    "Intense Lectures",
    "Difficult Exams",
    "Real Life Application",
    "Bird Course",
    "Graded by Few Things",
    "Assignment Heavy",
    "Reading Heavy",
    "Group Projects",
    "Weekly Quizzes",
    "Interesting Content",
    "Participation Counts",
    "Friendly Professor",
    "Fast Paced",
    "Strict Grading",
    "Attend Lectures to Do Well",
    "No Exams",
    "Do Readings To Do Well",
    "Get Ready To Present",
    "Tutorials Mandatory",
    "Take Home Exam",
  ];

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseResponse = await fetch(
          `${BASE_URL}/api/courses/${courseId}/`
        );
        if (!courseResponse.ok)
          throw new Error("Failed to fetch course details");
        const courseData = await courseResponse.json();
        setCourse(courseData.course);
        setReviews(courseData.reviews);

        calculateDistribution(courseData.reviews);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle tag selection
  const handleTagChange = (tag) => {
    setNewReview((prevState) => {
      const tags = [...prevState.tags];
      if (tags.includes(tag)) {
        // Remove tag if already selected
        tags.splice(tags.indexOf(tag), 1);
      } else if (tags.length < 10) {
        // Add tag if not already selected and if the limit is not reached
        tags.push(tag);
      }
      return { ...prevState, tags };
    });
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    const csrftoken = Cookies.get("csrftoken");

    try {
      console.log("Tags sent: " + newReview.tags);
      console.log(newReview);
      const response = await fetch(
        `${BASE_URL}/api/reviews/${courseId}/submit_review/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify(newReview),
        }
      );

      if (!response.ok) throw new Error("Failed to submit review");

      const updatedReview = await response.json();
      console.log(updatedReview);
      setReviews((prevReviews) => [...prevReviews, updatedReview]);
      calculateDistribution([...reviews, updatedReview]);

      setNewReview({
        semester: "",
        difficulty_rating: 1,
        overall_rating: 1,
        professor: "",
        online_course: true,
        attendance_mandatory: "",
        lectures_recorded: true,
        workload: "",
        textbook_required: true,
        take_again: true,
        grade: "",
        description: "",
        tags: [],
      });

      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.message);
    }
  };

  const calculateDistribution = (reviews) => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) return;

    const ratings = {
      overall: 0,
      difficulty: 0,
      takeAgainYes: 0,
      textbookRequired: 0,
      ratingCounts: [0, 0, 0, 0, 0],
    };

    reviews.forEach((review) => {
      ratings.overall += review.overall_rating;
      ratings.difficulty += review.difficulty_rating;
      if (review.take_again) ratings.takeAgainYes += 1;
      if (review.textbook_required) ratings.textbookRequired += 1;

      // Increment the count for each specific rating (1-5)
      if (review.overall_rating >= 1 && review.overall_rating <= 5) {
        ratings.ratingCounts[review.overall_rating - 1] += 1;
      }
    });

    setDistribution({
      avgOverall: (ratings.overall / totalReviews).toFixed(1),
      avgDifficulty: (ratings.difficulty / totalReviews).toFixed(1),
      takeAgainPercentage: (
        (ratings.takeAgainYes / totalReviews) *
        100
      ).toFixed(0),
      textbookRequiredPercentage: (
        (ratings.textbookRequired / totalReviews) *
        100
      ).toFixed(0),
      ratings: ratings.ratingCounts.reverse(),
    });
  };

  // Scroll to the review form when the button is clicked
  const scrollToReviewForm = () => {
    reviewFormRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p>Error: {error}</p>;

  function getColorClass(value, type) {
    if (type === "difficulty") {
      // Lower difficulty is better (green for easy, red for hard)
      return value <= 2 ? "green" : value <= 3.5 ? "yellow" : "red";
    } else if (type === "quality") {
      // Higher quality is better (green for good, red for bad)
      return value >= 4 ? "green" : value >= 2.5 ? "yellow" : "red";
    } else if (type === "retake") {
      // Higher retake rate is better (green for high, red for low)
      return value >= 75 ? "green" : value >= 50 ? "yellow" : "red";
    }
    return "";
  }

  return (
    <div className="course-page">
      {course && (
        <div style={{ marginTop: '50px' }}>
          <h2>
            {course.code}: {course.title}
          </h2>
          <p>{course.description}</p>
        </div>
      )}

      <div className="review-distribution">
        {distribution ? (
          <>
            <div className="avg-dif-retake">
              <div
                className={`info-box ${getColorClass(
                  distribution.avgDifficulty,
                  "difficulty"
                )}`}
              >
                <p>Average Difficulty: {distribution.avgDifficulty}</p>
              </div>
              <div
                className={`info-box ${getColorClass(
                  distribution.avgOverall,
                  "quality"
                )}`}
              >
                <p>Overall <br /> Quality: {distribution.avgOverall}</p>
              </div>
              <div
                className={`info-box ${getColorClass(
                  distribution.takeAgainPercentage,
                  "retake"
                )}`}
              >
                <p>Would Take Again: {distribution.takeAgainPercentage}%</p>
              </div>
            </div>

            <h3>Rating Distribution</h3>
            <div className="distribution-chart">
              <DistributionChart distribution={distribution} />
            </div>
          </>
        ) : (
          <p style={{ fontSize: '1.3em' }}> No reviews yet. <br /> Be the first to review!</p>
        )}
      </div>

      <button className="submit-review-button" onClick={scrollToReviewForm}>
        Submit a Review
      </button>

      {reviews.length > 0 && <h3>Reviews</h3>}
      <div className="review-container">
        {reviews.map((review, index) => (
          <Review key={index} review={review} />
        ))}
      </div>

      <h3 style={{ marginTop: '50px' }}>Submit a Review</h3>
      <form
        onSubmit={handleSubmitReview}
        ref={reviewFormRef}
        className="review-form"
      >
        <div className="review-form-row">
          <label className='lol'>
            Semester Taken:
            <select
              name="semester"
              value={newReview.semester}
              onChange={handleChange}
            >
              <option value="">Select Semester</option>
              <option value="Winter 2022">Winter 2022</option>
              <option value="Summer 2022">Summer 2022</option>
              <option value="Fall 2022">Fall 2022</option>
              <option value="Winter 2023">Winter 2023</option>
              <option value="Summer 2023">Summer 2023</option>
              <option value="Fall 2023">Fall 2023</option>
              <option value="Winter 2024">Winter 2024</option>
              <option value="Summer 2024">Summer 2024</option>
              <option value="Fall 2024">Fall 2024</option>
            </select>
          </label>

          <label>
            Professor:
            <input
              type="text"
              name="professor"
              value={newReview.professor}
              onChange={handleChange}
            />
          </label>

          <label>
            Grade:
            <select name="grade" value={newReview.grade} onChange={handleChange}>
              <option value="">Select Grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="B-">B-</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="C-">C-</option>
              <option value="D+">D+</option>
              <option value="D">D</option>
              <option value="D-">D-</option>
              <option value="F">F</option>
              <option value="N/A">Not Available Yet</option>
              <option value="Nope">Rather Not Say</option>
            </select>
          </label>
        </div>

        <div className="review-form-row">
          <label>
            Difficulty (1-5):
            <select
              name="difficulty_rating"
              value={newReview.difficulty_rating}
              onChange={handleChange}
            >
              <option value="">Select Difficulty</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>

          <label>
            Quality (1-5):
            <select
              name="overall_rating"
              value={newReview.overall_rating}
              onChange={handleChange}
            >
              <option value="">Select Quality</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>



        <div className="yes-no-inline-single">
          Was this an online course?
          <div className="form-radio">
            <label>
              Yes
              <input
                type="radio"
                name="online_course"
                checked={newReview.online_course === true}
                onChange={() =>
                  setNewReview((prev) => ({ ...prev, online_course: true }))
                }
              />
            </label>
            <label>
              No
              <input
                type="radio"
                name="online_course"
                checked={newReview.online_course === false}
                onChange={() =>
                  setNewReview((prev) => ({ ...prev, online_course: false }))
                }
              />
            </label>
          </div>
        </div>

        {/* <label className="yes-no-inline">
          What was the exam format?
          <label>
            MCQ Only
            <input
              type="radio"
              name="exam_format"
              checked={newReview.exam_format === "MCQ Only"}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, exam_format: e.target.value }))
              }
            />
          </label>
          <label>
            SA Only
            <input
              type="radio"
              name="exam_format"
              checked={newReview.exam_format === "SA Only"}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, exam_format: e.target.value }))
              }
            />
          </label>
          <label>
            MCQ & SA
            <input
              type="radio"
              name="exam_format"
              checked={newReview.exam_format === "MCQ & SA"}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, exam_format: e.target.value }))
              }
            />
          </label>
        </label> */}

        <div className="yes-no-inline-single">
          Would you take it again?
          <div className="form-radio">
            <label>
              Yes
              <input
                type="radio"
                name="take_again"
                checked={newReview.take_again === true}
                onChange={() =>
                  setNewReview((prev) => ({ ...prev, take_again: true }))
                }
              />
            </label>
            <label>
              No
              <input
                type="radio"
                name="take_again"
                checked={newReview.take_again === false}
                onChange={() =>
                  setNewReview((prev) => ({ ...prev, take_again: false }))
                }
              />
            </label>
          </div>
        </div>

        <div className="yes-no-inline-single">
          Was the textbook required?
          <div className="form-radio">
            <label>
              Yes
              <input
                type="radio"
                name="textbook_required"
                checked={newReview.textbook_required === true}
                onChange={() =>
                  setNewReview((prev) => ({ ...prev, textbook_required: true }))
                }
              />
            </label>
            <label>
              No
              <input
                type="radio"
                name="textbook_required"
                checked={newReview.textbook_required === false}
                onChange={() =>
                  setNewReview((prev) => ({ ...prev, textbook_required: false }))
                }
              />
            </label>
          </div>
        </div>

        <div className="yes-no-inline-single">
          Was attendance mandatory?
          <div className="form-radio">
            <label>
              Yes
              <input
                type="radio"
                name="attendance_mandatory"
                value="Mandatory"
                checked={newReview.attendance_mandatory === true}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, attendance_mandatory: true }))
                }
              />
            </label>
            <label>
              No
              <input
                type="radio"
                name="attendance_mandatory"
                value="Not Mandatory"
                checked={newReview.attendance_mandatory === false}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, attendance_mandatory: false }))
                }
              />
            </label>
          </div>
        </div>

        <div className="yes-no-inline-single">
          Were the lectures recorded?
          <div className="form-radio">
            <label>
              Yes
              <input
                type="radio"
                name="lectures_recorded"
                checked={newReview.lectures_recorded === true}
                onChange={() =>
                  setNewReview((prev) => ({
                    ...prev,
                    lectures_recorded: true,
                  }))
                }
              />
            </label>
            <label>
              No
              <input
                type="radio"
                name="lectures_recorded"
                checked={newReview.lectures_recorded === false}
                onChange={() =>
                  setNewReview((prev) => ({
                    ...prev,
                    lectures_recorded: false,
                  }))
                }
              />
            </label>
          </div>
        </div>

        <div className="yes-no-inline">
          How was the workload?
          <div>
            <select
              name="workload"
              value={newReview.workload}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, workload: e.target.value }))
              }
            >
              <option value="">Select Workload</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="yes-no-inline">
          What was the exam format?
          <div>
            <select
              name="exam_format"
              value={newReview.exam_format}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, exam_format: e.target.value }))
              }
            >
              <option value="">Select Exam Format</option>
              <option value="MCQ Only">MCQ Only</option>
              <option value="SA Only">Short Answer Only</option>
              <option value="MCQ & SA">MCQ & Short Answer</option>
            </select>
          </div>
        </div>

        <label>
          Review:
          <textarea
            name="description"
            value={newReview.description}
            onChange={handleChange}
            maxLength={2100}
          />
          <p>Characters remaining: {2100 - newReview.description.length}</p>
        </label>

        <label>
          Tags (up to 10):
          <div className="tags-inline">
            {tagOptions.map((tag) => (
              <button
                type="button"
                key={tag}
                className={`tag-button ${newReview.tags.includes(tag) ? "selected" : ""
                  }`}
                onClick={() => handleTagChange(tag)}
                disabled={
                  newReview.tags.length >= 10 && !newReview.tags.includes(tag)
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </label>

        <button className='form-submit' type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default CoursePage;
