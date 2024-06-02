import "./css/generalStyle.css";
import "./css/purchasePage.css";

import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";

import Navbar from "./components/Header";

function PurchasePage() {
  // Extracting parameters from the route
  // console.log("useParams(): ", useParams());
  const [travelId, settravelId] = useState(useParams()["travelId"]);
  const [seatNumber, setseatNumber] = useState(useParams()["seatNumber"]);
  const [userAvailableCoupons, setUserAvailableCoupons] = useState([]);
  const [balance, setBalance] = useState(0.0);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);

  const [travelInfo, setTravelInfo] = useState({
    company_name: null,
    departure_terminal: null,
    arrival_terminal: null,
    depart_time: null,
    arrive_time: null,
    price: null,
  });

  // session info
  const [sessionInfo, setSessionInfo] = useState({
    username: null,
    email: null,
    userType: null,
    sub: null,
    loggedin: null,
  });
  const [idTok, setIdTok] = useState(null);

  const [message, setMessage] = useState("");

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

  function handleCouponSelection(coupon) {
    console.log("coupon: ", coupon);
    if (selectedCoupon === coupon) {
      setSelectedCoupon(null);
      setCurrentPrice(travelInfo.price);
    } else {
      setSelectedCoupon(coupon);
      setCurrentPrice(travelInfo.price - travelInfo.price * coupon.sale_rate);
    }
  }

  // fetchTravelInformation
  async function fetchTravelInformation() {
    try {
      const travelData = {
        travelId: travelId,
      };
      const invokeUrlTravelInfo =
        "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/specificTravelInformation";
      axios
        .post(invokeUrlTravelInfo, travelData) // No need for authorization
        .then((response) => {
          console.log("response.data: ", response.data);
          setTravelInfo(response.data.body.travelInformation);
          setCurrentPrice(response.data.body.travelInformation.price);
          console.log("travelInfo: ", travelInfo);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error", error);
    }
  }

  //   fetchUserProfileInformation
  async function fetchUserProfileInformation() {
    try {
      let data = sessionInfo;
      axios
        .post(
          "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/userProfile",
          data,
          {
            headers: {
              Authorization: idTok,
            },
          }
        )
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200){
            const userInformation = response.data.body.userProfileInfo;
            console.log("userInformation: ", userInformation);
            setBalance(userInformation["user_balance"]);
          } else {
            setMessage("Something went wrong! Couldn't get user information!")
          }
        })
        .catch((error) => {
          console.error("Error:", error); // Handle error
        });
    } catch (error) {
      console.error("Error when fetching information: ", error);
      setMessage(error);
    }
  }

  // getUserAvailableCoupons
  async function getUserAvailableCoupons() {
    const data = sessionInfo;

    try {
      const invoke_url =
        "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/userAvailableCoupons";
      axios
        .post(invoke_url, data, {
          headers: {
            Authorization: idTok,
          },
        })
        .then((response) => {
          console.log("response.data: ", response.data); // Handle success response
          if (response.data.statusCode === 200){
            console.log(
              "response.data.user_available_coupons: ",
              response.data.body.user_available_coupons
            ); // Handle success response
            setUserAvailableCoupons(response.data.body.user_available_coupons);
          } else{
            setMessage("Something went wrong. Couldn't get your coupons.")
          }
        });
    } catch (error) {
      console.error("Error: ", error);
      setMessage("Couldn't get user coupons");
    }
  }

  useEffect(() => {
    getCurrentSession();
    handleFetchUserAttributes();
  }, []); // Run only once on component mount to fetch user attributes

  useEffect(() => {
    fetchTravelInformation();
    if(sessionInfo.loggedin && idTok){
      fetchUserProfileInformation();
      getUserAvailableCoupons();
    }
  }, [sessionInfo, idTok]);

  const handlePurchaseTicket = () => {
    console.log("in handlePurchaseTicket 1");
    try {

      // const data = {
      //   loggedin: sessionInfo.loggedin,
      //   userid: sessionInfo.userid,
      //   userType: sessionInfo.userType,
      //   coupon_id: selectedCoupon ? selectedCoupon.coupon_id : null,
      // };

      let data = sessionInfo;
      data["coupon_id"] = selectedCoupon ? selectedCoupon.coupon_id : null;
      console.log("data before the purchase: ", data)

      const invokeUrl = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/buyTravel/${travelId}/${seatNumber}`;
      axios
        .post(invokeUrl, data,
          {
            headers: {
              "Authorization": idTok,
            },
          })
        .then((response) => {
          console.log("response.data.body: ", response.data.body);
          if (response.data.statusCode === 200) {
            // Sending email to user
            let emailRequestData = sessionInfo
            emailRequestData["pnr"] = response.data.body.pnr;
            emailRequestData["seat_number"] = response.data.body.seat_number;
            emailRequestData["company_name"] = response.data.body.travel_details[0]
            emailRequestData["departure_terminal"] = response.data.body.travel_details[1]
            emailRequestData["arrival_terminal"] = response.data.body.travel_details[2]
            emailRequestData["departure_time"] = response.data.body.travel_details[3]
            emailRequestData["price"] = response.data.body.travel_details[4]
            const sendEmailInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/email`
            console.log("emailRequestData before request: ", emailRequestData)
            axios.post(sendEmailInvokeURL, emailRequestData).then((emailReqResponse) => {
              console.log("email request response: ", emailReqResponse)
              if(emailReqResponse.status === 200){
                window.location.href = "/myTravels";
              }
            }).catch((emailError) => {
              console.log("email request error: ", emailError)
            })
            // setting message and sending user to myTravels page
            setMessage(response.data.body.message);
            // window.location.href = "/myTravels";
          } else {
            setMessage(response.data.body.message);
          }
        })
        .catch((error) => {
          console.log("Error: ", error);
          //   setMessage(error) // might cause an error since error could be an object jsx cannot render object
        });
    } catch (error) {
      console.error("Error: ", error);
      //   setMessage(error); // might cause an error since error could be an object and jsx cannot render object
    }
  };

  return (
    <body>
      <Navbar />
      <div className="container-fluid text-white">
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col">
                <div className="card m-4 infoCard">
                  <div className="card-header">
                    <h5 className="card-title">{travelInfo["company_name"]}</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <div className="text-lightRed">Departure:</div>
                        <div>{travelInfo["departure_terminal"]}</div>
                      </div>
                      <div className="col">
                        <div className="text-lightRed">Arrival:</div>
                        <div>{travelInfo["arrival_terminal"]}</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="text-lightRed">Departure Time:</div>
                        <div>
                          {travelInfo["depart_time"] &&
                            travelInfo["depart_time"].substring(0, 10)}{" "}
                          -{" "}
                          {travelInfo["depart_time"] &&
                            travelInfo["depart_time"].substring(11, 19)}
                        </div>
                      </div>
                      <div className="col">
                        <div className="text-lightRed">Arrival Time:</div>
                        <div>
                          {travelInfo["arrive_time"] &&
                            travelInfo["arrive_time"].substring(0, 10)}{" "}
                          -{" "}
                          {travelInfo["arrive_time"] &&
                            travelInfo["arrive_time"].substring(11, 19)}
                        </div>
                      </div>

                      {/* {reserved_booking && (
                        <div className="col">
                          <div className="text-lightRed">PNR:</div>
                          <div>{pnr}</div>
                        </div>
                      )} */}
                    </div>
                    {seatNumber && (
                      <div className="col">
                        <div className="text-lightRed">Seat number:</div>
                        <div>{seatNumber}</div>
                      </div>
                    )}
                    {/* {journey_count !== 0 && (
                      <div className="row">
                        <div className="col">
                          <div className="text-lightRed">Journey:</div>
                          <div>{journeys}</div>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="card m-4 infoCard">
                  <div className="card-header">
                    <h5 className="card-title"> Available Coupons </h5>
                  </div>
                  <div className="card-body">
                    {sessionInfo["loggedin"] &&
                    sessionInfo["userType"] === "traveler" &&
                    userAvailableCoupons ? (
                      userAvailableCoupons.map((coupon, index) => (
                        <button
                          key={index}
                          className="btn btn-outline-success btn-lg mb-2"
                          style={{
                            width: "100%",
                            backgroundColor:
                              selectedCoupon === coupon ? "green" : "inherit",
                            color:
                              selectedCoupon === coupon ? "white" : "inherit",
                          }}
                          type="button"
                          onClick={() => handleCouponSelection(coupon)}
                        >
                          {coupon.coupon_name} ({coupon.sale_rate * 100}%)
                        </button>
                      ))
                    ) : (
                      <div className="card couponCard p-2 mb-2">
                        Log In to See Coupons
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card m-4 infoCard">
              <div className="card-header">
                <h5 className="card-title">Complete Purchase</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <h2> Current Balance: </h2>
                  </div>
                  <div className="col">
                    <div className="card bg-secondary text-white text-center">
                      {sessionInfo["loggedin"] &&
                      sessionInfo["userType"] === "traveler" ? (
                        <div style={{ fontSize: "30px" }}>{balance} ₺</div>
                      ) : (
                        <div style={{ fontSize: "30px" }}>
                          Log In to Purchase
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <h2> Ticket Price: </h2>
                  </div>
                  <div className="col">
                    <div className="card bg-secondary text-white text-center">
                      <div style={{ fontSize: "30px" }}>
                        {selectedCoupon && (
                          <>
                            <div style={{ textDecoration: "line-through" }}>
                              {travelInfo["price"]} ₺
                            </div>
                            <div>{currentPrice} ₺</div>
                          </>
                        )}
                        {!selectedCoupon && <div>{travelInfo["price"]} ₺</div>}
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="d-grid gap-2 col-6 mx-auto">
                    <div>
                      {sessionInfo.loggedin && (
                        <button
                          className="btn btn-outline-success btn-lg"
                          type="submit"
                          style={{ width: "100%" }}
                          name="purchase"
                          onClick={() => {
                            handlePurchaseTicket();
                          }}
                        >
                          Purchase Ticket
                        </button>
                      )}
                      {message && (
                        <div className="alert alert-danger mt-4" role="alert">
                          {message}
                        </div>
                      )}
                      {/* <hr /> */}

                      {/* {journey_count === 0 && (
                                                    <form method="POST" action="#">
                                                        <div className="d-grid gap-2 col-12 mx-auto">
                                                            <label htmlFor="selectedJourney">Add this travel to one of your journeys</label>
                                                            <select className="form-select" id="selectedJourney" name="selectedJourney">
                                                                {journeys.map((journey, index) => (
                                                                    <option key={index}>{journey.journey_name}</option>
                                                                ))}
                                                            </select>
                                                            <select id="selectedJourney" name="selectedJourney" style={{ display: 'none' }}></select>
                                                            <button className="btn btn-outline-info btn-lg" type="submit" name="addTravelToJourney">Add to Journey</button>
                                                        </div>
                                                    </form>
                                                )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}

export default PurchasePage;
