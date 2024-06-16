import React from "react";
import styles from "./ReservationItem.module.css";

const ReservationItem = ({ reservation }) => {

  return (
    <div className={styles.programItem}>
        <h2>{reservation.totalCost + "€"}</h2>
        <p>From: {new Date(reservation.fromDate).toLocaleDateString()}</p>
        <p>To: {new Date(reservation.toDate).toLocaleDateString()}</p>
    </div>
  );
};

export default ReservationItem;
