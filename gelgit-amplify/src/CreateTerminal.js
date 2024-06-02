import "./css/generalStyle.css";
import "./css/generalListPage.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";
import Navbar from "./components/Header";

function CreateTerminal() {
  const [message, setMessage] = useState("");
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

  function handleCreateTerminal(event) {
    event.preventDefault();
    const terminal_type = event.target.terminal_type.value;
    const terminal_city = event.target.terminal_city.value;
    const terminal_name = event.target.terminal_name.value;

    // const data = {
    //   userid: sessionInfo.userid,
    //   userType: sessionInfo.userType,
    //   loggedin: sessionInfo.loggedin,
    //   terminal_type: terminal_type,
    //   terminal_city: terminal_city,
    //   terminal_name: terminal_name,
    // };

    let data = sessionInfo;
    data["terminal_type"] = terminal_type;
    data["terminal_city"] = terminal_city;
    data["terminal_name"] = terminal_name;

    const createTerminalInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/createTerminal`;

    try {
      axios
        .post(createTerminalInvokeURL, data, {
          headers: {
            Authorization: idTok,
          },
        })
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200) {
            setMessage(response.data.body.message);
            event.target.reset(); // resets the form
          } else {
            if ("body" in response.data){
                setMessage(response.data.body.message);
            } else {
                console.log(response.data.errorMessage)
                setMessage("Something went wrong. Couldn't create terminal.")
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
  }, []); // Run only once on component mount to fetch user attributes

  return (
    <div>
      <Navbar />
      <div className="container pt-4 ">
        <h4> Create New Terminal </h4>
        <hr />
      </div>

      {message && (
        <div className="container mt-2">
          <h4 className="text-danger">{message}</h4>
        </div>
      )}

      <div className="container">
        <div className="row justify-content-center mt-4">
          <div className="col-md-9 p-5 rounded-4 profileCard">
            <form onSubmit={handleCreateTerminal}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="terminal_type">Terminal Type:</label>
                  <select
                    className="form-select"
                    id="terminal_type"
                    name="terminal_type"
                  >
                    <option value="bus">Bus</option>
                    <option value="plane">Plane</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="terminal_city">Terminal City:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="terminal_city"
                    name="terminal_city"
                    placeholder="Enter a city"
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label htmlFor="terminal_name">Terminal Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="terminal_name"
                    name="terminal_name"
                    placeholder="Enter terminal name..."
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 text-center">
                  <button type="submit" className="btn btn-lg btn-danger">
                    Create Terminal
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

export default CreateTerminal;
