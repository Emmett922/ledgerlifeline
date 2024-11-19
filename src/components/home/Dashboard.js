import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "react-calendar";
import Calculator from "../calc/Calculator";
import Draggable from "react-draggable";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import "./styles/Dashboard.css";

const Dashboard = () => {
    const [username, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [isEmailUserVisible, setIsEmailUserVisible] = useState(false);
    const [storedUserFullName, setStoredUserFullName] = useState("");
    const [userArray, setUserArray] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [pendingEntries, setPendingEntries] = useState([]);
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

        if (storedUser) {
            setUserName(storedUser.username);
            setUserRole(storedUser.role);
            setStoredUserFullName(`${storedUser.first_name} ${storedUser.last_name}`);

            const now = Date.now();
            const threeDaysFromNow = 3 * 24 * 60 * 60 * 1000;
            const passwordExpirationDate = new Date(storedUser.passwordExpiration).getTime();

            if (passwordExpirationDate - now <= threeDaysFromNow) {
                setTimeout(() => {
                    toast("Your password is set to expire soon! Please change your password!", {
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
                }, 500);
            }
        }

        // Get all users from database in
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/users`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // Gather the result
                const result = await response.json();

                // Handle result
                if (response.ok) {
                    setUserArray(result);
                } else {
                    toast("Failed to retrieve users!", {
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
                console.log(error);
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
        fetchUsers();

        const fetchPendingEntries = async () => {
            try {
                const response = await fetch(`${API_URL}/journal-entry/pending`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // Gather the result
                const result = await response.json();

                // Handle the result
                if (response.ok) {
                    if (result.length !== 0) {
                        setPendingEntries(result);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchPendingEntries();

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

        // Add listener for back button to prevent going back to login page
        const handlePopState = () => {
            const currentPath = window.location.pathname;

            if (currentPath === "/dashboard" && document.referrer.endsWith("/")) {
                // If the user navigated from login and tries to go back, prevent it
                window.history.pushState(null, "", window.location.href);
            }
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [navigate]);

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const toggleCalculator = () => {
        setShowCalculator(!showCalculator);
    };

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user data
        navigate("/"); // Redirect to login
    };

    const adminEmailUserOptions = [
        {
            value: "ALL",
            label: "ALL",
        },
        ...userArray
            .filter((user) => user.role === "Manager" || user.role === "Accountant")
            .map((user) => ({
                value: user,
                label: `${user.first_name} ${user.last_name}`,
            })),
    ];

    const managerEmailUserOptions = [
        {
            value: "ALL",
            label: "ALL",
        },
        ...userArray
            .filter((user) => user.role === "Admin" || user.role === "Accountant")
            .map((user) => ({
                value: user,
                label: `${user.first_name} ${user.last_name}`,
            })),
    ];

    const accountantEmailUserOptions = [
        {
            value: "ALL",
            label: "ALL",
        },
        ...userArray
            .filter((user) => user.role === "Manager" || user.role === "Manager")
            .map((user) => ({
                value: user,
                label: `${user.first_name} ${user.last_name}`,
            })),
    ];

    const handleEmail = async () => {
        const formattedMessage = emailMessage.replace(/\n/g, "<br>");

        // Send an email to each selected user
        for (const user of selectedUsers) {
            setTimeout(async () => {
                try {
                    const response = await fetch(`${API_URL}/email/send-custom-email`, {
                        method: "POST",
                        headers: {
                            "content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            user: user.value,
                            subject: emailSubject,
                            message: formattedMessage,
                            senderName: storedUserFullName,
                        }),
                    });

                    const result = await response.json();
                    if (response.ok) {
                        // Store the message in localStorage
                        localStorage.setItem("toastMessage", result.message);

                        // Reload the page after storing the message
                        window.location.reload();
                    }
                } catch (error) {
                    console.error("Error sending email:", error);
                }
            }, 0);
        }

        setIsEmailUserVisible(false);
    };

    const content = (
        <section className="dashboard">
            <ToastContainer />
            {/* Side navbar for admin */}
            {userRole === "Admin" && (
                <aside className="sidebar">
                    <div className="app-logo">
                        <img
                            className="logo"
                            src="/ledgerlifelinelogo.png"
                            alt="LedgerLifeline Logo"
                        />
                    </div>
                    <ul className="sidebar-btns">
                        <Link
                            className="sidebar-button"
                            id="dashboard-link"
                            title="Dashboard page link"
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
                            title="Users page link"
                            to="/users"
                        >
                            Users
                        </Link>
                        <Link
                            className="sidebar-button"
                            id="event-log-link"
                            title="Event Logs page link"
                            to="/event-logs"
                        >
                            Event Logs
                        </Link>
                    </ul>
                    <div className="help-btn">
                        <Link type="help-button" id="help-link" title="Help Page Link" to="/help">
                            <img className="pfp2" src="/question2.png" alt="Question mark button" />
                        </Link>
                    </div>
                </aside>
            )}

            {/* Side navbar for accountant && manager*/}
            {(userRole === "Accountant" || userRole === "Manager") && (
                <aside className="sidebar accountant">
                    <div className="app-logo">
                        <img
                            className="logo"
                            src="/ledgerlifelinelogo.png"
                            alt="LedgerLifeline Logo"
                        />
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
                            title="Journalize Page Link"
                            id="journalize-link"
                            to="/journalize"
                        >
                            Journalize
                        </Link>
                        <Link
                            className="sidebar-button"
                            title="Trial balance Page Link"
                            id="trial-balance-link"
                            to="/trial-balance"
                        >
                            Trial Balance
                        </Link>
                        <Link
                            className="sidebar-button"
                            title="Income Statement Page Link"
                            id="income-statement-link"
                            to="/income-statement"
                        >
                            Income Statement
                        </Link>
                        <Link
                            className="sidebar-button"
                            title="Balance Sheet Page Link"
                            id="balance-sheet-link"
                            to="/balance-sheet"
                        >
                            Balance Sheet
                        </Link>
                        <Link
                            className="sidebar-button"
                            title="Statement of Retained Earnings Page Link"
                            id="retained-earnings-link"
                            to="/retained-earnings"
                        >
                            Statement of Retained Earnings
                        </Link>
                    </ul>
                    <div className="help-btn">
                        <Link type="help-button" id="help-link" title="Help Page Link" to="/help">
                            <img className="pfp2" src="/question2.png" alt="LedgerLifeline Logo" />
                        </Link>
                    </div>
                </aside>
            )}

            {/* Main dashboard content */}
            <main className="main-content">
                <header className="header">
                    {/* Main content header-main for admin and manager users */}
                    {(userRole === "Admin" || userRole === "Manager") && (
                        <div className="header-main">
                            <h1 className="header-title">Dashboard</h1>
                            <button
                                className="email-btn"
                                title="Email Employee"
                                onClick={() => {
                                    setIsEmailUserVisible(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faEnvelope} size="lg" />
                            </button>
                            <button
                                onClick={toggleCalendar}
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                                title="Open/Close pop-up calendar"
                            >
                                <FontAwesomeIcon icon={faCalendar} size="2x" />
                            </button>
                            <button
                                onClick={toggleCalculator}
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                                title="Open/Close pop-up calculator"
                            >
                                <FontAwesomeIcon icon={faCalculator} size="2x" />
                            </button>
                        </div>
                    )}

                    {/* Main content header-main for accountant users */}
                    {userRole === "Accountant" && (
                        <div className="header-main">
                            <h1 className="header-title accountant">Dashboard</h1>
                            <button
                                className="email-btn"
                                title="Email Employee"
                                onClick={() => {
                                    setIsEmailUserVisible(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faEnvelope} size="lg" />
                            </button>
                            <button
                                onClick={toggleCalendar}
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                                title="Open/Close pop-up calendar"
                            >
                                <FontAwesomeIcon icon={faCalendar} size="2x" />
                            </button>
                            <button
                                className="calc-btn"
                                onClick={toggleCalculator}
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                                title="Open/Close pop-up calculator"
                            >
                                <FontAwesomeIcon icon={faCalculator} size="2x" />
                            </button>
                        </div>
                    )}

                    {/* Draggable Calendar pop-up */}
                    {showCalendar && (
                        <Draggable>
                            <div
                                className="calendar-popup"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    zIndex: 1000,
                                    padding: "10px",
                                    backgroundColor: "white",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                }}
                            >
                                <Calendar />
                            </div>
                        </Draggable>
                    )}

                    {/* Draggable Calculator pop-up */}
                    {showCalculator && (
                        <div
                            className="calculator-popup"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: 1000,
                            }}
                        >
                            <Calculator />
                        </div>
                    )}

                    <div className="user-profile">
                        <img className="pfp" src="/Default_pfp.svg.png" alt="LedgerLifeline Logo" />
                        <span className="profile-name">{username}</span>
                        <a>
                            <button
                                className="action-button1"
                                title="Logout of Application"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </a>
                    </div>
                </header>
                <div className="Dashboard1">
                    <div className="top-boxes">
                        <div className="Current-Ratio">
                            <h1 className="box-title">Current Ratio</h1>
                            <div className="percentage">
                                <h1 className="ratio-num">515.62%</h1>
                            </div>
                        </div>
                        <div className="Return-Assets">
                            <h1 className="box-title">Return on Assets</h1>
                            <div className="percentage">
                                <h1 className="ratio-num">18.96%</h1>
                            </div>
                        </div>
                        <div className="Return-Equity">
                            <h1 className="box-title">Return on Equity</h1>
                            <div>
                                <h1 className="ratio-num">28.02%</h1>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-boxes">
                        <div className="Net-Profit">
                            <h1 className="box-title">Net Profit Margin</h1>
                            <div className="percentage">
                                <h1 className="ratio-num">49.67%</h1>
                            </div>
                        </div>
                        <div className="Asset-Turnover">
                            <h1 className="box-title">Asset Turnover</h1>
                            <div className="percentage">
                                <h1 className="ratio-num">38.18%</h1>
                            </div>
                        </div>
                        <div className="Quick-Ratio">
                            <h1 className="box-title">Quick Ratio</h1>
                            <div className="percentage">
                                <h1 className="ratio-num">515.62%</h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pop-up section to email single user */}
                {isEmailUserVisible && userRole === "Admin" && (
                    <div className="modal">
                        <div className="modal-email-content">
                            <span
                                className="close"
                                title="Close modal"
                                onClick={() => setIsEmailUserVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Send Email</h2>
                            <form onSubmit={handleEmail}>
                                <div className="form-group">
                                    <label htmlFor="selectUser">To</label>
                                    <Select
                                        id="selectUser"
                                        name="selectUser"
                                        title="Select a user to send an email to"
                                        value={selectedUsers} // array of selected users
                                        onChange={(selectedOptions) => {
                                            if (
                                                selectedOptions.some(
                                                    (option) => option.value === "ALL"
                                                )
                                            ) {
                                                // If "ALL" is selected, set all users as selected
                                                setSelectedUsers(adminEmailUserOptions.slice(1)); // all except "ALL"
                                            } else {
                                                // Otherwise, set selected users to whatever is chosen
                                                setSelectedUsers(selectedOptions);
                                            }
                                        }}
                                        options={adminEmailUserOptions}
                                        isSearchable={true}
                                        isMulti={true}
                                        required
                                        placeholder="Select user(s)"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="emailSubject">Subject</label>
                                    <input
                                        type="text"
                                        id="emailSubject"
                                        name="emailSubject"
                                        title="Give email a subject"
                                        placeholder="Enter the subject"
                                        value={emailSubject}
                                        onChange={(e) => setEmailSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="emailMessage">Message</label>
                                    <textarea
                                        id="emailMessage"
                                        name="emailMessage"
                                        title="Enter an email message"
                                        placeholder="Enter your message"
                                        value={emailMessage}
                                        onChange={(e) => setEmailMessage(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="modal-btns">
                                    <button
                                        type="submit"
                                        title="Send email to user"
                                        className="send-button"
                                    >
                                        Send Email
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        title="Cancel email draft"
                                        onClick={() => setIsEmailUserVisible(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Pop-up section to email single user */}
                {isEmailUserVisible && userRole === "Manager" && (
                    <div className="modal">
                        <div className="modal-email-content">
                            <span
                                className="close"
                                title="Close modal"
                                onClick={() => setIsEmailUserVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Send Email</h2>
                            <form onSubmit={handleEmail}>
                                <div className="form-group">
                                    <label htmlFor="selectUser">To</label>
                                    <Select
                                        id="selectUser"
                                        name="selectUser"
                                        title="Select a user to send an email to"
                                        value={selectedUsers} // array of selected users
                                        onChange={(selectedOptions) => {
                                            if (
                                                selectedOptions.some(
                                                    (option) => option.value === "ALL"
                                                )
                                            ) {
                                                // If "ALL" is selected, set all users as selected
                                                setSelectedUsers(managerEmailUserOptions.slice(1)); // all except "ALL"
                                            } else {
                                                // Otherwise, set selected users to whatever is chosen
                                                setSelectedUsers(selectedOptions);
                                            }
                                        }}
                                        options={managerEmailUserOptions}
                                        isSearchable={true}
                                        isMulti={true}
                                        required
                                        placeholder="Select user(s)"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="emailSubject">Subject</label>
                                    <input
                                        type="text"
                                        id="emailSubject"
                                        name="emailSubject"
                                        title="Give email a subject"
                                        placeholder="Enter the subject"
                                        value={emailSubject}
                                        onChange={(e) => setEmailSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="emailMessage">Message</label>
                                    <textarea
                                        id="emailMessage"
                                        name="emailMessage"
                                        title="Enter an email message"
                                        placeholder="Enter your message"
                                        value={emailMessage}
                                        onChange={(e) => setEmailMessage(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="modal-btns">
                                    <button
                                        type="submit"
                                        title="Send email to user"
                                        className="send-button"
                                    >
                                        Send Email
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        title="Cancel email draft"
                                        onClick={() => setIsEmailUserVisible(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Pop-up section to email single user */}
                {isEmailUserVisible && userRole === "Accountant" && (
                    <div className="modal">
                        <div className="modal-email-content">
                            <span
                                className="close"
                                title="Close modal"
                                onClick={() => setIsEmailUserVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Send Email</h2>
                            <form onSubmit={handleEmail}>
                                <div className="form-group">
                                    <label htmlFor="selectUser">To</label>
                                    <Select
                                        id="selectUser"
                                        name="selectUser"
                                        title="Select a user to send an email to"
                                        value={selectedUsers} // array of selected users
                                        onChange={(selectedOptions) => {
                                            if (
                                                selectedOptions.some(
                                                    (option) => option.value === "ALL"
                                                )
                                            ) {
                                                // If "ALL" is selected, set all users as selected
                                                setSelectedUsers(
                                                    accountantEmailUserOptions.slice(1)
                                                ); // all except "ALL"
                                            } else {
                                                // Otherwise, set selected users to whatever is chosen
                                                setSelectedUsers(selectedOptions);
                                            }
                                        }}
                                        options={accountantEmailUserOptions}
                                        isSearchable={true}
                                        isMulti={true}
                                        required
                                        placeholder="Select user(s)"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="emailSubject">Subject</label>
                                    <input
                                        type="text"
                                        id="emailSubject"
                                        name="emailSubject"
                                        title="Give email a subject"
                                        placeholder="Enter the subject"
                                        value={emailSubject}
                                        onChange={(e) => setEmailSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="emailMessage">Message</label>
                                    <textarea
                                        id="emailMessage"
                                        name="emailMessage"
                                        title="Enter an email message"
                                        placeholder="Enter your message"
                                        value={emailMessage}
                                        onChange={(e) => setEmailMessage(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="modal-btns">
                                    <button
                                        type="submit"
                                        title="Send email to user"
                                        className="send-button"
                                    >
                                        Send Email
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        title="Cancel email draft"
                                        onClick={() => setIsEmailUserVisible(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </section>
    );
    return content;
};

export default Dashboard;
