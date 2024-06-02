import "./css/generalStyle.css";
import "./css/userProfile.css";

import React, { useState, useEffect } from "react";

import Header from "./components/Header";
import axios from "axios";
import {
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function UserProfile() {

  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [TCK, setTCK] = useState("");
  const [name, setName] = useState(""); 
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState(0);
  const [balance, setBalance] = useState(0.0);

  const [sessionInfo, setSessionInfo] = useState({
    "username": null,
    "email": null,
    "userType": null,
    "sub": null,
    "loggedin": null
  });
  const [idTok, setIdTok] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

  async function fetchUserProfileInformation() {
    try {
      let data = sessionInfo;
      axios
        .post(
          "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/userProfile",
          data,
          {
            headers: {
              "Authorization": idTok,
            },
          }
        )
        .then((response) => {
          console.log("response.data: ", response.data);
          const userInformation = response.data.body.userProfileInfo;
          console.log("userInformation: ", userInformation);
          setUserId(userInformation["user_id"]);
          setEmail(userInformation["user_email"]);
          setPhone(userInformation["user_phone"]);
          setTCK(userInformation["user_TCK"]);
          setName(userInformation["user_name"]);
          setSurname(userInformation["user_surname"]);
          setAge(userInformation["user_age"]);
          setBalance(userInformation["user_balance"]);          
        })
        .catch((error) => {
          console.error("Error:", error); // Handle error
        });
    } catch (error) {
      console.lerror("Error when fetching information: ", error);
      setMessage(error);
      
    } finally{
      setLoading(false)
    }
  }

  const handleUpdateUserProfile = (event) => {
    event.preventDefault();
    const data = sessionInfo;
    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log("data before profile update request: ", data);

    axios
      .post(
        "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/userProfileUpdate",
        data,
        {
          headers: {
            "Authorization": idTok,
          },
        }
      )
      .then((response) => {
        console.log("response.data: ", response.data); // Handle success response
        if (response.data.statusCode === 200) {
          // setUserProfileInformation(data);
          console.log("response.data.body.message: ", response.data.body.message);
          setMessage("Profile updated sucessfully!")
        } else {
          setMessage("Couldn't update profile!")
        }
      })
      .catch((error) => {
        console.error("Error:", error); // Handle error
      });


  };

  useEffect(() => {
    getCurrentSession();
    handleFetchUserAttributes();
  }, []);

  useEffect(() => {
    if (sessionInfo.loggedin) {
      fetchUserProfileInformation();
    }
  }, [sessionInfo, idTok]);

  if (loading) {
    // Render loading indicator while fetching user attributes
    return <div>Loading...</div>;
  } 

  return (
    <div>
      <Header />

      <div className="container-fluid bg-secondary">
        <h3 className="p-4 text-center text-white">My Profile Page</h3>
      </div>

      <div className="container ">
        <div className="row justify-content-center mt-4">
          <div className="col-md-9 p-5 rounded-4 profileCard">
            <form
              onSubmit={handleUpdateUserProfile}
              method="POST"
            >
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    readOnly
                    // onChange={e => setEmail(e.target.value)}
                  ></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone">Phone:</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="TCK">TCK:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="TCK"
                    name="TCK"
                    value={TCK}
                    readOnly
                  ></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="surname">Surname:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="surname"
                    name="surname"
                    value={surname}
                    onChange={e => setSurname(e.target.value)}
                  ></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="age">Age:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    name="age"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-md-6">
                  <label htmlFor="balance">Balance:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="balance"
                    name="balance"
                    value={balance}
                    readOnly
                  ></input>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 text-center">
                  <button type="submit" className="btn btn-lg btn-danger">
                    Update Profile
                  </button>
                </div>
              </div>
              {message && (
                <div className="alert alert-danger mt-4" role="alert">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile; // Export the userProfile component
