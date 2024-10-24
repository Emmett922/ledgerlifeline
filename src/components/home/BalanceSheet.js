import { useState, useEffect, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Accounts.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Calendar from "react-calendar";
import Calculator from "../calc/Calculator";
import Draggable from "react-draggable";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";

const BalanceSheet = () => {
    // Function variables
    const [selectedAccount, setSelectedAccount] = useState("");
    const [fetchedAccount, setFetchedAccount] = useState("");
    const [storedUserName, setStoredUserName] = useState("");
    const [storedUserRole, setStoredUserRole] = useState("");
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
    const [accountCatagory, setAccountCatagory] = useState("");
    const [accountSubcatagory, setAccountSubcatagory] = useState("");

    // -- Code for toggling the table in ascending and descending order -- //
    const [isDescending, setIsDescending] = useState(true); // State for sorting order

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
        const [integerPart, decimalPart] = value.split(".");

        // Format the integer part with commas
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Return formatted value with the decimal part
        return `${formattedInteger}.${decimalPart}`;
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

    const getLastDayOfMonth = () => {
        const date = new Date();
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return lastDay.toLocaleDateString(); // Format the date as needed
    };

    const handlePostReferenceClick = (pr) => {
        localStorage.setItem("PR", JSON.stringify(pr));
        navigate("/journalize");
    };

    const calculateTotals = (accounts) => {
        // Helper function to safely get balance as a number
        const getBalance = (account) => {
            const balance = account.balance || 0; // Default to 0 if undefined
            return typeof balance === 'number' ? balance : 0; // Ensure it's a number
        };
    
        // Calculate total revenue
        const totalAsset = accounts
            .filter(account => 
                account.accountCatagory.toLowerCase().includes("asset")
            )
            .reduce((total, account) => total + getBalance(account), 0);
    
        // Calculate total expenses
        const totalEquity = accounts
            .filter(account => 
                account.accountCatagory.toLowerCase().includes("equity")
            )
            .reduce((total, account) => total + getBalance(account), 0);

        // Calculate total expenses
        const totalLiability = accounts
        .filter(account => 
            account.accountCatagory.toLowerCase().includes("liability") &&
            account.accountSubcatagory.toLowerCase().includes("current")
        )
        .reduce((total, account) => total + getBalance(account), 0);

        // NetEquityandLiability (Liabilities + Equity)
        const netEquityandLiability = (totalLiability + totalEquity);

        return netEquityandLiability.toFixed(2);
    };

    // Usage in the component

    const netEquityandLiability = calculateTotals(filteredAccounts);

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
                            title="Income Statement Page Link"
                            id="income-statement-link"
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
                    {(storedUserRole === "Admin" || storedUserRole === "Accountant") && (
                        <div className="header-main">
                            <h1 className="header-title">Balance Sheet</h1>
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
                    {storedUserRole === "Manager" && (
                        <div className="header-main">
                            <h1 className="header-title">Balance Sheet</h1>
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
                <div className="account-ledger-table-container">
                <div style={{
                    backgroundColor: '#007bff',
                    padding: '20px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center' // Ensures text is centered
                }}>
                    <div className="company-title" style={{
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: '24px'
                    }}>
                        Addams & Family Inc.
                    </div>
                    <div className="page-title" style={{
                        color: 'white',
                        fontSize: '20px',
                        marginTop: '10px'
                    }}>
                        Balance Sheet
                    </div>
                    <div className="as-of-date" style={{
                        color: 'white',
                        fontSize: '18px',
                        marginTop: '10px'
                    }}>
                        For the period ending {getLastDayOfMonth()} {/* Needs to change to end of month */}
                    </div>
                </div>
                    <table className="account-ledger-table">
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        fontSize: '22px',
                                    }}
                                >
                                    Assests
                                </th>
                                <th
                                    style={{
                                        textAlign: 'right',
                                        paddingRight: '50px',
                                    }}
                                >
                                    Total Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>{/* Flexbox for Total Assets and Total Balance aligned to table columns */}
                            <tr>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                }}
                                >
                                Current Assets
                                </td>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                    textAlign: 'right',
                                    paddingRight: '50px'
                                }}
                                >
                                {`$${formatWithCommas(
                                filteredAccounts
                                    .filter((account) =>
                                        account.accountCatagory.toLowerCase().includes("asset") &&
                                        account.accountSubcatagory.toLowerCase().includes("current") && 
                                        account.balance > 0
                                    )
                                    .reduce((total, account) => total + (account.balance || 0), 0)
                                    .toFixed(2)
                                )}`}
                                </td>
                            </tr>
                            {filteredAccounts
                                .filter((account) =>
                                    account.accountCatagory.toLowerCase().includes("asset") &&
                                    account.accountSubcatagory.toLowerCase().includes("current") && 
                                    account.balance > 0
                                )
                                .sort((a, b) => a.accountNumber - b.accountNumber)
                                .map((account, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td
                                                style={{ padding: "20px 50px", width: "600px" }}
                                            >
                                                {account.accountName}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "20px 0",
                                                    width: "200px",
                                                    textAlign: "right", // Ensure text is right-aligned
                                                    paddingRight: '250px', // Match the padding of Total Amount
                                                }}
                                            >
                                                {account.balance
                                                    ? `$${formatWithCommas(
                                                        account.balance.toFixed(2)
                                                    )}`
                                                    : "$0.00"}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            <tr>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                }}
                                >
                                Non-Current Assets
                                </td>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                    textAlign: 'right',
                                    paddingRight: '50px'
                                }}
                                >
                                {`$${formatWithCommas(
                                filteredAccounts
                                    .filter((account) =>
                                        account.accountCatagory.toLowerCase().includes("asset") &&
                                        !account.accountSubcatagory.toLowerCase().includes("current") && 
                                        account.balance > 0
                                    )
                                    .reduce((total, account) => total + (account.balance || 0), 0)
                                    .toFixed(2)
                                )}`}
                                </td>
                            </tr>
                            <tr>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                }}
                                >
                                Total Assets
                                </td>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                    textAlign: 'right',
                                    paddingRight: '50px',
                                    textDecoration: 'double underline',
                                    textUnderlineOffset: "3px",
                                }}
                                >
                                {`$${formatWithCommas(
                                filteredAccounts
                                    .filter((account) =>
                                        account.accountCatagory.toLowerCase().includes("asset")
                                    )
                                    .reduce((total, account) => total + (account.balance || 0), 0)
                                    .toFixed(2)
                                )}`}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="account-ledger-table">
                        <thead>
                            <tr>
                                <th
                                    colSpan={2}
                                    style={{
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        fontSize: '22px',
                                    }}
                                >
                                    Equity & liabilities
                                </th>
                            </tr>
                        </thead>
                        <tbody>{/* Flexbox for Total Assets and Total Balance aligned to table columns */}
                            <tr>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                }}
                                >
                                Owners Equity
                                </td>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                    textAlign: 'right',
                                    paddingRight: '50px'
                                }}
                                >
                                {`$${formatWithCommas(
                                filteredAccounts
                                    .filter((account) =>
                                        account.accountCatagory.toLowerCase().includes("equity") &&
                                        account.balance > 0
                                    )
                                    .reduce((total, account) => total + (account.balance || 0), 0)
                                    .toFixed(2)
                                )}`}
                                </td>
                            </tr>
                            {filteredAccounts
                                .filter((account) =>
                                    account.accountCatagory.toLowerCase().includes("equity") &&
                                    account.balance > 0
                                )
                                .sort((a, b) => a.accountNumber - b.accountNumber)
                                .map((account, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td
                                                style={{ padding: "20px 50px", width: "600px" }}
                                            >
                                                {account.accountName}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "20px 0",
                                                    width: "200px",
                                                    textAlign: "right", // Ensure text is right-aligned
                                                    paddingRight: '250px', // Match the padding of Total Amount
                                                }}
                                            >
                                                {account.balance
                                                    ? `$${formatWithCommas(
                                                        account.balance.toFixed(2)
                                                    )}`
                                                    : "$0.00"}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            <tr>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                }}
                                >
                                Current liabilities
                                </td>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                    textAlign: 'right',
                                    paddingRight: '50px'
                                }}
                                >
                                {`$${formatWithCommas(
                                filteredAccounts
                                    .filter((account) =>
                                        account.accountCatagory.toLowerCase().includes("liability") &&
                                        account.accountSubcatagory.toLowerCase().includes("current") && 
                                        account.balance > 0
                                    )
                                    .reduce((total, account) => total + (account.balance || 0), 0)
                                    .toFixed(2)
                                )}`}
                                </td>
                            </tr>
                            {filteredAccounts
                                .filter((account) =>
                                    account.accountCatagory.toLowerCase().includes("liability") &&
                                    account.accountSubcatagory.toLowerCase().includes("current") && 
                                    account.balance > 0
                                )
                                .sort((a, b) => a.accountNumber - b.accountNumber)
                                .map((account, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td
                                                style={{ padding: "20px 50px", width: "600px" }}
                                            >
                                                {account.accountName}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "20px 0",
                                                    width: "200px",
                                                    textAlign: "right", // Ensure text is right-aligned
                                                    paddingRight: '250px', // Match the padding of Total Amount
                                                }}
                                            >
                                                {account.balance
                                                    ? `$${formatWithCommas(
                                                        account.balance.toFixed(2)
                                                    )}`
                                                    : "$0.00"}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            <tr>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                }}
                                >
                                Total Equity & liabilities
                                </td>
                                <td style={{
                                    fontWeight: 'bold',
                                    paddingLeft: "25px",
                                    textAlign: 'right',
                                    paddingRight: '50px',
                                    textDecoration: 'double underline',
                                    textUnderlineOffset: "3px",
                                }}
                                >
                                {`$${formatWithCommas(netEquityandLiability)}`}
                                </td>
                            </tr>
                        </tbody>
                    </table> 
                </div>
            </main>
        </section>
    );
    return content;
};

export default BalanceSheet;
