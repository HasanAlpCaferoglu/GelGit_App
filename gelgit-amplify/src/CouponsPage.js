import "./css/couponsPage.css";
import "./css/generalStyle.css";

import Navbar from "./components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";


function CouponsPage() {
  const [availableCoupons, setAvailableCoupons] = useState([]); // availableCouponsTest
  const [pastCoupons, setPastCoupons] = useState([]); // pastCouponsTest
  const [message, setMessage] = useState("");
  const [addCouponMessage, setAddCouponMessage] = useState("");

  const [loading, setLoading] = useState(true);
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

  async function fetchUserCoupons() {
    const userCouponsInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/userAvailableCoupons`;
    const data = sessionInfo
    try {
      axios
        .post(userCouponsInvokeURL, data,
          {
            headers: {
              "Authorization": idTok,
            },
          })
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200) {
            setAvailableCoupons(response.data.body.user_available_coupons);
            setPastCoupons(response.data.body.user_past_coupons);
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
    } finally {
      setLoading(false)
    }
  }

  

  function handleAddCoupon(event) {
    event.preventDefault();
    const entered_coupon_name = event.target.coupon_name.value;
    console.log("entered_coupon_name: ", entered_coupon_name);
    // adding coupon
    const travelerAddNewCouponInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/travelerAddNewCoupon`;
    let data = sessionInfo;
    data["entered_coupon_name"] = entered_coupon_name

    try {
      axios
        .post(travelerAddNewCouponInvokeURL, data,
          {
            headers: {
              "Authorization": idTok,
            },
          })
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200) {
            setAddCouponMessage(response.data.body.message);
            fetchUserCoupons();
            event.target.reset(); // resets the form
          } else {
            setAddCouponMessage(response.data.body.message);
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
      fetchUserCoupons();
    }
  }, [sessionInfo, idTok]);

  if (loading) {
    // Render loading indicator while fetching user attributes
    console.log("in loading...")
    return <div></div>;
  } 

  return (
    <div>
      <Navbar />

      <div className="container-fluid text-white">
        {message && (
          <div className="alert alert-danger mt-4" role="alert">
            {message}
          </div>
        )}
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="card m-4 infoCard">
                <div className="card-header">
                  <h5 className="card-title"> Available Coupons </h5>
                </div>
                <div className="card-body">
                  {availableCoupons &&
                    availableCoupons.map((singleAvailableCoupon, index) => (
                      <div
                        key={index}
                        className="card availableCouponCard p-2 mb-2"
                      >
                        {singleAvailableCoupon.coupon_name} (
                        {singleAvailableCoupon.sale_rate * 100}%)
                      </div>
                    ))}
                  {availableCoupons.length === 0 && (
                    <div className="container ">
                      <h5> You do not have any available coupon. </h5>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="card m-4 infoCard">
                <div className="card-header">
                  <h5 className="card-title"> Past Coupons </h5>
                </div>
                <div className="card-body">
                  {pastCoupons &&
                    pastCoupons.map((singlePastCoupon, index) => (
                      <div
                        key={index}
                        className="card pastCouponCard p-2 mb-2 p-2 mb-2"
                      >
                        {singlePastCoupon.coupon_name} (
                        {singlePastCoupon.sale_rate * 100}%)
                      </div>
                    ))}
                  {pastCoupons.length === 0 && (
                    <div className="container ">
                      <h5> You do not have any past coupon. </h5>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card m-4 infoCard">
              <div className="card-header">
                <h5 className="card-title"> Add New Coupon </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddCoupon} method="POST">
                  <label htmlFor="couponForm" className="form-label">
                    Enter coupon name
                  </label>
                  <input
                    className="form-control"
                    name="coupon_name"
                    id="couponForm"
                    aria-describedby="couponForm"
                  ></input>
                  <div id="couponForm" className="form-text custom-form-text">
                    Private coupons can only be entered by one user. Don't share
                    your private coupons with others.
                  </div>
                  <br />
                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-outline-success btn-lg"
                    >
                      Add Coupon
                    </button>
                  </div>
                </form>
                {addCouponMessage && (
                  <div className="alert alert-danger mt-4" role="alert">
                    {addCouponMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponsPage;
