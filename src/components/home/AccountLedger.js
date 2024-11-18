import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Accounts.css";
import { Link } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import Calendar from "react-calendar";
import Calculator from "../calc/Calculator";
import Draggable from "react-draggable";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";

const AccountLedger = () => {
    // Function variables
    const [selectedAccount, setSelectedAccount] = useState("");
    const [fetchedAccount, setFetchedAccount] = useState("");
    const [storedUserName, setStoredUserName] = useState("");
    const [storedUserRole, setStoredUserRole] = useState("");
    const [storedUserFullName, setStoredUserFullName] = useState("");
    const [storedPostReference, setStoredPostReference] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [fetchedEntry, setFetchedEntry] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [minBalance, setMinBalance] = useState("0.00");
    const [maxBalance, setMaxBalance] = useState("0.00");
    const [errorMessageArray, setErrorMessageArray] = useState([]);
    const [accountArray, setAccountArray] = useState([]);
    const [viewEntryDetails, setViewEntryDetails] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [userArray, setUserArray] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [isEmailUserVisible, setIsEmailUserVisible] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;
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

        // If all other checks are met, get the storedUser's username
        if (storedUser) {
            setStoredUserName(storedUser.username);
            setStoredUserRole(storedUser.role);
            setStoredUserFullName(`${storedUser.first_name} ${storedUser.last_name}`);
        }

        const storedPR = JSON.parse(localStorage.getItem("PR"));

        if (storedPR) {
            setStoredPostReference(storedPR);
            setSearchQuery(storedPR.toString());
            localStorage.removeItem("PR");
        }
    }, []);

    // Fetch accounts from the database
    useEffect(() => {
        // Get all accounts from database
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
                alert("An error occured. Failed to retrieve accounts!");
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

        // Get error messages
        const fetchErrorMessages = async () => {
            try {
                const response = await fetch(`${API_URL}/error-message`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // Gather the result
                const result = await response.json();

                // Handle result
                if (response.ok) {
                    setErrorMessageArray(result);
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
            } catch (err) {
                console.log(err);
                alert("An error occured. Failed to retrieve error messages!");
            }
        };
        fetchErrorMessages();

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

        const JournalCreationResult = localStorage.getItem("JournalCreated");
        if (JournalCreationResult) {
            toast("New Journal Entry Created!", {
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
            setTimeout(() => {
                localStorage.removeItem("journalCreated");
            }, 500);
        }
    }, [API_URL]);

    useEffect(() => {
        const fetchEntryById = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/accounts/account-by-id?id=${selectedEntry}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json,",
                        },
                    }
                );

                const result = await response.json();

                if (response.ok) {
                    setFetchedEntry(result);
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
            }
        };

        if (selectedEntry) {
            fetchEntryById();
        }

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
    }, [selectedEntry]);

    useEffect(() => {
        const fetchAccountById = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/accounts/account-by-id?id=${selectedAccount._id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json,",
                        },
                    }
                );

                const result = await response.json();

                if (response.ok) {
                    setFetchedAccount(result);
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
            }
        };

        if (selectedAccount) {
            fetchAccountById();
        }

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
    }, [selectedAccount]);

    const handleMinBalanceChange = (event) => {
        const input = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
        const minValue = parseFloat(input) / 100;

        setMinBalance(minValue.toFixed(2)); // Set with two decimal places
    };

    const handleMaxBalanceChange = (event) => {
        const input = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
        const maxValue = parseFloat(input) / 100;

        setMaxBalance(maxValue.toFixed(2)); // Set with two decimal places
    };

    const handleSearch = (query) => {
        const searchTerms = query.toLowerCase().split(/[\s,]+/); // Split by space or comma

        return accountArray.filter((account) => {
            // Balance filter logic
            const isWithinBalanceRange = (() => {
                const min = parseFloat(minBalance) || null;
                const max = parseFloat(maxBalance) || null;

                if (!min && !max) return true; // If no balance filters, include all accounts

                if (min !== null && max !== null) {
                    return account.balance >= min && account.balance <= max;
                } else if (min !== null) {
                    return account.balance >= min;
                } else if (max !== null) {
                    return account.balance <= max;
                }
                return true;
            })();

            // Check if any search term matches the relevant fields AND the account is within the date and balance range
            return (
                isWithinBalanceRange &&
                searchTerms.every(
                    (term) =>
                        account.accountNumber.toString().includes(term) ||
                        account.accountName.toLowerCase().includes(term) ||
                        term === account.balance.toFixed(2)
                )
            );
        });
    };

    const filteredAccounts = handleSearch(searchQuery);

    // Receives the post reference from the journal page and automatically searches it

    const formatWithCommas = (value) => {
        // Check if the value is negative
        const isNegative = value < 0;

        // Convert the value to a string and remove the minus sign if negative
        const absoluteValue = Math.abs(value).toFixed(2);

        // Split the value into integer and decimal parts
        const [integerPart, decimalPart] = absoluteValue.split(".");

        // Format the integer part with commas
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Combine formatted integer and decimal parts
        const formattedValue = `${formattedInteger}.${decimalPart}`;

        // Return the formatted value with parentheses if negative
        return isNegative ? `(${formattedValue})` : formattedValue;
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/"); // Redirect to login
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const toggleCalculator = () => {
        setShowCalculator(!showCalculator);
    };

    const toggleRow = (index) => {
        // Toggle the expanded state for the clicked row
        setExpandedRow(expandedRow === index ? null : index);
    };

    const handlePostReferenceClick = (pr) => {
        localStorage.setItem("PR", JSON.stringify(pr));
        navigate("/journalize");
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
        <section className="account ledger">
            <ToastContainer />
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

            <main className="main-content">
                <header className="header">
                    {/* Main heading for admin users to allow new account creation */}
                    {(storedUserRole === "Admin" || storedUserRole === "Manager") && (
                        <div className="header-main">
                            <h1 className="header-title">General Ledger</h1>
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
                    {/* Default main heading */}
                    {storedUserRole === "Accountant" && (
                        <div className="header-main">
                            <h1 className="header-title">General Ledger</h1>
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
                    <div className="balance-filter">
                        Min:
                        <input
                            type="tel"
                            id="minBalance"
                            name="minBalance"
                            title="Minimum balance range"
                            value={minBalance}
                            onChange={handleMinBalanceChange}
                            placeholder="0.00"
                            inputMode="numeric"
                        />
                        Max:
                        <input
                            type="tel"
                            id="maxBalance"
                            name="maxBalance"
                            title="Maximum balance range"
                            value={maxBalance}
                            onChange={handleMaxBalanceChange}
                            placeholder="0.00"
                            inputMode="numeric"
                        />
                    </div>
                    <div className="search-filter">
                        <input
                            type="search"
                            className="search"
                            title="Search General Ledger"
                            placeholder="Search ledger..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="account-ledger-table-container">
                    <table className="account-ledger-table">
                        <tbody>
                            {filteredAccounts
                                .filter(
                                    (account) =>
                                        account.journalEntries && // Account has journal entries
                                        account.journalEntries.length > 0 && // Has at least one journal entry
                                        account.balance !== 0 // Balance is not zero
                                )
                                .sort((a, b) => a.accountNumber - b.accountNumber)
                                .map((account, index) => {
                                    const isExpanded = expandedRow === index; // Check if the current row is expanded

                                    return (
                                        <React.Fragment key={index}>
                                            <tr
                                                className="account-ledger-account-row"
                                                onClick={() => toggleRow(index)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <td style={{ padding: "20px 0" }}>
                                                    {" "}
                                                    {/* Set a fixed width */}
                                                    <span style={{ fontWeight: "bold" }}>
                                                        {account.accountNumber} -{" "}
                                                        {account.accountName}
                                                    </span>
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "20px 0",
                                                        textAlign: "right",
                                                        paddingRight: "25px",
                                                    }}
                                                >
                                                    {" "}
                                                    {/* Set a fixed width */}
                                                    <span style={{ fontWeight: "bold" }}>
                                                        Total Balance:{" "}
                                                    </span>
                                                    <span
                                                        style={{
                                                            textDecoration: "underline",
                                                            textUnderlineOffset: "3px",
                                                            color: "green",
                                                        }}
                                                    >
                                                        {account.balance
                                                            ? `$${formatWithCommas(
                                                                  account.balance.toFixed(2)
                                                              )}`
                                                            : "$0.00"}
                                                    </span>
                                                </td>
                                            </tr>

                                            {/* Nested table for expanded row */}
                                            {isExpanded && (
                                                <tr className="account-entry-row">
                                                    <td colSpan={6}>
                                                        <table className="nested-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Date</th>
                                                                    <th>Description</th>
                                                                    <th>Posted By</th>
                                                                    <th>PR</th>
                                                                    <th>Debit</th>
                                                                    <th>Credit</th>
                                                                    <th>Balance History</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {account.journalEntries &&
                                                                account.journalEntries.length >
                                                                    0 ? (
                                                                    account.journalEntries.map(
                                                                        (entry, entryIndex) => {
                                                                            const isDebit =
                                                                                entry.side ===
                                                                                "debit"; // Check if it's debit or credit
                                                                            return (
                                                                                <React.Fragment
                                                                                    key={entryIndex}
                                                                                >
                                                                                    <tr>
                                                                                        <td>
                                                                                            {new Date(
                                                                                                entry.date
                                                                                            ).toLocaleDateString()}
                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                entry.entryDescription
                                                                                            }
                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                entry.addedBy
                                                                                            }
                                                                                        </td>
                                                                                        {storedUserRole !==
                                                                                            "Admin" && (
                                                                                            <td>
                                                                                                <span
                                                                                                    style={{
                                                                                                        color: "#007bff",
                                                                                                        cursor: "pointer",
                                                                                                    }}
                                                                                                    onClick={() =>
                                                                                                        handlePostReferenceClick(
                                                                                                            entry.postReference
                                                                                                        )
                                                                                                    }
                                                                                                    title="Navigate to journal Entry page"
                                                                                                >
                                                                                                    {
                                                                                                        entry.postReference
                                                                                                    }
                                                                                                </span>
                                                                                            </td>
                                                                                        )}
                                                                                        {storedUserRole ===
                                                                                            "Admin" && (
                                                                                            <td>
                                                                                                <span>
                                                                                                    {
                                                                                                        entry.postReference
                                                                                                    }
                                                                                                </span>
                                                                                            </td>
                                                                                        )}

                                                                                        <td className="debit-column">
                                                                                            {isDebit
                                                                                                ? `$${formatWithCommas(
                                                                                                      entry.amount.toFixed(
                                                                                                          2
                                                                                                      )
                                                                                                  )}`
                                                                                                : " "}
                                                                                        </td>
                                                                                        <td className="debit-column">
                                                                                            {!isDebit
                                                                                                ? `$${formatWithCommas(
                                                                                                      entry.amount.toFixed(
                                                                                                          2
                                                                                                      )
                                                                                                  )}`
                                                                                                : " "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {entry.currBalance
                                                                                                ? `$${formatWithCommas(
                                                                                                      entry.currBalance.toFixed(
                                                                                                          2
                                                                                                      )
                                                                                                  )}`
                                                                                                : " "}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            );
                                                                        }
                                                                    )
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan={6}>
                                                                            No journal entries found
                                                                        </td>
                                                                    </tr>
                                                                )}

                                                                {/* Total Row */}
                                                                {account.journalEntries &&
                                                                    account.journalEntries.length >
                                                                        0 && (
                                                                        <tr
                                                                            style={{
                                                                                borderTop:
                                                                                    "2px solid #000",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                className="blank-column"
                                                                                colSpan={4}
                                                                                style={{
                                                                                    fontWeight:
                                                                                        "bold",
                                                                                    textAlign:
                                                                                        "right",
                                                                                    paddingLeft:
                                                                                        "5%",
                                                                                }}
                                                                            ></td>
                                                                            <td
                                                                                style={{
                                                                                    textDecoration:
                                                                                        "underline",
                                                                                    textUnderlineOffset:
                                                                                        "3px",
                                                                                    color: "green",
                                                                                    textAlign:
                                                                                        "right",
                                                                                }}
                                                                            >
                                                                                {/* Calculate total debits */}
                                                                                {`$${formatWithCommas(
                                                                                    account.journalEntries
                                                                                        .filter(
                                                                                            (
                                                                                                entry
                                                                                            ) =>
                                                                                                entry.side ===
                                                                                                "debit"
                                                                                        )
                                                                                        .reduce(
                                                                                            (
                                                                                                sum,
                                                                                                entry
                                                                                            ) =>
                                                                                                sum +
                                                                                                entry.amount,
                                                                                            0
                                                                                        )
                                                                                        .toFixed(2)
                                                                                )}`}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    textDecoration:
                                                                                        "underline",
                                                                                    textUnderlineOffset:
                                                                                        "3px",
                                                                                    color: "green",
                                                                                    textAlign:
                                                                                        "right",
                                                                                }}
                                                                            >
                                                                                {/* Calculate total credits */}
                                                                                {`$${formatWithCommas(
                                                                                    account.journalEntries
                                                                                        .filter(
                                                                                            (
                                                                                                entry
                                                                                            ) =>
                                                                                                entry.side ===
                                                                                                "credit"
                                                                                        )
                                                                                        .reduce(
                                                                                            (
                                                                                                sum,
                                                                                                entry
                                                                                            ) =>
                                                                                                sum +
                                                                                                entry.amount,
                                                                                            0
                                                                                        )
                                                                                        .toFixed(2)
                                                                                )}`}
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
                <Link
                    className="back-btn"
                    type="button"
                    id="chart-of-accounts-link"
                    title="Accounts Page Link"
                    to="/chart-of-accounts"
                    onClick={() => {
                        localStorage.removeItem("account"); // Remove the account ID
                    }}
                >
                    Go to Chart of Accounts
                </Link>

                {/* Pop-up section to email single user */}
                {isEmailUserVisible && storedUserRole === "Admin" && (
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
                {isEmailUserVisible && storedUserRole === "Manager" && (
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
                {isEmailUserVisible && storedUserRole === "Accountant" && (
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

export default AccountLedger;
