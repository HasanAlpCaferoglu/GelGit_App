import "./css/aTravelDetails.css";
import "./css/generalStyle.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";

import Navbar from "./components/Header";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function ATravelDetails() {
  const [sessionInfo, setSessionInfo] = useState({
    username: null,
    email: null,
    userType: null,
    sub: null,
    loggedin: null,
  });
  const [idTok, setIdTok] = useState(null);

  const [theTravel, setTheTravel] = useState({});
  const [aTravelPurchaseDetails, setATravelPurchaseDetails] = useState([]);
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

  function arrangePurchases(purchases) {
    var arr_purchases = [];
    purchases.forEach((purchase) => {
      if (purchase.length == 11) {
        var purchaseVar = {
          PNR: purchase[0],
          seat_number: purchase[1],
          seat_type: purchase[2],
          purchased_time: purchase[3],
          payment_method: purchase[4],
          amount: purchase[5],
          coupon_name: purchase[6],
          sale_rate: purchase[7],
          TCK: purchase[8],
          name: purchase[9],
          surname: purchase[10],
        };
      } else if (purchase.length == 8) {
        var purchaseVar = {
          PNR: purchase["PNR"],
          TCK: purchase["TCK"],
          name: purchase["name"],
          surname: purchase["surname"],
          seat_number: purchase["seat_number"],
          seat_type: purchase["seat_type"],
          purchased_time: purchase["purchased_time"],
          amount: purchase["amount"],
          coupon_name: purchase["coupon_name"],
          sale_rate: purchase["sale_rate"],
          payment_method: purchase["payment_method"],
        };
      } else {
        console.log("The purchase is already arranged.");
      }

      arr_purchases.push(purchaseVar);
    });
    console.log("arr_purchases: ", arr_purchases);
    return arr_purchases;
  }

  async function getTravelDetails() {
    const url = window.location.href;
    console.log("splitted url: ", url.split("/"))
    const company_id = url.split("/")[4];
    const travel_id = url.split("/")[5];

    try {
      let data = sessionInfo;
      data["travelId"] = travel_id;
      data["company_id"] = company_id;
      const aTravelDetailsInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/aTravelDetails/${company_id}`;
      console.log("data just before post request: ", data)
      axios
        .post(aTravelDetailsInvokeURL, data, {
          headers: {
            Authorization: idTok,
          },
        })
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200) {
            const travelDetails = response.data.body.theTravel;
            console.log("travelDetails: ", travelDetails);
            var travelDetailsVar = {
              travel_id: travel_id,
              departure_city: travelDetails[5],
              departure_terminal_name: travelDetails[4],
              arrival_city: travelDetails[7],
              arrival_terminal_name: travelDetails[6],
              depart_time: travelDetails[0],
              arrival_time: travelDetails[1],
              vehicle_type: travelDetails[9],
              vehicle_model: travelDetails[8],
              price: travelDetails[2],
              business_price: travelDetails[3],
            };
            setTheTravel(travelDetailsVar);
            setATravelPurchaseDetails(
              arrangePurchases(response.data.body.aTravelPurchaseDetails)
            );
            console.log(response.data.body.aTravelPurchaseDetails);
          } else {
            if ("body" in response.data) {
              setMessage(response.data.body.message);
            } else {
              setMessage("Something went wrong!");
            }
          }
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    } catch (error) {
      console.error("Error: ", error);
      setMessage("Someting went wrong.");
    }
  }

  useEffect(() => {
    getCurrentSession();
    handleFetchUserAttributes();
  }, []); // Run only once on component mount to fetch user attributes

  useEffect(() => {
    if (sessionInfo.loggedin) {
        getTravelDetails();
    }
  }, [sessionInfo, idTok]);

  return (
    <div>
      <Navbar />
      {theTravel && (
        <div className="container pt-5 ">
          <h4>The Travel</h4>
          <hr />
          <div className="card bg-dark text-white">
            <div className="card-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <div className="row">
                      <h6 className=" blockTitle">Departure Terminal</h6>
                      <p className="">{theTravel["departure_terminal_name"]}</p>
                    </div>
                    <div className="row">
                      <h6 className="blockTitle">Departure Time</h6>
                      <p className="">{theTravel["depart_time"]}</p>
                    </div>
                  </div>
                  <div className="col">
                    <div className="row">
                      <h6 className="blockTitle">Arrival Terminal</h6>
                      <p className="">{theTravel["arrival_terminal_name"]}</p>
                    </div>
                    <div className="row">
                      <h6 className="blockTitle">Arrival Time</h6>
                      <p className="">{theTravel["arrival_time"]}</p>
                    </div>
                  </div>
                  <div className="col">
                    <div className="row">
                      <h6 className="blockTitle">Vehicle Type</h6>
                      <p className="">{theTravel["vehicle_type"]}</p>
                    </div>
                    <div className="row">
                      <h6 className="blockTitle">Vehicle Model</h6>
                      <p className="">{theTravel["vehicle_model"]}</p>
                    </div>
                  </div>
                  <div className="col">
                    <div className="row">
                      <h6 className="blockTitle">Price</h6>
                      <p className="">{theTravel["price"]}</p>
                    </div>
                    <div className="row">
                      <h6 className="blockTitle">Business Price</h6>
                      {theTravel["business_price"] ? (
                        <p className="">{theTravel["business_price"]} ₺</p>
                      ) : (
                        <p>-</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {message && (
        <div className="container mt-5">
          <h4 className="text-danger">{message}</h4>
        </div>
      )}
      <div className="container pt-4 ">
        <h4> All Purchases For This Travel</h4>
        <hr />
      </div>
      {aTravelPurchaseDetails.length > 0 ? (
        <div className="container ">
          {aTravelPurchaseDetails.map((singlePurchaseDetail) => (
            <div className="card card-person bg-secondary text-white">
              <div className="card-body">
                <div className="container-fluid">
                  <div className="row align-items-start">
                    <div className="col">
                      <div className="row">
                        <h6 className=" blockTitle">PNR</h6>
                        <p className="">{singlePurchaseDetail["PNR"]}</p>
                      </div>
                      <div className="row">
                        <h6 className="blockTitle">TCK</h6>
                        <p className="">{singlePurchaseDetail["TCK"]}</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="row">
                        <h6 className="blockTitle">Name</h6>
                        <p className="">{singlePurchaseDetail["name"]}</p>
                      </div>
                      <div className="row">
                        <h6 className="blockTitle">Surname</h6>
                        <p className="">{singlePurchaseDetail["surname"]}</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="row">
                        <h6 className="blockTitle">Seat Number</h6>
                        <p className="">
                          {singlePurchaseDetail["seat_number"]}
                        </p>
                      </div>
                      <div className="row">
                        <h6 className="blockTitle">Seat Type</h6>
                        <p className="">{singlePurchaseDetail["seat_type"]}</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="row">
                        <h6 className="blockTitle">Purchased Time</h6>
                        <p className="">
                          {singlePurchaseDetail["purchased_time"]}
                        </p>
                      </div>
                      <div className="row">
                        <h6 className="blockTitle">Purchase Amount</h6>
                        <p className="">{singlePurchaseDetail["amount"]}</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="row">
                        <h6 className="blockTitle">Coupon Name</h6>
                        {singlePurchaseDetail["coupon_name"] ? (
                          <p className="">
                            {singlePurchaseDetail["coupon_name"]}
                          </p>
                        ) : (
                          <p className="">-</p>
                        )}
                      </div>
                      <div className="row">
                        <h6 className="blockTitle">Coupon Sale Rate</h6>
                        {singlePurchaseDetail["coupon_name"] ? (
                          <p className="">
                            {singlePurchaseDetail["sale_rate"]}
                          </p>
                        ) : (
                          <p className="">-</p>
                        )}
                      </div>
                    </div>
                    <div className="col">
                      <div className="row">
                        <h6 className="blockTitle">Payment method</h6>
                        <p className="">
                          {singlePurchaseDetail["payment_method"]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="container ">
          <h5> There is no purchase. </h5>
        </div>
      )}
    </div>
  );
}

export default ATravelDetails;
