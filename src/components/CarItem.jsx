import React from "react";
import styles from "./CarItem.module.css";
import { Link } from "react-router-dom";
import api from "../axiosConfig";

const CarItem = ({ program: car, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await api.delete(`/cars/${car._id}`);
      if (response.status === 200) {
        onDelete(car._id);
      } else {
        console.error("Error deleting training program:", response);
      }
    } catch (error) {
      console.error("Error deleting training program:", error);
    }
  };
  return (
    <div className={styles.programItem}>
      <Link
        to={`car/${car._id}`}
        className={styles.linkNoColor}
      >
        <h2>{car.make+" "+car.model}</h2>
        <p>Year: {car.year}</p>
      </Link>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default CarItem;
