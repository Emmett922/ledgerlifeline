import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import Calculator from "../calc/Calculator";
import Draggable from "react-draggable";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import "./styles/Help.css";

const Help = () => {
    const [storedUserName, setStoredUserName] = useState("");
    const [storedUserRole, setStoredUserRole] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));

        // If user is not logged in, redirect to login
        if (!storedUser) {
            navigate("/", { replace: true });
        }

        // If all other checks are met, get the storedUser's username
        if (storedUser) {
            setStoredUserName(storedUser.username);
            setStoredUserRole(storedUser.role);
        }
    });

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user data
        navigate("/"); // Redirect to login
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const toggleCalculator = () => {
        setShowCalculator(!showCalculator);
    };

    const content = (
        <section className="dashboard help">
            {/* Side nav for admin */}
            {storedUserRole === "Admin" && (
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
                            to="/dashboard"
                        >
                            Dashboard
                        </Link>
                        <Link
                            className="sidebar-button"
                            id="chart-of-accounts-link"
                            title="Chart of Accounts page link"
                            to="/chart-of-accounts"
                        >
                            Chart of Accounts
                        </Link>
                        <Link
                            className="sidebar-button"
                            id="accounts-link"
                            title="Accounts page link"
                            to="/accounts"
                        >
                            Accounts
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
                            <img className="pfp2" src="/question2.png" alt="LedgerLifeline Logo" />
                        </Link>
                    </div>
                </aside>
            )}

            {/* Side nav for accountand && manager */}
            {(storedUserRole === "Accountant" || storedUserRole === "Manager") && (
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
                            title="Dashboard Page Link"
                            to="/dashboard"
                        >
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
                        <Link
                            className="sidebar-button"
                            id="accounts-link"
                            title="Accounts Page Link"
                            to="/accounts"
                        >
                            Accounts
                        </Link>
                        <Link
                            className="sidebar-button"
                            title="Journalize Page Link"
                            id="journalize-link"
                        >
                            Journalize
                        </Link>
                        <Link
                            className="sidebar-button"
                            title="Income Statement Page Link"
                            id="income-statement-link"
                        >
                            Income Statement
                        </Link>
                        <Link
                            className="sidebar-button"
                            title="Balance Sheet Page Link"
                            id="balance-sheet-link"
                        >
                            Balance Sheet
                        </Link>
                        <Link
                            className="sidebar-button"
                            title="Statement of Retained Earnings Page Link"
                            id="retained-earnings-link"
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
                    {/* Default main heading */}
                    {(storedUserRole === "Manager" || storedUserRole === "Admin") && (
                        <div className="header-main">
                            <h1 className="header-title">Application Information</h1>
                        </div>
                    )}
                    {/* Main content header-main for accountant users */}
                    {storedUserRole === "Accountant" && (
                        <div className="header-main">
                            <h1 className="header-title accountant">Application Information</h1>
                            <button
                                onClick={toggleCalendar}
                                title="Open/Close pop-up calendar"
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                            >
                                <FontAwesomeIcon icon={faCalendar} size="2x" />
                            </button>
                            <button
                                onClick={toggleCalculator}
                                title="Open/Close pop-up calculator"
                                style={{ background: "none", border: "none", cursor: "pointer" }}
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
                        <span className="profile-name">{storedUserName}</span>
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
                <div className="scroll">
                    <div className="software-overview">
                        <h2>Software Overview</h2>
                        <p>
                            The product is a web application that allows users to manage accounting
                            and finance tasks from any location with internet access. The
                            application is compatible with various browsers, including Internet
                            Explorer, Firefox, Chrome, and Safari, and can be accessed on devices
                            such as computers and tablets.
                        </p>
                    </div>

                    <div className="user-roles">
                        <h2>User Roles</h2>
                        <p>This application is designed for three distinct user roles:</p>
                        <ul>
                            <li>
                                <strong>Administrator:</strong> Responsible for managing user
                                accounts and setting security protocols.
                            </li>
                            <li>
                                <strong>Manager:</strong> Oversees financial data and generates
                                relevant reports.
                            </li>
                            <li>
                                <strong>User:</strong> Engages with the application to perform daily
                                accounting functions.
                            </li>
                        </ul>
                    </div>

                    <div className="security-features">
                        <h2>Security Features</h2>
                        <p>Security is a top priority for the application. Key features include:</p>
                        <ul>
                            <li>
                                <strong>Password Length:</strong> Minimum of 8 characters required.
                            </li>
                            <li>
                                <strong>Password Expiration:</strong> Passwords must be updated
                                every 90 days.
                            </li>
                            <li>
                                <strong>Password Recovery:</strong> Users can recover their
                                passwords via email verification.
                            </li>
                            <li>
                                <strong>Password History:</strong> Users cannot reuse their last 5
                                passwords.
                            </li>
                            <li>
                                <strong>Password Complexity:</strong> Passwords must contain
                                uppercase letters, lowercase letters, numbers, and special
                                characters.
                            </li>
                        </ul>
                    </div>

                    <div className="accounting-functions">
                        <h2>Accounting Functions</h2>
                        <p>
                            The application facilitates various accounting and finance functions,
                            including:
                        </p>
                        <ul>
                            <li>Creating and managing a chart of accounts.</li>
                            <li>Journalizing financial transactions.</li>
                            <li>Attaching relevant source documents to transactions.</li>
                            <li>Displaying transactions organized by date.</li>
                            <li>Posting transactions to specific accounts.</li>
                            <li>Generating essential financial statements, including:</li>
                            <ul>
                                <li>Trial Balances</li>
                                <li>Income Statements</li>
                                <li>Balance Sheets</li>
                                <li>Cash Flow Statements</li>
                            </ul>
                            <li>Performing ratio analysis for enhanced financial assessment.</li>
                        </ul>
                    </div>

                    <div className="additional-features">
                        <h2>Additional Features</h2>
                        <p>
                            The application includes several other features to enhance user
                            experience:
                        </p>
                        <ul>
                            <li>User-friendly interface for easy navigation.</li>
                            <li>Real-time data updates and reporting.</li>
                            <li>Customizable settings based on user preferences.</li>
                            <li>Integration with other financial tools and platforms.</li>
                        </ul>
                    </div>

                    <div className="support">
                        <h2>Support and Documentation</h2>
                        <p>Comprehensive support is provided, including:</p>
                        <ul>
                            <li>Help resources within the application.</li>
                            <li>Documentation for all features and functionalities.</li>
                            <li>Access to customer support for technical assistance.</li>
                        </ul>
                    </div>
                </div>
            </main>
        </section>
    );
    return content;
};

export default Help;
