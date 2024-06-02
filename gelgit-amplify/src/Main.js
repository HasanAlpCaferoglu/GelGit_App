import "./css/generalStyle.css";
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";

import axios from "axios";

import Header from "./components/Header"; // importing Header Component

function getDate(day) {
  var curr = new Date();
  curr.setDate(curr.getDate() + day);
  var date = curr.toISOString().substring(0, 10);
  return date;
}

function Main() {
  // State to store cities
  const [cities, setCities] = useState([]);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  // State to manage the checkbox
  const [enableDateRange, setEnableDateRange] = useState(false);
  const [message, setMessage] = useState("");
  const [vehicle_type, setVehicleType] = useState("bus");

  // Function to fetch cities from Lambda function
  async function fetchCities() {
    try {
      // Make a fetch request to your Lambda function endpoint
      const response = await fetch(
        "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/getAllCities"
      );
      // Parse the response JSON
      const data = await response.json();
      // console.log('data.body: ', data.body)
      // console.log("data.body.cities", data.body.cities)
      // Set the cities state with the fetched data
      setCities(data.body.cities);
      setFromLocation(data.body.cities[0]);
      setToLocation(data.body.cities[1]);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setMessage(error)
    }
  }

  // Fetch cities when the component mounts
  useEffect(() => {
    fetchCities();
  }, []);

  // Function to render city options
  const renderCityOptions = () => {
    return cities.map(city => (
      <option key={city} value={city}>
        {city}
      </option>
    ));
  };

  const handleFromChange = (event) => {
    var previousFromLocation = fromLocation;
    setFromLocation(event.target.value);
    if (event.target.value === toLocation) {
      setToLocation(previousFromLocation); // Reset "To" location if it's the same as "From" location
    }
  };

  const handleToChange = (event) => {
    var previousToLocation = toLocation;
    setToLocation(event.target.value);
    if (event.target.value === fromLocation) {
      setFromLocation(previousToLocation); // Reset "From" location if it's the same as "To" location
    }
  };

  // Function to handle checkbox change
  function handleCheckboxChange() {
    // Toggle the state of enableDateRange
    setEnableDateRange(!enableDateRange);
    // Get the end date input element
    const extraDateInputElement = document.getElementById("extra_date");
    // Enable/disable the end date input based on the state of enableDateRange
    extraDateInputElement.disabled = enableDateRange;
    extraDateInputElement.value = enableDateRange ? NaN : getDate(2);
  }

  const handleFindTravel = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log("data: ", data);

    // Construct the URL with the data
    const redirectURL = `/travel/${data.vehicle_type}/from/${data['from-location']}/to/${data['to-location']}/date/${data.departure_date}/extra_date/${data.extra_date}`;
    // Redirect user to the constructed URL
    window.location.href = redirectURL;

    // axios
    //   .post(
    //     "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/findTravel",
    //     data
    //   )
    //   .then((response) => {
    //     console.log("response.data: ", response.data); // Handle success response
    //     console.log("response.data.body.message: ", response.data.body.message);
    //     setMessage(response.data.body.message);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error); // Handle error
    //   });
  };

  return (
    <div>
      <Header />
      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}
      <div className="container pt-5">
        <form onSubmit={handleFindTravel} method="POST">
          <div className="container d-flex justify-content-center">
            <div
              className="btn-group btn-group-lg"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                className="btn-check"
                name="vehicle_type"
                id="btnradio1"
                autoComplete="off"
                value="bus"
                checked={vehicle_type === "bus"}
                onClick={(e) => setVehicleType(e.target.value)}
              />
              <label className="btn btn-outline-danger" htmlFor="btnradio1">
                Bus
              </label>

              <input
                type="radio"
                className="btn-check"
                name="vehicle_type"
                id="btnradio2"
                autoComplete="off"
                value="plane"
                checked={vehicle_type === "plane"}
                onClick={(e) => setVehicleType(e.target.value)}
              />
              <label className="btn btn-outline-danger" htmlFor="btnradio2">
                Plane
              </label>
            </div>
          </div>

          <br />
          <div className="card text-white justify-content-center">
            <div className="card-header text-center">
              <h1>Search For a travel</h1>
            </div>
            <div className="card-body">
              <div className="container pt-2">
                <label htmlFor="from-location" className="form-label">
                  From:
                </label>
                <select className="form-select" name="from-location" id="from-location" value={fromLocation} onChange={handleFromChange}>
                  {renderCityOptions()}
                </select>
              </div>

              <div className="container pt-2">
                <label htmlFor="to-location" className="form-label">
                  To:
                </label>
                <select className="form-select" name="to-location" id="to-location" value={toLocation} onChange={handleToChange}>
                  {renderCityOptions()}
                </select>
              </div>

              <div className="container pt-4">
                <label htmlFor="departure_date">Travel Date:</label>
                <input type="date" id="departure_date" name="departure_date" defaultValue={getDate(1)} />
                {/* <label htmlFor="extra_date">End Date:</label>
                <input type="date" id="extra_date" name="extra_date" disabled /> */}
              </div>

              {/* <div className="container pt-4">
                <input
                  type="checkbox"
                  id="enable_date"
                  onChange={handleCheckboxChange}
                  checked={enableDateRange}
                />
                <label htmlFor="enable_date">Search in Date Range</label>
              </div> */}

              <div className="d-grid pt-4 justify-content-center">
                <button className="btn btn-lg btn-danger" type="submit">
                  Find Travel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Main;
