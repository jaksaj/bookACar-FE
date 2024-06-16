import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import "./HomePage.css";
import "./Car.css";
import ReservationItem from "./ReservationItem";

function Car() {
  const [reservations, setReservations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get("/reservations/user");
        if (response.status === 200) {
          setReservations(response.data);
        } else {
          console.error("Error fetching reservations:", response);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          console.error("Error fetching reservations:", error);
        }
      }
    };
    fetchReservations();
  }, [navigate]);

  return (
    <div className="home-page">
      <h2>Your reservations</h2>

      {reservations.length === 0 ? (
        <p>No reservations yet</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <ReservationItem key={reservation._id} reservation={reservation} />
          ))}
        </ul>
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
