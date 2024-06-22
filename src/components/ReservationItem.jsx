import React from "react";
import styles from "./ReservationItem.module.css";
import { Link } from "react-router-dom";

const ReservationItem = ({ reservation }) => {
  return (
    <Link to={`/reservations/${reservation._id}`}>
      <div className={styles.reservationItem}>
        <h2>{reservation.totalCost + "€"}</h2>
        <p>From: {new Date(reservation.fromDate).toLocaleDateString()}</p>
        <p>To: {new Date(reservation.toDate).toLocaleDateString()}</p>
      </div>
    </Link>
  );
};

export default ReservationItem;
