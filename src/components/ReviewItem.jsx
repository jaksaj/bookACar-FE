import React from "react";
import styles from "./ReviewItem.module.css";

const ReviewItem = ({ review }) => {
  return (
    <div className={styles.reviewItem}>
      <h4>Rating: {review.rating}</h4>
      <p>{review.text}</p>
    </div>
  );
};

export default ReviewItem;
