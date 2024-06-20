import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import "./HomePage.css";
import "./Car.css";
import { jwtDecode } from "jwt-decode";
import ReservationItem from "./ReservationItem";
import ReviewItem from "./ReviewItem";

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
    const fetchCarInfo = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/cars/${carId}`);
        const reviewResponse = await api.get(`/reviews/car/${carId}`);
        if (response.status === 200 && reviewResponse.status === 200) {
          setCarInfo(response.data);
          setCarReviews(reviewResponse.data);
          console.log("Car reviews" + reviewResponse.data);
        } else {
          console.error("Error fetching car info:", response); // TODO error for reviewResponse
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
    fetchCarInfo();
  }, [navigate, carId]);

  useEffect(() => {
    const fetchReservationInfo = async () => {
      if (!isOwner) return;
      setIsLoading(true);
      try {
        const response = await api.get(`/reservations/car/${carId}`);
        console.log("Res response" + response);
        if (response.status === 200) {
          setReservations(response.data);
        } else {
          console.error("Error fetching reservation info:", response);
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
    setIsOwner(() => carInfo.owner === userId);
    fetchReservationInfo();
  }, [carInfo, isOwner, navigate, carId]);

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
    <div className="home-page">
      <h3>{carInfo.make + " " + carInfo.model}</h3>

      <div id="content1">
        <h4>Year: {carInfo.year}</h4>
        <h4>Price per day: {carInfo.pricePerDay}</h4>
        <h4>Seat capacity: {carInfo.seatCapacity}</h4>
        <h4>Fuel type: {carInfo.fuelType}</h4>
        <h4>{carReviews && "Rating: " + calculateAverageRating(carReviews)}</h4>
      </div>

      {carReviews && (
        <>
          <h2>Reviews</h2>
          <ul>
            {carReviews.map((review) => (
              <ReviewItem key={review._id} review={review} />
            ))}
          </ul>
        </>
      )}
      {isOwner ? (
        <>
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
            className="button"
            id="upper"
          >
            DELETE
          </button>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="start-date">Start Date:</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <br />
            <label htmlFor="end-date">End Date:</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button id="plus" onClick={handleBook}>
            BOOK
          </button>
        </>
      )}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="button"
        id="upper"
      >
        BACK
      </button>
    </div>
  );
}

export default Car;
