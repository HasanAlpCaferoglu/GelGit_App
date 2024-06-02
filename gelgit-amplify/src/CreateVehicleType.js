import "./css/generalStyle.css";
import "./css/generalListPage.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";

import Navbar from "./components/Header";

function CreateVehicleType() {
  const [message, setMessage] = useState("");
  const [sessionInfo, setSessionInfo] = useState({
    username: null,
    email: null,
    userType: null,
    sub: null,
    loggedin: null,
  });
  const [idTok, setIdTok] = useState(null);

  async function handleFetchUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log("userAttributes: ", userAttributes);
      const info = {
        username: userAttributes.email,
        email: userAttributes.email,
        userType: userAttributes["custom:UserType"],
        sub: userAttributes.sub,
        loggedin: true,
      };
      setSessionInfo(info);
    } catch (error) {
      console.log(error);
      window.location.href = "/";
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

  function handleSubmit(event) {
    event.preventDefault();
    const vehicle_type = event.target.vehicle_type.value;
    const vehicle_seat_formation = event.target.vehicle_seat_formation.value;
    const vehicle_num_of_seats = event.target.vehicle_num_of_seats.value;
    const vehicle_business_rows = event.target.vehicle_business_rows.value;
    const vehicle_model = event.target.vehicle_model.value;

    // const data = {
    //   userid: sessionInfo.userid,
    //   userType: sessionInfo.userType,
    //   loggedin: sessionInfo.loggedin,
    //   vehicle_type: vehicle_type,
    //   vehicle_seat_formation: vehicle_seat_formation,
    //   vehicle_num_of_seats: vehicle_num_of_seats,
    //   vehicle_business_rows: vehicle_business_rows,
    //   vehicle_model: vehicle_model,
    // };

    let data = sessionInfo;
    data["vehicle_type"] = vehicle_type;
    data["vehicle_seat_formation"] = vehicle_seat_formation;
    data["vehicle_num_of_seats"] = vehicle_num_of_seats;
    data["vehicle_business_rows"] = vehicle_business_rows;
    data["vehicle_model"] = vehicle_model;


    try {
      const createVehicleTypeInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/createVehicleType`;
      axios
        .post(createVehicleTypeInvokeURL, data, {
          headers: {
            Authorization: idTok,
          },
        })
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200) {
            setMessage(response.data.body.message);
            event.target.reset(); // This resets the form
          } else {
            setMessage(response.data.body.message);
          }
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    getCurrentSession();
    handleFetchUserAttributes();
  }, []); // Run only once on component mount to fetch user attributes

  return (
    <div>
      <Navbar />
      <div className="container pt-4 ">
        <h4> Create New Vehicle Type </h4>
        <hr />
      </div>

      {message && (
        <div className="container mt-2">
          <h4 className="text-danger">{message}</h4>
        </div>
      )}

      <div className="container">
        <div className="row justify-content-center mt-4">
          <div className="col-md-9 p-5 rounded-4 profileCard">
            <form onSubmit={handleSubmit}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="vehicle_type">Vehicle Type:</label>
                  <select
                    className="form-select"
                    id="vehicle_type"
                    name="vehicle_type"
                  >
                    <option value="bus">Bus</option>
                    <option value="plane">Plane</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="vehicle_seat_formation">
                    Seat Formation:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="vehicle_seat_formation"
                    name="vehicle_seat_formation"
                    placeholder="Format: X-X or X-X-X"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^\d-]/g, "");
                      if (
                        e.target.value.length % 2 === 0 &&
                        e.target.value.length !== 0
                      ) {
                        const lastItem = e.target.value.charAt(
                          e.target.value.length - 1
                        );
                        e.target.value =
                          e.target.value.slice(0, -1) + "-" + lastItem;
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        const seatFormation = e.target.value.replace(
                          /[^\d-]/g,
                          ""
                        );
                        const lastChar = seatFormation.charAt(
                          seatFormation.length - 1
                        );
                        if (
                          seatFormation.length % 2 === 1 &&
                          lastChar === "-"
                        ) {
                          e.target.value =
                            seatFormation.slice(0, -2) + lastChar;
                          e.preventDefault();
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="vehicle_num_of_seats">
                    Total Seat Number:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="vehicle_num_of_seats"
                    name="vehicle_num_of_seats"
                    placeholder="Enter a number..."
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="vehicle_business_rows">
                    Number of Business Class Rows:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="vehicle_business_rows"
                    name="vehicle_business_rows"
                    placeholder="Enter a number..."
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="vehicle_model">Vehicle Model:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="vehicle_model"
                    name="vehicle_model"
                    placeholder="Give a name to vehicle model..."
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 text-center">
                  <button type="submit" className="btn btn-lg btn-danger">
                    Create Vehicle Type
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateVehicleType;
