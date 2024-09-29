import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Accounts.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Accounts = () => {
  // Function variables
  const [isEditAccountVisible, setIsEditAccountVisible] = useState(false);
  const [isEditAccountActiveVisible, setIsEditAccountActiveVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountDescription, setAccountDescription] = useState("");
  const [normalSide, setNormalSide] = useState("");
  const [accountCatagory, setAccountCatagory] = useState("");
  const [accountSubcatagory, setAccountSubcatagory] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [debit, setDebit] = useState("");
  const [credit, setCredit] = useState("");
  const [balance, setBalance] = useState("");
  const [dateAccountAdded, setDateAccountAdded] = useState("");
  const [userID, setUserID] = useState("");
  const [order, setOrder] = useState("");
  const [statement, setStatement] = useState("");
  const [comment, setComment] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [changeIsActive, setChangeIsActive] = useState(false);
  const [accountArray, setAccountArray] = useState([]);
  const [accountTable, setAccountTable] = useState(1);
  const API_URL = process.env.REACT_APP_API_URL;
  const [storedUserName, setStoredUserName] = useState("");
  const navigate = useNavigate();
  const CustomCloseButton = ({ closeToast }) => (
    <button
        onClick={closeToast}
        style={{ color: "white", background: "transparent", border: "none", fontSize: "16px" }}
    >
        X
    </button>
  );

  useEffect(() => {
    // Retrieve the user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // If user is not logged in, redirect to login
    if (!storedUser) {
        navigate("/", { replace: true });
    }

    // Ensure that the user has the proper role to view this page
    if (storedUser.role !== "Admin") {
        navigate("/dashboard", { replace: true });
    }

    // If all other checks are met, get the storedUser's username
    if (storedUser) {
        setStoredUserName(storedUser.username);
    }
  });

  // Fetch accounts from the database
  useEffect(() => {
    // Get all accounts from database
    const fetchAccounts = async () => {
        try {
            const response = await fetch(`${API_URL}/accounts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Gather the result
            const result = await response.json();

            // Handle result
            if (response.ok) {
                setAccountArray(result);
            } else {
                alert("Failed to retrieve accounts!");
            }
        } catch (error) {
            alert("An error occured. Failed to retrieve account!");
        }
    };

    fetchAccounts();

    // Show toast message if present in localStorage
    const toastMessage = localStorage.getItem("toastMessage");
    if (toastMessage !== null) {
        // Show toast message
        toast(toastMessage, {
            style: {
                backgroundColor: "#333",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
            },
            progressStyle: {
                backgroundColor: "#2196f3", // Solid blue color for progress bar
                backgroundImage: "none",
            },
            closeButton: <CustomCloseButton />,
        });

        // Delay removal of the message from localStorage
        setTimeout(() => {
            localStorage.removeItem("toastMessage");
        }, 500); // Delay by 500ms (can be adjusted as needed)
    }

    const accountCreationResult = localStorage.getItem("accountCreated");
    if (accountCreationResult) {
        toast("New Account created!", {
            style: {
                backgroundColor: "#333",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
            },
            progressStyle: {
                backgroundColor: "#2196f3", // Solid blue color for progress bar
                backgroundImage: "none",
            },
            closeButton: <CustomCloseButton />,
        });
        setTimeout(() => {
            localStorage.removeItem("accountCreated");
        }, 500);
    }
  }, [API_URL]);

  // Handle the switch between tables
  const handleChangeTable = (event) => {
    if (accountTable === 1) {
        setAccountTable(2);
        event.target.innerHTML = "Back";
    } else {
        setAccountTable(1);
        event.target.innerHTML = "Requests";
    }
  };

  // Handle the input changes from editing the account
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "accountName") {
        setAccountName(value);
    } else if (name === "accountNumber") {
      setAccountNumber(value);
    } else if (name === "accountDescription") {
      setAccountDescription(value);
    } else if (name === "normalSide") {
      setNormalSide(value);
    } else if (name === "accountCatagory") {
      setAccountCatagory(value);
    } else if (name === "accountSubcatagory") {
      setAccountSubcatagory(value);
    } else if (name === "initialBalance") {
      setInitialBalance(value);
    } else if (name === "debit") {
      setDebit(value);
    } else if (name === "credit") {
      setCredit(value);
    } else if (name === "balance") {
      setBalance(value);
    } else if (name === "dateAccountAdded") {
      setDateAccountAdded(value);
    } else if (name === "userID") {
      setUserID(value);
    } else if (name === "order") {
      setOrder(value);
    } else if (name === "statement") {
      setStatement(value);
    } else if (name === "comment") {
      setComment(value);
    } else if (name === "isActive") {
      setIsActive(value === "true");
      setChangeIsActive(true);
    }
  };

  const handleEditAccount = async () => {

    const editAccountData = {
      accountName,
      accountNumber,
      accountDescription,
      normalSide,
      accountCatagory,
      accountSubcatagory,
      initialBalance,
      debit,
      credit,
      balance,
      dateAccountAdded,
      userID,
      order,
      statement,
      comment,
      isActive
    };

    try {
        const response = await fetch(`${API_URL}/accounts/edit-account`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editAccountData),
        });

        const result = await response.json();

        //Store message locally to deliver on page reload
        localStorage.setItem("toastMessage", result.message);
    } catch (error) {
        console.error("Error submitting edit:", error);
        alert("An error occurred. Please try again.");
    }

    setIsEditAccountVisible(false);
    window.location.reload();
  };

  // Specifically handling the change of a account's active status
  const handleChangeIsActive = async () => {
    // Handle active status change if applicable
    if (changeIsActive) {
        const accountData = {
            accountName: selectedAccount.accountName,
            isActive: active,
        };

        try {
            const response = await fetch(`${API_URL}/accounts/active`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            //Store message locally to deliver on page reload
            localStorage.setItem("toastMessage", result.message);
        } catch (error) {
            console.error("Error submitting edit:", error);
            alert("An error occurred. Please try again.");
        }
        setIsEditAccountVisible(false);
        window.location.reload();
    } else {
        toast("No new active status chosen!", {
            style: {
                backgroundColor: "#333",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
            },
            progressStyle: {
                backgroundColor: "#2196f3", // Solid blue color for progress bar
                backgroundImage: "none",
            },
            closeButton: <CustomCloseButton />,
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("account"); // Clear account data
    navigate("/"); // Redirect to login
  };

  const content = (
    <section className="users">
        <ToastContainer />
        <aside className="sidebar">
            <div className="app-logo">
                <img className="logo" src="/ledgerlifelinelogo.png" alt="LedgerLifeline Logo" />
            </div>
            <ul className="sidebar-btns">
                <Link className="sidebar-button" id="dashboard-link" to="/dashboard">
                    Dashboard
                </Link>
                <Link className="sidebar-button" id="chart-of-accounts-link" to="/chart-of-accounts">
                    Chart of Accounts
                </Link>
                <Link className="sidebar-button" id="accounts-link" to="/accouunts">
                    Accounts
                </Link>
                <Link className="sidebar-button" id="users-link" to="/users">
                    Users
                </Link>
                <Link className="sidebar-button" id="event-log-link">
                    Event Log
                </Link>
            </ul>
        </aside>

        <main className="main-content">
            <header className="user-profile">
                <span className="profile-name">{storedUserName}</span>
                <img className="pfp" src="/Default_pfp.svg.png" alt="LedgerLifeline Logo" />
                <a>
                    <button className="sidebar-button logout-link" onClick={handleLogout}>
                        Logout
                    </button>
                </a>
            </header>
            <header className="header">
                <div className="header-main">
                    <h1 className="header-title">Accounts</h1>
                    <Link className="action-button1" to="/addAccount">
                        + Add Account
                    </Link>
                </div>
                <div className="header-search">
                    <input type="text" className="search" placeholder="Search"></input>
                    <button className="search-btn">Search</button>
                </div>
            </header>

            {/* Main Account Table */}
            {accountTable === 1 && (
                <table className="account-table">
                    <thead>
                        <tr>
                            <th>Account Number</th>
                            <th>Name</th>           {/*name of the account (cash, accounts receivable, etc.)*/}
                            <th>Type</th>           {/*type of the account (asset, liability, equity, et.)*/}
                            <th>Term</th>           {/*current/long term*/}
                            <th>Balance</th>        {/*account balance*/}
                            <th>Created By</th>     {/*name of the admin's username*/}
                            <th>Date Created</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>

                      {/*THIS IS NOT CORRECT*/}
                        {accountArray
                            .filter((account) => account.accountNumber !== "")
                            .map((account, index) => (
                                <tr key={index}>
                                    <td id="accountNumber">
                                        <button
                                            className="link-button"
                                            onClick={() => {
                                                setSelectedAccount(account);
                                                setAccountNumber(account.accountNumber);
                                                setAccountName(account.accountName);
                                                setAccountDescription(account.accountDescription);
                                                setNormalSide(account.normalSide)
                                                setAccountCatagory(account.accountCatagory);
                                                setAccountSubcatagory(account.accountSubcatagory);
                                                setInitialBalance(account.initialBalance);
                                                setDebit(account.debit);
                                                setCredit(account.credit);
                                                setBalance(account.balance);
                                                setDateAccountAdded(account.dateAccountAdded);
                                                setUserID(account.UserID);
                                                setOrder(account.order);
                                                setStatement(account.statement);
                                                setComment(account.comment);
                                                setIsActive(account.isActive);

                                                setIsEditAccountVisible(true);
                                            }}
                                        >
                                            {account.accountNumber}
                                        </button>
                                    </td>
                                    <td>
                                        <Link
                                            className="account-active-link"
                                            onClick={() => {
                                                setSelectedAcocunt(account);
                                                setIsActive(account.isActive);
                                                setIsEditAccountActiveVisible(true);
                                            }}
                                        >
                                            {account.isActive ? "Active" : "Inactive"}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
            {/* Account Creation Request Table */}
            {accountTable === 2 && (
                <table className="account-table">
                    <thead>
                        <tr>
                            <th>Account Number</th>
                            <th>Name</th>           {/*name of the account (cash, accounts receivable, etc.)*/}
                            <th>Type</th>           {/*type of the account (asset, liability, equity, et.)*/}
                            <th>Term</th>           {/*current/long term*/}
                            <th>Balance</th>        {/*account balance*/}
                            <th>Created By</th>     {/*name of the admin's username*/}
                            <th>Date Created</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountArray
                            .filter((account) => account.accountNumber !== "")
                            .map((account, index) => (
                                <tr key={index}>
                                    <td id="accountNumber">
                                        <button
                                            className="link-button"
                                            onClick={() => {
                                                setSelectedAccount(account);
                                                setIsEditAccountVisible(true);
                                            }}
                                        >
                                            {account.accountNumber}
                                        </button>
                                    </td>
                                    <td>{account.isActive ? "Active" : "Inactive"}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}

            {/* Edit Account Modal */}
            {isEditAccountVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsEditAccountVisible(false)}>
                            &times;
                        </span>
                        <h2>Edit Account</h2>
                        <form>
                            <label>
                                Account Name:
                                <input
                                    type="text"
                                    id="accountName"
                                    name="accountName"
                                    value={accountName}
                                    onChange={handleInputChange}
                                    placeholder="Account Name"
                                />
                            </label>
                            <label>
                                Account Number:
                                <input
                                    type="text"
                                    id="accountNumber"
                                    name="accountNumber"
                                    value={accountNumber}
                                    onChange={handleInputChange}
                                    placeholder="Account Number"
                                />
                            </label>
                            <label>
                                Account Desciption:
                                <input
                                    type="text"
                                    id="accountDescription"
                                    name="accountDescription"
                                    value={accountDescription}
                                    onChange={handleInputChange}
                                    placeholder="Account Description"
                                />
                            </label>
                            <label>
                                Normal Side:
                                <input
                                    type="text"
                                    id="normalSide"
                                    name="normalSide"
                                    value={normalSide}
                                    onChange={handleInputChange}
                                    placeholder="Normal Side"
                                />
                            </label>
                            <label>
                                Account Catagory:
                                <input
                                    type="text"
                                    id="accountCatagory"
                                    name="accountCatagory"
                                    value={accountCatagory}
                                    onChange={handleInputChange}
                                    placeholder="Account Catagory"
                                />
                            </label>
                            <label>
                                Account Subcatagory:
                                <input
                                    type="text"
                                    id="accountSubcatagory"
                                    name="accountSubcatagory"
                                    value={accountSubcatagory}
                                    onChange={handleInputChange}
                                    placeholder="Account Subcatagory"
                                />
                            </label>
                            <label>
                                Initial Balance:
                                <input
                                    type="text"
                                    id="initialBalance"
                                    name="initialBalance"
                                    value={initialBalance}
                                    onChange={handleInputChange}
                                    placeholder="Initial Balance"
                                />
                            </label>
                            <label>
                                Debit:
                                <input
                                    type="text"
                                    id="debit"
                                    name="debit"
                                    value={debit}
                                    onChange={handleInputChange}
                                    placeholder="Debit"
                                />
                            </label>
                            <label>
                                Credit:
                                <input
                                    type="text"
                                    id="credit"
                                    name="credit"
                                    value={credit}
                                    onChange={handleInputChange}
                                    placeholder="Credit"
                                />
                            </label>
                            <label>
                                Balance:
                                <input
                                    type="text"
                                    id="balance"
                                    name="balance"
                                    value={balance}
                                    onChange={handleInputChange}
                                    placeholder="Balance"
                                />
                            </label>
                            <label>
                                Date Account Added:
                                <input
                                    type="text"
                                    id="dateAccountAddedn"
                                    name="dateAccountAdded"
                                    value={dateAccountAdded}
                                    onChange={handleInputChange}
                                    placeholder="Date Account Added"
                                />
                            </label>
                            <label>
                                User ID:
                                <input
                                    type="text"
                                    id="userID"
                                    name="userID"
                                    value={userID}
                                    onChange={handleInputChange}
                                    placeholder="User ID"
                                />
                            </label>
                            <label>
                                Order:
                                <input
                                    type="text"
                                    id="order"
                                    name="order"
                                    value={order}
                                    onChange={handleInputChange}
                                    placeholder="Order"
                                />
                            </label>
                            <label>
                                Statement:
                                <input
                                    type="text"
                                    id="statement"
                                    name="statement"
                                    value={statement}
                                    onChange={handleInputChange}
                                    placeholder="Statement"
                                />
                            </label>
                            <label>
                                Comment:
                                <input
                                    type="text"
                                    id="comment"
                                    name="comment"
                                    value={accountDescription}
                                    onChange={handleInputChange}
                                    placeholder="comment"
                                />
                            </label> 
                        </form>
                        <div className="modal-btns">
                            <button
                                type="button"
                                className="action-button2"
                                onClick={handleEditAccount}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Account Active Status Modal */}
            {isEditAccountActiveVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span
                            className="close"
                            onClick={() => setIsEditAccountActiveVisible(false)}
                        >
                            &times;
                        </span>
                        <h2>Edit Account's Active Status</h2>
                        <form>
                            <h3 className="form-sub-title">
                                Account:{" "}
                                <p className="name">
                                    {selectedAccount.accountName} {selectedAccount.AccountNumber}
                                </p>
                            </h3>
                            <label>
                                Active:
                                <select
                                    id="active"
                                    name="active"
                                    value={active ? "true" : "false"}
                                    onChange={handleChangeIsActive}
                                >
                                    <option value="" disabled>
                                        Select status
                                    </option>
                                    <option value="true">Active</option>
                                    <option value="false">Not Active</option>
                                </select>
                            </label>
                        </form>
                        <div className="modal-btns">
                            <button
                                type="button"
                                className="action-button2"
                                onClick={handleChangeIsActive}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    </section>
  );
  return content;
};

export default Accounts;