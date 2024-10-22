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
import { faFilePdf, faFileExcel, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const AccountLedger = () => {
    // Function variables
    const [selectedAccount, setSelectedAccount] = useState("");
    const [fetchedAccount, setFetchedAccount] = useState("");
    const [storedUserName, setStoredUserName] = useState("");
    const [storedUserRole, setStoredUserRole] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [isEditEntryVisible, setIsEditEntryVisible] = useState(false);
    const [isEditEntryActiveVisible, setIsEditEntryActiveVisible] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [changeIsActive, setChangeIsActive] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [fetchedEntry, setFetchedEntry] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [postReferenceFromJournal, setPostReferenceFromJournal] = useState("");
    const [journalEntryArray, setJournalEntryArray] = useState([]);
    const [errorMessageArray, setErrorMessageArray] = useState([]);
    const [accountArray, setAccountArray] = useState([]);
    const [viewEntryDetails, setViewEntryDetails] = useState(false);
    const [files, setFiles] = useState([]);
    const [fullSizeImage, setFullSizeImage] = useState(null);
    
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

    const handleEditInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "isActive") {
            setIsActive(value === "true");
            setChangeIsActive(true);
        } 
    };

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

        // Get all journalEntries
        const fetchJournalEntries = async () => {
            try {
                const response = await fetch(`${API_URL}/journal-entry`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // Gather the result
                const result = await response.json();

                // Handle result
                if (response.ok) {

                    // Process result to break each debit and credit into their own table entries
                    // THIS SEGMENT IS BEING WORKED ON
                    const processedResult = [];
                    for (let i=0; i < result.length; i++) {
                        for (let j=0; j<result[i].debit.length; j++) {
                            processedResult.push({
                                createdAt: result[i].createdAt,
                                createdBy: result[i].createdBy, 
                                debit: result[i].debit[j], 
                                description: result[i].description,
                                files: result[i].files, 
                                postReference: result[i].postReference, 
                                rejectionReason: result[i].rejectionReason,
                                status: result[i].status, 
                                type: result[i].type,
                                updatedAt: result[i].updatedAt,
                                updatedBy: result[i].updatedBy, 
                                __v: result[i].__v,
                                _id: result[i]._id
                            });
                        }
                    }

                    setJournalEntryArray(result);

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
                console.error(err);
                alert("An error occured. Failed to retrieve journal entries!");
            }
        };
        fetchJournalEntries();

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

    const handleRowClick = async (entry) => {
        try {
            setSelectedEntry(entry);
            const response = await fetch(`${API_URL}/journal-entry/files?id=${entry._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch entry files");
            }

            const files = await response.json();

            setFiles(files);
            console.log(files);
            setViewEntryDetails(true);
        } catch (error) {
            console.error("Error fetching entry files: ", error);
            alert("Error getting entry files");
        }
    };

    const handleSearch = (query) => {
        const searchTerms = query.toLowerCase().split(/[\s,]+/); // Split by space or comma

        return journalEntryArray.filter((entry) => {
            const updatedAtDate = new Date(entry.updatedAt).toLocaleDateString();

            // Helper function to check if any term matches a value
            const matchesSearchTerm = (value) => {
                return searchTerms.some((term) => value.toLowerCase().includes(term));
            };

            // Check debit accounts for matching account numbers or names
            const matchesDebit = entry.debit.some(
                (debitAccount) =>
                    matchesSearchTerm(debitAccount.account.accountNumber.toString()) ||
                    matchesSearchTerm(debitAccount.account.accountName)
            );

            // Check credit accounts for matching account numbers or names
            const matchesCredit = entry.credit.some(
                (creditAccount) =>
                    matchesSearchTerm(creditAccount.account.accountNumber.toString()) ||
                    matchesSearchTerm(creditAccount.account.accountName)
            );

            // Check if any search term matches the type, creator, status, or date
            const matchesType = matchesSearchTerm(entry.type.toLowerCase());
            const matchesCreatedBy = matchesSearchTerm(entry.createdBy.toLowerCase());
            const matchesUpdatedAt = searchTerms.some((term) => updatedAtDate.includes(term));
            const matchesUpdatedBy = entry.updatedBy
                ? matchesSearchTerm(entry.updatedBy.toLowerCase())
                : false;

            // Return true if any of the fields match the search query
            return (
                matchesDebit ||
                matchesCredit ||
                matchesType ||
                matchesCreatedBy ||
                matchesUpdatedAt ||
                matchesUpdatedBy
            );
        });
    };

    const filteredJournalEntries = handleSearch(searchQuery);

    const sortedEntries = [...filteredJournalEntries].sort((a, b) => {
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);
        return isDescending ? dateB - dateA : dateA - dateB; // Sort by updatedAt
    });

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

        // Get selected account's id
        const storedAccount = localStorage.getItem("account");

        if (!storedAccount) {
            toast("Could not retrieve stored account id", {
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

        if (storedAccount) {
            setSelectedAccount(storedAccount);
        }
    }, []);

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

    // Receives the post reference from the journal page and automatically searches it
    useEffect(() => {
        const postReferenceFromJournal = JSON.parse(localStorage.getItem("PR"));

        if(postReferenceFromJournal) {
            setPostReferenceFromJournal(postReferenceFromJournal)
            setSearchQuery(postReferenceFromJournal.toString())
        }
        localStorage.removeItem("PR")
    })

    const formatWithCommas = (value) => {
        const [integerPart, decimalPart] = value.split(".");

        // Format the integer part with commas
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Return formatted value with the decimal part
        return `${formattedInteger}.${decimalPart}`;
    };

    // Function to toggle sort order
    const toggleSortOrder = () => {
        setIsDescending((prev) => !prev);
    };

    const [toggleState, setToggleState] = useState(1);
    
    const toggleTab = (index) => {
        setToggleState(index);
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

            <main className="main-content">
                <header className="header">
                    {/* Main heading for admin users to allow new account creation */}
                    {(storedUserRole === "Admin" || storedUserRole === "Manager") && (
                        <div className="header-main">
                            <h1 className="header-title">General Ledger</h1>
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
                        />
                        To:
                        <input
                            type="date"
                            id="to"
                            name="to"
                            title="Ending date range"
                        />
                    </div>
                    <div className="balance-filter">
                        Min:
                        <input
                            type="tel"
                            id="minBalance"
                            name="minBalance"
                            title="Minimum balance range"
                            placeholder="0.00"
                            inputMode="numeric"
                        />
                        Max:
                        <input
                            type="tel"
                            id="maxBalance"
                            name="maxBalance"
                            title="Maximum balance range"
                            placeholder="0.00"
                            inputMode="numeric"
                        />
                    </div>
                    <div className="search-filter">
                        <input
                            type="text"
                            className="search"
                            title="Search the list of entries"
                            placeholder="Search entries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tab Setup */}
                <div className="tab-container">
                    <div
                        className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                        title="Show account updates log"
                        onClick={() => toggleTab(1)}
                    >
                        All Entries
                    </div>

                    <div
                        className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                        title="Show user updates log"
                        onClick={() => toggleTab(2)}
                    >
                        Approved Entries
                    </div>

                    <div
                        className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
                        title="Show login attempts log"
                        onClick={() => toggleTab(3)}
                    >
                        Denied Entries
                    </div>

                    <div
                        className={toggleState === 4 ? "tabs active-tabs" : "tabs"}
                        title="Show login attempts log"
                        onClick={() => toggleTab(4)}
                    >
                        Pending Entries
                    </div>
                </div>

                {/* Accounts Log */}
                {/* Tab Bodies Begin Here */}
                <div className={toggleState === 1 ? "content active-content" : "content"}>
                    <div>
                        <table className="account-table">
                            <thead>
                                <tr>
                                    <th>
                                        <button
                                        onClick={toggleSortOrder}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {isDescending ? (
                                            <FontAwesomeIcon icon={faCaretUp} />
                                        ) : (
                                            <FontAwesomeIcon icon={faCaretDown} />
                                        )}
                                    </button>
                                    </th>
                                    <th>Type</th>
                                    <th>Creator</th>
                                    <th>PR</th>
                                    <th>Accounts</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedEntries.map((entry, index) => (
                                    <tr key={index}>
                                        <td>
                                            <strong>
                                                {new Date(entry.updatedAt).toLocaleDateString()}
                                            </strong>
                                            <br />
                                            <br />
                                            <strong>
                                                <span
                                                    style={{
                                                        color:
                                                            entry.status === "Approved"
                                                                ? "green"
                                                                : entry.status === "Rejected"
                                                                ? "red"
                                                                : "orange",
                                                        textDecoration:
                                                            "none",
                                                        cursor:
                                                            entry.status === "Pending"
                                                                ? "pointer"
                                                                : "default",
                                                    }}
                                                >
                                                    {entry.status === "Rejected"
                                                        ? "Denied"
                                                        : entry.status}
                                                </span>
                                            </strong>
                                            <br />
                                            {entry.status === "Rejected" && (
                                                <div>
                                                    <br />
                                                    <span style={{ fontWeight: "bold" }}>
                                                        Reason:{" "}
                                                    </span>
                                                    <br />
                                                    {entry.rejectionReason}
                                                </div>
                                            )}
                                            {(entry.status === "Approved" ||
                                                entry.status === "Rejected") && (
                                                <span
                                                    style={{
                                                        color: "black",
                                                        textDecoration: "underline",
                                                    }}
                                                >
                                                    <br />
                                                </span>
                                            )}
                                        </td>
                                        <td>{entry.type}</td>
                                        <td>{entry.createdBy}</td>
                                        {entry.status === "Approved" && (
                                            <td>
                                                {entry.debit.map((debitAccount, index) => (
                                                    <div key={index}>
                                                        <span
                                                            style={{
                                                                color: "#007bff",
                                                                cursor: "pointer",
                                                            }}
                                                            title="Navigate to account in General Ledger"
                                                        >
                                                            {debitAccount.account.accountNumber}
                                                        </span>
                                                    </div>
                                                ))}
                                                <br />
                                                {entry.credit.map((creditAccount, index) => (
                                                    <div key={index}>
                                                        <span
                                                            style={{
                                                                color: "#007bff",
                                                                cursor: "pointer",
                                                            }}
                                                            title="Navigate to account in General Ledger"
                                                        >
                                                            {creditAccount.account.accountNumber}
                                                        </span>
                                                    </div>
                                                ))}
                                                <br />
                                            </td>
                                        )}
                                        {(entry.status === "Rejected" ||
                                            entry.status === "Pending") && <td> </td>}
                                        <td>
                                            {entry.debit.map((debitAccount, index) => (
                                                <div key={index}>
                                                    <strong>
                                                        {debitAccount.account.accountName}
                                                    </strong>
                                                </div>
                                            ))}
                                            <br />
                                            {entry.credit.map((creditAccount, index) => (
                                                <div key={index} style={{ paddingLeft: "40px" }}>
                                                    <strong>
                                                        {creditAccount.account.accountName}
                                                    </strong>
                                                </div>
                                            ))}
                                            <br />
                                            <div>
                                                <span style={{ fontWeight: "bold" }}>
                                                    Description:{" "}
                                                </span>
                                                {entry.description}
                                            </div>
                                            <br />
                                            <div>
                                                <span
                                                    style={{
                                                        color: "#007bff",
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                    }}
                                                    title="Click to view entry source documentation"
                                                    onClick={() => handleRowClick(entry)}
                                                >
                                                    Source Documentation
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {entry.debit.map((debitAccount, index) => (
                                                <div key={index}>
                                                    $
                                                    {formatWithCommas(
                                                        debitAccount.amount.toFixed(2)
                                                    )}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            <br />
                                            {entry.debit.map((_, index) => (
                                                <React.Fragment key={index}>
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                            {entry.credit.map((creditAccount, index) => (
                                                <div key={index}>
                                                    $
                                                    {formatWithCommas(
                                                        creditAccount.amount.toFixed(2)
                                                    )}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                            Back to Chart of Accounts
                        </Link>
                    </div>
                </div>

                <div className={toggleState === 2 ? "content active-content" : "content"}>
                    <div>
                        <table className="approved-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>PR</th>
                                    <th>Description</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{`${new Date(fetchedAccount.createdAt).toLocaleString()}`}</td>
                                    {/* Date the transaction Took place */}
                                    <td>{1}</td> {/* This will increment per row */}
                                    <td>Initial Account Balance</td>
                                    <td>
                                        {fetchedAccount.debit
                                            ? `$${formatWithCommas(fetchedAccount.debit.toFixed(2))}`
                                            : " "}
                                    </td>{" "}
                                    {/* Show blank if debit is 0 or debit equals credit */}
                                    <td>
                                        {fetchedAccount.credit
                                            ? `$${formatWithCommas(fetchedAccount.credit.toFixed(2))}`
                                            : " "}
                                    </td>{" "}
                                    {/* Show blank if credit is 0 or credit equals debit */}
                                    <td>
                                            <Link
                                                className="entry-active-link"
                                                title="Change active status"
                                                onClick={() => {
                                                    setSelectedEntry(selectedEntry)
                                                    setIsEditEntryVisible(true);
                                                    setIsEditEntryActiveVisible(true);
                                                }}
                                            >
                                                InsertStatusHere
                                            </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3} style={{ textAlign: "right", fontWeight: "bold" }}>
                                        Total Balance:
                                    </td>
                                    <td
                                        colSpan={4}
                                        style={{
                                            textAlign: "left",
                                            fontWeight: "bold",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        {fetchedAccount.balance
                                            ? `$${formatWithCommas(fetchedAccount.balance.toFixed(2))}`
                                            : " "}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
                            Back to Chart of Accounts
                        </Link>
                    </div>
                </div>

                <div className={toggleState === 3 ? "content active-content" : "content"}>
                    <div>
                        <table className="debnied-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>PR</th>
                                    <th>Description</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{`${new Date(fetchedAccount.createdAt).toLocaleString()}`}</td>
                                    {/* Date the transaction Took place */}
                                    <td>{1}</td> {/* This will increment per row */}
                                    <td>Initial Account Balance</td>
                                    <td>
                                        {fetchedAccount.debit
                                            ? `$${formatWithCommas(fetchedAccount.debit.toFixed(2))}`
                                            : " "}
                                    </td>{" "}
                                    {/* Show blank if debit is 0 or debit equals credit */}
                                    <td>
                                        {fetchedAccount.credit
                                            ? `$${formatWithCommas(fetchedAccount.credit.toFixed(2))}`
                                            : " "}
                                    </td>{" "}
                                    {/* Show blank if credit is 0 or credit equals debit */}
                                </tr>
                                <tr>
                                    <td colSpan={3} style={{ textAlign: "right", fontWeight: "bold" }}>
                                        Total Balance:
                                    </td>
                                    <td
                                        colSpan={4}
                                        style={{
                                            textAlign: "left",
                                            fontWeight: "bold",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        {fetchedAccount.balance
                                            ? `$${formatWithCommas(fetchedAccount.balance.toFixed(2))}`
                                            : " "}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
                            Back to Chart of Accounts
                        </Link>
                    </div>
                </div>

                <div className={toggleState === 4 ? "content active-content" : "content"}>
                    <div>
                        <table className="pending-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>PR</th>
                                    <th>Description</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{`${new Date(fetchedAccount.createdAt).toLocaleString()}`}</td>
                                    {/* Date the transaction Took place */}
                                    <td>{1}</td> {/* This will increment per row */}
                                    <td>Initial Account Balance</td>
                                    <td>
                                        {fetchedAccount.debit
                                            ? `$${formatWithCommas(fetchedAccount.debit.toFixed(2))}`
                                            : " "}
                                    </td>{" "}
                                    {/* Show blank if debit is 0 or debit equals credit */}
                                    <td>
                                        {fetchedAccount.credit
                                            ? `$${formatWithCommas(fetchedAccount.credit.toFixed(2))}`
                                            : " "}
                                    </td>{" "}
                                    {/* Show blank if credit is 0 or credit equals debit */}
                                </tr>
                                <tr>
                                    <td colSpan={3} style={{ textAlign: "right", fontWeight: "bold" }}>
                                        Total Balance:
                                    </td>
                                    <td
                                        colSpan={4}
                                        style={{
                                            textAlign: "left",
                                            fontWeight: "bold",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        {fetchedAccount.balance
                                            ? `$${formatWithCommas(fetchedAccount.balance.toFixed(2))}`
                                            : " "}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
                            Back to Chart of Accounts
                        </Link>
                    </div>
                </div>


                {/* Edit Entry Active Status Modal */}
                {isEditEntryActiveVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span
                                className="close"
                                onClick={() => setIsEditEntryActiveVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Edit Entry's Approval Status</h2>
                            <form>
                                <h3 className="form-sub-title">
                                    Account: <p className="name">{fetchedAccount.accountNumber} {fetchedAccount.accountName}</p>

                                    <td>
                                        {fetchedAccount.debit === 0 ? "":"Debit:"}
                                    </td>
                                    <p className="name">
                                        {fetchedAccount.debit
                                            ? `$${formatWithCommas(fetchedAccount.debit.toFixed(2))}`
                                            : ""}
                                    </p>{" "}
                                    {/* Show blank if debit is 0 or debit equals credit */}
                                    <td>
                                        {fetchedAccount.credit === 0 ? "":"Credit:"}
                                    </td>
                                    <p className="name">
                                        {fetchedAccount.credit
                                            ? `$${formatWithCommas(fetchedAccount.credit.toFixed(2))}`
                                            : " "}
                                    </p>{" "}
                                    {/* Show blank if credit is 0 or credit equals debit */}
                                </h3>
                                <label>
                                    Status:
                                    <select
                                        id="isActive"
                                        name="isActive"
                                        title="Change the entry's approval status"
                                        value={isActive ? "true" : "false"}
                                        onChange={handleEditInputChange}
                                    >
                                        <option value="" disabled>
                                            Select status
                                        </option>
                                        <option value="true">Approved</option>
                                        <option value="false">Denied</option>
                                    </select>
                                </label>
                            </form>
                            <div className="modal-btns">
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Submit the entry status change"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {viewEntryDetails && (
                    <div className="modal">
                        <div className="modal-view-entry-details-content">
                            <span
                                className="close"
                                onClick={() => {
                                    setViewEntryDetails(false);
                                    setFiles([]);
                                }}
                            >
                                &times;
                            </span>
                            <h2>Entry Source Documentation</h2>
                            <div className="file-thumbnails">
                                {files &&
                                    files.map((file) => (
                                        <div key={file._id} className="thumbnail-container">
                                            {file.type && file.type.includes("image") ? (
                                                <img
                                                    src={file.url}
                                                    alt={file.filename}
                                                    className="thumbnail"
                                                    onClick={() => setFullSizeImage(file.url)} // Set the full size image URL on click
                                                />
                                            ) : (
                                                <div className="file-button-container">
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="file-button"
                                                    >
                                                        {/* Check for file.type before using includes */}
                                                        {file.type && file.type.includes("pdf") && (
                                                            <FontAwesomeIcon
                                                                icon={faFilePdf}
                                                                className="file-icon"
                                                            />
                                                        )}
                                                        {file.type &&
                                                            file.type.includes(
                                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                            ) && (
                                                                <FontAwesomeIcon
                                                                    icon={faFileExcel}
                                                                    className="file-icon"
                                                                />
                                                            )}
                                                        {file.type &&
                                                            file.type.includes("text/plain") && (
                                                                <FontAwesomeIcon
                                                                    icon={faFileAlt}
                                                                    className="file-icon"
                                                                />
                                                            )}
                                                        <div className="file-name">
                                                            {file.filename}
                                                        </div>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                        {fullSizeImage && (
                            <div className="full-size-modal">
                                <span
                                    className="close"
                                    onClick={() => setFullSizeImage(null)}
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "20px",
                                        color: "white",
                                        fontSize: "24px",
                                        cursor: "pointer",
                                    }}
                                >
                                    &times;
                                </span>
                                <img
                                    src={fullSizeImage}
                                    alt="Full size"
                                    className="full-size-image"
                                    style={{ maxWidth: "90%", maxHeight: "90%" }} // Ensure the image fits within the modal
                                />
                            </div>
                        )}
                    </div>
                )}

        </section>
    );
    return content;
};

export default AccountLedger;