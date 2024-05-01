import { useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "./CreateCar.css";

function FormCreateCar() {
  const navigate = useNavigate();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [seatCapacity, setSeatCapacity] = useState("");
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
    const inputValue = e.target.value;
    setYear(inputValue);
  };
  const handlePricePerDayChange = (e) => {
    const inputValue = e.target.value;
    setPricePerDay(inputValue);
  };
  const handleIsAvailableChange = (e) => {
    const inputValue = e.target.checked;
    setIsAvailable(inputValue);
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
      year.length < 1 ||
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
        isAvailable,
        seatCapacity,
        fuelType,
      });
      back();
    } catch (error) {
      console.error("Error!", error);
    }
  };

  return (
    <div className="box">
      <h2 id="title">Add a new rental car</h2>

      <div>
        <label className="label">Make</label>
        <input
          type="text"
          value={make}
          onChange={handleMakeChange}
          placeholder="Enter make"
          className="entrance"
        />
      </div>

      <div>
        <label className="label">Model</label>
        <input
          type="text"
          value={model}
          onChange={handleModelChange}
          placeholder="Enter model"
          className="entrance"
        />
      </div>

      <div>
        <label className="label">Year</label>
        <input
          type="number"
          value={year}
          onChange={handleYearChange}
          placeholder="Enter year"
          className="entrance"
        />
      </div>

      <div>
        <label className="label">Price per day</label>
        <input
          type="number"
          value={pricePerDay}
          onChange={handlePricePerDayChange}
          placeholder="Enter price per day"
          className="entrance"
        />
      </div>

      <div>
        <label className="label">Is available</label>
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={handleIsAvailableChange}
          className="checkbox"
        />
      </div>

      <div>
        <label className="label">Seat capacity</label>
        <input
          type="number"
          value={seatCapacity}
          onChange={handleSeatCapacityChange}
          placeholder="Enter seat capacity"
          className="entrance"
        />
      </div>

      <div>
        <label className="label">Fuel type</label>
        <input
          type="text"
          value={fuelType}
          onChange={handleFuelTypeChange}
          placeholder="Enter fuel type"
          className="entrance"
        />
      </div>

      <button type="button" onClick={testToken} className="button">
        CREATE
      </button>
      <button type="button" onClick={back} className="button" id="upper">
        BACK
      </button>
    </div>
  );
}

export default FormCreateCar;
