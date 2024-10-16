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

            return (
                isWithinDateRange &&
                searchTerms.every(
                    (term) =>
                        update.accountNumber.toString().includes(term) ||
                        update.accountName.toLowerCase().includes(term)
                )
            );
        });
    };

    const filteredAccounts = handleSearch1(searchQuery);

    // Seach user updates function
    const handleSearch2 = (query) => {
        const searchString = query && typeof query === "string" ? query.toLowerCase() : "";

        const searchTerms = searchString.split(/[\s,]+/);

        return userUpdateArray.filter((update) => {
            const userUpdatedDate = new Date(update.createdAt);
            const userUpdateDateString = userUpdatedDate.toISOString().split("T")[0];

            const fromDateString = fromDate ? new Date(fromDate).toISOString().split("T")[0] : null;
            const toDateString = toDate ? new Date(toDate).toISOString().split("T")[0] : null;

            const isWithinDateRange = (() => {
                if (!fromDateString && !toDateString) return true;

                if (fromDateString && toDateString) {
                    // Include accounts created between fromDate and toDate (inclusive)
                    return (
                        userUpdateDateString >= fromDateString &&
                        userUpdateDateString <= toDateString
                    );
                } else if (fromDateString) {
                    // Include accounts created on or after fromDate
                    return userUpdateDateString >= fromDateString;
                } else if (toDateString) {
                    // Include accounts created on or before toDate
                    return userUpdateDateString <= toDateString;
                }
                return true;
            })();

            return (
                isWithinDateRange &&
                searchTerms.every((term) => update.username.toString().includes(term))
            );
        });
    };

    const filteredUsers = handleSearch2(searchQuery);

    // Function to render the changes made to an account
    const renderAccountFieldChanges = (currUpdate, allUpdates) => {
        const changes = [];

        // Log the current update and all updates
        console.log("Current Update:", currUpdate);
        console.log("All Updates:", allUpdates);

        // Find the most recent previous update for the same account
        const sortedUpdates = allUpdates
            .filter((update) => update.account.toString() === currUpdate.account.toString()) // Same account only
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Oldest first

        // Find the index of the current update in the sorted updates
        const currUpdateIndex = sortedUpdates.findIndex((update) => update._id === currUpdate._id);

        // Previous update will be the one just before the current one
        const prevUpdate = currUpdateIndex > 0 ? sortedUpdates[currUpdateIndex - 1] : null;

        console.log("Previous Update:", prevUpdate);

        // If there's no previous update, treat it as a brand new account
        if (!prevUpdate) {
            // Use currUpdate fields directly or "None" if not defined
            changes.push(
                { field: "Account Number", from: "None", to: currUpdate.accountNumber || "None" },
                { field: "Account Name", from: "None", to: currUpdate.accountName || "None" },
                {
                    field: "Account Description",
                    from: "None",
                    to: currUpdate.accountDescription || "None",
                },
                { field: "Normal Side", from: "None", to: currUpdate.normalSide || "None" },
                {
                    field: "Account Category",
                    from: "None",
                    to: currUpdate.accountCatagory || "None",
                },
                {
                    field: "Account Subcategory",
                    from: "None",
                    to: currUpdate.accountSubCatagory || "None",
                },
                { field: "Account Balance", from: "None", to: currUpdate.balance || "None" },
                { field: "Account Debit", from: "None", to: currUpdate.debit || "None" },
                { field: "Account Credit", from: "None", to: currUpdate.credit || "None" },
                { field: "Account Order", from: "None", to: currUpdate.order || "None" },
                { field: "Account Statement", from: "None", to: currUpdate.statement || "None" },
                { field: "Account Comment", from: "None", to: currUpdate.comment || "None" },
                {
                    field: "Account Active Status",
                    from: "Inactive",
                    to: currUpdate.isActive ? "Active" : "Inactive",
                }
            );
        } else {
            // If a previous update exists, compare each field
            const compareField = (field, displayName) => {
                const prevValue = prevUpdate[field] !== undefined ? prevUpdate[field] : "None"; // Default to "None"
                const currValue = currUpdate[field] !== undefined ? currUpdate[field] : "None"; // Default to "None"

                // Only add to changes if they differ
                if (prevValue !== currValue) {
                    changes.push({
                        field: displayName,
                        from: prevValue,
                        to: currValue,
                    });
                }
            };

            // Compare fields
            compareField("accountNumber", "Account Number");
            compareField("accountName", "Account Name");
            compareField("accountDescription", "Account Description");
            compareField("normalSide", "Normal Side");
            compareField("accountCatagory", "Account Category");
            compareField("accountSubCatagory", "Account Subcategory");
            compareField("balance", "Account Balance");
            compareField("debit", "Account Debit");
            compareField("credit", "Account Credit");
            compareField("order", "Account Order");
            compareField("statement", "Account Statement");
            compareField("comment", "Account Comment");

            // Special handling for isActive
            const prevIsActive = prevUpdate.isActive !== undefined ? prevUpdate.isActive : false; // Previous isActive value
            const currIsActive = currUpdate.isActive !== undefined ? currUpdate.isActive : false; // Current isActive value
            if (prevIsActive !== currIsActive) {
                changes.push({
                    field: "Account Active Status",
                    from: prevIsActive ? "Active" : "Inactive",
                    to: currIsActive ? "Active" : "Inactive",
                });
            }
        }
        return changes;
    };

    // Function to render the changes made to an account
    const renderUserFieldChanges = (currUpdate, allUpdates) => {
        const changes = [];

        // Log the current update and all updates
        console.log("Current Update:", currUpdate);
        console.log("All Updates:", allUpdates);

        // Find the most recent previous update for the same user
        const sortedUpdates = allUpdates
            .filter((update) => update.user.toString() === currUpdate.user.toString()) // Same user only
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Oldest first

        // Find the index of the current update in the sorted updates
        const currUpdateIndex = sortedUpdates.findIndex((update) => update._id === currUpdate._id);

        // Previous update will be the one just before the current one
        const prevUpdate = currUpdateIndex > 0 ? sortedUpdates[currUpdateIndex - 1] : null;

        console.log("Previous Update:", prevUpdate);

        // If there's no previous update, treat it as a brand new user
        if (!prevUpdate) {
            // Use currUpdate fields directly or "None" if not defined
            changes.push(
                { field: "Username", from: "None", to: currUpdate.username || "None" },
                { field: "Password", from: "None", to: currUpdate.password || "None" },
                { field: "First Name", from: "None", to: currUpdate.first_name || "None" },
                { field: "Last Name", from: "None", to: currUpdate.last_name || "None" },
                { field: "Email", from: "None", to: currUpdate.email || "None" },
                {
                    field: "Address",
                    from: "None",
                    to: JSON.stringify(currUpdate.address) || "None", // stringify for a better display
                },
                { field: "Date of Birth", from: "None", to: currUpdate.dob || "None" },
                {
                    field: "Security Question",
                    from: "None",
                    to: JSON.stringify(currUpdate.securityQuestion) || "None", // stringify for a better display
                },
                { field: "Role", from: "None", to: currUpdate.role || "None" },
                {
                    field: "Active Status",
                    from: "Inactive",
                    to: currUpdate.active ? "Active" : "Inactive",
                },
                {
                    field: "Suspended",
                    from: "None",
                    to: JSON.stringify(currUpdate.suspended) || "None", // stringify for a better display
                }
            );
        } else {
            // If a previous update exists, compare each field
            const compareField = (field, displayName) => {
                const prevValue = prevUpdate[field] !== undefined ? prevUpdate[field] : "None"; // Default to "None"
                const currValue = currUpdate[field] !== undefined ? currUpdate[field] : "None"; // Default to "None"

                // Only add to changes if they differ
                if (prevValue !== currValue) {
                    changes.push({
                        field: displayName,
                        from: prevValue,
                        to: currValue,
                    });
                }
            };

            // Compare fields
            compareField("username", "Username");
            compareField("password", "Password");
            compareField("first_name", "First Name");
            compareField("last_name", "Last Name");
            compareField("email", "Email");
            compareField("dob", "Date of Birth");
            compareField("role", "Role");

            // Compare address object and its nested fields
            if (JSON.stringify(currUpdate.address) !== JSON.stringify(prevUpdate.address)) {
                changes.push({
                    field: "Address",
                    from: JSON.stringify(prevUpdate.address) || "None",
                    to: JSON.stringify(currUpdate.address) || "None",
                });
            }

            // Special handling for active status
            const prevIsActive = prevUpdate.active !== undefined ? prevUpdate.active : false; // Previous isActive value
            const currIsActive = currUpdate.active !== undefined ? currUpdate.active : false; // Current isActive value
            if (prevIsActive !== currIsActive) {
                changes.push({
                    field: "Active Status",
                    from: prevIsActive ? "Active" : "Inactive",
                    to: currIsActive ? "Active" : "Inactive",
                });
            }

            // Special handling for suspended object and its nested fields
            if (JSON.stringify(currUpdate.suspended) !== JSON.stringify(prevUpdate.suspended)) {
                changes.push({
                    field: "Suspended",
                    from: JSON.stringify(prevUpdate.suspended) || "None",
                    to: JSON.stringify(currUpdate.suspended) || "None",
                });
            }
        }

        console.log("Changes:", changes);
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
                    <Link
                        className="sidebar-button"
                        id="dashboard-link"
                        title="Dashboard Page Link"
                        to="/dashboard"
                    >
                        Dashboard
                    </Link>
                    <Link
                        className="sidebar-button"
                        id="ledger-link"
                        title="Ledger page link"
                        to="/account-ledger"
                    >
                        Ledger
                    </Link>
                    <Link
                        className="sidebar-button"
                        id="accounts-link"
                        title="Chart of Accounts Page Link"
                        to="/chart-of-accounts"
                    >
                        Chart of Accounts
                    </Link>
                    <Link
                        className="sidebar-button"
                        id="users-link"
                        title="Users Page Link"
                        to="/users"
                    >
                        Users
                    </Link>
                    <Link
                        className="sidebar-button"
                        id="event-log-link"
                        title="Event Logs Page Link"
                        to="/event-logs"
                    >
                        Event Logs
                    </Link>
                </ul>
                <div className="help-btn">
                    <Link type="help-button" id="help-link" title="Help Page Link" to="/help">
                        <img className="pfp2" src="/question2.png" alt="LedgerLifeline Logo" />
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
                            <button
                                className="action-button1"
                                title="Logout of Appliction"
                                onClick={handleLogout}
                            >
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
                                {accountUpdateArray.length > 0 &&
                                    filteredAccounts
                                        .sort(
                                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                                        )
                                        .map((update) => {
                                            const changes = renderAccountFieldChanges(
                                                update,
                                                accountUpdateArray
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
                                    filteredUsers
                                        .sort(
                                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                                        )
                                        .map((update) => {
                                            const changes = renderUserFieldChanges(
                                                update,
                                                userUpdateArray
                                            );

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
                            {loginAttempts.length > 0 &&
                                loginAttempts
                                    .slice()
                                    .reverse()
                                    .map((attempt, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{attempt.user.username}</td>
                                                <td>{attempt.attemptNum}</td>
                                                <td>{attempt.successful ? "Yes" : "No"}</td>
                                                <td>
                                                    {new Date(
                                                        attempt.createdAt
                                                    ).toLocaleDateString()}{" "}
                                                    {new Date(
                                                        attempt.createdAt
                                                    ).toLocaleTimeString()}
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
