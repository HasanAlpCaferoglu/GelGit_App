import "../css/generalStyle.css";
import "../css/listAvailableTravelsPage.css";

import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import axios from "axios";

function TravelCardBasic({ singleTravel }) {
  // variables
  let seatNumber = 1;
  // States
  const [chooseSeatOpenTravelId, setChooseSeatOpenTravelId] = useState(null);

  const [travelId, setTravelId] = useState(singleTravel["travel_id"]);
  const [formation, setFormation] = useState([]);
  const [col, setCol] = useState(null);
  const [row, setRow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [isSelectSeatOpen, setIsSelectSeatOpen] = useState(false);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState(null);

  const [message, setMessage] = useState("");

  // Function to handle box click
  const handleBoxClick = (boxNumber) => {
    console.log("Hello from handleBoxClick!!");
    if (boxNumber === selectedSeatNumber) {
      setSelectedSeatNumber(null);
    } else {
      setSelectedSeatNumber(boxNumber);
    }
    console.log("boxNumero: ", boxNumber);
  };

  // fetchTravelVehicleInfo function
  async function fetchTravelVehicleInfo() {
    try {
      const invoke_url =
        "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/travelAvailableSeatsAndSeatFormation/" +
        travelId;
      console.log("invoke_url: ", invoke_url);
      const response = await fetch(invoke_url);
      const data = await response.json();
      console.log("data: ", data);
      setFormation(data.body["formation"]);
      setCol(data.body["col"]);
      setRow(data.body["row"]);
      setOccupiedSeats(data.body["occupied_seats"]);
      setIsSelectSeatOpen(!isSelectSeatOpen);
    } catch (error) {
      console.error("Error fetching travel vehicle information: ", error);
      setMessage(error);
    }
  }

  // handleChooseSeatButton function
  function handleChooseSeatButton(event) {
    event.preventDefault();
    fetchTravelVehicleInfo();
    console.log("formation: ", formation);
    console.log("col: ", col);
    console.log("row: ", row);
    console.log("ocupiedSeats: ", occupiedSeats);
  }

  function handlePurchaseSelectedSeat(event) {
    // const directURL = `/travel/:${vehicleType}/from/:${fromLocation}/to/:${toLocation}/date/:${travelDate}/extra_date/:${extraDate}/buy/travel_id/:${travel_id}/seat_number/:${seat_number}`;
    if (selectedSeatNumber === null) {
      setMessage("Please select a seat!");
    } else {
      const directURL = `/travel/buy/${travelId}/${selectedSeatNumber}`;
      console.log("directURL: ", directURL);
      window.location.href = directURL;
    }
  }

  return (
    <div className="card bg-secondary text-white">
      <div className="card-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-6" style={{ width: "20vw" }}>
              <h1 className="companyTitle">
                {singleTravel.travel_company_name}
              </h1>
            </div>
            <div className="col d-flex justify-content-center">
              <div className="row arrow-container" style={{ width: "80%" }}>
                <div className="col arrow-text">
                  <div>Depart: </div>
                  <div>{singleTravel.departure_time.substring(0, 10)}</div>
                  <div>{singleTravel.departure_time.substring(11, 19)}</div>
                </div>
                <div className="col d-flex justify-content-center">
                  <span className="arrow">&rarr;</span>
                </div>
                <div className="col arrow-text">
                  <div>Arrive: </div>
                  <div>{singleTravel.arrival_time.substring(0, 10)}</div>
                  <div>{singleTravel.arrival_time.substring(11, 19)}</div>
                </div>
              </div>
            </div>
            <div className="col-2 col-right">
              {/* {travel_seat !== singleTravel.travel_id ? (
                                <form action={`/buy_travel/${singleTravel.travel_id}`} method="get">
                                    <button type="submit" style={{ width: '10vw' }} className="btn btn-danger btn-lg">Purchase random seat</button>
                                </form>
                            ) : (
                                <form action={`/buy_travel/${singleTravel.travel_id}`} method="POST">
                                    <input type="hidden" name="seat_number" id="seat_number" />
                                    <button type="submit" id="seat_purchase" style={{ width: '10vw' }} className="btn btn-danger btn-lg">Purchase seat</button>
                                </form>
                            )} */}
              {isSelectSeatOpen === false ? (
                <form onSubmit={handleChooseSeatButton} method="get">
                  <input
                    type="hidden"
                    name="travel_seat"
                    value={singleTravel.travel_id}
                  />
                  <button
                    type="submit"
                    style={{ width: "10vw" }}
                    className="btn btn-danger btn-lg"
                  >
                    Choose seat
                  </button>
                </form>
              ) : (
                <div className="col">
                  <button
                    type="submit"
                    style={{ width: "10vw" }}
                    className="btn btn-danger btn-lg"
                    onClick={() => {
                      setIsSelectSeatOpen(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Below part is displayed when user wants to select a seat for a travle */}
        {isSelectSeatOpen === true && (
          <div className="container-sm">
            <hr></hr>
            {[...Array(row)].map((_, rowIndex) => (
              <div className="row" key={rowIndex}>
                {[...Array(formation.length)].map((_, colIndex) => (
                  <React.Fragment key={colIndex}>
                    {[...Array(formation[colIndex])].map((_, innerIndex) => {
                      const boxNumber = seatNumber++;
                      return (
                        <div className="col" key={innerIndex}>
                          {occupiedSeats.includes(boxNumber) ? (
                            <div
                              className="box"
                              style={{
                                backgroundColor: "gray",
                                cursor: "default",
                                userSelect: "none",
                              }}
                            >
                              {boxNumber}
                            </div>
                          ) : (
                            <div
                              className="box"
                              id={`box${boxNumber}`}
                              style={{
                                backgroundColor:
                                  selectedSeatNumber === boxNumber ? "red" : "",
                              }}
                              onClick={() => handleBoxClick(boxNumber)} // Add onClick event handler
                            >
                              {boxNumber}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {colIndex < formation.length - 1 && (
                      <div className="empty-box"></div>
                    )}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            ))}
            <button
              type="submit"
              style={{ width: "100%" }}
              className="btn btn-danger btn-lg mt-4"
              onClick={() => handlePurchaseSelectedSeat()}
            >
              Purchase Selected Seat
            </button>
            {/* Show message if it is exist */}
            {message && (
              <div className="alert alert-danger mt-2" role="alert">
                {message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TravelCardBasic;
