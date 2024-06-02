import "./css/generalStyle.css";
import "./css/balancePage.css";
import React, { useState, useEffect } from "react";
import {
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";

import Navbar from "./components/Header";
import axios from "axios";

function formatCardNo(cardNumber) {
  // Formats the card no as XXXX-XXXX-XX... as it is being written
  if (!cardNumber) return ""; // Handle cases where input is undefined or null

  cardNumber = cardNumber.replace(/\D/g, "");

  if (cardNumber.length > 4) {
    cardNumber = cardNumber.match(/.{1,4}/g).join("-");
  }

  return cardNumber;
}

function formatCardExpiryDate(input) {
  // Formats the input as "MM/YY" as it is being written
  if (!input) return ""; // Handle cases where input is undefined or null
  console.log(input.value);
  input = input.value.replace(/\D/g, "");

  if (input.length > 2) {
    input = input.match(/.{1,2}/g).join("/");
  }
  console.log(input);
  return input;
}

function BalancePage() {
  const [balance, setBalance] = useState(0.0);

  const [sessionInfo, setSessionInfo] = useState({
    username: null,
    email: null,
    userType: null,
    sub: null,
    loggedin: null,
  });
  const [idTok, setIdTok] = useState(null);

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

  async function fetchUserBalance() {
    try {
      let data = sessionInfo;
    //   console.log("data before request: ", data);
    //   console.log("idTok before request: ", idTok)
      axios
        .post(
          "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/balance",
          data,
          {
            headers: {
              "Authorization": idTok,
            },
          }
        )
        .then((response) => {
          console.log("response.data: ", response.data);
          const userInformation = response.data.body;
          console.log("userInformation: ", userInformation);
          console.log(
            "userInformation['user_balance']: ",
            userInformation["user_balance"]
          );
          setBalance(userInformation["user_balance"]);
        })
        .catch((error) => {
          console.error("Error:", error); // Handle error
        });
    } catch (error) {
      console.lerror("Error when fetching balance: ", error);
      setMessage(error);
    }
  }

  const handleUpdateBalance = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = sessionInfo;

    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log("data: ", data);

    axios
      .post(
        "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/updateBalance",
        data,
        {
          headers: {
            "Authorization": idTok,
          },
        }
      )
      .then((response) => {
        console.log("response.data: ", response.data); // Handle success response
        console.log("response.data.body.message: ", response.data.body.message);
        setMessage(response.data.body.message);
        if (response.data.statusCode === 200) {
          setMessage("Balance updated sucessfully!");
          fetchUserBalance();
        } else {
          setMessage("Couln't update balance!");
        }
      })
      .catch((error) => {
        console.error("Error:", error); // Handle error
      });
  };

  useEffect(() => {
    getCurrentSession();
    handleFetchUserAttributes();
  }, []); // Run only once on component mount to fetch user attributes

  useEffect(() => {
    if (sessionInfo.email) {
      // Only fetch balance if email is available
      fetchUserBalance();
    }
  }, [sessionInfo, idTok]); // Run whenever sessionInfo changes

  return (
    <div>
      <Navbar />
      <div class="container mt-4 col-8 text-white">
        <div class="card bg-secondary">
          <div class="card-header">
            <div class="card-title">Balance</div>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2 col-8 mx-auto">
              <div class="row">
                <div class="col">
                  <h1>Current Balance: </h1>
                </div>
                <div class="col">
                  <div
                    class="card bg-danger text-white text-center"
                    style={{ fontSize: "30px" }}
                  >
                    {balance} ₺
                  </div>
                </div>
              </div>

              <hr />

              <h5 class="almost-red-header">Add money to balance: </h5>

              <div class="row">
                <div class="col">
                  <label for="name-surname">
                    Name and surname on the card:
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="name-surname"
                    name="name-surname"
                    placeholder="Name Surname"
                  ></input>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <label for="card-no">Card number:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="card-no"
                    name="card-no"
                    maxlength="19"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    onKeyUp={(event) => {
                      const formattedValue = formatCardNo(event.target.value);
                      event.target.value = formattedValue;
                    }}
                  />
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <label for="exp-date">Expiration date:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="exp-date"
                    name="exp-date"
                    maxlength="5"
                    placeholder="MM/YY"
                    onKeyUp={(event) => {
                      const formattedExpValue = formatCardExpiryDate(
                        event.target
                      );
                      event.target.value = formattedExpValue;
                    }}
                  ></input>
                </div>

                <div class="col">
                  <label for="cvv">CVV (the 3 digits behind your card):</label>
                  <input
                    type="text"
                    class="form-control"
                    id="cvv"
                    name="cvv"
                    placeholder="CVV"
                    maxlength="3"
                  ></input>
                </div>
              </div>

              <form method="post" onSubmit={handleUpdateBalance}>
                <div class="d-grid gap-2 mx-auto">
                  <label for="amount">Amount to add:</label>
                  <input
                    type="number"
                    class="form-control"
                    id="amount"
                    name="amount"
                  ></input>
                  <button type="submit" class="btn mt-4 btn-danger btn-lg">
                    Add Money
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BalancePage;
