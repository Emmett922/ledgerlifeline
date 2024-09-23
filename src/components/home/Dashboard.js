import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./styles/Dashboard.css";
import "react-toastify/dist/ReactToastify.css";

const profileImageUrl = "src/img/Default-pfp.svg.png";

const Dashboard = () => {
    const [username, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
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

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user data
        navigate("/"); // Redirect to login
    };

    const content = (
        <section className="dashboard">
            <ToastContainer />
            {/* Side navbar for admin */}
            {userRole === "Admin" && (
                <aside className="sidebar">
                    <div className="profile-img">
                        <img src={profileImageUrl} alt="Profile" className="profile-img" />
                    </div>
                    <div className="profile-name">
                        <span className="profile-name">{username}</span>
                    </div>
                    <ul className="sidebar-btns">
                        <Link className="sidebar-button" id="dashboard-link" to="dashboard">
                            Dashboard
                        </Link>
                        <Link className="sidebar-button" id="chart-of-accounts-link">
                            Chart of Accounts
                        </Link>
                        <Link className="sidebar-button" id="accounts-link">
                            Accounts
                        </Link>
                        <Link className="sidebar-button" id="users-link" to="/users">
                            Users
                        </Link>
                        <Link className="sidebar-button" id="event-log-link">
                            Event Log
                        </Link>
                        <a>
                            <button className="sidebar-button logout-link" onClick={handleLogout}>
                                Logout
                            </button>
                        </a>
                    </ul>
                </aside>
            )}

            {/* Side navbar for accountant && manager*/}
            {(userRole === "Accountant" || userRole === "Manager") && (
                <aside className="sidebar">
                    <div className="profile-img">
                        <img src={profileImageUrl} alt="Profile" className="profile-img" />
                    </div>
                    <div className="profile-name">
                        <span className="profile-name">{username}</span>
                    </div>
                    <ul className="sidebar-btns">
                        <Link className="sidebar-button" id="dashboard-link" to="dashboard">
                            Dashboard
                        </Link>
                        <Link className="sidebar-button" id="chart-of-accounts-link">
                            Chart of Accounts
                        </Link>
                        <Link className="sidebar-button" id="accounts-link">
                            Accounts
                        </Link>
                        <a>
                            <button className="sidebar-button">
                                <Link className="journalize-link">Journalize</Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button">
                                <Link className="income-statement-link">Income Statement</Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button">
                                <Link className="balance-sheet-link">Balance Sheet</Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button">
                                <Link className="retained-earnings-link">
                                    Statement of Retained Earnings
                                </Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button logout-link" onClick={handleLogout}>
                                Logout
                            </button>
                        </a>
                    </ul>
                </aside>
            )}

            {/* Main dashboard content */}
            <main className="main-content">
                <header className="Dashboard1">
                    <h1>Dashboard</h1>
                    <div className="top-boxes">
                        <div className="Current-Ratio">
                            <h1>Current Ratio</h1>
                            <div className="percentage">
                                <h1>515.62%</h1>
                            </div>
                        </div>
                        <div className="Return-Assets">
                            <h1>Return on Assets</h1>
                            <div className="percentage">
                                <h1>18.96%</h1>
                            </div>
                        </div>
                        <div className="Return-Equity">
                            <h1>Return on Equity</h1>
                            <div>
                                <h1>28.02%</h1>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-boxes">
                        <div className="Net-Profit">
                            <h1>Net Profit Margin</h1>
                            <div className="percentage">
                                <h1>49.67%</h1>
                            </div>
                        </div>
                        <div className="Asset-Turnover">
                            <h1>Asset Turnover</h1>
                            <div className="percentage">
                                <h1>38.18%</h1>
                            </div>
                        </div>
                        <div className="Quick-Ratio">
                            <h1>Quick Ratio</h1>
                            <div className="percentage">
                                <h1>515.62%</h1>
                            </div>
                        </div>
                    </div>
                </header>
            </main>
        </section>
    );
    return content;
};

export default Dashboard;
