import './css/generalStyle.css';
import './css/aTravelDetails.css';

function CommentsOnATravel() {
    return (
        <div>
        


        
        </div>
    );
}

export default CommentsOnATravel;



/*

<body>

    {% if session['loggedin']  and session['userType'] == 'company' %}
    <nav class="navbar navbar-expand-sm navbar-dark customNavbar">
      <div class="container-fluid">
        <ul class="navbar-nav">
          <a class="navbar-brand" href="{{ url_for('main') }}"><strong>şu</strong>bilet.com</a>
          <li class="nav-item">
            <a class="nav-link" href="{{ url_for('main') }}">Search Travels</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="{{ url_for('companysAllTravels', upcomingOrPast = 'upcoming') }}">Company's All Travels</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="{{ url_for('addCompanyTravel', travelVehicleType = 'plane') }}">Register A Travel</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="{{ url_for('companyProfile', companyId = session['userid']) }}">Company Profile</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="{{ url_for('logout') }}">Log Out</a>
          </li>
        </ul>
      </div>
    </nav>
    {% elif session['loggedin'] and session['userType'] == 'admin' %}
    <nav class="navbar navbar-expand-sm navbar-dark customNavbar">
        <div class="container-fluid">
        <ul class="navbar-nav">
            <a class="navbar-brand" href="{{ url_for('main') }}"><strong>şu</strong>bilet.com</a>
            <li class="nav-item">
            <a class="nav-link" href="{{ url_for('main') }}">Search Travels</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="{{ url_for('companies')}}">Companies</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="{{ url_for('couponManagement') }}">Coupons</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="{{ url_for('vehicleManagement') }}">Vehicles</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="{{ url_for('terminalManagement') }}">Terminals</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="{{ url_for('reportManagement') }}">Application Report</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="{{ url_for('logout') }}">Log Out</a>
            </li>
        </ul>
        </div>
    </nav>
    {% endif %}
    
    {% if theTravel %}
        <div class="container pt-5 ">
            <h4>
                The Travel
            </h4>
            <hr>
            <div class="card bg-dark text-white">
                <div class="card-body">
                    <div class="container-fluid">
                        <div class="row">
                            
                            <div class="col">
                                <div class="row">
                                    <h6 class=" blockTitle">Departure Terminal</h6>
                                    <p class="">{{ theTravel['departure_terminal_name'] }}</p>
                                </div>
                                <div class="row">
                                    <h6 class="blockTitle">Departure Time</h6>
                                    <p class="">{{ theTravel['depart_time'] }}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="row">
                                    <h6 class="blockTitle">Arrival Terminal</h6>
                                    <p class="">{{ theTravel['arrival_terminal_name'] }}</p>
                                </div>
                                <div class="row">
                                    <h6 class="blockTitle">Arrival Time</h6>
                                    <p class="">{{ theTravel['arrival_time'] }}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="row">
                                    <h6 class="blockTitle">Vehicle Type</h6>
                                    <p class="">{{ theTravel['vehicle_type'].capitalize() }}</p>
                                </div>
                                <div class="row">
                                    <h6 class="blockTitle">Vehicle Model</h6>
                                    <p class="">{{ theTravel['vehicle_model'] }}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="row">
                                    <h6 class="blockTitle">Price</h6>
                                    <p class="">{{ theTravel['price'] }}</p>
                                </div>
                                <div class="row">
                                    <h6 class="blockTitle">Business Price</h6>
                                    {% if theTravel['business_price'] %}
                                        <p class="">{{ theTravel['business_price'] }} ₺</p>
                                    {% else %}
                                        <p>-</p>
                                    {% endif %}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {% endif %}

    {% with messages = get_flashed_messages() %}
    {% if messages %}
      <div class=flashes>
      {% for message in messages %}
        {% if message != 'Session was not valid, please log in!' %}
          <div class="container mt-5">
            <h4 class="text-danger">{{ message }}</h4>
          </div>
        {% endif %}
      {% endfor %}
      </div>
    {% endif %}
    {% endwith %}

    <div class="container pt-4 ">
        <h4> Comments </h4>
        <hr>
    </div>
    {% if allComments%}
    <div class="container ">
        {% for singleComment in allComments %}
            <div class="card bg-primary-subtle">
                <div class="card-body">
                        <div class="row "> 
                            <div class="row ">
                                <div class="col-9 ">
                                    <h5 class="text-dark">{{ singleComment['name'].capitalize() }} &nbsp {{ singleComment['surname'].capitalize() }}</h5>
                                    {% for i in range(singleComment['rating']) %}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                    </svg>
                                    {% endfor %}
                                </div>
                                {% if session['userType'] == 'admin' %}
                                <div class="col-3">
                                    <form class="row mb-2 text-decoration-none" action="{{ url_for('deleteComment', travel_id =  singleComment['travel_id'], traveler_id = singleComment['traveler_id'], company_id = companyId ) }}" method="get">
                                        <input type="hidden" name="company_id" id="company_id" value="{{ companyId }}">
                                        <button class="btn btn-secondary" >Delete</button>
                                    </form>
                                </div>
                                {% endif %}
                            </div>
                            <hr>
                            <div class="row">
                                <p>
                                    {{ singleComment['comment'] }}
                                </p>
                            </div>
                        </div>
                </div>
            </div>
        {% endfor %}
    </div>
    {% else %}
    <div class="container">
        <h5> There is no comment. </h5>
    </div>
    {% endif %}



</body>

*/