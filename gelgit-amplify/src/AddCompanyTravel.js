import "./css/generalStyle.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";

import Navbar from "./components/Header";

function vehicleOptions(allAvailableVehicleTypes) {
  if (allAvailableVehicleTypes) {
    return allAvailableVehicleTypes.map((singleVehicType, index) => {
      return <option key={index} value={singleVehicType[0]}> {singleVehicType[1]}</option>;
    });
  } else {
    return <option value="">No available Vehicle Type</option>;
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function AddCompanyTravel() {
  const [sessionInfo, setSessionInfo] = useState({
    "username": null,
    "email": null,
    "userType": null,
    "sub": null,
    "loggedin": null
  })
  const [idTok, setIdTok] = useState(null);
  

  function terminalOptions(allAvailableTerminals) {
    if (allAvailableTerminals) {
      return allAvailableTerminals.map((singleTerminal, index) => {
        return (
          <option key={index} value={singleTerminal[0]}>
            {singleTerminal[1]} | {singleTerminal[2]}
          </option>
        );
      });
    } else {
      return <option  value="">No available Terminal</option>;
    }
  }

  const [travelVehicleType, setTravelVehicleType] = useState("bus");
  const [message, setMessage] = useState("");
  const [allAvailableTerminals, setAllAvailableTerminals] = useState([]);
  const [allAvailableVehicleTypes, setAllAvailableVehicleTypes] = useState([]);
  const [fromTerminal, setFromTerminal] = useState("");
  const [toTerminal, setToTerminal] = useState("");
  const [depTime, setDepTime] = useState(
    new Date(new Date().getTime() + 3 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16)
  );
  const [arTime, setArTime] = useState(
    new Date(new Date().getTime() + 27 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16)
  );

  async function handleFetchUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log("userAttributes: ", userAttributes);
      const info = {
        "username": userAttributes.email,
        "email": userAttributes.email,
        "userType": userAttributes["custom:UserType"],
        "sub": userAttributes.sub,
        "loggedin": true
      }
      setSessionInfo(info)
    } catch (error) {
      console.log(error);
    }
  }

  async function getCurrentSession() {
    try {
      //   const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      setIdTok(idToken);
    } catch (err) {
      console.log(err);
      window.location.href = "/";
    }
  }

  async function fetchTravelOptionsInformation() {
    try {
      axios
        .post(
          "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/getTravelOptions", // No need for authorization
          { vehic_type: travelVehicleType }
        )
        .then((response) => {
          console.log("response.data: ", response.data);
          const travelOptions = response.data.body;
          console.log("travelOptions: ", travelOptions);
          setAllAvailableTerminals(travelOptions["terminals"]);
          setAllAvailableVehicleTypes(travelOptions["vehicleTypes"]);
          setFromTerminal(travelOptions["terminals"][0][0]);
          setToTerminal(travelOptions["terminals"][1][0]);
        })
        .catch((error) => {
          console.error("Error:", error); // Handle error
        });
    } catch (error) {
      console.lerror("Error when fetching information: ", error);
    }
  }

  useEffect(() => {
    getCurrentSession();
    handleFetchUserAttributes();
  }, []);

  useEffect(() => {
    if(sessionInfo.loggedin){
      fetchTravelOptionsInformation();
    }
  }, [travelVehicleType, sessionInfo, idTok]);

  function handleFromChange(event) {
    var previousFromTerminal = fromTerminal;
    setFromTerminal(event.target.value);
    if (event.target.value === toTerminal) {
      setToTerminal(previousFromTerminal); // Reset "To" location if it's the same as "From" location
    }
  }

  function handleToChange(event) {
    var previousToTerminal = toTerminal;
    setToTerminal(event.target.value);
    if (event.target.value === fromTerminal) {
      setFromTerminal(previousToTerminal); // Reset "From" location if it's the same as "To" location
    }
  }

  function handleAddCompanyTravel(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = sessionInfo;

    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log("data: ", data);

    axios
      .post(
        "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/addCompanyTravel",
        data,
        {
          headers: {
            "Authorization": idTok,
          },
        }
      )
      .then((response) => {
        console.log("response.data: ", response.data); // Handle success response
        if("statusCode" in response.data && response.data.statusCode === 200){
          console.log("response.data.body.message: ", response.data.body.message);
          setMessage(response.data.body.message);
          event.target.reset();
          // window.location.href = "/companysAllTravels"
        } else {
          console.log("response.data.errorMessage: ", response.data.errorMessage);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage(error);
      });
  }

  return (
    <div>
      <Navbar />

      <div className="container ">
        <div className="d-flex justify-content-around mt-4 mb-3 ">
          <div className="flex-fill justify-content-center text-center">
            <button
              type="button"
              className={`btn btn-lg w-50 ${
                travelVehicleType === "bus" ? "btn-secondary" : "btn-primary"
              }`}
              onClick={() => {
                setTravelVehicleType("bus");
              }}
            >
              Bus Travel
            </button>
          </div>

          <div className=" flex-fill justify-content-center text-center">
            <div className="flex-fill justify-content-center text-center">
              <button
                type="button"
                className={`btn btn-lg w-50 ${
                  travelVehicleType === "plane"
                    ? "btn-secondary"
                    : "btn-primary"
                }`}
                onClick={() => {
                  setTravelVehicleType("plane");
                }}
              >
                Plane Travel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container ">
        <div className="row justify-content-center mt-4">
          <div className="col-md-9 p-5 rounded-4 profileCard">
            <form onSubmit={handleAddCompanyTravel} method="POST">
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="dep_terminal_id">Departure Terminal:</label>
                  <select
                    className="form-select"
                    id="dep_terminal_id"
                    name="dep_terminal_id"
                    value={fromTerminal}
                    onChange={handleFromChange}
                  >
                    {terminalOptions(allAvailableTerminals)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="ar_terminal_id">Arrival Terminal:</label>
                  <select
                    className="form-select"
                    id="ar_terminal_id"
                    name="ar_terminal_id"
                    value={toTerminal}
                    onChange={handleToChange}
                  >
                    {terminalOptions(allAvailableTerminals)}
                  </select>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="dep_time">Departure Time:</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="dep_time"
                    name="dep_time"
                    value={depTime}
                    onChange={(e) => setDepTime(e.target.value)}
                  ></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="ar_time">Arrival Time:</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="ar_time"
                    name="ar_time"
                    value={arTime}
                    onChange={(e) => setArTime(e.target.value)}
                  ></input>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="vehic_type">Vehicle Type:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="vehic_type"
                    name="vehic_type"
                    value={capitalizeFirstLetter(travelVehicleType)}
                    readOnly
                  ></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="vehic_type_id">Vehicle Model:</label>
                  <select
                    className="form-select"
                    id="vehic_type_id"
                    name="vehic_type_id"
                  >
                    {vehicleOptions(allAvailableVehicleTypes)}
                  </select>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="price">Price:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                  ></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="business_price">Business Price:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="business_price"
                    name="business_price"
                  ></input>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 text-center">
                  <button type="submit" className="btn btn-lg btn-danger">
                    Register {capitalizeFirstLetter(travelVehicleType)} Travel
                  </button>
                </div>
              </div>

              {message && (
                <div className="alert alert-danger mt-4" role="alert">
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

export default AddCompanyTravel;
