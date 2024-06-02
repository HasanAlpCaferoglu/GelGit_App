import "./css/travelerRegister.css";
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import axios from "axios";

import Navbar from "./components/HeaderLoginRegister";
import { ConsoleLogger } from "aws-amplify/utils";

function Register() {
  // set registerState
  const [userRegisterState, setUserRegisterState] = useState("traveler");
  const [message, setMessage] = useState("");

  async function handleAWSSignUp({ username, password }) {
    console.log("Inside handleAWSSignUp")
    console.log("username: ", username);
    console.log("password: ", password);
    const UserType = userRegisterState
    console.log("UserType: ", UserType)
    const email = username;
    // console.log("email: ", email);
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            'custom:UserType': UserType
          },
          // optional
          autoSignIn: false, // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
        },
      });

      console.log("isSignUpComplete: ", isSignUpComplete);
      console.log("userId: ", userId);
      console.log("nextStep: ", nextStep);
      var returnObject = {
        "userId": userId,
        "nextStep": nextStep,
      }
      return returnObject
    } catch (error) {
      console.log("error signing up:", error);
      return error
    }
  }

  // Function to handle button click and update userRegisterState
  const handleUserRegisterType = (registerType) => {
    setUserRegisterState(registerType);
  };

  const handleTravelerRegisterSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log("data in handleTravelerRegisterSubmit: ", data)
    if (data.password === data.passwordRepeat) {
      const awsSingUpObject = {
        username: data.email,
        password: data.password,
      }
      handleAWSSignUp(awsSingUpObject).then((response) => {
        if ("userId" in response ) {
          axios
            .post(
              "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/travelerRegister",
              data
            )
            .then((response) => {
              console.log("response.data: ", response.data); // Handle success response
              console.log("response.data.body.message: ", response.data.body.message);
              setMessage(response.data.body.message);
            })
            .catch((error) => {
              console.error("Error:", error); // Handle error
              setMessage(error.message)
            });
        } else {
          setMessage(response.message)

        }
      }).catch((error) => {
        console.error("Error: ", error)
      });
    } else {
      setMessage("Passwords are not matching!")
    }

  };

  const handleCompanyRegisterSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log("data in handleComapnyRegisterSubmit: ", data)
    if(data.password === data.passwordRepeat){
      const awsSingUpObject = {
        username: data.companyEmail,
        password: data.password,
      }
      handleAWSSignUp(awsSingUpObject).then((response) => {
        if("userId" in response){
          axios
            .post(
              "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/companyRegister",
              data
            )
            .then((response) => {
              console.log("response.data: ", response.data); // Handle success response
              console.log("response.data.body.message: ", response.data.body.message);
              setMessage(response.data.body.message);
            })
            .catch((error) => {
              console.error("Error:", error); // Handle error
              setMessage(error.message)
            });
        }
      }).catch((error) => {
        console.error("Error: ", error)
      });
    } else{
      setMessage("Passwords are not matching!")
    }

  };

  if (userRegisterState === "traveler") {
    return (
      <div>
        <Navbar />

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-9 p-5 rounded-4">
              <div className="row justify-content-center mt-2 mb-4">
                <button
                  type="button"
                  className={`col-4 btn btn-lg text-white ${
                    userRegisterState === "traveler"
                      ? "btn-secondary"
                      : "btn-primary"
                  }`}
                  onClick={() => handleUserRegisterType("traveler")}
                >
                  Traveler
                </button>
                <div className="col-2"></div>
                <button
                  type="button"
                  className={`col-4 btn btn-lg text-white ${
                    userRegisterState === "company"
                      ? "btn-secondary"
                      : "btn-primary"
                  }`}
                  onClick={() => handleUserRegisterType("company")}
                >
                  Company
                </button>
              </div>

              <form
                className="login-box mt-3 rounded"
                onSubmit={handleTravelerRegisterSubmit}
                method="POST"
              >
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label text-start">
                      <h4>
                        Name<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="surname" className="form-label text-start">
                      <h4>
                        Surname<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="TCK" className="form-label text-start">
                      <h4>
                        TCK<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="text"
                      id="TCK"
                      name="TCK"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label text-start">
                      <h4>
                        Phone<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label text-start">
                      <h4>
                        Email<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="age" className="form-label text-start">
                      <h4>
                        Age<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label text-start">
                      <h4>
                        Password<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="passwordRepeat" className="form-label text-start">
                      <h4>
                        Repeat Password<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="password"
                      id="passwordRepeat"
                      name="passwordRepeat"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Sign Up
                  </button>
                </div>

                <div className="d-grid">
                  <a
                    href="/login"
                    className="btn btn-primary signup-btn mt-2 text-white"
                  >
                    Login
                  </a>
                </div>

                <div className="mt-4">
                  <h5 className="text-start">
                    <span className="text-danger">*</span>required fields
                  </h5>
                </div>
                {message && (
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (userRegisterState === "company") {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-9 p-5 rounded-4">
              <div className="row justify-content-center mt-2 mb-4">
                <button
                  type="button"
                  className={`col-4 btn btn-lg text-white ${
                    userRegisterState === "traveler"
                      ? "btn-secondary"
                      : "btn-primary"
                  }`}
                  onClick={() => handleUserRegisterType("traveler")}
                >
                  Traveler
                </button>
                <div className="col-2"></div>
                <button
                  type="button"
                  className={`col-4 btn btn-lg text-white ${
                    userRegisterState === "company"
                      ? "btn-secondary"
                      : "btn-primary"
                  }`}
                  onClick={() => handleUserRegisterType("company")}
                >
                  Company
                </button>
              </div>

              <form
                className="login-box mt-3 rounded"
                onSubmit={handleCompanyRegisterSubmit}
                method="POST"
              >
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="companyName" className="form-label text-start">
                      <h4>
                        Company Name<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      className="form-control"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="companyEmail" className="form-label text-start">
                      <h4>
                        Company Official Email<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="email"
                      id="companyEmail"
                      name="companyEmail"
                      className="form-control"
                      placeholder="Enter official company email"
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="companyPhone" className="form-label text-start">
                      <h4>
                        Company Official Phone<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="tel"
                      id="companyPhone"
                      name="companyPhone"
                      className="form-control"
                      placeholder="Enter official company phone number"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="website" className="form-label text-start">
                      <h4>
                        Company Official Website
                        <span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      className="form-control"
                      placeholder="Enter official company website"
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="foundationDate" className="form-label text-start">
                      <h4>Foundation Date</h4>
                    </label>
                    <input
                      type="date"
                      id="foundationDate"
                      name="foundationDate"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="aboutCompany" className="form-label text-start">
                      <h4>About Company</h4>
                    </label>
                    <input
                      type="text"
                      id="aboutCompany"
                      name="aboutCompany"
                      className="form-control"
                      placeholder="About"
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label text-start">
                      <h4>
                        Password<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="passwordRepeat" className="form-label text-start">
                      <h4>
                        Repeat Password<span className="text-danger">*</span>
                      </h4>
                    </label>
                    <input
                      type="password"
                      id="passwordRepeat"
                      name="passwordRepeat"
                      className="form-control"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Sign Up
                  </button>
                </div>

                <div className="d-grid">
                  <a
                    href="/login"
                    className="btn btn-primary signup-btn mt-2 text-white"
                  >
                    Login
                  </a>
                </div>

                <div className="mt-4">
                  <h5 className="text-start">
                    <span className="text-danger">*</span>required fields
                  </h5>
                </div>

                {message && (
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
