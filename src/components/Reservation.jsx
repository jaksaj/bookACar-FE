import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import "./HomePage.css";
import "./Car.css";
import { jwtDecode } from "jwt-decode";
import Review from "./Review";

function Reservation() {
  const [reservation, setReservation] = useState([]);
  const [carInfo, setCarInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReservationOwner, setIsReservationOwner] = useState(false);
  const token = localStorage.getItem("token");
  const userId = jwtDecode(token).userId;

  const navigate = useNavigate();
  const { reservationId } = useParams();

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const toDate = new Date(date);
    return toDate < today;
  };

  useEffect(() => {
    const fetchReservationAndCarInfo = async () => {
      try {
        const reservationResponse = await api.get(
          `/reservations/${reservationId}`
        );
        const carResponse = await api.get(
          `/cars/${reservationResponse.data.car}`
        );
        if (reservationResponse.status === 200 || carResponse.status === 200) {
          setReservation(reservationResponse.data);
          setCarInfo(carResponse.data);
          setIsReservationOwner(reservationResponse.data.user === userId);
        } else {
          console.error("Error fetching reservation:", reservationResponse); // TODO error for carResponse
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          console.error("Error fetching reservation:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservationAndCarInfo();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-page">
      {userId === reservation?.user ? (
        <h2>Your reservation</h2>
      ) : (
        <h2>Reservation</h2>
      )}
      <h2>{carInfo.make + " " + carInfo.model}</h2>
      <h2>{reservation.totalCost + "€"}</h2>
      <p>From: {new Date(reservation.fromDate).toLocaleDateString()}</p>
      <p>To: {new Date(reservation.toDate).toLocaleDateString()}</p>
      {!isPastDate(reservation.toDate) && (
        <Review reservation={reservation} isReservationOwner={isReservationOwner} />
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

export default Reservation;
