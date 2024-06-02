import "./css/generalStyle.css";
import "./css/companies.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";

import Navbar from "./components/Header";

function Companies() {
  const [message, setMessage] = useState("");
  const [sessionInfo, setSessionInfo] = useState({
    username: null,
    email: null,
    userType: null,
    sub: null,
    loggedin: null,
  });
  const [idTok, setIdTok] = useState(null);

  const [allCompanies, setAllCompanies] = useState([]);

  const [sortType, setSortType] = useState("sort_by_name");
  const [filterType, setFilterType] = useState("all");
  const [searchWord, setSearchWord] = useState("");

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

  const fetchCompanies = () => {
    setMessage("")
    let data = sessionInfo;
    data["sort_type"] = sortType;
    data["filter_type"] = filterType;
    data["search_word"] = searchWord;

    // data = {
    //   userid: sessionInfo.userid,
    //   loggedin: sessionInfo.loggedin,
    //   userType: sessionInfo.userType,
    //   sort_type: sortType,
    //   filter_type: filterType,
    //   search_word: searchWord,
    // };

    console.log("Before axis.post data: ", data);
    axios
      .post(
        "https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/companies",
        data,
        {
          headers: {
            Authorization: idTok,
          },
        }
      )
      .then((response) => {
        console.log("response.data: ", response.data); // Handle success response
        if (response.data.statusCode === 200) {
          console.log("response.data.body: ", response.data.body);
          setAllCompanies(response.data.body.companies);
        } else {
          if ("body" in response.data) {
            console.log(
              "response.data.body.message: ",
              response.data.body.message
            );
            setMessage(response.data.body.message);
          } else {
            setMessage(response.data.errorMessage);
          }
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
    if (sessionInfo.loggedin) {
      fetchCompanies();
    }
  }, [sortType, filterType, searchWord, message, sessionInfo, idTok]);

  function handleSortSubmit(event) {
    event.preventDefault();
    const sort_type = event.target.sort_type.value;
    setSortType(sort_type);
  }

  function handleFilterSubmit(event) {
    event.preventDefault();
    const filter_type = event.target.filter_type.value;
    setFilterType(filter_type);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const search_word = event.target.search_word.value;
    setSearchWord(search_word);
  }

  function handleValidateCompany(companyId) {
    try {
      const validateInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/validateCompany/${companyId}`;
      let data = sessionInfo;
      axios
        .post(validateInvokeURL, data, {
          headers: {
            Authorization: idTok,
          },
        })
        .then((response) => {
          if (response.data.statusCode === 200) {
            console.log(
              "response.data.body.message: ",
              response.data.body.message
            );
            console.log("validation success");
            setMessage(response.data.body.message);
          } else {
            console.log("validation failed");
            if ("body" in response.data) {
              setMessage(response.data.body.message);
              console.log("response.data: ", response.data)
            } else {
              console.log("error: ", response.data)
              setMessage("Something went wrong!");
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

  function handleDeleteCompany(companyId) {
    console.log("In handleDeleteCompany");
    try {
      const deleteInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/deleteCompany/${companyId}`;
      let data = sessionInfo;
      axios
        .post(deleteInvokeURL, data, {
          headers: {
            Authorization: idTok,
          },
        })
        .then((response) => {
          if (response.data.statusCode === 200) {
            console.log(
              "response.data.body.message: ",
              response.data.body.message
            );
            console.log("Company is deleted!");
            setMessage(response.data.body.message);
          } else {
            if ("body" in response.data) {
              console.log("response.data: ", response.data)
              setMessage(response.data.body.message);
            } else {
              console.log("response.data: ", response.data)
              setMessage("Something went wrong!");
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

  function handleDeactivateCompany(companyId) {
    console.log("In handleDeactivateCompany");
    try {
      const deleteInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/deactivateCompany/${companyId}`;
      let data = sessionInfo;
      axios
        .post(deleteInvokeURL, data, {
          headers: {
            Authorization: idTok,
          },
        })
        .then((response) => {
          if (response.data.statusCode === 200) {
            console.log(
              "response.data.body.message: ",
              response.data.body.message
            );
            console.log("Company is deactivated!");
            setMessage(response.data.body.message);
          } else {
            if ("body" in response.data) {
              setMessage(response.data.body.message);
              console.log("response.data: ", response.data)
            } else {
              setMessage("Something went wrong!");
              console.log("response.data: ", response.data)
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

  function handleActivateCompany(companyId) {
    console.log("In handleActivateCompany");
    try {
      const deleteInvokeURL = `https://34b7tnxk3e.execute-api.us-east-1.amazonaws.com/dev/activateCompany/${companyId}`;
      let data = sessionInfo;
      axios
        .post(deleteInvokeURL, data, {
          headers: {
            Authorization: idTok,
          },
        })
        .then((response) => {
          if (response.data.statusCode === 200) {
            console.log(
              "response.data.body.message: ",
              response.data.body.message
            );
            console.log("Company is activated!");
            setMessage(response.data.body.message);
          } else {
            if ("body" in response.data) {
              setMessage(response.data.body.message);
              console.log("response.data: ", response.data)
            } else {
              console.log("response.data: ", response.data)
              setMessage("Something went wrong!");
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

  return (
    <div>
      <Navbar />
      <div className="container-fluid pt-4 pb-4 upperBar">
        <div className="container">
          <div className="row mx-4">
            <div className="col-4">
              <form className="row" onSubmit={handleSortSubmit}>
                <input
                  type="hidden"
                  name="filter_type"
                  id="filter_type"
                  value={filterType}
                ></input>
                <div className="col-6">
                  <select
                    className="form-select"
                    name="sort_type"
                    id="sort_type"
                  >
                    <option
                      value="sort_by_name"
                      selected={sortType === "sort_by_name"}
                    >
                      Name
                    </option>
                    <option
                      value="validation_date_earliest_to_latest"
                      selected={
                        sortType === "validation_date_earliest_to_latest"
                      }
                    >
                      Validation date (earliest to latest)
                    </option>
                    <option
                      value="validation_date_latest_to_earliest"
                      selected={
                        sortType === "validation_date_latest_to_earliest"
                      }
                    >
                      Validation date (latest to earliest)
                    </option>
                    <option
                      value="foundation_date_earliest_to_latest"
                      selected={
                        sortType === "foundation_date_earliest_to_latest"
                      }
                    >
                      Foundation date (earliest to latest)
                    </option>
                    <option
                      value="foundation_date_latest_to_earliest"
                      selected={
                        sortType === "foundation_date_latest_to_earliest"
                      }
                    >
                      Foundation date (latest to earliest)
                    </option>
                  </select>
                </div>
                <div className="col-6">
                  <button
                    type="submit"
                    id="sort-button"
                    className="btn btn-outline-danger"
                  >
                    Sort
                  </button>
                </div>
              </form>
            </div>

            <div className="col-4">
              <form className="row" onSubmit={handleFilterSubmit}>
                <input
                  type="hidden"
                  name="sort_type"
                  id="sort_type"
                  value={sortType}
                ></input>
                <div className="col-6">
                  <select
                    className="form-select"
                    name="filter_type"
                    id="filter_type"
                  >
                    <option value="all" selected={filterType === "all"}>
                      All
                    </option>
                    <option
                      value="validated"
                      selected={filterType === "validated"}
                    >
                      Validated
                    </option>
                    <option
                      value="unvalidated"
                      selected={filterType === "unvalidated"}
                    >
                      Unvalidated
                    </option>
                    <option value="active" selected={filterType === "active"}>
                      Active
                    </option>
                    <option
                      value="inactive"
                      selected={filterType === "inactive"}
                    >
                      Inactive
                    </option>
                  </select>
                </div>
                <div className="col-6">
                  <button
                    type="submit"
                    id="filter-button"
                    className="btn btn-outline-danger"
                  >
                    Filter
                  </button>
                </div>
              </form>
            </div>

            <div className="col-4">
              <form className="row" onSubmit={handleSearchSubmit}>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    name="search_word"
                    id="search_word"
                  ></input>
                </div>
                <div className="col-6">
                  <button type="submit" className="btn btn-outline-danger">
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="alert alert-danger mt-4" role="alert">
          {message}
        </div>
      )}

      <div className="container pt-4 mx-4">
        <h4> Companies </h4>
        <hr />
      </div>

      <div className="container mt-2">
        {allCompanies.length > 0 ? (
          allCompanies.map((singleCompany, index) => (
            <div
              className="card card-person bg-secondary text-white "
              key={index}
            >
              <div className="card-body">
                <div className="container-fluid">
                  <div className="row align-items-start">
                    <div className="col">
                      <div className="row">
                        <h6 className=" blockTitle">Company Name</h6>
                        <p className="">{singleCompany["company_name"]}</p>
                      </div>
                      <div className="row">
                        <h6 className="blockTitle">Email</h6>
                        <p className="">{singleCompany["email"]}</p>
                      </div>
                    </div>

                    <div className="col">
                      <div className="row">
                        <h6 className="blockTitle">Phone</h6>
                        <p className="">{singleCompany["phone"]}</p>
                      </div>
                      <div className="row">
                        <h6 className="blockTitle">Website</h6>
                        <p className="">{singleCompany["website"]}</p>
                      </div>
                    </div>

                    <div className="col">
                      <div className="row">
                        <h6 className="blockTitle">Foundation Date</h6>
                        <p className="">{singleCompany["foundation_date"]}</p>
                      </div>
                      <div className="row">
                        <h6 className="blockTitle">Status</h6>
                        {singleCompany["active"] ? (
                          <p>Active</p>
                        ) : (
                          <p>Inactive</p>
                        )}
                      </div>
                    </div>

                    <div className="col">
                      <div className="row">
                        <h6 className="blockTitle">Validator Username</h6>
                        {singleCompany["admin_username"] ? (
                          <p className="">{singleCompany["admin_username"]}</p>
                        ) : (
                          <p>-</p>
                        )}
                      </div>
                      <div className="row">
                        <h6 className="blockTitle">Validation Date</h6>
                        {singleCompany["validation_date"] ? (
                          <p className="">{singleCompany["validation_date"]}</p>
                        ) : (
                          <p>-</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-start">
                    <h6 className="blockTitle">About Company</h6>
                    <p className="">{singleCompany["about"]}</p>
                  </div>

                  <div className="row align-items-start mt-4">
                    {singleCompany["validation_date"] &&
                      (singleCompany["is_active"] ? (
                        <button
                          onClick={() => {
                            handleDeactivateCompany(
                              singleCompany["company_id"]
                            );
                          }}
                          className="btn btn-danger mb-2 text-decoration-none"
                        >
                          Deactivate Company
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleActivateCompany(singleCompany["company_id"]);
                          }}
                          className="btn btn-warning  mb-2 text-decoration-none"
                        >
                          Activate Company
                        </button>
                      ))}

                    {!singleCompany["validation_date"] && (
                      <button
                        onClick={() => {
                          handleValidateCompany(singleCompany["company_id"]);
                        }}
                        className="btn btn-info  mb-2 text-decoration-none"
                      >
                        Validate Company
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleDeleteCompany(singleCompany["company_id"]);
                      }}
                      className="btn btn-danger  mb-2 text-decoration-none"
                    >
                      Delete Company
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="container ">
            <h5> There is no company. </h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default Companies;
