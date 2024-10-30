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
                            <img className="pfp2" src="/question2.png" alt="LedgerLifeline Logo" />
                        </Link>
                    </div>
                </aside>
            )}

            {/* Side nav for accountand && manager */}
            {(storedUserRole === "Accountant" || storedUserRole === "Manager") && (
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
                            Our product is a comprehensive web-based accounting and finance
                            management application that empowers users to manage their financial
                            tasks seamlessly from any location with internet connectivity. It
                            supports a wide range of browsers, including Internet Explorer, Firefox,
                            Chrome, and Safari, ensuring accessibility on multiple platforms such as
                            desktop computers, laptops, and tablets. This flexibility makes it ideal
                            for professionals working remotely or on the go.
                        </p>
                        <p>
                            The application is designed with an intuitive user interface and
                            real-time data synchronization, ensuring that all users have access to
                            the most up-to-date financial information. Its cross-browser
                            compatibility and responsive design ensure that the application adjusts
                            automatically to any device's screen size for an optimal experience.
                        </p>
                    </div>

                    <div className="user-roles">
                        <h2>User Roles</h2>
                        <p>
                            The application is structured around three key user roles, each with
                            distinct responsibilities and access levels, to ensure efficient
                            workflow and data security:
                        </p>
                        <ul>
                            <li>
                                <strong>Administrator:</strong> Administrators hold the highest
                                level of access and control within the application. They are
                                responsible for managing user accounts, setting security protocols,
                                configuring application settings, and overseeing the overall
                                operation. They can create, update, or deactivate user profiles and
                                assign roles to ensure the appropriate access levels are maintained.
                            </li>
                            <li>
                                <strong>Manager:</strong> Managers play a pivotal role in overseeing
                                the organization’s financial data. They can view, analyze, and
                                generate financial reports, such as income statements, balance
                                sheets, and cash flow statements, as well as monitor budget
                                performance. Managers can also approve financial transactions and
                                ensure compliance with internal policies.
                            </li>
                            <li>
                                <strong>User:</strong> Users are primarily involved in the
                                day-to-day accounting tasks, such as journalizing transactions,
                                attaching source documents, posting to accounts, and managing the
                                chart of accounts. Their access is restricted to the operational
                                functions relevant to maintaining accurate financial records.
                            </li>
                        </ul>
                    </div>

                    <div className="security-features">
                        <h2>Security Features</h2>
                        <p>
                            Security is a critical aspect of the application, ensuring that
                            sensitive financial data is safeguarded. The platform employs
                            industry-standard security measures, including:
                        </p>
                        <ul>
                            <li>
                                <strong>Password Length:</strong> All user accounts require a
                                minimum password length of 8 characters to ensure adequate
                                complexity and resistance to brute-force attacks.
                            </li>
                            <li>
                                <strong>Password Expiration:</strong> To mitigate potential security
                                risks, passwords must be updated every 90 days, encouraging users to
                                maintain strong and frequently updated credentials.
                            </li>
                            <li>
                                <strong>Password Recovery:</strong> The application offers a
                                straightforward password recovery process, allowing users to
                                retrieve their passwords securely via email verification. This
                                ensures that only authorized users regain access to the account.
                            </li>
                            <li>
                                <strong>Password History:</strong> Users are prohibited from reusing
                                any of their last 5 passwords, thereby preventing the reuse of
                                compromised or old passwords.
                            </li>
                            <li>
                                <strong>Password Complexity:</strong> To bolster security, passwords
                                must contain a mix of uppercase and lowercase letters, numbers, and
                                special characters, making them more resistant to common hacking
                                techniques.
                            </li>
                        </ul>
                    </div>

                    <div className="accounting-functions">
                        <h2>Accounting Functions</h2>
                        <p>
                            The application is equipped with robust accounting tools, streamlining
                            financial management by automating essential accounting processes. Key
                            functions include:
                        </p>
                        <ul>
                            <li>
                                <strong>Chart of Accounts:</strong> Users can create, update, and
                                manage a structured chart of accounts, ensuring that all financial
                                transactions are categorized correctly.
                            </li>
                            <li>
                                <strong>Journalizing Transactions:</strong> Users can record
                                financial transactions in real-time, ensuring that the
                                organization’s ledgers remain up to date.
                            </li>
                            <li>
                                <strong>Source Document Management:</strong> Users can attach and
                                store source documents such as receipts or invoices alongside
                                transactions, allowing for better recordkeeping and audit trails.
                            </li>
                            <li>
                                <strong>Transaction Sorting:</strong> Transactions can be displayed
                                and filtered by date, making it easy to review and audit historical
                                financial records.
                            </li>
                            <li>
                                <strong>Posting to Accounts:</strong> Transactions are automatically
                                posted to the appropriate accounts, minimizing manual entry errors.
                            </li>
                            <li>
                                <strong>Financial Reporting:</strong> The application generates key
                                financial reports, offering users a clear view of their
                                organization’s financial health. Available reports include:
                                <ul>
                                    <li>Trial Balances</li>
                                    <li>Income Statements</li>
                                    <li>Balance Sheets</li>
                                    <li>Cash Flow Statements</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Ratio Analysis:</strong> Users can perform financial ratio
                                analysis, providing insights into liquidity, profitability, and
                                solvency to enhance decision-making processes.
                            </li>
                        </ul>
                    </div>

                    <div className="additional-features">
                        <h2>Additional Features</h2>
                        <p>
                            To improve usability and efficiency, the application includes the
                            following additional features:
                        </p>
                        <ul>
                            <li>
                                <strong>User-Friendly Interface:</strong> The application is
                                designed with an intuitive interface that simplifies navigation,
                                even for users without extensive technical experience.
                            </li>
                            <li>
                                <strong>Real-Time Data Updates:</strong> All financial data is
                                updated in real-time, ensuring that users always have access to the
                                most current information.
                            </li>
                            <li>
                                <strong>Customizable Settings:</strong> Users can tailor the
                                application’s settings to match their specific workflow needs,
                                enhancing the overall user experience.
                            </li>
                            <li>
                                <strong>Third-Party Integration:</strong> The application integrates
                                seamlessly with other financial tools and platforms, including
                                payroll systems, tax software, and budgeting applications.
                            </li>
                        </ul>
                    </div>

                    <div className="support">
                        <h2>Support and Documentation</h2>
                        <p>
                            We offer a comprehensive support system to ensure that users can make
                            the most of the application, including:
                        </p>
                        <ul>
                            <li>
                                <strong>In-App Help:</strong> Contextual help resources are
                                available within the application, guiding users through specific
                                features and functionalities.
                            </li>
                            <li>
                                <strong>Detailed Documentation:</strong> The application includes
                                thorough documentation covering all features, from basic usage to
                                advanced configuration.
                            </li>
                            <li>
                                <strong>Technical Support:</strong> Users have access to dedicated
                                customer support for technical assistance, troubleshooting, and
                                issue resolution.
                            </li>
                        </ul>
                    </div>
                    <div className="sprint-overview">
                        <h2>Sprint 1: Feature List for User Interface Module</h2>
                        <p>
                            This sprint focuses on creating the core user interface elements
                            required for the application. These elements include login forms,
                            role-specific dashboards, and navigation bars for easy access to the
                            application's features. The goal is to create a responsive,
                            user-friendly interface tailored to each role (Administrator, Manager,
                            and Accountant).
                        </p>

                        <div className="login-page">
                            <h3>Login Page</h3>
                            <p>
                                The login page allows users to authenticate themselves and access
                                their respective dashboards based on their roles. The form includes
                                basic login fields and a password recovery feature.
                            </p>
                            <ul>
                                <li>
                                    <strong>Username Input:</strong> A text field for entering the
                                    username or email address.
                                </li>
                                <li>
                                    <strong>Password Input:</strong> A password field with masked
                                    input for security.
                                </li>
                                <li>
                                    <strong>Login Button:</strong> Triggers user authentication and
                                    redirects to the appropriate dashboard.
                                </li>
                                <li>
                                    <strong>Forgot Password Link:</strong> Allows users to initiate
                                    the password recovery process.
                                </li>
                                <li>
                                    <strong>Error Notification:</strong> Displays error messages for
                                    incorrect login credentials or account lockout.
                                </li>
                            </ul>
                        </div>

                        <div className="dashboard-page">
                            <h3>Dashboard Page</h3>
                            <p>
                                After logging in, users will be redirected to their respective
                                dashboards. Each role will have a unique dashboard view,
                                highlighting key data and actionable items relevant to their role.
                            </p>
                            <ul>
                                <li>
                                    <strong>Administrator Dashboard:</strong> Access to user
                                    management, system settings, and security configurations.
                                </li>
                                <li>
                                    <strong>Manager Dashboard:</strong> Overview of financial
                                    reports, budgets, and performance metrics.
                                </li>
                                <li>
                                    <strong>Accountant Dashboard:</strong> Tools for journal
                                    entries, chart of accounts management, and transaction tracking.
                                </li>
                            </ul>
                        </div>

                        <div className="navigation-bar">
                            <h3>Navigation Bar</h3>
                            <p>
                                A role-based navigation bar provides easy access to key features,
                                enabling users to quickly move between modules such as account
                                management, financial reporting, and ledger updates.
                            </p>
                        </div>
                    </div>

                    <div className="sprint-overview">
                        <h2>Sprint 2: Chart of Accounts Module</h2>
                        <p>
                            This sprint involves developing the chart of accounts (COA) module,
                            which allows users to create, update, and manage accounts that track an
                            organization's financial transactions. This page will be critical for
                            both accountants and managers.
                        </p>

                        <div className="coa-page">
                            <h3>Chart of Accounts Page</h3>
                            <ul>
                                <li>
                                    <strong>Account Creation Form:</strong> Allows users to input
                                    account details, such as account name, type (asset, liability,
                                    income, etc.), and balance.
                                </li>
                                <li>
                                    <strong>Account List:</strong> Displays a table of existing
                                    accounts with options to edit, deactivate, or delete accounts.
                                </li>
                                <li>
                                    <strong>Filter Options:</strong> Provides search and filter
                                    tools to quickly locate specific accounts by account number,
                                    type, or name.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="sprint-overview">
                        <h2>Sprint 3: Journalizing and Ledger Module</h2>
                        <p>
                            In this sprint, the journalizing module is developed to record and track
                            financial transactions. This page allows users to input transaction
                            details and attach source documents. Additionally, this sprint covers
                            the ledger module, where posted transactions are stored.
                        </p>

                        <div className="journal-page">
                            <h3>Journal Page</h3>
                            <ul>
                                <li>
                                    <strong>Transaction Input Form:</strong> A form where users can
                                    enter details about financial transactions (date, description,
                                    debit, credit).
                                </li>
                                <li>
                                    <strong>Source Document Upload:</strong> Users can attach
                                    receipts, invoices, or other documents to transactions for
                                    auditing purposes.
                                </li>
                            </ul>
                        </div>

                        <div className="ledger-page">
                            <h3>Ledger Page</h3>
                            <ul>
                                <li>
                                    <strong>Posted Transactions List:</strong> Displays transactions
                                    that have been posted to specific accounts.
                                </li>
                                <li>
                                    <strong>Filter by Date/Account:</strong> Users can filter
                                    transactions by date range or account to review specific periods
                                    or accounts.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="sprint-overview">
                        <h2>Sprint 4: Adjusting Entries and Financial Reports</h2>
                        <p>
                            The focus of this sprint is to develop the functionality for adjusting
                            entries and generating key financial reports, including income
                            statements, balance sheets, and cash flow statements. Adjusting entries
                            will ensure that financial data is accurate and up to date.
                        </p>

                        <div className="adjusting-entries-page">
                            <h3>Adjusting Entries Page</h3>
                            <ul>
                                <li>
                                    <strong>Adjusting Entry Form:</strong> Users can input
                                    adjustments for accrued expenses, prepaid expenses, and
                                    depreciation.
                                </li>
                                <li>
                                    <strong>Preview Adjustments:</strong> A feature that allows
                                    users to preview the impact of adjustments before finalizing
                                    them.
                                </li>
                            </ul>
                        </div>

                        <div className="financial-reports-page">
                            <h3>Financial Reports Page</h3>
                            <ul>
                                <li>
                                    <strong>Income Statement:</strong> Automatically generated based
                                    on the organization's revenue and expenses, providing a summary
                                    of profits or losses.
                                </li>
                                <li>
                                    <strong>Balance Sheet:</strong> Displays the company's assets,
                                    liabilities, and equity.
                                </li>
                                <li>
                                    <strong>Cash Flow Statement:</strong> Tracks the flow of cash in
                                    and out of the organization.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="sprint-overview">
                        <h2>Sprint 5: Financial Ratios and Dashboards</h2>
                        <p>
                            This sprint focuses on developing the ratio analysis and dashboard
                            functionalities. Users will be able to perform financial analysis and
                            view key metrics such as liquidity, profitability, and solvency directly
                            from the dashboard.
                        </p>

                        <div className="ratio-analysis-page">
                            <h3>Ratio Analysis Page</h3>
                            <ul>
                                <li>
                                    <strong>Liquidity Ratios:</strong> Calculates ratios such as the
                                    current ratio and quick ratio to assess the company’s ability to
                                    cover short-term liabilities.
                                </li>
                                <li>
                                    <strong>Profitability Ratios:</strong> Measures profitability
                                    using ratios like return on assets (ROA) and return on equity
                                    (ROE).
                                </li>
                                <li>
                                    <strong>Solvency Ratios:</strong> Evaluates long-term financial
                                    stability through debt-to-equity ratios and interest coverage.
                                </li>
                            </ul>
                        </div>

                        <div className="dashboard-page">
                            <h3>Financial Dashboard Page</h3>
                            <ul>
                                <li>
                                    <strong>Real-Time Financial Metrics:</strong> Displays real-time
                                    financial data, including cash balances, revenue, and expenses.
                                </li>
                                <li>
                                    <strong>Graphical Insights:</strong> Interactive graphs and
                                    charts showing financial trends and performance over time.
                                </li>
                                <li>
                                    <strong>Customizable Widgets:</strong> Users can customize the
                                    dashboard by adding or removing widgets relevant to their roles.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    );
    return content;
};

export default Help;
