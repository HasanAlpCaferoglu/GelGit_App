import "./css/login.css";
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { signIn } from 'aws-amplify/auth';
import Navbar from "./components/HeaderLoginRegister";

import axios from "axios";


function Login() {
  const [message, setMessage] = useState("");
  let history = useHistory();


  async function AWSSignIn({ username, password }) {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      var returnObject = {
        "isSignedIn": isSignedIn,
        "nextStep": nextStep
      }
      return returnObject
    } catch (error) {
      console.log('error signing in', error);
      return error
    }
  }

  const handleLogin = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    const AWSSignInObject = {
      "username": data.email,
      "password": data.password
    }

    AWSSignIn(AWSSignInObject).then((response) => {
      console.log("response: ", response)
      if (response.isSignedIn === true){
        window.location.href = '/'
      }
    }).catch((error) => {
      console.error("Error: ", error)
    })
    // console.log("data: ", data)
    // axios
    //   .post(
    //     "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/login",
    //     data
    //   )
    //   .then((response) => {
    //     console.log("response.data: ", response.data); // Handle success response
    //     console.log("response.data.body.message: ", response.data.body.message);
    //     setMessage(response.data.body.message);
    //     const session_info = response.data.body.session_info
    //     console.log("session_info", session_info)  // store session info into local storage
    //     localStorage.setItem("session_info", JSON.stringify(session_info));
    //     // Redirect user to main page after successful login
    //     if (session_info.loggedin){
    //         // history.push("/");
    //         window.location.href = '/';
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error); // Handle error
    //   });
  };

  return (
    <div>
      <Navbar/>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="login-box mt-5 rounded">
                {message && (
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                )}
              <form onSubmit={handleLogin} method="POST">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-start">
                    <h4>Email</h4>
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-start">
                    <h4>Password</h4>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>
              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-primary signup-btn mt-2"
                  onClick={() => {
                    window.location.href = "/register";
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
