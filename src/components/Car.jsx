import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import styles from "./Car.module.css";
import { jwtDecode } from "jwt-decode";
import ReservationItem from "./ReservationItem";
import ReviewItem from "./ReviewItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

function Car() {
  const token = localStorage.getItem("token");
  const userId = jwtDecode(token).userId;
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { carId } = useParams();
  const [carInfo, setCarInfo] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [carReviews, setCarReviews] = useState([]);

  const calculateAverageRating = (reviews) => {
    let sum = 0;
    for (let i = 0; i < reviews.length; i++) {
      sum += reviews[i].rating;
    }
    return sum / reviews.length;
  };

  useEffect(() => {
    const fetchCarInfoAndReservationInfo = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/cars/${carId}`);
        const reviewResponse = await api.get(`/reviews/car/${carId}`);
        if (response.status === 200 && reviewResponse.status === 200) {
          setCarInfo(response.data);
          setCarReviews(reviewResponse.data);
        } else {
          console.error("Error fetching car info:", response);
          if (reviewResponse.status !== 200) {
            console.error("Error fetching car reviews:", reviewResponse);
          }
        }

        const isCurrentUserOwner = response.data.owner === userId;
        setIsOwner(isCurrentUserOwner);

        if (isCurrentUserOwner) {
          const reservationResponse = await api.get(
            `/reservations/car/${carId}`
          );
          if (reservationResponse.status === 200) {
            setReservations(reservationResponse.data);
          } else {
            console.error(
              "Error fetching reservation info:",
              reservationResponse
            );
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          console.error("Error fetching car info:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarInfoAndReservationInfo();
  }, [navigate, carId, userId]);

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/cars/${carInfo._id}`);
      if (response.status === 200) {
        navigate(-1);
      } else {
        console.error("Error deleting car:", response);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const handleBook = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      alert("End date must be after start date.");
      return;
    }
    if (new Date(startDate) < new Date().setHours(0, 0, 0, 0)) {
      alert("Start date must be after today.");
      return;
    }

    const calculateTotalCost = (startDate, endDate, pricePerDay) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = (end - start) / (1000 * 60 * 60 * 24);
      return days * pricePerDay;
    };

    const reservationData = {
      car: carId,
      fromDate: startDate,
      toDate: endDate,
      isPaid: false,
      totalCost: calculateTotalCost(startDate, endDate, carInfo.pricePerDay),
    };

    try {
      const response = await api.post("/reservations", reservationData);
      if (response.status === 200 || response.status === 201) {
        alert("Reservation created successfully!");
      } else {
        console.error("Failed to create reservation:", response);
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      alert(error.response.data.message ?? "Failed to create reservation.");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.main}>
      <h3>{carInfo.make + " " + carInfo.model}</h3>
      <div>
        <h4>Year: {carInfo.year}</h4>
        <h4>Price per day: {carInfo.pricePerDay}</h4>
        <h4>Seat capacity: {carInfo.seatCapacity}</h4>
        <h4>Fuel type: {carInfo.fuelType}</h4>
        <h4>
          {carReviews?.length > 1 &&
            "Rating: " + calculateAverageRating(carReviews)}
        </h4>
      </div>

      {carReviews?.length > 1 && (
        <div className={styles.reviews}>
          <h2>Reviews</h2>
          <ul>
            {carReviews.map((review) => (
              <ReviewItem key={review._id} review={review} />
            ))}
          </ul>
        </div>
      )}
      {isOwner ? (
        <div className={styles.reservations}>
          <h2>Your reservations</h2>
          {reservations.length === 0 ? (
            <p>No reservations yet</p>
          ) : (
            <ul>
              {reservations.map((reservation) => (
                <ReservationItem
                  key={reservation._id}
                  reservation={reservation}
                />
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={handleDelete}
            style={{ backgroundColor: "red" }}
          >
            <FontAwesomeIcon icon={faTrash} className={styles.buttonIcon} />{" "}
            DELETE
          </button>
        </div>
      ) : (
        <div className={styles.dateInput}>
          <label htmlFor="start-date">Start Date:</label>
          <div className={styles.inputContainer}>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <label htmlFor="end-date">End Date:</label>
          <div className={styles.inputContainer}>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button onClick={handleBook}>
            <FontAwesomeIcon icon={faCheck} className={styles.buttonIcon} />{" "}
            BOOK
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{ backgroundColor: "red" }}
      >
        <FontAwesomeIcon icon={faArrowLeft} className={styles.buttonIcon} />{" "}
        BACK
      </button>
    </div>
  );
}

export default Car;
