import "./css/generalStyle.css";
import "./css/generalListPage.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    fetchUserAttributes,
    fetchAuthSession,
  } from "aws-amplify/auth";

import Navbar from "./components/Header";

function CreateCoupon() {
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

  function handleSubmit(event) {
    event.preventDefault();
    const coupon_name = event.target.coupon_name.value;
    const sale_rate = event.target.sale_rate.value;
    const expiration_date = event.target.expiration_date.value;
    const public_status = event.target.public_status.value;

    // const data = {
    //   userid: sessionInfo.userid,
    //   userType: sessionInfo.userType,
    //   loggedin: sessionInfo.loggedin,
    //   coupon_name: coupon_name,
    //   sale_rate: sale_rate,
    //   expiration_date: expiration_date,
    //   public_status: public_status,
    // };

    let data = sessionInfo;
    data["coupon_name"] = coupon_name;
    data["sale_rate"] = sale_rate;
    data["expiration_date"] = expiration_date;
    data["public_status"] = public_status;

    axios
      .post(
        "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/createCoupon",
        data,
        {
          headers: {
            "Authorization": idTok,
          },
        }
      )
      .then((response) => {
        console.log("response.data: ", response.data);
        if (response.data["status"] === 200) {
          setMessage(response.data.body.message);
          window.location.href();
        } else {
          setMessage(response.data.body.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getCurrentSession();
    handleFetchUserAttributes();
  }, []); // Run only once on component mount to fetch user attributes


  return (
    <div>
      <Navbar />
      <div className="container pt-4 ">
        <h4> Create Coupon </h4>
        <hr />
      </div>

      {message && (
        <div className="container mt-2">
          <h4 className="text-danger">{message}</h4>
        </div>
      )}

      <div className="container ">
        <div className="row justify-content-center mt-4">
          <div className="col-md-9 p-5 rounded-4 profileCard">
            <form onSubmit={handleSubmit}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="coupon_name">Coupon Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="coupon_name"
                    name="coupon_name"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="sale_rate">Sale Rate:</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="sale_rate"
                    name="sale_rate"
                    placeholder="Enter number between 0,00 and 1,00"
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="expiration_date">Expration Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="expiration_date"
                    name="expiration_date"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="public_status">Public Status:</label>
                  <select
                    className="form-select"
                    id="public_status"
                    name="public_status"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 text-center">
                  <button type="submit" className="btn btn-lg btn-danger">
                    Create Coupon
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

export default CreateCoupon;
