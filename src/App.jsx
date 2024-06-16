import FormRegistration from "./components/FormRegistration";
import FormSignIn from "./components/FormSignIn";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import FormCreateCar from "./components/FormCreateCar";
import Car from "./components/Car";
import Reservations from "./components/Reservations";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<FormSignIn />} />
          <Route path="/register" element={<FormRegistration />} />
          <Route path="/home/*" element={<HomePage />} />
          <Route path="/create" element={<FormCreateCar />} />
          <Route path="/home/car/:carId" element={<Car />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
