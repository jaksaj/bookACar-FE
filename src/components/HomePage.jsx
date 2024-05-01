import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import "./HomePage.css";
import CarItem from "./CarItem";

function HomePage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/cars");
        if (response.status === 200) {
          setCars(response.data);
        } else if (response.status === 401) {
          navigate("/login");
        } else {
          console.error("Error", response);
        }
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/login");
        }
        console.error("Error fetching training programs:", error);
      }
    };
    fetchCars();
  }, []);
  const handleDeleteCar = (deletedCarId) => {
    setCars((prevCars) =>
      prevCars.filter((car) => car._id !== deletedCarId)
    );
  };
  return (
    <div className="home-page">
      <div id="header">
        <h1 id="welcome">Welcome to</h1>
        <h1 id="logo">BookACar</h1>
      </div>

      <div id="content1">
        <div id="form-section">
          {cars.length > 0 && (
            <>
              <h2>Your Cars: </h2>
              <ul className="unorderedList">
                {cars.map((car) => (
                  <CarItem
                    key={car._id}
                    program={car}
                    onDelete={handleDeleteCar}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
        <div id="text-section">
          <p>
            See all available cars <br></br>
            and add new ones!
          </p>

          <Link to={"/create"}>
            <button>ADD</button>
          </Link>
          <p>Click button to add new car.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
