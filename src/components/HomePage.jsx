import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import "./HomePage.css";
import CarItem from "./CarItem";

function HomePage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [myCars, setMyCars] = useState([]);
  const [viewMyCars, setViewMyCars] = useState(false);

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
    fetchCars();
    fetchMyCars();
  }, []);

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
          {
            <>
              <h2> {viewMyCars ? "My cars:" : "Rent a car:"} </h2>
              <ul className="unorderedList">
                {viewMyCars ? (
                  myCars.length > 0 ? (
                    myCars.map((car) => <CarItem key={car._id} car={car} />)
                  ) : (
                    <p>You do not have any cars</p>
                  )
                ) : cars.length > 0 ? (
                  cars.map((car) => <CarItem key={car._id} car={car} />)
                ) : (
                  <p>There are no cars available to rent</p>
                )}
              </ul>
            </>
          }
        </div>
        <div id="text-section">
          {viewMyCars && (
            <Link to={"/create"}>
              <button>ADD NEW CAR</button>
            </Link>
          )}
          <button onClick={() => setViewMyCars(!viewMyCars)} id="viewMyCars">
            {viewMyCars ? "View all cars" : "View my cars"}
            {/*TODO refactor to not use viewMyCars in so many places && myb add isRenting flag or something similar*/}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
