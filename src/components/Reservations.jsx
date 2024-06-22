import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import ReservationItem from "./ReservationItem";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, [navigate]);

  return (
    <div>
      <h2>Your reservations</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : reservations.length === 0 ? (
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
        style={{ backgroundColor: "red" }}
      >
        BACK
      </button>
    </div>
  );
}

export default Reservations;
