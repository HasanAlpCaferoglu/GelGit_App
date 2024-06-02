import "./css/generalStyle.css";
import "./css/listAvailableTravelsPage.css";

import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

// Importing components
import Header from "./components/Header";
import TravelCardBasic from "./components/TravelCardBasic";

function selectBox(boxNumber) {
  const selectedBox = document.getElementById("box" + boxNumber);
  const boxes = document.querySelectorAll(".box");
  document.getElementById("seat_number").value = boxNumber;

  boxes.forEach((otherBox) => {
    otherBox.classList.remove("selected");
  });

  selectedBox.classList.add("selected");
}

var searched = false;
var searchedTravels = [];
var travel_seat = -1;

function renderSeats(
  travel_seat,
  singleTravel,
  row,
  formation,
  tot_col,
  occupied
) {
  if (travel_seat === singleTravel["travel_id"]) {
    var container = document.createElement("div");
    container.classList.add("container-sm");

    for (var rowIdx = 0; rowIdx < row; rowIdx++) {
      var rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      var i = { offset: 0 };

      for (var colIdx = 0; colIdx < formation.length; colIdx++) {
        for (var j = 0; j < formation[colIdx]; j++) {
          var colDiv = document.createElement("div");
          colDiv.classList.add("col");
          colDiv.classList.add("col-md-offset-1");

          var box_number = rowIdx * tot_col + i.offset + j + 1;
          var boxDiv = document.createElement("div");
          boxDiv.classList.add("box");

          if (occupied.includes(box_number)) {
            boxDiv.style.backgroundColor = "gray";
            boxDiv.textContent = box_number;
          } else {
            boxDiv.setAttribute("id", "box" + box_number);
            boxDiv.textContent = box_number;
            boxDiv.addEventListener("click", function () {
              selectBox(box_number);
            });
          }

          colDiv.appendChild(boxDiv);
          rowDiv.appendChild(colDiv);
        }

        var emptyBoxDiv = document.createElement("div");
        emptyBoxDiv.classList.add("empty-box");
        rowDiv.appendChild(emptyBoxDiv);
        rowDiv.appendChild(document.createElement("br"));

        i.offset += formation[colIdx];
      }

      container.appendChild(rowDiv);
    }

    document.body.appendChild(container);
  }
}

function renderTravelDetails(travel_seat, singleTravel) {
  var containerFluid = document.createElement("div");
  containerFluid.classList.add("container-fluid");

  var row = document.createElement("div");
  row.classList.add("row");

  var colLeft = document.createElement("div");
  colLeft.classList.add("col-6");
  colLeft.style.width = "20vw";

  var h1 = document.createElement("h1");
  h1.classList.add("companyTitle");
  h1.textContent = singleTravel["company_name"];
  colLeft.appendChild(h1);

  row.appendChild(colLeft);

  var colCenter = document.createElement("div");
  colCenter.classList.add("col");
  colCenter.classList.add("d-flex");
  colCenter.classList.add("justify-content-center");

  var rowArrowContainer = document.createElement("div");
  rowArrowContainer.classList.add("row");
  rowArrowContainer.classList.add("arrow-container");
  rowArrowContainer.style.width = "80%";

  var colDepart = document.createElement("div");
  colDepart.classList.add("col");
  colDepart.classList.add("arrow-text");
  colDepart.textContent = "Depart: " + singleTravel["depart_time"];
  rowArrowContainer.appendChild(colDepart);

  var colArrow = document.createElement("div");
  colArrow.classList.add("col");
  colArrow.classList.add("d-flex");
  colArrow.classList.add("justify-content-center");

  var spanArrow = document.createElement("span");
  spanArrow.classList.add("arrow");
  spanArrow.innerHTML = "&rarr;";
  colArrow.appendChild(spanArrow);
  rowArrowContainer.appendChild(colArrow);

  var colArrive = document.createElement("div");
  colArrive.classList.add("col");
  colArrive.classList.add("arrow-text");
  colArrive.textContent = "Arrive: " + singleTravel["arrive_time"];
  rowArrowContainer.appendChild(colArrive);

  colCenter.appendChild(rowArrowContainer);
  row.appendChild(colCenter);

  var colRight = document.createElement("div");
  colRight.classList.add("col-2");
  colRight.classList.add("col-right");

  var containerRight = document.createElement("div");
  containerRight.classList.add("container");

  var rowRight = document.createElement("div");
  rowRight.classList.add("row");

  var formRow1 = document.createElement("div");
  formRow1.classList.add("row");

  if (travel_seat !== singleTravel["travel_id"]) {
    var form1 = document.createElement("form");
    form1.action =
      "{{ url_for('buy_travel', travel_id=singleTravel['travel_id']) }}";
    form1.method = "get";

    var button1 = document.createElement("button");
    button1.type = "submit";
    button1.style.width = "10vw";
    button1.classList.add("btn");
    button1.classList.add("btn-danger");
    button1.classList.add("btn-lg");
    button1.textContent = "Purchase random seat";

    form1.appendChild(button1);
    formRow1.appendChild(form1);
  } else {
    var form2 = document.createElement("form");
    form2.action =
      "{{ url_for('buy_travel', travel_id=singleTravel['travel_id']) }}";
    form2.method = "POST";

    var inputHidden = document.createElement("input");
    inputHidden.type = "hidden";
    inputHidden.name = "seat_number";
    inputHidden.id = "seat_number";
    form2.appendChild(inputHidden);

    var button2 = document.createElement("button");
    button2.type = "submit";
    button2.style.width = "10vw";
    button2.classList.add("btn");
    button2.classList.add("btn-danger");
    button2.classList.add("btn-lg");
    button2.id = "seat_purchase";
    button2.textContent = "Purchase seat";
    form2.appendChild(button2);

    formRow1.appendChild(form2);
  }

  rowRight.appendChild(formRow1);

  var formRow2 = document.createElement("div");
  formRow2.classList.add("row");

  if (travel_seat !== singleTravel["travel_id"]) {
    var form3 = document.createElement("form");
    form3.action = "{{ request.path }}";
    form3.method = "get";

    var inputHidden2 = document.createElement("input");
    inputHidden2.type = "hidden";
    inputHidden2.name = "travel_seat";
    inputHidden2.value = singleTravel["travel_id"];
    form3.appendChild(inputHidden2);

    var button3 = document.createElement("button");
    button3.type = "submit";
    button3.style.width = "10vw";
    button3.classList.add("btn");
    button3.classList.add("btn-danger");
    button3.classList.add("btn-lg");
    button3.textContent = "Choose seat";
    form3.appendChild(button3);

    formRow2.appendChild(form3);
  } else {
    var form4 = document.createElement("form");
    form4.action = "{{ request.path }}";
    form4.method = "get";

    var button4 = document.createElement("button");
    button4.type = "submit";
    button4.style.width = "10vw";
    button4.classList.add("btn");
    button4.classList.add("btn-danger");
    button4.classList.add("btn-lg");
    button4.textContent = "Close";
    form4.appendChild(button4);

    formRow2.appendChild(form4);
  }

  rowRight.appendChild(formRow2);
  containerRight.appendChild(rowRight);
  colRight.appendChild(containerRight);
  row.appendChild(colRight);

  containerFluid.appendChild(row);

  document.body.appendChild(containerFluid);
}

function display_if_searched() {
  if (searched) {
    searchedTravels.map((singleTravel) => {
      return (
        <div className="card bg-secondary text-white">
          <div className="card-body">
            {renderTravelDetails(travel_seat, singleTravel)}
            {renderSeats(
              travel_seat,
              singleTravel,
              5,
              [2, 3, 2],
              7,
              singleTravel["occupied_seats"]
            )}
          </div>
        </div>
      );
    });
  } else {
    return (
      <div>
        <h3>There are no travels that match your specified limitations.</h3>
      </div>
    );
  }
}

function sortTravels() {
  "document.getElementById('sort-button').click()";
}

function ListAvailableTravelsPage() {
  // Extracting parameters from the URL
  const {
    vehicleTypeParam,
    fromLocationParam,
    toLocationParam,
    travelDateParam,
    extraDateParam,
  } = useParams();
  const [vehicleType, setVehicleType] = useState(useParams()["vehicleType"]);
  const [fromLocation, setFromLocation] = useState(useParams()["fromLocation"]);
  const [toLocation, setToLocation] = useState(useParams()["toLocation"]);
  const [travelDate, setTravelDate] = useState(useParams()["travelDate"]);
  const [extraDate, setExtraDate] = useState(useParams()["extraDate"]);

  const [sortType, setSortType] = useState("earliest_to_latest");
  const [travels, setTravels] = useState({});

  const [chooseSeatOpenTravelId, setChooseSeatOpenTravelId] = useState(null)

  const [message, setMessage] = useState("");



  function display_date_range() {
    if (extraDate === undefined) {
      return (
        <div>
          Date Range: {travelDate} - {extraDate}
        </div>
      );
    } else {
      return <div>Date: {travelDate}</div>;
    }
  }

  function handleChooseSeatButton(travel_id) {
    console.log('travel_id: ', travel_id)
    setChooseSeatOpenTravelId(travel_id)
    console.log("chooseSeatOpenTravelId: ", chooseSeatOpenTravelId)
  }

  const handleSortTravels = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    // console.log("data: ", data) 
    setSortType(data["sort_type"])

  };

  async function fetchTravels() {
    try {
      let data = {
        vehicle_type: vehicleType,
        "from-location": fromLocation,
        "to-location": toLocation,
        departure_date: travelDate,
        extra_date: extraDate,
        sort_in: sortType,
      };

      axios
        .post(
          "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/findTravel",
          data
        )
        .then((response) => {
          // console.log("response.data: ", response.data); // Handle success response
          // Transform the list of lists into an array of objects
          const transformedTravels = response.data.body.searchedTravels.map(
            (travel) => ({
              travel_company_id: travel[0],
              travel_company_name: travel[1],
              travel_id: travel[2],
              departure_time: travel[3],
              arrival_time: travel[4],
              arrival_terminal_id: travel[5],
              price: travel[6],
              business_price: travel[7],
              departure_terminal_name: travel[8],
              departure_city: travel[9],
              arrival_terminal_name: travel[10],
              arrival_city: travel[11],
            })
          );
          // Set the transformed travels as the state
          setTravels(transformedTravels);
          // console.log("Travels: ", travels);
          // console.log('Type of Travels: ', typeof(travels))
        })
        .catch((error) => {
          console.error("Error:", error); // Handle error
        });
    } catch (error) {
      console.error("Error when fetching travels: ", error);
      setMessage(error);
    }
  }

  useEffect(() => {
    fetchTravels();
  }, [sortType]);

  return (
    <div>
      <Header /> {/* Render the Header component */}
      <div className="container-fluid pt-4 pb-4 upperBar">
        <div className="row">
          <div className="col-3">
            <form onSubmit={handleSortTravels} method="POST">
              <div className="row">
                <select className="form-select" name="sort_type" id="sort_type">
                  <option value="earliest_to_latest">
                    Time (earliest to latest)
                  </option>
                  <option value="latest_to_earliest">
                    Time (latest to earliest)
                  </option>
                  <option value="price_low_to_high">Price (low to high)</option>
                  <option value="price_high_to_low">Price (high to low)</option>
                </select>

                <button
                  type="submit"
                  id="sort-button"
                  className="btn btn-outline-danger"
                  // style={{ display: "none" }}
                >
                  Sort
                </button>
              </div>
            </form>
          </div>

          <div className="col-2">From: {fromLocation}</div>
          <div className="col-2">To: {toLocation}</div>
          <div className="col-3">{display_date_range()}</div>
        </div>
      </div>
      <div className="container pt-5">
        {travels.length > 0 ? (
          travels.map((singleTravel, index) => (
            <TravelCardBasic key={index} singleTravel={singleTravel} />
          ))
        ) : (
          <h2>There are no travels that match your specified limitations</h2>
        )}
      </div>
    </div>
  );
}

export default ListAvailableTravelsPage;
