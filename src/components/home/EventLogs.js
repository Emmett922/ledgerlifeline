import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/EventLogs.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventLogs = () => {
    const navigate = useNavigate();
    const [storedUserName, setStoredUserName] = useState("");
    const [searchQuery, setSearchQuery] = useState([]);
    const [loginAttempts, setLoginAttempts] = useState([]);
    const [userUpdateArray, setUserUpdateArray] = useState([]);
    const [accountUpdateArray, setAccountUpdateArray] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const API_URL = process.env.REACT_APP_API_URL;

    const CustomCloseButton = ({ closeToast }) => (
        <button
            onClick={closeToast}
            style={{ color: "white", background: "transparent", border: "none", fontSize: "16px" }}
        >
            X
        </button>
    );

    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user data
        navigate("/"); // Redirect to login
    };

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

    // Fetch login attemtps
    useEffect(() => {
        // Get all login attempts
        const fetchLoginAttempts = async () => {
            try {
                const response = await fetch(`${API_URL}/event-logs/login-attempts`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // Gather the result
                const result = await response.json();

                // Handle result
                if (response.ok) {
                    setLoginAttempts(result);
                } else {
                    toast(`${result.message}`, {
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
            } catch (error) {
                console.error(error);
                toast("An error occured. Failed to retrieve login attempts!", {
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
        fetchLoginAttempts();
    }, [API_URL]);

    // Fetch user updates
    useEffect(() => {
        // Get all user updates
        const fetchUserUpdates = async () => {
            try {
                const response = await fetch(`${API_URL}/event-logs/user-updates`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // Gather the result
                const result = await response.json();

                // Handle result
                if (response.ok) {
                    setUserUpdateArray(result);
                } else {
                    toast(`${result.message}`, {
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
            } catch (error) {
                console.error(error);
                toast("An error occured. Failed to retrieve users!", {
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
        fetchUserUpdates();
    }, [API_URL]);

    // Fetch account updates
    useEffect(() => {
        // Get all account updates
        const fetchAccountUpdates = async () => {
            try {
                const response = await fetch(`${API_URL}/event-logs/account-updates`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // Gather the result
                const result = await response.json();

                // Handle result
                if (response.ok) {
                    setAccountUpdateArray(result);
                } else {
                    // Show toast message
                    toast(`${result.message}`, {
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
            } catch (error) {
                console.error(error);
                toast("An error occured. Failed to retrieve accounts!", {
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
        fetchAccountUpdates();
    }, [API_URL]);

    // Search Account Updates function
    const handleSearch1 = (query) => {
        const searchString = query && typeof query === "string" ? query.toLowerCase() : "";

        const searchTerms = searchString.split(/[\s,]+/);

        return accountUpdateArray.filter((update) => {
            const accountUpdatedDate = new Date(update.createdAt);
            const accountUpdateDateString = accountUpdatedDate.toISOString().split("T")[0];

            const fromDateString = fromDate ? new Date(fromDate).toISOString().split("T")[0] : null;
            const toDateString = toDate ? new Date(toDate).toISOString().split("T")[0] : null;

            const isWithinDateRange = (() => {
                if (!fromDateString && !toDateString) return true;

                if (fromDateString && toDateString) {
                    // Include accounts created between fromDate and toDate (inclusive)
                    return (
                        accountUpdateDateString >= fromDateString &&
                        accountUpdateDateString <= toDateString
                    );
                } else if (fromDateString) {
                    // Include accounts created on or after fromDate
                    return accountUpdateDateString >= fromDateString;
                } else if (toDateString) {
                    // Include accounts created on or before toDate
                    return accountUpdateDateString <= toDateString;
                }
                return true;
            })();

            return searchTerms.every(
                (term) =>
                    update.accountNumber.toString().includes(term) ||
                    update.accountName.toLowerCase().includes(term)
            );
        });
    };

    const filteredAccounts = handleSearch1(searchQuery);

    // Function to render the changes made to an account
    const renderAccountFieldChanges = (update, prevUpdate) => {
        const changes = [];

        // Compare accountNumber
        if (update.accountNumber !== prevUpdate.accountNumber) {
            changes.push({
                field: "Account Number",
                from: prevUpdate.accountNumber || "None",
                to: update.accountNumber || "None",
            });
        }

        // Compare accountName
        if (update.accountName !== prevUpdate.accountName) {
            changes.push({
                field: "Account Name",
                from: prevUpdate.accountName || "None",
                to: update.accountName || "None",
            });
        }

        // Compare accountDescription
        if (update.accountDescription !== prevUpdate.accountDescription) {
            changes.push({
                field: "Account Description",
                from: prevUpdate.accountDescription || "None",
                to: update.accountDescription || "None",
            });
        }

        // Compare normalSide
        if (update.normalSide !== prevUpdate.normalSide) {
            changes.push({
                field: "Normal Side",
                from: prevUpdate.normalSide || "None",
                to: update.normalSide || "None",
            });
        }

        // Compare accountCatagory
        if (update.accountCatagory !== prevUpdate.accountCatagory) {
            changes.push({
                field: "Account Category",
                from: prevUpdate.accountCatagory || "None",
                to: update.accountCatagory || "None",
            });
        }

        // Compare accountSubCatagory
        if (update.accountSubCatagory !== prevUpdate.accountSubCatagory) {
            changes.push({
                field: "Account Subcategory",
                from: prevUpdate.accountSubCatagory || "None",
                to: update.accountSubCatagory || "None",
            });
        }

        // Compare balance
        if (update.balance !== prevUpdate.balance) {
            changes.push({
                field: "Account Balance",
                from: prevUpdate.balance || "None",
                to: update.balance || "None",
            });
        }

        // Compare debit
        if (update.debit !== prevUpdate.debit) {
            changes.push({
                field: "Account Debit",
                from: prevUpdate.debit || "None",
                to: update.debit || "None",
            });
        }

        // Compare credit
        if (update.credit !== prevUpdate.credit) {
            changes.push({
                field: "Account Category",
                from: prevUpdate.credit || "None",
                to: update.credit || "None",
            });
        }

        // Compare order
        if (update.order !== prevUpdate.order) {
            changes.push({
                field: "Account Order",
                from: prevUpdate.order || "None",
                to: update.order || "None",
            });
        }

        // Compare statement
        if (update.statement !== prevUpdate.statement) {
            changes.push({
                field: "Account Statement",
                from: prevUpdate.statement || "None",
                to: update.statement || "None",
            });
        }

        // Compare comment
        if (update.comment !== prevUpdate.comment) {
            changes.push({
                field: "Account Comment",
                from: prevUpdate.comment || "None",
                to: update.comment || "None",
            });
        }

        // Compare isActive
        if (update.isActive !== prevUpdate.isActive) {
            changes.push({
                field: "Account Active Status",
                from: prevUpdate.isActive ? "Active" : "Inactive" || "None",
                to: update.isActive ? "Active" : "Inactive" || "None",
            });
        }

        return changes;
    };

    // Function to render the changes made to an account
    const renderUserFieldChanges = (update, prevUpdate) => {
        const changes = [];

        // Compare username
        if (update.username !== prevUpdate.username) {
            changes.push({
                field: "Username",
                from: prevUpdate.username || "None",
                to: update.username || "None",
            });
        }

        // Compare password
        if (update.password !== prevUpdate.password) {
            changes.push({
                field: "Password",
                from: prevUpdate.password || "None",
                to: update.password || "None",
            });
        }

        // Compare first_name
        if (update.first_name !== prevUpdate.first_name) {
            changes.push({
                field: "First Name",
                from: prevUpdate.first_name || "None",
                to: update.first_name || "None",
            });
        }

        // Compare last_name
        if (update.last_name !== prevUpdate.last_name) {
            changes.push({
                field: "Last Name",
                from: prevUpdate.last_name || "None",
                to: update.last_name || "None",
            });
        }

        // Compare email
        if (update.email !== prevUpdate.email) {
            changes.push({
                field: "Email",
                from: prevUpdate.email || "None",
                to: update.email || "None",
            });
        }

        // Compare address object and its nested fields
        if (update.address || prevUpdate.address) {
            // Compare street
            if (update.address?.street !== prevUpdate.address?.street) {
                changes.push({
                    field: "Street",
                    from: prevUpdate.address?.street || "None",
                    to: update.address?.street || "None",
                });
            }
            // Compare city
            if (update.address?.city !== prevUpdate.address?.city) {
                changes.push({
                    field: "City",
                    from: prevUpdate.address?.city || "None",
                    to: update.address?.city || "None",
                });
            }
            // Compare state
            if (update.address?.state !== prevUpdate.address?.state) {
                changes.push({
                    field: "State",
                    from: prevUpdate.address?.state || "None",
                    to: update.address?.state || "None",
                });
            }
            // Compare postal code
            if (update.address?.postal_code !== prevUpdate.address?.postal_code) {
                changes.push({
                    field: "Postal Code",
                    from: prevUpdate.address?.postal_code || "None",
                    to: update.address?.postal_code || "None",
                });
            }
        }

        // Compare dob
        if (update.dob !== prevUpdate.dob) {
            changes.push({
                field: "Date of Birth",
                from: prevUpdate.dob || "None",
                to: update.dob || "None",
            });
        }

        // Compare securityQuestion object and its nested fields
        if (update.securityQuestion || prevUpdate.securityQuestion) {
            // Compare security question text
            if (update.securityQuestion?.question !== prevUpdate.securityQuestion?.question) {
                changes.push({
                    field: "Security Question Text",
                    from: prevUpdate.securityQuestion?.question || "None",
                    to: update.securityQuestion?.question || "None",
                });
            }
            // Compare security answer
            if (update.securityQuestion?.answer !== prevUpdate.securityQuestion?.answer) {
                changes.push({
                    field: "Security Question Answer",
                    from: prevUpdate.securityQuestion?.answer || "None",
                    to: update.securityQuestion?.answer || "None",
                });
            }
        }

        // Compare role
        if (update.role !== prevUpdate.role) {
            changes.push({
                field: "Role",
                from: prevUpdate.role || "None",
                to: update.role || "None",
            });
        }

        // Compare active
        if (update.active !== prevUpdate.active) {
            changes.push({
                field: "Active Status",
                from: prevUpdate.active ? "Active" : "Inactive" || "None",
                to: update.active ? "Active" : "Inactive" || "None",
            });
        }

        // Compare suspended object and its nested fields
        if (update.suspended || prevUpdate.suspended) {
            // Compare suspension start date
            if (update.suspended?.start_date !== prevUpdate.suspended?.start_date) {
                changes.push({
                    field: "Suspension Start Date",
                    from: prevUpdate.suspended?.start_date || "None",
                    to: update.suspended?.start_date || "None",
                });
            }

            // Compare suspension end date
            if (update.suspended?.end_date !== prevUpdate.suspended?.end_date) {
                changes.push({
                    field: "Suspension End Date",
                    from: prevUpdate.suspended?.end_date || "None",
                    to: update.suspended?.end_date || "None",
                });
            }
        }

        return changes;
    };

    const content = (
        <section className="eventLogs">
            <ToastContainer />
            <aside className="sidebar">
                <div className="app-logo">
                    <img className="logo" src="/ledgerlifelinelogo.png" alt="LedgerLifeline Logo" />
                </div>
                <ul className="sidebar-btns">
                    <Link className="sidebar-button" id="dashboard-link" title="Dashboard Page Link" to="/dashboard">
                        Dashboard
                    </Link>
                    <Link
                        className="sidebar-button"
                        id="chart-of-accounts-link"
                        title="Chart of Accounts Page Link"
                        to="/chart-of-accounts"
                    >
                        Chart of Accounts
                    </Link>
                    <Link className="sidebar-button" id="accounts-link" title="Accounts Page Link" to="/accounts">
                        Accounts
                    </Link>
                    <Link className="sidebar-button" id="users-link" title="Users Page Link" to="/users">
                        Users
                    </Link>
                    <Link className="sidebar-button" id="event-log-link" title="Event Logs Page Link" to="/event-logs">
                        Event Logs
                    </Link>
                </ul>
                <div className="help-btn">
                        <Link
                            type="help-button"
                            id="help-link"
                            title="Help Page Link"
                            to="/help"
                        >
                            <img className="pfp2" src="/question2.png" alt="LedgerLifeline Logo"/>
                        </Link>
                    </div>
            </aside>

            <main className="main-content">
                <header className="header">
                    <div className="header-main">
                        <h1 className="header-title">Event Logs</h1>
                    </div>
                    <div className="user-profile">
                        <img className="pfp" src="/Default_pfp.svg.png" alt="LedgerLifeline Logo" />
                        <span className="profile-name">{storedUserName}</span>
                        <a>
                            <button className="action-button1" title="Logout of Appliction" onClick={handleLogout}>
                                Logout
                            </button>
                        </a>
                    </div>
                </header>

                <div className="table-filter">
                    <div className="date-filter">
                        From:
                        <input
                            type="date"
                            id="from"
                            name="from"
                            title="Starting date range"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                        To:
                        <input
                            type="date"
                            id="to"
                            name="to"
                            title="Ending date range"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    <div className="search-filter">
                        <input
                            type="text"
                            className="search"
                            title="Search the event logs"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="tab-container">
                    <div
                        className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                        title="Show account updates log"
                        onClick={() => toggleTab(1)}
                    >
                        Accounts Log
                    </div>

                    <div
                        className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                        title="Show user updates log"
                        onClick={() => toggleTab(2)}
                    >
                        Users Log
                    </div>

                    <div
                        className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
                        title="Show login attempts log"
                        onClick={() => toggleTab(3)}
                    >
                        Login Attempts
                    </div>
                </div>

                {/* Accounts Log */}
                <div className={toggleState === 1 ? "content active-content" : "content"}>
                    <div>
                        <table className="chart-logs-table">
                            <thead>
                                <tr>
                                    <th>Account</th>
                                    <th>Field Changed</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Updated By</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accountUpdateArray.length > 0 && filteredAccounts.sort((a,b) => a.accountUpdateArray - b.accountUpdateArray).map((update, index) => {
                                        const prevUpdate = accountUpdateArray[index - 1] || {};
                                        const changes = renderAccountFieldChanges(
                                            update,
                                            prevUpdate
                                        );

                                        return (
                                            <tr key={update._id}>
                                                <td>
                                                    {update.accountNumber} {update.accountName}
                                                </td>
                                                <td>
                                                    <ul>
                                                        {changes.map((change, idx) => (
                                                            <li key={idx}>{change.field}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>
                                                    <ul>
                                                        {changes.map((change, idx) => (
                                                            <li key={idx}>{change.from}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>
                                                    <ul>
                                                        {changes.map((change, idx) => (
                                                            <li key={idx}>{change.to}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>{update.updatedBy}</td>
                                                <td>
                                                    {new Date(
                                                        update.createdAt
                                                    ).toLocaleDateString()}{" "}
                                                    {new Date(
                                                        update.createdAt
                                                    ).toLocaleTimeString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={toggleState === 2 ? "content active-content" : "content"}>
                    <div>
                        <table className="user-logs-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Field Changed</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Updated By</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userUpdateArray.length > 0 &&
                                    userUpdateArray.map((update, index) => {
                                        const prevUpdate = userUpdateArray[index - 1] || {};
                                        const changes = renderUserFieldChanges(update, prevUpdate);

                                        return (
                                            <tr key={update._id}>
                                                <td>{update.username}</td>
                                                <td>
                                                    <ul>
                                                        {changes.map((change, idx) => (
                                                            <li key={idx}>{change.field}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>
                                                    <ul>
                                                        {changes.map((change, idx) => (
                                                            <li key={idx}>{change.from}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>
                                                    <ul>
                                                        {changes.map((change, idx) => (
                                                            <li key={idx}>{change.to}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>{update.updatedBy}</td>
                                                <td>
                                                    {new Date(
                                                        update.createdAt
                                                    ).toLocaleDateString()}{" "}
                                                    {new Date(
                                                        update.createdAt
                                                    ).toLocaleTimeString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={toggleState === 3 ? "content active-content" : "content"}>
                    <table className="login-logs-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Attempt</th>
                                <th>Success</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loginAttempts.map((attempt, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{attempt.user.username}</td>
                                        <td>{attempt.attemptNum}</td>
                                        <td>{attempt.successful ? "Yes" : "No"}</td>
                                        <td>
                                            {new Date(attempt.createdAt).toLocaleDateString()}{" "}
                                            {new Date(attempt.createdAt).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </section>
    );
    return content;
};

export default EventLogs;
