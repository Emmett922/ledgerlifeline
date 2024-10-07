import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Help.css";

const Help = () => {
    const [username, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user data
        navigate("/"); // Redirect to login
    };

    const content = (
        <section className="dashboard">
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
                        to="dashboard"
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
                    <Link className="sidebar-button" id="users-link" title="Users page link" to="/users">
                        Users
                    </Link>
                    <Link className="sidebar-button" id="event-log-link" title="Event Logs page link" to="/event-logs">
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
            {/* Main dashboard content */}
            <main className="main-content">
                <header className="header">
                    <div className="header-main">
                        <h1 className="header-title">Help</h1>
                    </div>
                    <div className="user-profile">
                        <img className="pfp" src="/Default_pfp.svg.png" alt="LedgerLifeline Logo" />
                        <span className="profile-name">{username}</span>
                        <a>
                            <button className="action-button1" title="Logout of Application" onClick={handleLogout}>
                                Logout
                            </button>
                        </a>
                    </div>
                </header>
                <div className="scroll">
                    <div className="software-overview">
                        <h2>Software Overview</h2>
                        <p>
                            The product is a web application that allows users to manage accounting and finance tasks from any location with internet access. The application is compatible with various browsers, including Internet Explorer, Firefox, Chrome, and Safari, and can be accessed on devices such as computers and tablets.
                        </p>
                    </div>

                    <div className="user-roles">
                        <h2>User Roles</h2>
                        <p>This application is designed for three distinct user roles:</p>
                        <ul>
                            <li><strong>Administrator:</strong> Responsible for managing user accounts and setting security protocols.</li>
                            <li><strong>Manager:</strong> Oversees financial data and generates relevant reports.</li>
                            <li><strong>User:</strong> Engages with the application to perform daily accounting functions.</li>
                        </ul>
                    </div>

                    <div className="security-features">
                        <h2>Security Features</h2>
                        <p>Security is a top priority for the application. Key features include:</p>
                        <ul>
                            <li><strong>Password Length:</strong> Minimum of 8 characters required.</li>
                            <li><strong>Password Expiration:</strong> Passwords must be updated every 90 days.</li>
                            <li><strong>Password Recovery:</strong> Users can recover their passwords via email verification.</li>
                            <li><strong>Password History:</strong> Users cannot reuse their last 5 passwords.</li>
                            <li><strong>Password Complexity:</strong> Passwords must contain uppercase letters, lowercase letters, numbers, and special characters.</li>
                        </ul>
                    </div>

                    <div className="accounting-functions">
                        <h2>Accounting Functions</h2>
                        <p>The application facilitates various accounting and finance functions, including:</p>
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
                        <p>The application includes several other features to enhance user experience:</p>
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
