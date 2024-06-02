import "./css/generalStyle.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";

import Navbar from "./components/Header";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function CompanyProfile() {
  // const [sessionInfo, setSessionInfo] = useState(
  //     JSON.parse(localStorage.getItem('session_info'))
  //         ? JSON.parse(localStorage.getItem('session_info'))
  //         : {
  //             loggedin: false,
  //             userType: null,
  //             userid: null
  //         }
  // );

  const [sessionInfo, setSessionInfo] = useState({
    username: null,
    email: null,
    userType: null,
    sub: null,
    loggedin: null,
  });
  const [idTok, setIdTok] = useState(null);

  const [companyInfo, setCompanyInfo] = useState({
    user_id: "",
    company_email: "",
    company_phone: "",
    company_name: "",
    company_website: "",
    company_foundation_date: "",
    company_about: "",
  });

  const [companyName, setCompanyName] = useState(companyInfo["company_name"]);

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

  async function fetchCompanyProfileInformation() {
    try {
      let data = sessionInfo;
      axios
        .post(
          "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/companyProfile",
          data,
          {
            headers: {
              "Authorization": idTok,
            },
          }
        )
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200) {
            const companyProfile = response.data.body.companyProfile;
            console.log("companyProfile: ", companyProfile);
            setCompanyInfo(companyProfile);
          } else {
            if( "body" in response.data){
                setMessage(response.data.body.message);
            } else {
                setMessage(response.data.errorMessage)
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error); // Handle error
        });
    } catch (error) {
      console.lerror("Error when fetching information: ", error);
      setMessage(error);
    }
  }

  useEffect(() => {
    getCurrentSession();
    handleFetchUserAttributes();
  }, []);

  useEffect(() => {
    if(sessionInfo.loggedin){
        fetchCompanyProfileInformation();
    }
  }, [sessionInfo, idTok]);

  function showMessage() {
    if (message) {
      return (
        <div className="cont">
          <h4 className="text-danger">{message}</h4>
        </div>
      );
    }
  }

  function handleUpdateCompanyProfile(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data["userid"] = companyInfo.user_id;
    data["userType"] = sessionInfo.userType;
    data["loggedin"] = sessionInfo.loggedin;

    console.log("Inside handleUpdateCompanyProfile");
    console.log("post request data: ", data);

    axios
      .post(
        "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/companyProfileUpdate",
        data,
        {
          headers: {
            "Authorization": idTok,
          },
        }
      )
      .then((response) => {
        console.log("response.data: ", response.data);
        if (response.data.statusCode === 200) {
          console.log(
            "New company information: ",
            response.data.body.companyProfile
          );
          setMessage(response.data.body.message);
        } else {
            if("body" in response.data){
                setMessage(response.data.body.message);
            } else{
                setMessage(response.data.errorMessage)
            }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid mt-4 mb-4">
        <h3 className="ml-6 ">
          {capitalizeFirstLetter(companyInfo.company_name)} Profile{" "}
        </h3>
      </div>
      <hr />

      {showMessage()}

      <div className="container ">
        <div className="row justify-content-center mt-4">
          <div className="col-md-9 p-5 rounded-4 profileCard">
            <form onSubmit={handleUpdateCompanyProfile} method="POST">
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="company_name">Company Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="company_name"
                    name="company_name"
                    value={companyInfo.company_name}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        company_name: e.target.value,
                      })
                    }
                  ></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="company_phone">Phone:</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="company_phone"
                    name="company_phone"
                    value={companyInfo.company_phone}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        company_phone: e.target.value,
                      })
                    }
                  ></input>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="company_email">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="company_email"
                    name="company_email"
                    value={companyInfo.company_email}
                    readOnly
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        company_email: e.target.value,
                      })
                    }
                  ></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="company_website">Official Website:</label>
                  <input
                    type="text"
                    style={{ cursor: 'default' }}
                    className="form-control"
                    id="company_website"
                    name="company_website"
                    value={companyInfo.company_website}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        company_website: e.target.value,
                      })
                    }
                  ></input>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="company_foundation_date">
                    Foundation Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="company_foundation_date"
                    name="company_foundation_date"
                    value={companyInfo.company_foundation_date}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        company_foundation_date: e.target.value,
                      })
                    }
                  ></input>
                </div>
              </div>
              <div className="row mb-5">
                <label htmlFor="company_about">About Company:</label>
                <textarea
                  className="form-control"
                  id="company_about"
                  name="company_about"
                  cols="30"
                  rows="10"
                  value={companyInfo.company_about}
                  onChange={(e) =>
                    setCompanyInfo({
                      ...companyInfo,
                      company_about: e.target.value,
                    })
                  }
                >
                  {companyInfo.company_about}
                </textarea>
              </div>

              <div className="row ">
                <div className="col-2"></div>
                <div className="col-4 text-center ">
                  <button type="submit" className="btn btn-lg btn-danger">
                    Update Profile
                  </button>
                </div>
                <a className="col-4 text-center" href="/companyProfile">
                  <button type="button" className="btn btn-lg btn-secondary">
                    Cancel Edition
                  </button>
                </a>
                <div className="col-2"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfile;
