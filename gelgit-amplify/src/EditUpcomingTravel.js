import'./css/editUpcomingTravel.css';
import'./css/generalStyle.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Header';

function capitalizeFirstLetter(string) {
    if (!string) {
        return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function EditUpcomingTravel() {
    const [sessionInfo, setSessionInfo] = useState(
        JSON.parse(localStorage.getItem('session_info'))
            ? JSON.parse(localStorage.getItem('session_info'))
            : {
                loggedin: false,
                userType: null,
                userid: null
            }
    );

    const [theTravel, setTheTravel] = useState({});

    const [theOrgTravel, setTheOrgTravel] = useState({});

    const [allAvailableTerminals, setAllAvailableTerminals] = useState([]);

    const [allAvailableVehicleTypes, setAllAvailableVehicleTypes] = useState([]);

    const [message, setMessage] = useState("");

    const [isEditable, setIsEditable] = useState(true);

    useEffect(() => {
        if (sessionInfo.loggedin && sessionInfo.userType === 'company') {
            if (theTravel) {
                if (allAvailableTerminals && allAvailableVehicleTypes) {
                    setIsEditable(true);
                }
            }
        }
    }
    , [sessionInfo, theTravel, allAvailableTerminals, allAvailableVehicleTypes]);

    function arrangeTravelData(travelData) {
        const arrangedTravelData = {
            "depart_time": travelData[0],
            "arrival_time": travelData[1],
            "price": travelData[2],
            "business_price": travelData[3],
            "departure_terminal": travelData[4],
            "departure_city": travelData[5],
            "arrival_terminal": travelData[6],
            "arrival_city": travelData[7],
            "vehicle_model": travelData[8],
            "vehicle_type": travelData[9]
        };
        return arrangedTravelData;
    }

    function arrangeTerminalData(terminalData) {
        var test = []
        terminalData.map((singleTerminal) => {
            const arrangedSingleTerminal = {
                "terminal_id": singleTerminal[0],
                "name": singleTerminal[1],
                "city": singleTerminal[2],
                "type": singleTerminal[3],
                "is_active": singleTerminal[4]
            };
            test.push(arrangedSingleTerminal)
        });
        return test;
    }

    function arrangeVehicleTypeData(vehicleTypeData) {
        var test = []
        vehicleTypeData.map((singleVehicleType) => {
            const arrangedSingleVehicleType = {
                "id": singleVehicleType[0],
                "model": singleVehicleType[1],
                "type": singleVehicleType[2],
                "is_active": singleVehicleType[3]
            };
            test.push(arrangedSingleVehicleType)
        });
        return test;
    }


    async function fetchTravelInformation() {

        const data = {};
        const url = window.location.href;
        const travel_id = url.split("/")[4];
        data['travelId'] = travel_id
        data['loggedin'] = sessionInfo.loggedin
        data['userType'] = sessionInfo.userType
        data['userid'] = sessionInfo.userid
        data['getInfo'] = "True"
        try {
            axios
                .post(
                    "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/editUpcomingTravel/{travel_id}",
                    data
                )
                .then((response) => {
                    console.log("response.data: ", response.data);
                    if (response.data.statusCode === 200){
                        setAllAvailableTerminals(arrangeTerminalData(response.data.body.allAvailableTerminals));
                        setAllAvailableVehicleTypes(arrangeVehicleTypeData(response.data.body.allAvailableVehicleTypes));
                        setTheTravel(arrangeTravelData(response.data.body.theTravel));
                        setTheOrgTravel(arrangeTravelData(response.data.body.theTravel));

                        console.log("response.data.body.theTravel: ", response.data.body.theTravel);
                        console.log("response.data.body.allAvailableTerminals: ", response.data.body.allAvailableTerminals);
                        console.log("response.data.body.allAvailableVehicleTypes: ", response.data.body.allAvailableVehicleTypes);
                    } else {
                        setMessage(response.data.body.message)
                    }
                })
                .catch((error) => {
                    console.error("Error:", error); // Handle error
                });
        } catch (error) {
            setMessage(error);
        }
    }

    useEffect(() => {
        if (sessionInfo.loggedin && sessionInfo.userType === 'company') {
            fetchTravelInformation();
        }
    }
    , [sessionInfo]);

    function handleEditTravel(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        const url = window.location.href;
        const travel_id = url.split("/")[4];
        data['travelId'] = travel_id
        data['loggedin'] = sessionInfo.loggedin
        data['userType'] = sessionInfo.userType
        data['userid'] = sessionInfo.userid
        data['getInfo'] = "False"
        console.log("data: ", data);
        try {
            axios
                .post(
                    "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/editUpcomingTravel/{travel_id}",
                    data
                )
                .then((response) => {
                    console.log("response.data: ", response.data);
                    if (response.data.statusCode === 200){
                        setMessage("Travel updated successfully!")
                        // refresh the page
                        window.location.reload();
                    } else {
                        setMessage(response.data.body.message)
                    }
                })
                .catch((error) => {
                    console.error("Error:", error); // Handle error
                });
        } catch (error) {
            setMessage(error);
        }
    }

    function handleDepTerminalChange(event) {
        const newDepTerminalId = event.target.value;
        setTheTravel({
            ...theTravel,
            departure_terminal_id: newDepTerminalId
        });
    }

    function handleArTerminalChange(event) {
        const newArTerminalId = event.target.value;
        setTheTravel({
            ...theTravel,
            arrival_terminal_id: newArTerminalId
        });
    }

    function handleDepTimeChange(event) {
        const newDepTime = event.target.value;
        setTheTravel({
            ...theTravel,
            depart_time: newDepTime
        });
    }

    function handleArTimeChange(event) {
        const newArTime = event.target.value;
        setTheTravel({
            ...theTravel,
            arrival_time: newArTime
        });
    }

    function handleVehicTypeChange(event) {
        const newVehicType = event.target.value;
        setTheTravel({
            ...theTravel,
            vehicle_type: newVehicType
        });
    }

    function handleVehicTypeIdChange(event) {
        const newVehicTypeId = event.target.value;
        setTheTravel({
            ...theTravel,
            vehicle_type_id: newVehicTypeId
        });
    }

    function handlePriceChange(event) {
        const newPrice = event.target.value;
        setTheTravel({
            ...theTravel,
            price: newPrice
        });
    }

    function handleBusinessPriceChange(event) {
        const newBusinessPrice = event.target.value;
        setTheTravel({
            ...theTravel,
            business_price: newBusinessPrice
        });
    }

    function findTerminalIdByName (terminalName) {
        var terminalId = null;
        allAvailableTerminals.map((singleTerminal) => {
            if (singleTerminal.name === terminalName) {
                terminalId = singleTerminal.terminal_id;
            }
        });
        return terminalId;
    }

    return (
        <div>
            <Navbar />
            <div>
                <div>
                    {theTravel ?
                        <div className="container pt-4">
                            <h4>Travel To Be Edited</h4>
                            <hr />
                            <div className="card bg-dark text-white">
                                <div className="card-body">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col">
                                                <div className="row">
                                                    <h6 className="blockTitle">Departure Terminal</h6>
                                                    <p>{theOrgTravel.departure_terminal}</p>
                                                </div>
                                                <div className="row">
                                                    <h6 className="blockTitle">Departure Time</h6>
                                                    <p>{theOrgTravel.depart_time}</p>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="row">
                                                    <h6 className="blockTitle">Arrival Terminal</h6>
                                                    <p>{theOrgTravel.arrival_terminal}</p>
                                                </div>
                                                <div className="row">
                                                    <h6 className="blockTitle">Arrival Time</h6>
                                                    <p>{theOrgTravel.arrival_time}</p>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="row">
                                                    <h6 className="blockTitle">Vehicle Type</h6>
                                                    <p>{capitalizeFirstLetter(theOrgTravel.vehicle_type)}</p>
                                                </div>
                                                <div className="row">
                                                    <h6 className="blockTitle">Vehicle Model</h6>
                                                    <p>{theOrgTravel.vehicle_model}</p>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="row">
                                                    <h6 className="blockTitle">Price</h6>
                                                    <p>{theOrgTravel.price}</p>
                                                </div>
                                                <div className="row">
                                                    <h6 className="blockTitle">Business Price</h6>
                                                    {theTravel.business_price ?
                                                        <p>{theOrgTravel.business_price} ₺</p>
                                                        :
                                                        <p>-</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }
                </div>
                <div>
                    {message ?
                        <div className="container">
                            <h4 className="mb-2 text-danger">{message}</h4>
                        </div>
                        :
                        null
                    }
                </div>
                <div>
                    {isEditable ?
                        <div className="container">
                            <h4>Edit Travel</h4>
                            <hr />
                            <div className="row justify-content-center">
                                <div className="col-md-12 p-2 rounded-4 profileCard">
                                    <form onSubmit={handleEditTravel} method="POST">
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <label htmlFor="dep_terminal_id">Departure Terminal:</label>
                                                <select className="form-select" id="dep_terminal_id" name="dep_terminal_id" onChange={handleDepTerminalChange}>
                                                    {allAvailableTerminals ?
                                                        allAvailableTerminals.map((singleTerminal) => (
                                                            <option value={singleTerminal.terminal_id} selected={singleTerminal.terminal_id === findTerminalIdByName(theTravel.departure_terminal)}>
                                                                {singleTerminal.name} | {singleTerminal.city}
                                                            </option>
                                                        ))
                                                        :
                                                        <option value="">No available Terminal</option>
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="ar_terminal_id">Arrival Terminal:</label>
                                                <select className="form-select" id="ar_terminal_id" name="ar_terminal_id" onChange={handleArTerminalChange}>
                                                    {allAvailableTerminals ?
                                                        allAvailableTerminals.map((singleTerminal) => (
                                                            <option value={singleTerminal.terminal_id} selected={singleTerminal.terminal_id === findTerminalIdByName(theTravel.arrival_terminal)}>
                                                                {singleTerminal.name} | {singleTerminal.city}
                                                            </option>
                                                        ))
                                                        :
                                                        <option value="">No available Terminal</option>
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <label htmlFor="dep_time">Departure Time:</label>
                                                <input type="datetime-local" className="form-control" id="dep_time" name="dep_time" value={theTravel.depart_time} onChange={handleDepTimeChange}></input>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="ar_time">Arrival Time:</label>
                                                <input type="datetime-local" className="form-control" id="ar_time" name="ar_time" value={theTravel.arrival_time} onChange={handleArTimeChange}></input>
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <label htmlFor="vehic_type">Vehicle Type:</label>
                                                <input type="text" className="form-control" id="vehic_type" name="vehic_type" placeholder={capitalizeFirstLetter(theTravel.vehicle_type)} readOnly></input>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="vehic_type_id">Vehicle Model:</label>
                                                <select className="form-select" id="vehic_type_id" name="vehic_type_id" onChange={handleVehicTypeIdChange}>
                                                    {allAvailableVehicleTypes ?
                                                        allAvailableVehicleTypes.map((singleVehicType) => (
                                                            <option value={singleVehicType.id}>{singleVehicType.model}</option>
                                                        ))
                                                        :
                                                        <option value="">No available Vehicle Type</option>
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <label htmlFor="price">Price:</label>
                                                <input type="number" step="0.01" className="form-control" id="price" name="price" value={theTravel.price} onChange={handlePriceChange}></input>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="business_price">Business Price:</label>
                                                <input type="number" step="0.01" className="form-control" id="business_price" name="business_price" value={theTravel.business_price} onChange={handleBusinessPriceChange}></input>
                                            </div>
                                        </div>
                                        <div className="row ">
                                            <div className="col-4"></div>
                                            <div className="col-2 text-center ">
                                                <button type="submit" className="btn btn-lg btn-danger">Update Travel</button>
                                            </div>
                                            <a className="col-2 text-center" href="/companysAllTravels">
                                                <button type="button" className="btn btn-lg btn-secondary">Cancel Update</button>
                                            </a>
                                            <div className="col-4"></div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }
                </div>
            </div>
        </div>
    );
}

export default EditUpcomingTravel;
