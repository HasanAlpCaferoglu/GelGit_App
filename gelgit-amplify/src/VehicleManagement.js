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

function VehicleManagement() {
  const [message, setMessage] = useState("");
  const [sessionInfo, setSessionInfo] = useState({
    username: null,
    email: null,
    userType: null,
    sub: null,
    loggedin: null,
  });
  const [idTok, setIdTok] = useState(null);

  const [allVehicles, setAllVehicles] = useState([]);

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

  function fetchVehicles() {
    try {
      const vehicleManagementInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/vehicleManagement`;
      const data = sessionInfo
      axios
        .post(vehicleManagementInvokeURL, data,
          {
            headers: {
              "Authorization": idTok,
            },
          })
        .then((response) => {
          console.log("response.data: ", response.data);
          if (response.data.statusCode === 200) {
            setAllVehicles(response.data.body.vehicles);
          } else {
            if("body" in response.data){
              setMessage(response.data.body.message);
            } else{
              setMessage(response.data.errorMessage)
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

  useEffect(() => {
    if(sessionInfo.loggedin){
      fetchVehicles();
    }
  }, [sessionInfo, idTok]);


  function deleteVehicleType(vehicleTypeId) {
    console.log("In deleteVehicleType")
    const deleteVehicleTypeInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/deleteAVehicleType/${vehicleTypeId}`
    const data = sessionInfo

    try {
        axios.post(deleteVehicleTypeInvokeURL, data,
          {
            headers: {
              "Authorization": idTok,
            },
          }).then((response) => {
            console.log("response.data: ", response.data)
            if(response.data.statusCode === 200){
                setMessage(response.data.body.message)
                fetchVehicles();
            } else {
                setMessage(response.data.body.message)
            }
        }).catch((error) =>{
            console.error("Error: ", error)
        })
    } catch (error) {
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
          <div className="col-10 d-flex flex-column">
            <div className="mt-auto ">
              <h4> Vehicle Types </h4>
            </div>
          </div>
          <div className="col-2">
            <a href="/createVehicleType">
              <button className="btn btn-lg btn-danger px-4">
                {" "}
                Create New Vehicle Type
              </button>
            </a>
          </div>
        </div>
        <hr />
      </div>

      {allVehicles.length > 0 && (
        <div className="container mt-2">
          {allVehicles.map((singleVehicle, index) => {
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
                          <h6 className=" blockTitle">Vehicle ID</h6>
                          <p className="">{singleVehicle.vehicle_id}</p>
                        </div>
                      </div>

                      <div className="col">
                        <div className="row">
                          <h6 className="blockTitle">Vehicle Model</h6>
                          <p className="">{singleVehicle.vehicle_model}</p>
                        </div>
                      </div>

                      <div className="col">
                        <div className="row">
                          <h6 className="blockTitle">Vehicle Type</h6>
                          <p className="">{singleVehicle.vehicle_type}</p>
                        </div>
                      </div>

                      <div className="col">
                        <div className="row">
                          <h6
                            className="blockTitle"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Numbers represent adjacent seats. The dash represents the corridor."
                          >
                            Seat Formation
                          </h6>
                          <p className="">{singleVehicle.seat_formation}</p>
                        </div>
                      </div>

                      <div className="col">
                        <div className="row">
                          <h6 className="blockTitle">Total Seat Number</h6>
                          <p className="">{singleVehicle.total_seat_number}</p>
                        </div>
                      </div>

                      <div className="col">
                        <div className="row">
                          <h6 className="blockTitle">Business Row #</h6>
                          <p className="">
                            {singleVehicle.business_row_number}
                          </p>
                        </div>
                      </div>

                      <div className="col">
                        <button
                          onClick={() => {
                            deleteVehicleType(singleVehicle.vehicle_id);
                          }}
                          className="btn btn-danger"
                        >
                          Delete Vehicle Type
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {allVehicles.length === 0 && (
        <div className="container ">
          <h5> There is no vehicle type. </h5>
        </div>
      )}
    </div>
  );
}

export default VehicleManagement;
