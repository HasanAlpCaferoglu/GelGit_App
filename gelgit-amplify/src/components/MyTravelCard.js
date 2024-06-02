import React from 'react';

// Define a functional component for the travel card
const MyTravelCard = ({ travelData,travelId, seatNumber, PNR, depTime, arrTime, DepTerminalName, ArrTerminalName, upcomingOrPast, commentAreaOnPNR=null, currentRating=null }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="container-fluid">
          <div className="row">
            {/* Render travel data */}
            <div className="col-3">
              <h3 className="companyTitle">{travelData.company_name}</h3>
            </div>
            <div className="col">
              <div className="row text-secondary"  style={{ textDecoration: 'underline' }}>PNR Number:</div>
              <div className="row">{travelData.PNR}</div>
            </div>
            {/* Render seat number only for upcoming travels */}
            {upcomingOrPast && (
              <div className="col-1">
                <div className="row text-secondary" style={{ textDecoration: 'underline' }}>Seat:</div>
                <div className="row">{travelData.seat_number}</div>
              </div>
            )}
            <div className="col-2">
              <div className="row text-secondary" style={{ textDecoration: 'underline' }}>Travel Date:</div>
              <div className="row">{travelData.depart_time.substr(0, 10)} -- {travelData.depart_time.substr(11, )}</div>
            </div>
            <div className="col-2">
              <div className="row text-secondary" style={{ textDecoration: 'underline' }}>Departure:</div>
              <div className="row">{travelData.departure_terminal_name}</div>
            </div>
            <div className="col-2">
              <div className="row text-secondary" style={{ textDecoration: 'underline' }}>Destination:</div>
              <div className="row">{travelData.arrival_terminal_name}</div>
            </div>
            {/* Render comment button for past travels */}
            {/* {upcomingOrPast === 'past' && (
              <div className="col-1">
                <form action="/myTravels" method="GET">
                  <input type="hidden" name="commentAreaOnAPNR" value={travelData.PNR} />
                  <input type="hidden" name="upcomingOrPast" value="past" />
                  <button
                    type="submit"
                    className={`btn ${commentAreaOnPNR === travelData.PNR ? 'disabled' : 'btn-danger'}`}
                  >
                    Comment
                  </button>
                </form>
              </div>
            )} */}
            {/* Render purchase button for upcoming travels */}
            {/* {upcomingOrPast === 'upcoming' && reservedTravels.includes(travelData.PNR) && (
              <div className="col-1">
                <form method="POST" action={`/buy_travel/${travelData.travel_id}`}>
                  <input type="hidden" name="reserve_PNR" id="reserve_PNR" value={travelData.PNR} />
                  <button className="btn btn-danger btn-lg" type="submit">
                    Purchase
                  </button>
                </form>
              </div>
            )} */}
          </div>
          {/* Render comment and rating section */}
          {/* {commentAreaOnPNR === travelData.PNR && (
            <div>
             
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default MyTravelCard;
