import './css/App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Amplify, Auth, Cache } from 'aws-amplify';
import AddCompanyTravel from './AddCompanyTravel';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import ListAvailableTravelsPage from './ListAvailableTravelsPage';
import MyTravelsPage from './MyTravelsPage'
import UserProfile from './UserProfile';
import BalancePage from './BalancePage';
import PurchasePage from './PurchasePage';
import CouponsPage from './CouponsPage';
import CompanyProfile from './CompanyProfile';
import CompanysAllTravels from './CompanysAllTravels';
import CouponManagement from './CouponManagement';
import CreateCoupon from './CreateCoupon';
import TerminalManagement from './TerminalManagement';
import CreateTerminal from './CreateTerminal';
import VehicleManagement from './VehicleManagement';
import CreateVehicleType from './CreateVehicleType';
import Companies from './Companies';
import EditUpcomingTravel from './EditUpcomingTravel';
import ATravelDetails from './ATravelDetails';


Amplify.configure({
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: 'us-east-1_4Gw9ftr4g',
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: '2603joliv91jaa9it5rpkqj5e0',
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab', // We dont have Identity Pool
      // OPTIONAL - Set to true to use your identity pool's unauthenticated role when user is not logged in
      // allowGuestAccess: true,  // We don't allow guest users
      // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
      // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
      signUpVerificationMethod: 'code', // 'code' | 'link'
      loginWith: {
        // OPTIONAL - Hosted UI configuration
        oauth: {
          domain: 'https://gelgitapp.auth.us-east-1.amazoncognito.com',
          scopes: [
            'phone',
            'email',
            'profile',
            'openid',
            'aws.cognito.signin.user.admin'
          ],
          redirectSignIn: ['http://localhost:3000/'],
          redirectSignOut: ['http://localhost:3000/'],
          responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
        },
        email: 'true',
      }
    }
  }
});

// You can get the current config object
// const currentConfig = Amplify.getConfig();

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/addCompanyTravel" component={AddCompanyTravel} />
          <Route path="/travel/:vehicleType/from/:fromLocation/to/:toLocation/date/:travelDate/extra_date/:extraDate">
            <ListAvailableTravelsPage/>
          </Route>
          <Route path="/travel/buy/:travelId/:seatNumber">
            <PurchasePage/>
          </Route>
          <Route path="/myTravels" component={MyTravelsPage}/>-
          <Route path="/myProfile" component={UserProfile}/>
          <Route path="/myBalance" component={BalancePage}/>
          <Route path="/myCoupons" component={CouponsPage}/>
          <Route path="/companyProfile" component={CompanyProfile}/>
          <Route path="/companysAllTravels" component={CompanysAllTravels}/>
          <Route path="/couponManagement" component={CouponManagement}/>
          <Route path="/createCoupon" component={CreateCoupon}/>
          <Route path="/terminalManagement" component={TerminalManagement}/>
          <Route path="/createTerminal" component={CreateTerminal}/>
          <Route path="/vehicleManagement" component={VehicleManagement}/>
          <Route path="/createVehicleType" component={CreateVehicleType}/>
          <Route path="/companies" component={Companies}/>
          <Route path="/editUpcomingTravel" component={EditUpcomingTravel}/>
          <Route path="/travelDetails/:companyId/:travelId" component={ATravelDetails}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
