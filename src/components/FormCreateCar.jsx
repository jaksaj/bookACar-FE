import { useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import styles from "./FormCreateCar.module.css";
import { Cars, FuelTypes } from "../constants";

function FormCreateCar() {
  const navigate = useNavigate();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2000);
  const [pricePerDay, setPricePerDay] = useState(10);
  const [seatCapacity, setSeatCapacity] = useState(4);
  const [fuelType, setFuelType] = useState("");

  const handleMakeChange = (e) => {
    const inputValue = e.target.value;
    setMake(inputValue);
  };
  const handleModelChange = (e) => {
    const inputValue = e.target.value;
    setModel(inputValue);
  };
  const handleYearChange = (e) => {
    let inputValue = e.target.value;
    if (inputValue !== "") {
      inputValue = parseInt(inputValue, 10);
      if (inputValue >= 2000 && inputValue <= 2024) {
        setYear(inputValue);
      }
    } else {
      setYear(null);
    }
  };
  const handlePricePerDayChange = (e) => {
    const inputValue = e.target.value;
    setPricePerDay(inputValue);
  };
  const handleSeatCapacityChange = (e) => {
    const inputValue = e.target.value;
    setSeatCapacity(inputValue);
  };
  const handleFuelTypeChange = (e) => {
    const inputValue = e.target.value;
    setFuelType(inputValue);
  };

  const back = () => {
    navigate("/home");
  };

  const testToken = async () => {
    if (
      make.length < 1 ||
      model.length < 1 ||
      year === null ||
      pricePerDay.length < 1 ||
      seatCapacity.length < 1 ||
      fuelType.length < 1
    ) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await api.post("/cars", {
        make,
        model,
        year,
        pricePerDay,
        isAvailable: true,
        seatCapacity,
        fuelType,
      });
      back();
    } catch (error) {
      console.error("Error!", error);
    }
  };

  return (
    <div>
      <h2 id="title">Add a new rental car</h2>

      <div>
        <label className={styles.label}>Make</label>
        <select
          value={make}
          onChange={handleMakeChange}
          className={styles.entrance}
        >
          <option value="">Select make</option>
          {Object.keys(Cars).map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={styles.label}>Model</label>
        <select
          value={model}
          onChange={handleModelChange}
          className={styles.entrance}
        >
          <option value="">Select model</option>
          {make &&
            Cars[make].map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className={styles.label}>Year</label>
        <input
          type="number"
          min="1990"
          value={year}
          onChange={handleYearChange}
          placeholder="Enter year"
          className={styles.entrance}
        />
      </div>

      <div>
        <label className={styles.label}>Price per day</label>
        <input
          type="number"
          min="1"
          value={pricePerDay}
          onChange={handlePricePerDayChange}
          placeholder="Enter price per day"
          className={styles.entrance}
        />
      </div>

      <div>
        <label className={styles.label}>Seat capacity</label>
        <input
          type="number"
          min="1"
          value={seatCapacity}
          onChange={handleSeatCapacityChange}
          placeholder="Enter seat capacity"
          className={styles.entrance}
        />
      </div>

      <div>
        <label className={styles.label}>Fuel type</label>
        <select
          value={fuelType}
          onChange={handleFuelTypeChange}
          className={styles.entrance}
        >
          <option value="">Select fuel type</option>
          {FuelTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <button type="button" onClick={testToken}>
        CREATE
      </button>
      <button type="button" onClick={back} style={{ backgroundColor: "red" }}>
        BACK
      </button>
    </div>
  );
}

export default FormCreateCar;
