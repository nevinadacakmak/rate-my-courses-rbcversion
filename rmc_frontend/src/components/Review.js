import React from "react";

function getColorClass(value, type) {
  if (type === "difficulty") {
    // Lower difficulty is better (green for easy, red for hard)
    return value <= 2 ? "green" : value <= 3.5 ? "yellow" : "red";
  } else if (type === "quality") {
    // Higher quality is better (green for good, red for bad)
    return value >= 4 ? "green" : value >= 2.5 ? "yellow" : "red";
  }
  return "";
}

const Review = ({ review }) => {
  return (
    <div className="review-box">
      {/* Header: Professor Name, Review Date, and Semester */}
      <div className="review-header">
        <span className="review-author">
          {review.professor || "Unknown Professor"}
        </span>
        <span className="review-date">
        {review.review_date
          ? new Intl.DateTimeFormat("en-US", { 
              month: "short", 
              day: "numeric", 
              year: "numeric" 
            }).format(new Date(review.review_date))
              .replace(/(\d+)(?=,)/, (match) => `${match}th`) // Add "th" for the day
          : "Date Not Available"}
      </span>
      </div>

      {/* Semester */}
      <div className="review-header">
        <span className="review-semester">
          {review.semester || "Semester Not Available"}
        </span>
      </div>

      {/* Main Content: Rating, Yes/No, Description */}
      <div className="review-content">
        {/* Ratings Section */}
        <div className="rating-container">
          <div className="rating-header">
            <span>Quality</span>
          </div>
          <div className={`rating-box ${getColorClass(review.overall_rating, "quality")}`}>
            <strong className="rating-number">{review.overall_rating || "N/A"}</strong>
          </div>
          <div className="rating-container">
          <div className="rating-header">
            <span>Difficulty</span>
          </div>
          <div className={`rating-box ${getColorClass(review.difficulty_rating, "difficulty")}`}>
            <strong className="rating-number">{review.difficulty_rating || "N/A"}</strong>
          </div>
        </div>
      </div>

        {/* Yes/No Questions and Description */}
        <div className="review-questions">
          <div className="review-ratings">
            <span>
                Workload:{" "}
                <strong>{review.workload || "N/A"}</strong>
            </span>
            <span>
              Attendance:{" "}
              <strong>{review.attendance_mandatory ? "Mandatory" : "Not Mandatory" }</strong>
            </span>
            <span>
             Would Take Again: <strong>{review.take_again ? "Yes" : "No"}</strong>
            </span>
            <span>
              Grade: <strong>{review.grade || "N/A"}</strong>
            </span>
            <span>
              Textbook:{" "}
              <strong>{review.textbook_required ? "Yes" : "No"}</strong>
            </span>
            <span>
              Online:{" "}
              <strong>{review.online_course ? "Yes" : "No"}</strong>
            </span>
            <span>
              Recorded:{" "}
              <strong>{review.lectures_recorded ? "Yes" : "No"}</strong>
            </span>
            <span>
              Exam:{" "}
              <strong>{review.exam_format || "N/A"}</strong>
            </span>
          </div>

          {/* Description */}
          <p className="review-description">
            {review.description || "No review provided"}
          </p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="tags-container">
        {review.tags && review.tags.length > 0 ? (
          review.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))
        ):
        ""}
      </div>
    </div>
  );
};

export default Review;
