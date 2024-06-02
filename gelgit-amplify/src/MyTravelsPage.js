import "./css/generalStyle.css";
import "./css/myTravels.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";

import Header from "./components/Header"; // importing Header Component
import MyTravelCard from "./components/MyTravelCard";


function MyTravelsPage() {
  // State to store cities
  // session info
  const [sessionInfo, setSessionInfo] = useState({
    "username": null,
    "email": null,
    "userType": null,
    "sub": null,
    "loggedin": null
  })
  const [idTok, setIdTok] = useState(null);
  const [cities, setCities] = useState([]);
  const [message, setMessage] = useState("");
  const [upcomingOrPast, setupcomingOrPast] = useState("upcoming");
  const [myTravels, setMyTravels] = useState(null)
  const [loading, setLoading] = useState(true);

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


  // Function to fetch cities from Lambda function
  async function fetchCities() {
    try {
      // Make a fetch request to your Lambda function endpoint
      const response = await fetch(
        "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/getAllCities" // No need authorization
      );
      // Parse the response JSON
      const data = await response.json();
      // console.log('data.body: ', data.body)
      // console.log("data.body.cities", data.body.cities)
      // Set the cities state with the fetched data
      setCities(data.body.cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setMessage(error);
    }
  }

  // Function to fetch travels from Lambda function
  const fetchTravels = (event = null) => {
    let data = sessionInfo
    data["upcomingOrPast"] = upcomingOrPast;        // setting upcomingOrPast
    
    if (event !== null) {
      event.preventDefault();
      console.log("event: ", event)
      const formData = new FormData(event.target);
      formData.forEach((value, key) => {
        data[key] = value;
      });
    } else{
      data["travelDate"] = "";
      data["departureTerminal"]= "";
      data["arrivalTerminal"] = "";
      data["travelType"]= "";
    }

    // data["loggedin"] = sessionInfo["loggedin"];     // setting login info
    // data["userid"] = sessionInfo["userid"];         // setting user id info
    // data["userType"] = sessionInfo["userType"];     // setting user type
    // data["upcomingOrPast"] = upcomingOrPast;        // setting upcomingOrPast
    try {
      axios
        .post(
          "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/myTravels",
          data,
          {
            headers: {
              "Authorization": idTok,
            },
          }
        )
        .then((response) => {
          console.log("response.data: ", response.data); // Handle success response
          if (response.data.statusCode === 200){
            console.log("response.data.body.user_purchased_travels: ", response.data.body.user_purchased_travels)
            setMyTravels(response.data.body.user_purchased_travels)
          } else {
            if (response.data.body in response.data){
              console.log("message: ", response.data.body.message?response.data.body.message:response.data.errorMessage);
              setMessage(response.data.body.message?response.data.body.message:response.data.errorMessage);
            } 
          }
        })
        .catch((error) => {
          console.error("Error:", error); // Handle error
        });
    } catch (error) {
      console.error("Error: ", error)
    } finally {
      setLoading(false)
      console.log("setting loading to false")
    }
  };



  useEffect(() => {
    getCurrentSession();
    handleFetchUserAttributes();
    // Fetch cities when the component mounts
    fetchCities();
  }, []);

  useEffect(() => {
    // fetch travels
    if(sessionInfo.loggedin){
      fetchTravels();
    }
  }, [upcomingOrPast, sessionInfo, idTok])

  if (loading) {
    // Render loading indicator while fetching user attributes
    return <div>Loading...</div>;
  } 
  return (
    <div>
      <Header />

      {/*  Filtering My Travels with form  */}
      
      {/* <div className="container-fluid pt-4 pb-4 upperBar">
        <form action="{{ url_for('myTravels') }}" method="GET">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label for="travelDate">Travel Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="travelDate"
                  name="travelDate"
                  
                />{" "}
              </div>
            </div>
            
            <div className="col-md-3">
              <label for="departureTerminal">Departure Terminal</label>
              <select
                className="form-control"
                id="departureTerminal"
                name="departureTerminal"
              >
                <option value="">All</option>
                
              </select>
            </div>

            <div className="col-md-3">
              <label for="arrivalTerminal">Arrival Terminal</label>
              <select
                className="form-control"
                id="arrivalTerminal"
                name="arrivalTerminal"
              >
                <option value="">All</option>
                
              </select>
            </div>

            
            <div className="col-md-3">
              <label for="travelType">Travel Type</label>
              <select className="form-control" id="travelType" name="travelType">
                <option value="">All</option>
             
              </select>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <input
                  type="hidden"
                  name="upcomingOrPast"
                  value={upcomingOrPast}
                />
                <button type="submit" className="btn btn-primary">
                  Filter
                </button>
              </div>
            </div>
          </div>
        </form>
      </div> */}

      <div className="container mx-4">
        <div className="d-flex justify-content-around mt-4 mb-3">
          <div className="flex-fill justify-content-center text-center">
            <div>
              <input type="hidden" name="upcomingOrPast" value={"upcoming"} />
              <button
                type="button"
                className={`col-4 btn btn-lg text-white ${
                  upcomingOrPast === "upcoming"
                    ? "btn-secondary"
                    : "btn-primary"
                }`}
                onClick={() => setupcomingOrPast("upcoming")}
              >
                Upcoming Travels
              </button>
            </div>
          </div>

          <div className="flex-fill justify-content-center text-center">
            <div>
              <input type="hidden" name="upcomingOrPast" value={"past"} />
              <button
                type="button"
                className={`col-4 btn btn-lg text-white ${
                  upcomingOrPast === "upcoming"
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
                onClick={() => setupcomingOrPast("past")}
              >
                Past Travels
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5">
        {/* Travel Card for each travel */}
        {myTravels && myTravels.length > 0 ? (myTravels.map((travel, index) => (
          <MyTravelCard
            key={index}
            travelData={travel}
            travelId={travel.travel_id} // Unique key for each card
            seatNumber = {travel.seat_number}
            PNR={travel.PNR} // Unique key for each card
            depTime = {travel.depart_time}
            arrTime = {travel.arrive_time}
            DepTerminalName = {travel.departure_terminal_name}
            ArrTerminalName = {travel.arrival_terminal_name}
            upcomingOrPast={upcomingOrPast}
            commentAreaOnPNR={null} // Pass comment area status here if needed
            currentRating={null} // Pass current rating here if needed
          />
        ))): (
          <p> No travels available!</p>
        )}
      </div>

    </div>
  );
}

export default MyTravelsPage;
