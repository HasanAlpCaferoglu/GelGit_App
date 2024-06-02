import "./css/generalStyle.css";
import "./css/generalListPage.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";

import Navbar from "./components/Header";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function TerminalManagement() {
  const [message, setMessage] = useState("");
  const [sessionInfo, setSessionInfo] = useState({
    username: null,
    email: null,
    userType: null,
    sub: null,
    loggedin: null,
  });
  const [idTok, setIdTok] = useState(null);

  const [allTerminals, setAllTerminals] = useState([]);

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

  function fetchTerminals() {
    const terminalManagementInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/terminalManagement`;
    const data = sessionInfo
    try {
      axios
        .post(terminalManagementInvokeURL, data,
          {
            headers: {
              "Authorization": idTok,
            },
          })
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200) {
            setAllTerminals(response.data.body.terminals);
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
    if( sessionInfo.loggedin ){
      fetchTerminals();
    }
  }, [sessionInfo, idTok]);

  function handleDeleteTerminal(terminalId) {
    const deleteTerminalInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/deleteTerminal/${terminalId}`;
    const data = sessionInfo;

    try {
      axios
        .post(deleteTerminalInvokeURL, data,
          {
            headers: {
              "Authorization": idTok,
            },
          })
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200) {
            setMessage(response.data.body.message);
            fetchTerminals();
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

  return (
    <div>
      <Navbar />
      
      {message && (
        <div className="alert alert-danger mt-4" role="alert">
          {message}
        </div>
      )}

      <div className="container pt-4">
        <div className="row">
          <div className="col-9 d-flex flex-column">
            <div className="mt-auto">
              <h4>Terminals</h4>
            </div>
          </div>
          <div className="col-3 d-flex justify-content-center">
            <a href="/createTerminal">
              <button className="btn btn-lg btn-danger px-5">
                Create New Terminal
              </button>
            </a>
          </div>
        </div>
        <hr />
      </div>

      {allTerminals.length > 0 && (
        <div className="container mt-2">
          {allTerminals.map((singleTerminal, index) => (
            <div key={index} className="card card-person bg-secondary text-white">
              <div className="card-body">
                <div className="container-fluid">
                  <div className="row align-items-start">
                    <div className="col">
                      <div className="row">
                        <h6 className=" blockTitle">Terminal Name</h6>
                        <p className="">{singleTerminal.terminal_name}</p>
                      </div>
                    </div>

                    <div className="col">
                      <div className="row">
                        <h6 className="blockTitle">City</h6>
                        <p className="">
                          {capitalizeFirstLetter(singleTerminal.terminal_city)}{" "}
                        </p>
                      </div>
                    </div>

                    <div className="col">
                      <div className="row">
                        <h6 className="blockTitle">Terminal Type</h6>
                        <p className="">
                          {capitalizeFirstLetter(singleTerminal.terminal_type)}{" "}
                        </p>
                      </div>
                    </div>

                    <div className="col">
                      <div className="row">
                        <h6 className="blockTitle">Terminal Active Status</h6>
                        <p className="">
                          {capitalizeFirstLetter(
                            singleTerminal.terminal_status
                          )}{" "}
                        </p>
                      </div>
                    </div>

                    <div className="col">
                      <button
                        onClick={() => {
                          handleDeleteTerminal(singleTerminal.terminal_id);
                        }}
                        className="btn btn-danger"
                      >
                        Delete Terminal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {allTerminals.length === 0 && (
        <div className="container ">
          <h5> There is no terminal. </h5>
        </div>
      )}
    </div>
  );
}

export default TerminalManagement;
