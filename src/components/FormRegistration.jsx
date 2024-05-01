import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../axiosConfig";
import "./Register.css";

function FormRegistration() {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    canList: false
  });

  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

  const handleRegistration = (event) => {
    event.preventDefault();
    validateInputs();
    if (
      isUsernameValid &&
      isEmailValid &&
      isPasswordValid &&
      isFirstNameValid &&
      isLastNameValid &&
      isAddressValid &&
      isPhoneNumberValid
    ) {
      registerUser(registrationData);
    }
  };

  const validateInputs = () => {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      address,
      phoneNumber
    } = registrationData;

    setIsUsernameValid(username.length >= 4);
    setIsEmailValid(email.includes("@") && email.length >= 5);
    setIsPasswordValid(password.length >= 8);
    setIsFirstNameValid(firstName.length > 3);
    setIsLastNameValid(lastName.length > 3);
    setIsAddressValid(address.length > 3);
    setIsPhoneNumberValid(phoneNumber.length > 6);
  };

  const inputChange = (event) => {
    const { name, value } = event.target;
    setRegistrationData({ ...registrationData, [name]: value });
  };

  const registerUser = async (userData) => {
    try {
      const response = await api.post("/users/register", userData);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      } else {
        console.error("Error during registration!", response.data);
      }
    } catch (error) {
      console.error("Error during registration!", error);
    }
  };

  return (
    <>
      <form onSubmit={handleRegistration} id="form_reg">
        <div>
          <div id="header">
            <h1 id="welcome" style={{ color: "white" }}>
              Welcome to
            </h1>
            <h1 id="logo">BookACar</h1>
          </div>
        </div>
        <div>
          <label id="label1">
            Username:
            <input
              type="text"
              name="username"
              value={registrationData.username}
              onChange={inputChange}
              required
              id="input_reg1"
            />
          </label>
          <div style={{ color: "red" }}>
            {!isUsernameValid && "Username can not be shorter than 4 units!"}
          </div>
          <label id="label2">
            Email:
            <input
              type="email"
              name="email"
              value={registrationData.email}
              onChange={inputChange}
              required
              id="input2"
            />
          </label>
          <div style={{ color: "red" }}>
            {!isEmailValid && "This is not a valid email address"}
          </div>
          <label label3="label3">
            Password:
            <input
              type="password"
              name="password"
              value={registrationData.password}
              onChange={inputChange}
              required
              id="input3"
            />
          </label>
          <div style={{ color: "red" }}>
            {!isPasswordValid && "Password can not be shorter than 8 units!"}
          </div>
          <label label4="label4">
            First Name:
            <input
              type="text"
              name="firstName"
              value={registrationData.firstName}
              onChange={inputChange}
              required
              id="input4"
            />
          </label>
          <div style={{ color: "red" }}>
            {!isFirstNameValid && "First Name is required!"}
          </div>
          <label label5="label5">
            Last Name:
            <input
              type="text"
              name="lastName"
              value={registrationData.lastName}
              onChange={inputChange}
              required
              id="input5"
            />
          </label>
          <div style={{ color: "red" }}>
            {!isLastNameValid && "Last Name is required!"}
          </div>
          <label label6="label6">
            Address:
            <input
              type="text"
              name="address"
              value={registrationData.address}
              onChange={inputChange}
              required
              id="input6"
            />
          </label>
          <div style={{ color: "red" }}>
            {!isAddressValid && "Address is required!"}
          </div>
          <label label7="label7">
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={registrationData.phoneNumber}
              onChange={inputChange}
              required
              id="input7"
            />
          </label>
          <div style={{ color: "red" }}>
            {!isPhoneNumberValid && "Phone Number is required!"}
          </div>
        </div>

        <button type="submit" className="button">
          Register!
        </button>
      </form>
      <p>
        You already have an account? <Link to={"/login"}>Sign in.</Link>
      </p>
    </>
  );
}

export default FormRegistration;

