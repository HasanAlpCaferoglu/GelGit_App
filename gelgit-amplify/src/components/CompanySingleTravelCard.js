import "../css/generalStyle.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

function CompanySingleTravelCard({ singleTravelDetail, travelUpcomingPast }) {
  function handleDeleteTravel(event) {
    event.preventDefault();
    console.log(event);
  }

  function handleEditTravel(event) {
    event.preventDefault();
    console.log(event);
  }

  const redirectToATravelDetails = (singleTravelDetail) => {
    window.location.href = `/travelDetails/${singleTravelDetail["company_id"]}/${singleTravelDetail["travel_id"]}`;
  };

  return (
    <div className="card bg-secondary ">
      <div className="card-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div className="row">
                <h6 className=" blockTitle">Departure Terminal</h6>
                <p className="">{singleTravelDetail["departure_terminal"]}</p>
              </div>
              <div className="row">
                <h6 className="blockTitle ">Departure Time</h6>
                <p className="">{singleTravelDetail["departure_time"]}</p>
              </div>
            </div>
            <div className="col">
              <div className="row">
                <h6 className="blockTitle">Arrival Terminal</h6>
                <p className="">{singleTravelDetail["arrival_terminal"]}</p>
              </div>
              <div className="row">
                <h6 className="blockTitle">Arrival Time</h6>
                <p className="">{singleTravelDetail["arrival_time"]}</p>
              </div>
            </div>
            <div className="col">
              <div className="row">
                <h6
                  className="blockTitle
											"
                >
                  Vehicle Type
                </h6>
                <p className="">{singleTravelDetail["vehicle_type"]}</p>
              </div>
              <div className="row">
                <h6 className="blockTitle">Vehicle Model</h6>
                <p className="">{singleTravelDetail["vehicle_model"]}</p>
              </div>
            </div>
            <div className="col">
              <div className="row">
                <h6
                  className="blockTitle
											"
                >
                  Price
                </h6>
                <p className="">{singleTravelDetail["price"]}</p>
              </div>
              <div className="row">
                <h6 className="blockTitle">Business Price</h6>
                <p className="">{singleTravelDetail["business_price"]}</p>
              </div>
            </div>
            <div className="col d-flex flex-column justify-content-around">
              {travelUpcomingPast === "upcoming" ? (
                <div>
                  <form
                    className="row mb-2 text-decoration-none"
                    onSubmit={() => {
                      handleDeleteTravel(singleTravelDetail.travel_id);
                    }}
                    method="post"
                  >
                    <button disabled={true} className="btn btn-danger">
                      Delete
                    </button>
                  </form>
                  <form
                    className="row mb-2 text-decoration-none"
                    onSubmit={() => {
                      handleEditTravel(singleTravelDetail.travel_id);
                    }}
                    method="post"
                  >
                    <input
                      type="hidden"
                      name="company_id"
                      id="company_id"
                      value="{{ companyId }}"
                    ></input>
                    <button disabled={true} className="btn btn-danger">
                      Edit
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <form
                    className="row mb-2 text-decoration-none"
                    action="{{ url_for('commentsOnATravel', travelId = singleTravel['travel_id']) }}"
                    method="get"
                  >
                    <input
                      type="hidden"
                      name="company_id"
                      id="company_id"
                      value="{{companyId }}"
                    ></input>
                    <button type="submit" className="btn btn-danger">
                      Comments
                    </button>
                  </form>
                </div>
              )}

              <div
                className="row mb-2 text-decoration-none"
              >
                <button
                  className="btn btn-danger"
                  onClick={() => redirectToATravelDetails(singleTravelDetail)}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanySingleTravelCard;
