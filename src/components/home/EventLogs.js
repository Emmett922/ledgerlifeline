import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/EventLogs.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventLogs = () => {
    const navigate = useNavigate();
    const [storedUserName, setStoredUserName] = useState("");

    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index)
    }

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

    const content = (
        <section className="eventLogs">
            <ToastContainer />
            <aside className="sidebar">
                <div className="app-logo">
                    <img className="logo" src="/ledgerlifelinelogo.png" alt="LedgerLifeline Logo" />
                </div>
                <ul className="sidebar-btns">
                    <Link className="sidebar-button" id="dashboard-link" to="/dashboard">
                        Dashboard
                    </Link>
                    <Link
                        className="sidebar-button"
                        id="chart-of-accounts-link"
                        to="/chart-of-accounts"
                    >
                        Chart of Accounts
                    </Link>
                    <Link className="sidebar-button" id="accounts-link" to="/accounts">
                        Accounts
                    </Link>
                    <Link className="sidebar-button" id="users-link" to="/users">
                        Users
                    </Link>
                    <Link className="sidebar-button" id="event-log-link" to="/event-logs">
                        Event Logs
                    </Link>
                </ul>
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
                            <button className="action-button1" onClick={handleLogout}>
                                Logout
                            </button>
                        </a>
                    </div>
                </header>

                <div className="table-filter">
                    <div className="date-filter">
                        From:
                        <input type="date" id="from" name="from" />
                        To:
                        <input type="date" id="to" name="to" />
                    </div>
                    <div className="search-filter">
                        <input
                            type="text"
                            className="search"
                            placeholder="Search accounts..."
                            value={"Search"} />
                    </div>
                </div>

                <div className="tab-container">

                    <div
                        className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                        onClick={() => toggleTab(1)}>
                        Chart of Accounts</div>

                    <div
                        className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                        onClick={() => toggleTab(2)}>
                        User Accounts</div>

                    <div
                        className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
                        onClick={() => toggleTab(3)}>
                        Login Attempts</div>
                </div>

                <div className={toggleState === 1 ? "content active-content" : "content"}>
                    <div>
                        <table className="chart-logs-table">
                            <thead>
                                <tr>
                                    <th>Event ID</th>
                                    <th>Time</th>
                                    <th>Date</th>
                                    <th>Original / Modified</th>
                                    <th>Account Number</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Sub-Type</th>
                                    <th>Term</th>
                                    <th>Balance</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Editor</th>
                                </tr>
                            </thead>
                        </table>
                        <tbody>
                        </tbody>

                    </div>
                </div>

                <div className={toggleState === 2 ? "content active-content" : "content"}>
                    <div>
                        <table className="user-logs-table">
                            <thead>
                                <tr>
                                    <th>Event ID</th>
                                    <th>Time</th>
                                    <th>Date</th>
                                    <th>Original / Modified</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Street</th>
                                    <th>State</th>
                                    <th>Zip</th>
                                    <th>Date of Birth</th>
                                    <th>Email</th>
                                    <th>Security Question</th>
                                    <th>Security Answer</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Editor</th>
                                </tr>
                            </thead>
                        </table>
                        <tbody>
                        </tbody>

                    </div>
                </div>

                <div className={toggleState === 3 ? "content active-content" : "content"}>
                    <table className="login-logs-table">
                        <thead>
                            <tr>
                                <th>Event ID</th>
                                <th>Time</th>
                                <th>Date</th>
                                <th>Username</th>
                                <th>Success</th>
                                <th>Consecutive Attempts</th>
                                <th>Reason for Fail</th>
                            </tr>
                        </thead>
                    </table>
                    <tbody>
                    </tbody>
                </div>
            </main>
        </section>
    );
    return content;
}

export default EventLogs;