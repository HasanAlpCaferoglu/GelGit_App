import "./css/generalStyle.css";
import "./css/generalListPage.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";

import Navbar from "./components/Header";

function CouponManagement() {
  const [message, setMessage] = useState("");
  const [sessionInfo, setSessionInfo] = useState({
    username: null,
    email: null,
    userType: null,
    sub: null,
    loggedin: null,
  });
  const [idTok, setIdTok] = useState(null);

  const [allCoupons, setAllCoupons] = useState([]);

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

  function fetchCoupons() {
    try {
      const data = sessionInfo;
      const couponManagementInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/couponManagement`;
      axios
        .post(couponManagementInvokeURL, data,
          {
            headers: {
              "Authorization": idTok,
            },
          })
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200) {
            setAllCoupons(response.data.body.coupons);
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

  useEffect(() => {
    if(sessionInfo.loggedin){
      fetchCoupons();
    }
  }, [sessionInfo, idTok]);


  function deleteCoupon(couponId) {

    try{
        const deleteACouponInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/deleteACoupon/${couponId}`
        const data = sessionInfo
        axios.post(deleteACouponInvokeURL, data,
          {
            headers: {
              "Authorization": idTok,
            },
          }).then((response) => {
            console.log("response.data", response.data)
            if(response.data.statusCode === 200){
                setMessage(response.data.body.message)
                fetchCoupons();
            } else {
                setMessage(response.data.body.message)
            }
        }).catch((error)=>{
            console.error("Error: ", error)
        })
    } catch(error) {
        console.error("Error: ", error)
    }
    
  }

  return (
    <div>
      <Navbar />
      {message && (
        <div className="alert alert-danger mt-4" role="alert">
          {message}
        </div>
      )}
      <div className="container pt-4 ">
        <div className="row">
          <div className="col-10">
            <h4> Coupons </h4>
          </div>
          <div className="col-2">
            <a href="/createCoupon">
              <button className="btn btn-lg btn-danger px-4">
                {" "}
                Create Coupon
              </button>
            </a>
          </div>
        </div>
        <hr />
      </div>

      {allCoupons.length > 0 ? (
        <div className="container mt-2">
          {allCoupons.map((singleCoupon, index) => {
            return (
              <div
                className="card card-person bg-secondary text-white"
                key={index}
              >
                <div className="card-body">
                  <div className="container-fluid">
                    <div className="row align-items-start">
                      <div className="col">
                        <div className="row">
                          <h6 className=" blockTitle">Coupon ID</h6>
                          <p className="">{singleCoupon["coupon_id"]}</p>
                        </div>
                      </div>

                      <div className="col">
                        <div className="row">
                          <h6 className="blockTitle">Coupon Name</h6>
                          <p className="">{singleCoupon["coupon_name"]}</p>
                        </div>
                      </div>

                      <div className="col">
                        <div className="row">
                          <h6 className="blockTitle">Sale Rate</h6>
                          <p className="">{singleCoupon["sale_rate"]}</p>
                        </div>
                      </div>

                      <div className="col">
                        <div className="row">
                          <h6 className="blockTitle">Expration Date</h6>
                          <p className="">{singleCoupon["expiration_date"]}</p>
                        </div>
                      </div>

                      <div className="col">
                        <div className="row">
                          <h6 className="blockTitle">Generation Date</h6>
                          <p className="">{singleCoupon["generation_date"]}</p>
                        </div>
                      </div>

                      <div className="col">
                        <div className="row">
                          <h6 className="blockTitle">Status</h6>
                          <p className="">{singleCoupon["status"]}</p>
                        </div>
                      </div>

                      <div className="col">
                          <button onClick={() => {deleteCoupon(singleCoupon["coupon_id"])}} className="btn btn-danger ">
                            Delete Coupon
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="container ">
          <h5> There is no coupon. </h5>
        </div>
      )}
    </div>
  );
}

export default CouponManagement;
