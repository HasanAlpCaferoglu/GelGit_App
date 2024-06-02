// Header.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {fetchUserAttributes, signOut } from "aws-amplify/auth";

function Header() {
  
  const [sessionInfo, setSessionInfo] = useState({
      "username": null,
      "email": null,
      "userType": null,
      "sub": null,
      "loggedin": null
  })
  const [loading, setLoading] = useState(true);

  async function handleFetchUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();
      // console.log("userAttributes: ", userAttributes);
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
    } finally {
      setLoading(false); // Set loading to false when fetch completes
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  useEffect(() => {
    handleFetchUserAttributes();
  }, []);

  if (loading) {
    // Render loading indicator while fetching user attributes
    return <div></div>;
  }

  if (sessionInfo["loggedin"] && sessionInfo["userType"] === "traveler") {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark customNavbar">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <a className="navbar-brand" href="/">
              <img src="./icon_navbar.png" alt="" style={{ height: "35px" }} />
            </a>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/myTravels"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                My Travels
              </a>
            </li>
            {/* <li className="nav-item">
                            <a className="nav-link" href="/myjourneys">My Journeys</a>
                        </li> */}
            <li className="nav-item">
              <a
                className="nav-link"
                href="/myBalance"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Balance
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/myCoupons"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Coupons
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/myProfile"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Profile
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/"
                onClick={(event) => {
                  event.preventDefault(); // Prevent default navigation
                  handleSignOut(); // Call handleSignOut function
                }}
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  } else if (sessionInfo["loggedin"] && sessionInfo["userType"] === "company") {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark customNavbar">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <a className="navbar-brand" href="/">
              <img src="./icon_navbar.png" alt="" style={{ height: "35px" }} />
            </a>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Search Travels
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/companysAllTravels"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                {" "}
                Company's All Travels
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/addCompanyTravel"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Register A Travel
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/companyProfile"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Company Profile
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/"
                onClick={(event) => {
                  event.preventDefault(); // Prevent default navigation
                  handleSignOut(); // Call handleSignOut function
                }}
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  } else if (sessionInfo["loggedin"] && sessionInfo["userType"] === "admin") {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark customNavbar">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <a className="navbar-brand" href="/">
              <img src="./icon_navbar.png" alt="" style={{ height: "35px" }} />
            </a>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Search Travels
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/companies"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Companies
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="/couponManagement"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Coupons
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/vehicleManagement"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Vehicles
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/terminalManagement"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Terminals
              </a>
            </li>
            {/* <li className="nav-item">
                            <a className="nav-link" href="{{ url_for('reportManagement') }}" style={{ fontWeight: "bolder", fontSize: "17px" }}>Application Report</a>
                        </li> */}
            <li className="nav-item">
              <a
                className="nav-link"
                href="/"
                onClick={(event) => {
                  event.preventDefault(); // Prevent default navigation
                  handleSignOut(); // Call handleSignOut function
                }}
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark customNavbar">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <a className="navbar-brand" href="/">
              <img src="./icon_navbar.png" alt="" style={{ height: "35px" }} />
            </a>
          </ul>

          <ul className="navbar-nav ml-auto d-flex align-items-center">
            <li className="nav-item border-right pr-3">
              <a
                className="nav-link"
                href="/login"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Log in
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/register"
                style={{ fontWeight: "bolder", fontSize: "17px" }}
              >
                Register
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
