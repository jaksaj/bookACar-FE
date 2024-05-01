import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../axiosConfig";
import "./SignIn.css";

function FormSignIn() {
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [isEmailValid, changeIsEmailValid] = useState(true);
  const [isPasswordValid, changeIsPasswordValid] = useState(true);
  function inputChange(event) {
    const { name, value } = event.target;
    setSignInData({ ...signInData, [name]: value });
  }
  const handleSignIn = async (event) => {
    event.preventDefault();
    validateInputs();
    if (isEmailValid && isPasswordValid) {
      signInUser(signInData);
    }
  };
  const validateInputs = () => {
    const { email, password } = signInData;

    !email.includes("@") || email.length < 5
      ? changeIsEmailValid(false)
      : changeIsEmailValid(true);

    password.length < 8
      ? changeIsPasswordValid(false)
      : changeIsPasswordValid(true);
  };

  const signInUser = async (userData) => {
    try {
      const response = await api.post("/users/login", { userData });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      } else {
        console.error("Error with sign in!", response.data);
      }
    } catch (error) {
      console.error("Error with sign in!", error);
    }
  };
  return (
    <>
      <div
        id="content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div id="header">
          <h1 id="welcome">Welcome to</h1>
          <h1 id="logo">myFitness</h1>
        </div>

        <form onSubmit={handleSignIn}>
          <div>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={signInData.email}
                onChange={inputChange}
                required
              />
            </label>
            <div style={{ color: "red" }}>
              {!isEmailValid && "This is not a valid email address"}
            </div>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={signInData.password}
                onChange={inputChange}
                required
              />
            </label>
            <div style={{ color: "red" }}>
              {!isPasswordValid && "Password can not be shorter then 8 units!"}
            </div>
          </div>

          <button id="button1" type="submit">
            Sign in!
          </button>
        </form>
        <p>
          You do not have a account? <Link to={"/register"}>Register!</Link>
        </p>
      </div>
    </>
  );
}
export default FormSignIn;
