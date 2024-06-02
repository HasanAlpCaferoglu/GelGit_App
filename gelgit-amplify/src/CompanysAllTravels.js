import "./css/generalStyle.css";
import "./css/companysAllTravels.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";

import Navbar from "./components/Header";
import CompanySingleTravelCard from "./components/CompanySingleTravelCard";

function CompanysAllTravels() {
  const [message, setMessage] = useState("");
  const [travelSortType, setTravelSortType] = useState("earliest_to_latest");
  const [travelUpcomingPast, setTravelUpcomingPast] = useState("upcoming");
  const [travelsDetailList, setTravelsDetailList] = useState([]);
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

  function handleSortCompanyTravels(event) {
    event.preventDefault();
    console.log("in handleSortCompanyTravels ");
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    setTravelSortType(data.sort_type);
  }

  function fetchCompanyAllTravels() {
    const companyAllTravelsInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/companyTravels`;
    // const data = {
    //   userid: sessionInfo.userid,
    //   userType: sessionInfo.userType,
    //   loggedin: sessionInfo.loggedin,
    //   sort_type: travelSortType,
    //   upcomingOrPast: travelUpcomingPast,
    // };
    let data = sessionInfo;
    data["sort_type"] = travelSortType;
    data["upcomingOrPast"] = travelUpcomingPast;
    console.log("data before fetch company all travels: ", data)
    try {
      axios
        .post(companyAllTravelsInvokeURL, data,
          {
            headers: {
              "Authorization": idTok,
            },
          })
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200) {
            setTravelsDetailList(response.data.body.travels_list);
            // console.log("response.data.body.travels_list): ", response.data.body.travels_list);
          } else {
            if(response.data.body in response.data){
              setMessage(response.data.body.message);
            }
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
  }, []);

  useEffect(() => {
    console.log("in useEffect");
    console.log("travelSortType in useEffect: ", travelSortType);
    if(sessionInfo.loggedin){
      fetchCompanyAllTravels();
    }
  }, [travelUpcomingPast, travelSortType, sessionInfo, idTok]);

  return (
    <div>
      <Navbar />
      {/* Sorting bar */}
      <div className="container-fluid pt-4 pb-4 upperBar">
        <div className="row">
          <div className="col-6">
            <form onSubmit={handleSortCompanyTravels} method="POST">
              <div className="row align-items-center">
                <div className="col-6">
                  <select
                    className="form-select"
                    name="sort_type"
                    id="sort_type"
                  >
                    <option value="earliest_to_latest">
                      Earliest to Latest
                    </option>
                    <option value="latest_to_earliest">
                      Latest to Earliest
                    </option>
                    <option value="price_low_to_high">Price Low to High</option>
                    <option value="price_high_to_low">Price High to Low</option>
                  </select>
                </div>
                <div className="col-6">
                  <button
                    type="submit"
                    id="sort-button"
                    className="btn btn-outline-danger "
                  >
                    Sort
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Filtering upcoming or past travels */}
      <div className="container ">
        <div className="d-flex justify-content-around mt-4 mb-3 ">
          <div className="flex-fill justify-content-center text-center">
            <button
              onClick={() => {
                setTravelUpcomingPast("upcoming");
              }}
              className={
                travelUpcomingPast === "upcoming"
                  ? "btn btn-lg w-50 btn-secondary "
                  : "btn btn-lg w-50 btn-danger"
              }
            >
              Upcoming Travels
            </button>
          </div>

          <div className=" flex-fill justify-content-center text-center">
            <button
              onClick={() => {
                setTravelUpcomingPast("past");
              }}
              className={
                travelUpcomingPast === "upcoming"
                  ? "btn btn-lg w-50 btn-danger"
                  : "btn btn-lg w-50 btn-secondary"
              }
            >
              Past Travels
            </button>
          </div>
        </div>
      </div>

      <div className="container pt-5 ">
        {/* {renderTravelDetailList(travelsDetailList, travelUpcomingPast)} */}
        {travelsDetailList &&
          travelsDetailList.map((singleTravelDetail, index) => (
            <CompanySingleTravelCard
              key={index}
              singleTravelDetail={singleTravelDetail}
              travelUpcomingPast={travelUpcomingPast}
            />
          ))}
      </div>
    </div>
  );
}

export default CompanysAllTravels;
