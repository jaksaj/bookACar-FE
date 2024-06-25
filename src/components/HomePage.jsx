import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import CarItem from "./CarItem";
import Logo from "./Logo";
import { faCar, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    <div>
      <Logo />

      <Link to={"/reservations"}>
        <button>
          {" "}
          <FontAwesomeIcon icon={faCalendarAlt} /> MY RESERVATIONS
        </button>
      </Link>

      <div>
        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2>{headerText}</h2>
              <ul>
                {displayCars.length > 0 ? (
                  displayCars.map((car) => <CarItem key={car._id} car={car} />)
                ) : (
                  <p>{noCarsMessage}</p>
                )}
              </ul>
            </>
          )}
        </div>
        <div>
          {viewMode === "my" && (
            <Link to={"/create"}>
              <button>ADD NEW CAR</button>
            </Link>
          )}
          <button onClick={toggleViewMode}>
            <FontAwesomeIcon icon={faCar} /> {viewButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
