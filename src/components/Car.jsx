import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import "./HomePage.css";
import "./Car.css";

function Car() {
  const navigate = useNavigate();
  const { carId } = useParams();
  const [carInfo, setCarInfo] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get(`/cars/${carId}`);
        if (response.status === 200) {
          setCarInfo(response.data);
        } else if (response.status === 401) {
          navigate("/login");
        } else {
          console.error("Error", response);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, [navigate]);

  const handleAddWorkoutClick = () => {
    navigate(`addworkout?type=${type}`);
  };

  return (
    <div className="home-page">
      <h3>{carInfo.make+" "+ carInfo.model}</h3>

      <div id="content1">
        <div id="form-section">
          {Array.isArray(carInfo) && carInfo.length > 0 && (
            <>
              <h2>Your Workouts: </h2>
            </>
          )}
        </div>
      </div>
      <button id="plus" onClick={handleAddWorkoutClick}>
        BOOK
      </button>
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
