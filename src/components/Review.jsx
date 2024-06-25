import React, { useState, useEffect } from "react";
import api from "../axiosConfig";

const Review = ({ reservation, isReservationOwner }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `/reviews/reservation/${reservation._id}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch review");
        }
        setReview(response.data);
      } catch (error) {
        if (error.status === 404) {
          return;
        }
        console.error("Error fetching review:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, [reservation]);

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleSubmit = async () => {
    const reviewData = {
      text: reviewText,
      rating: rating,
      car: reservation.car,
      reservation: reservation._id,
    };

    try {
      const response = await api.post("/reviews", reviewData);
      if (response.status !== 200) {
        throw new Error("Failed to submit review");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (isLoading) {
    return <div>Loading review...</div>;
  }

  if (review) {
    return (
      <div>
        <h2>{isReservationOwner ? "Your Review" : "Client review"} </h2>
        <p>
          Rating: {review.rating} {review.rating === 1 ? "star" : "stars"}
        </p>
        <p>Review: {review.text}</p>
      </div>
    );
  }

  return isReservationOwner ? (
    <div>
      <textarea
        value={reviewText}
        onChange={handleReviewTextChange}
        placeholder="Enter your review"
      />
      <select value={rating} onChange={handleRatingChange}>
        <option value={1}>1 star</option>
        <option value={2}>2 stars</option>
        <option value={3}>3 stars</option>
        <option value={4}>4 stars</option>
        <option value={5}>5 stars</option>
      </select>
      <button onClick={handleSubmit}>Submit Review</button>
    </div>
  ) : null;
};

export default Review;
