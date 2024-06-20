import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import "./HomePage.css";
import CarItem from "./CarItem";

function HomePage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [myCars, setMyCars] = useState([]);
  const [viewMode, setViewMode] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
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
        console.error("Error fetching cars", error);
      }
    };
    const fetchMyCars = async () => {
      try {
        const response = await api.get("/cars/owner");
        if (response.status === 200) {
          setMyCars(response.data);
        } else if (response.status === 401) {
          navigate("/login");
        } else {
          console.error("Error", response);
        }
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/login");
        }
        console.error("Error fetching cars", error);
      }
    };
    Promise.all([fetchCars(), fetchMyCars()]).then(() => setIsLoading(false));
  }, []);

  const toggleViewMode = () => {
    setViewMode(viewMode === "all" ? "my" : "all");
  };

  const displayCars = viewMode === "my" ? myCars : cars;
  const noCarsMessage =
    viewMode === "my"
      ? "You do not have any cars"
      : "There are no cars available to rent";
  const viewButtonText = viewMode === "my" ? "View all cars" : "View my cars";
  const headerText = viewMode === "my" ? "My cars:" : "Rent a car:";

  return (
    <div className="home-page">
      <div id="header">
        <h1 id="welcome">Welcome to</h1>
        <h1 id="logo">BookACar</h1>
      </div>

      <Link to={"/reservations"}>
        <button>MY RESERVATIONS</button>
      </Link>

      <div id="content1">
        <div id="form-section">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2>{headerText}</h2>
              <ul className="unorderedList">
                {displayCars.length > 0 ? (
                  displayCars.map((car) => <CarItem key={car._id} car={car} />)
                ) : (
                  <p>{noCarsMessage}</p>
                )}
              </ul>
            </>
          )}
        </div>
        <div id="text-section">
          {viewMode === "my" && (
            <Link to={"/create"}>
              <button>ADD NEW CAR</button>
            </Link>
          )}
          <button onClick={toggleViewMode} id="viewMyCars">
            {viewButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
