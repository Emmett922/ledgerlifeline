import { Link } from "react-router-dom";
import "./styles/Dashboard.css";

const profileImageUrl = "src/img/Default-pfp.svg.png";
const userName = "John Doe";
const userRole = "Accountant";

const Dashboard = () => {
    const content = (
        <section className="dashboard">
            {/* Side navbar for admin */}
            {userRole === "Admin" && (
                <aside className="sidebar">
                    <div className="profile-img">
                        <img src={profileImageUrl} alt="Profile" className="profile-img" />
                    </div>
                    <div className="profile-name">
                        <span className="profile-name">{userName}</span>
                    </div>
                    <ul className="sidebar-btns">
                        <a>
                            <button className="sidebar-button">
                                <Link className="dashboard-link" to="dashboard">
                                    Dashboard
                                </Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button">
                                <Link className="chart-of-accounts-link">Chart of Accounts</Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button">
                                <Link className="accounts-link">Accounts</Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button">
                                <Link className="users-link" to="users">
                                    Users
                                </Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button">
                                <Link className="event-log-link">Event Log</Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button">
                                <Link className="logout-link" to="/">
                                    Logout
                                </Link>
                            </button>
                        </a>
                    </ul>
                </aside>
            )}

            {/* Side navbar for accountant && manager*/}
            {userRole === "Accountant" && (
                <aside className="sidebar">
                    <div className="profile-img">
                        <img src={profileImageUrl} alt="Profile" className="profile-img" />
                    </div>
                    <div className="profile-name">
                        <span className="profile-name">{userName}</span>
                    </div>
                    <ul className="sidebar-btns">
                        <a>
                            <button className="sidebar-button">
                                <Link className="dashboard-link" to="dashboard">
                                    Dashboard
                                </Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button">
                                <Link className="chart-of-accounts-link">Chart of Accounts</Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button">
                                <Link className="accounts-link">Accounts</Link>
                            </button>
                        </a>
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
                                <Link className="retained-earnings-link">Statement of Retained Earnings</Link>
                            </button>
                        </a>
                        <a>
                            <button className="sidebar-button">
                                <Link className="logout-link" to="/">
                                    Logout
                                </Link>
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
                            <div>
                                <h1>515.62%</h1>
                            </div>
                        </div>
                        <div className="Return-Assets">
                            <h1>Return on Assets</h1>
                            <div>
                                <h1>18.96%</h1>
                            </div>
                        </div>
                        <div className="Rturn-Equity">
                            <h1>Return on Equity</h1>
                            <div>28.02%</div>
                        </div>
                    </div>
                    <div className="bottom-boxes">
                        <div className="Net-Profit">
                            <h1>Net Profit Margin</h1>
                            <div>
                                <h1>49.67%</h1>
                            </div>
                        </div>
                        <div className="Asset-Turnover">
                            <h1>Asset Turnover</h1>
                            <div>
                                <h1>38.18%</h1>
                            </div>
                        </div>
                        <div className="Quick-Ratio">
                            <h1>Quick Ratio</h1>
                            <div>
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
