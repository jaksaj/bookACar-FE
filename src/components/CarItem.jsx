import React from "react";
import styles from "./CarItem.module.css";
import { Link } from "react-router-dom";

const CarItem = ({ car }) => {
  return (
    <div className={styles.carItem}>
      <Link to={`car/${car._id}`}>
        <h2>{car.make + " " + car.model}</h2>
        <p>Year: {car.year}</p>
      </Link>
    </div>
  );
};

export default CarItem;
