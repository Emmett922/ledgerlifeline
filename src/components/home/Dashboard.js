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
    const [accountArray, setAccountArray] = useState([]);
    const [returnOnAssets, setReturnOnAssets] = useState(null);
    const [returnOnEquity, setReturnOnEquity] = useState(null);
    const [netProfitPercent, setNetProfitPercent] = useState(null);
    const [assetTurnover, setAssetTurnover] = useState(null);
    const [quickRatio, setQuickRatio] = useState(null);
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
                alert("An error occured. Failed to retrieve account!");
            }
        };
        fetchAccounts();

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
            localStorage.removeItem("toastMessage");
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

    const handleClickToJournal = () => {
        localStorage.setItem("tab", "pending");
        navigate("/journalize");
    };

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

    // Helper function to convert a date to "YYYY-MM-DD" format
    const formatDateString = (date) => {
        const dateObj = new Date(date); // Ensure date is a Date object
        if (isNaN(dateObj)) {
            console.error("Invalid date encountered:", date);
            return null;
        }
        // Format date to "YYYY-MM-DD"
        return dateObj.toISOString().split("T")[0];
    };

    const findClosestBalance = (journalEntries, asOfDate) => {
        const asOfDateString = formatDateString(asOfDate);

        if (!asOfDateString) {
            console.error("Invalid asOfDate provided:", asOfDate);
            return 0;
        }

        // Filter entries based on the criteria
        const validEntries = journalEntries
            .filter((entry) => {
                const entryDateString = formatDateString(entry.date);

                // Check both conditions: valid date and type not "Closing"
                return (
                    entryDateString && entryDateString <= asOfDateString && entry.type !== "Closing"
                );
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort in descending order by date

        // Return the closest entry's currBalance as an integer, or 0 if none found
        return validEntries.length > 0 ? parseInt(validEntries[0].currBalance, 10) : 0;
    };

    const calculateCurrentRatio = () => {
        let assetBalance = 0;
        let liabilityBalance = 0;

        for (let account of accountArray) {
            if (account.accountCatagory === "Asset" && account.accountSubcatagory === "Current") {
                assetBalance += account.balance;
            }
            if (
                account.accountCatagory === "Liability" &&
                account.accountSubcatagory === "Current"
            ) {
                liabilityBalance += account.balance;
            }
        }

        return ((assetBalance / liabilityBalance) * 100).toFixed(2);
    };
    const currentRatio = calculateCurrentRatio();

    const calculateReturnOnAssets = () => {
        let totalAssets = 0;
        let netIncome = 0;
        let retainedEarnings = 0;

        for (let account of accountArray) {
            if (account.accountCatagory === "Asset") {
                totalAssets += account.balance;
            }
            if (account.accountCatagory === "Revenue") {
                netIncome += account.balance;
            }
            if (account.accountCatagory === "Expense") {
                netIncome -= account.balance;
            }
            if (account.accountName === "Retained Earnings") {
                retainedEarnings += account.balance;
            }
        }

        if (netIncome === 0) {
            netIncome = retainedEarnings;
        }

        if (totalAssets === 0) {
            return 0;
        }

        return ((netIncome / totalAssets) * 100).toFixed(2);
    };

    const calculateReturnOnEquity = () => {
        let totalEquity = 0;
        let netIncome = 0;
        let retainedEarnings = 0;

        for (let account of accountArray) {
            if (account.accountCatagory === "Equity") {
                totalEquity += account.balance;
            }
            if (account.accountCatagory === "Revenue") {
                netIncome += account.balance;
            }
            if (account.accountCatagory === "Expense") {
                netIncome -= account.balance;
            }
            if (account.accountName === "Retained Earnings") {
                retainedEarnings += account.balance;
            }
        }

        if (netIncome === 0) {
            netIncome = retainedEarnings;
        }

        if (totalEquity === 0) {
            return 0;
        }

        return ((netIncome / totalEquity) * 100).toFixed(2);
    };

    const calculateNetProfit = () => {
        let revenue = 0;
        let expense = 0;
        let now = new Date();

        for (let account of accountArray) {
            if (account.accountCatagory === "Revenue") {
                revenue += findClosestBalance(account.journalEntries, now);
            }

            if (account.accountCatagory === "Expense") {
                expense += findClosestBalance(account.journalEntries, now);
            }
        }

        // Avoid division by zero
        if (revenue === 0) {
            return 0;
        }

        // Correct formula for Net Profit Margin
        return (((revenue - expense) / revenue) * 100).toFixed(2);
    };

    const calculateAssetTurnover = () => {
        let totalAssets = 0;
        let totalRevenue = 0;

        for (let account of accountArray) {
            if (account.accountCatagory === "Asset") {
                totalAssets += account.balance;
            }

            if (account.accountCatagory === "Revenue") {
                totalRevenue += account.balance;
            }
        }

        return ((totalRevenue / totalAssets) * 100).toFixed(2);
    };

    const calculateQuickRatio = () => {
        let quickAssets = 0;
        let currentLiabilities = 0;

        for (let account of accountArray) {
            // Include only the most liquid assets
            if (
                account.accountCatagory === "Asset" &&
                account.accountSubcatagory === "Current" &&
                ["Cash", "Accounts Receivable"].includes(
                    account.accountName
                )
            ) {
                quickAssets += account.balance;
            }

            // Include only current liabilities
            if (
                account.accountCatagory === "Liability" &&
                account.accountSubcatagory === "Current"
            ) {
                currentLiabilities += account.balance;
            }
        }

        // Avoid division by zero
        if (currentLiabilities === 0) {
            console.warn("No current liabilities available to calculate quick ratio.");
            return 0; // or return "N/A"
        }

        // Return the quick ratio
        return ((quickAssets / currentLiabilities) * 100).toFixed(2);
    };

    // Calculate dashboard values once accountArray is updated
    useEffect(() => {
        if (accountArray.length > 0) {
            const roa = calculateReturnOnAssets();
            setReturnOnAssets(roa);

            const roe = calculateReturnOnEquity();
            setReturnOnEquity(roe);

            const np = calculateNetProfit();
            setNetProfitPercent(np);

            const ato = calculateAssetTurnover();
            setAssetTurnover(ato);

            const qr = calculateQuickRatio();
            setQuickRatio(qr);
        }
    }, [accountArray]); // Recalculate when accountArray changes

    // Arrow animation effect
    useEffect(() => {
        const animateAndSetArrows = (
            element,
            targetValue,
            duration,
            customThresholdLow,
            customThresholdHigh
        ) => {
            if (!element) return;
            const stepTime = Math.abs(Math.floor(duration / targetValue));
            let currentValue = 0;

            const ratioNumElement = element.querySelector(".ratio-num");
            const arrow = element.querySelector(".arrow");

            if (!ratioNumElement || !arrow) return;

            arrow.textContent = "→"; // Neutral side arrow
            ratioNumElement.style.color = "orange";
            arrow.style.color = "orange";

            const interval = setInterval(() => {
                currentValue += 1;
                ratioNumElement.textContent = `${currentValue.toFixed(2)}%`;

                if (currentValue > customThresholdHigh) {
                    ratioNumElement.style.color = "green";
                    arrow.style.color = "green";
                    arrow.textContent = "↑"; // Up arrow for high values
                } else if (currentValue < customThresholdLow) {
                    ratioNumElement.style.color = "red";
                    arrow.style.color = "red";
                    arrow.textContent = "↓"; // Down arrow for low values
                } else {
                    ratioNumElement.style.color = "orange";
                    arrow.style.color = "orange";
                    arrow.textContent = "→"; // Side arrow for neutral values
                }

                if (currentValue >= targetValue) {
                    clearInterval(interval);
                    ratioNumElement.textContent = `${targetValue.toFixed(2)}%`;
                }
            }, stepTime);
        };

        // Trigger animations
        const ratioElements = document.querySelectorAll(".percentage");
        ratioElements.forEach((el) => {
            const ratioNumElement = el.querySelector(".ratio-num");
            if (!ratioNumElement) return;

            const targetValue = parseFloat(ratioNumElement.textContent.replace("%", ""));
            const ratioClass = el.classList[1];
            let customThresholdLow = 0;
            let customThresholdHigh = 0;

            // Define custom thresholds based on ratio type
            if (ratioClass === "Current-Ratio") {
                customThresholdLow = 133.33;
                customThresholdHigh = 350;
            }
            if (ratioClass === "Return-Assets") {
                customThresholdLow = 3;
                customThresholdHigh = 5;
            }
            if (ratioClass === "Return-Equity") {
                customThresholdLow = 5;
                customThresholdHigh = 10;
            }
            if (ratioClass === "Net-Profit") {
                customThresholdLow = 5;
                customThresholdHigh = 10;
            }
            if (ratioClass === "Asset-Turnover") {
                customThresholdLow = 0.5;
                customThresholdHigh = 0.75;
            }
            if (ratioClass === "Quick-Ratio") {
                customThresholdLow = 0.9;
                customThresholdHigh = 1.2;
            }

            if (!isNaN(targetValue)) {
                animateAndSetArrows(el, targetValue, 1000, customThresholdLow, customThresholdHigh);
            }
        });
    }, [returnOnAssets, returnOnEquity]); // Re-run when values change.

    useEffect(() => {
        // Function to animate and add arrow icons
        const animateAndSetArrows = (
            element,
            targetValue,
            duration,
            customThresholdLow,
            customThresholdHigh
        ) => {
            if (!element) return; // Skip if the element doesn't exist
            const stepTime = Math.abs(Math.floor(duration / targetValue));
            let currentValue = 0;

            const interval = setInterval(() => {
                const ratioNumElement = element.querySelector(".ratio-num");
                const arrow = element.querySelector(".arrow");

                if (!ratioNumElement || !arrow) {
                    clearInterval(interval); // Stop if element is null
                    return;
                }

                currentValue += 1;
                ratioNumElement.textContent = `${currentValue.toFixed(2)}%`;

                // Apply color progressively during count based on the ratio type's thresholds
                if (currentValue > customThresholdHigh) {
                    ratioNumElement.style.color = "green";
                    arrow.style.color = "green"; // Set the arrow color to match
                } else if (currentValue < customThresholdLow) {
                    ratioNumElement.style.color = "red";
                    arrow.style.color = "red"; // Set the arrow color to match
                } else {
                    ratioNumElement.style.color = "orange";
                    arrow.style.color = "orange"; // Set the arrow color to match
                }

                if (currentValue >= targetValue) {
                    clearInterval(interval);
                    ratioNumElement.textContent = `${targetValue.toFixed(2)}%`;

                    // Set final arrow based on value and custom threshold
                    if (targetValue > customThresholdHigh) {
                        arrow.textContent = "↑"; // Up arrow for high (above 70%)
                        ratioNumElement.style.color = "green"; // Match number color
                        arrow.style.color = "green"; // Match arrow color
                    } else if (targetValue < customThresholdLow) {
                        arrow.textContent = "↓"; // Down arrow for low (below 60%)
                        ratioNumElement.style.color = "red"; // Match number color
                        arrow.style.color = "red"; // Match arrow color
                    } else {
                        arrow.textContent = "→"; // Side arrow for neutral (between 60%-70%)
                        ratioNumElement.style.color = "orange"; // Match number color
                        arrow.style.color = "orange"; // Match arrow color
                    }
                }
            }, stepTime);
        };

        // Query all elements with the "percentage" class and process them
        const ratioElements = document.querySelectorAll(".percentage");
        ratioElements.forEach((el) => {
            const ratioNumElement = el.querySelector(".ratio-num");
            if (!ratioNumElement) return; // Skip if the ratio number element is missing

            const targetValue = parseFloat(ratioNumElement.textContent.replace("%", ""));
            const ratioClass = el.classList[1]; // Get the class of the current box
            let customThresholdLow = 0;
            let customThresholdHigh = 0;

            // Define custom thresholds for each ratio
            if (ratioClass === "Current-Ratio") {
                customThresholdLow = 133.33; // (1:75) Lower threshold for Current Ratio
                customThresholdHigh = 350; // (2:25) Upper threshold for Current Ratio
            }
            if (ratioClass === "Return-Assets") {
                customThresholdLow = 3; // Return Assets lower threshold
                customThresholdHigh = 5; // Return Assets upper threshold
            }
            if (ratioClass === "Return-Equity") {
                customThresholdLow = 5; // Return Equity lower threshold
                customThresholdHigh = 10; // Return Equity upper threshold
            }
            if (ratioClass === "Net-Profit") {
                customThresholdLow = 5; // Net Profit lower threshold
                customThresholdHigh = 10; // Net Profit upper threshold
            }
            if (ratioClass === "Asset-Turnover") {
                customThresholdLow = 0.5; // Asset Turnover lower threshold
                customThresholdHigh = 0.75; // Asset Turnover upper threshold
            }
            if (ratioClass === "Quick-Ratio") {
                customThresholdLow = 111.11; // (1:0.9) Quick Ratio lower threshold
                customThresholdHigh = 120; // (1.2:1) Quick Ratio upper threshold
            }

            if (!isNaN(targetValue)) {
                animateAndSetArrows(el, targetValue, 1000, customThresholdLow, customThresholdHigh); // 1-second animation with thresholds
            }
        });
    }, []);

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
                                title="Email"
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
                                title="Email"
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
                <div className="dashboard1">
                    <div className="top-boxes">
                        <div className="percentage Current-Ratio">
                            <div className="box-title">Current Ratio</div>
                            <div className="ratio-num">{currentRatio}%</div>
                            <div className="arrow"></div>
                        </div>
                        <div className="percentage Return-Assets">
                            <div className="box-title">Return on Assets</div>
                            <div className="ratio-num">{returnOnAssets}%</div>
                            <div className="arrow"></div>
                        </div>
                        <div className="percentage Return-Equity">
                            <div className="box-title">Return on Equity</div>
                            <div className="ratio-num">{returnOnEquity}%</div>
                            <div className="arrow"></div>
                        </div>
                    </div>
                    <div className="bottom-boxes">
                        <div className="percentage Net-Profit">
                            <div className="box-title">Net Profit</div>
                            <div className="ratio-num">{netProfitPercent}%</div>
                            <div className="arrow"></div>
                        </div>
                        <div className="percentage Asset-Turnover">
                            <div className="box-title">Asset Turnover</div>
                            <div className="ratio-num">{assetTurnover}%</div>
                            <div className="arrow"></div>
                        </div>
                        <div className="percentage Quick-Ratio">
                            <div className="box-title">Quick Ratio</div>
                            <div className="ratio-num">{quickRatio}</div>
                            <div className="arrow"></div>
                        </div>
                    </div>
                    <div className="pending-row">
                        <div
                            className="Pending"
                            onClick={handleClickToJournal}
                            title="Go to pending journal entries"
                        >
                            <div className="box-title" style={{ color: "orange" }}>
                                Pending Entries: {pendingEntries.length}
                            </div>
                            <div className="linkHint" style={{ color: "orange" }}>
                                {">"}
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
