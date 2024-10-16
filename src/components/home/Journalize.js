import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Accounts.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "react-calendar";
import Calculator from "../calc/Calculator";
import Draggable from "react-draggable";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";

const Journalize = () => {
    // Function variables
    const [isEditJournalVisible, setIsEditJournalVisible] = useState(false);
    const [isEditJournalActiveVisible, setIsEditJournalActiveVisible] = useState(false);
    const [isAddJournalVisible, setIsAddJournalVisible] = useState(false);
    const [viewJournalDetails, setViewJournalDetails] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [fetchedAccount, setFetchedAccount] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [newAccountNumber, setNewAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [newAccountName, setNewAccountName] = useState("");
    const [accountDescription, setAccountDescription] = useState("");
    const [newAccountDescription, setNewAccountDescription] = useState("");
    const [normalSide, setNormalSide] = useState("");
    const [newNormalSide, setNewNormalSide] = useState("");
    const [accountCatagory, setAccountCatagory] = useState("");
    const [newAccountCatagory, setNewAccountCatagory] = useState("");
    const [accountSubcatagory, setAccountSubcatagory] = useState("");
    const [isSubcategoryDisabled, setIsSubcategoryDisabled] = useState(true);
    const [isNewSubcategoryDisabled, setIsNewSubcategoryDisabled] = useState(true);
    const [newAccountSubcatagory, setNewAccountSubcatagory] = useState("");
    const [initialBalance, setInitialBalance] = useState("0.00");
    const [newInitialBalance, setNewInitialBalance] = useState("0.00");
    const [debit, setDebit] = useState("0.00");
    const [newDebit, setNewDebit] = useState("0.00");
    const [credit, setCredit] = useState("0.00");
    const [newCredit, setNewCredit] = useState("0.00");
    const [balance, setBalance] = useState("0.00");
    const [newBalance, setNewBalance] = useState("0.00");
    const [dateAccountAdded, setDateAccountAdded] = useState("");
    const [dateAccountUpdated, setDateAccountUpdated] = useState("");
    const [userID, setUserID] = useState("");
    const [order, setOrder] = useState("");
    const [newOrder, setNewOrder] = useState("");
    const [statement, setStatement] = useState("");
    const [newStatement, setNewStatement] = useState("");
    const [comment, setComment] = useState("");
    const [newComment, setNewComment] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [changeIsActive, setChangeIsActive] = useState(false);
    const [accountArray, setAccountArray] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;
    const [storedUserName, setStoredUserName] = useState("");
    const [storedUserRole, setStoredUserRole] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [minBalance, setMinBalance] = useState("0.00");
    const [maxBalance, setMaxBalance] = useState("0.00");
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
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
    });

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
                alert("An error occured. Failed to retrieve account!");
            }
        };
        fetchAccounts();

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
                    `${API_URL}/accounts/account-by-id?id=${selectedAccount}`,
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

    // Handle the input changes from editing the account
    const handleEditInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "accountNumber") {
            setAccountNumber(value);
        } else if (name === "accountName") {
            setAccountName(value);
        } else if (name === "accountDescription") {
            setAccountDescription(value);
        } else if (name === "debit") {
            setDebit(value);
        } else if (name === "credit") {
            setCredit(value);
        }
    };

    const handleNewInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "accountNumber") {
            setAccountNumber(value);
        } else if (name === "accountName") {
            setAccountName(value);
        } else if (name === "accountDescription") {
            setAccountDescription(value);
        } else if (name === "debit") {
            setDebit(value);
        } else if (name === "credit") {
            setCredit(value);
        }
    };

    const formatWithCommas = (value) => {
        const [integerPart, decimalPart] = value.split(".");

        // Format the integer part with commas
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Return formatted value with the decimal part
        return `${formattedInteger}.${decimalPart}`;
    };

    const handleDebitChange = (event) => {
        const input = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
        const debitValue = parseFloat(input) / 100;

        setDebit(debitValue.toFixed(2)); // Set with two decimal places

        // Update balance
        if (normalSide === "Debit") {
            const newBalance = (debitValue - credit).toFixed(2);
            setBalance(newBalance);
        } else if (normalSide === "Credit") {
            const newBalance = (credit - debitValue).toFixed(2);
            setBalance(newBalance);
        } else {
            const zero = 0.0;
            setBalance(zero.toFixed(2));
        }
    };

    const handleNewDebitChange = (event) => {
        const input = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
        const debitValue = parseFloat(input) / 100;

        setNewDebit(debitValue.toFixed(2)); // Set with two decimal places

        // Update balance
        if (newNormalSide === "Debit") {
            const totalBalance = (debitValue - newCredit).toFixed(2);
            setNewBalance(totalBalance);
            setNewInitialBalance(totalBalance);
        } else if (newNormalSide === "Credit") {
            const totalBalance = (newCredit - debitValue).toFixed(2);
            setNewBalance(totalBalance);
            setNewInitialBalance(totalBalance);
        } else {
            const zero = 0.0;
            setNewBalance(zero.toFixed(2));
            setNewInitialBalance(zero.toFixed(2));
        }
    };

    const handleCreditChange = (event) => {
        const input = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
        const creditValue = parseFloat(input) / 100;

        setCredit(creditValue.toFixed(2)); // Set with two decimal places

        // Update balance
        if (normalSide === "Debit") {
            const newBalance = (debit - creditValue).toFixed(2);
            setBalance(newBalance);
        } else if (normalSide === "Credit") {
            const newBalance = (creditValue - debit).toFixed(2);
            setBalance(newBalance);
        } else {
            const zero = 0.0;
            setBalance(zero.toFixed(2));
        }
    };

    const handleNewCreditChange = (event) => {
        const input = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
        const creditValue = parseFloat(input) / 100;

        setNewCredit(creditValue.toFixed(2)); // Set with two decimal places

        // Update balance
        if (newNormalSide === "Debit") {
            const totalBalance = (newDebit - creditValue).toFixed(2);
            setNewBalance(totalBalance);
            setNewInitialBalance(totalBalance);
        } else if (newNormalSide === "Credit") {
            const totalBalance = (creditValue - newDebit).toFixed(2);
            setNewBalance(totalBalance);
            setNewInitialBalance(totalBalance);
        } else {
            const zero = 0.0;
            setNewBalance(zero.toFixed(2));
            setNewInitialBalance(zero.toFixed(2));
        }
    };

    const handleEditJournal = async () => {
        const editAccountData = {
            id: selectedAccount._id,
            accountName,
            accountNumber,
            accountDescription,
            normalSide: normalSide === "Debit" ? "L" : "R",
            accountCatagory,
            accountSubcatagory,
            debit,
            credit,
            balance,
            order,
            statement,
            comment,
            updatedBy: storedUserName,
        };

        try {
            const response = await fetch(`${API_URL}/accounts/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editAccountData),
            });

            const result = await response.json();

            //Store message locally to deliver on page reload
            localStorage.setItem("toastMessage", result.message);
        } catch (error) {
            console.error("Error submitting edit:", error);
            alert("An error occurred. Please try again.");
        }

        setIsEditJournalVisible(false);
        window.location.reload();
    };

    const handleAddNewJournal = async () => {
        const accountData = {
            accountName: newAccountName,
            accountNumber: newAccountNumber,
            accountDescription: newAccountDescription,
            normalSide: newNormalSide === "Debit" ? "L" : "R",
            debit: newDebit,
            credit: newCredit,
            balance: newBalance,
            createdBy: storedUserName,
        };

        try {
            const response = await fetch(`${API_URL}/accounts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(accountData),
            });

            const result = await response.json();

            localStorage.setItem("toastMessage", result.message);
            setIsAddJournalVisible(false);
            window.location.reload();
        } catch (error) {
            console.error("Error submitting new account details", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleClearAll = () => {
        setNewAccountNumber("");
        setNewAccountName("");
        setNewAccountDescription("");
        setNewDebit("");
        setNewCredit("");
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/"); // Redirect to login
    };

    const isDisabled2 = !newAccountCatagory;

    const isAddNewDisabled = !(
        newAccountName &&
        newAccountNumber &&
        newAccountCatagory &&
        newAccountDescription &&
        newOrder &&
        newComment
    );
    
    const handleSearch = (query) => {
        const searchTerms = query.toLowerCase().split(/[\s,]+/); // Split by space or comma

        return accountArray.filter((account) => {
            // Extract and convert the account creation date to YYYY-MM-DD string
            const accountCreatedDate = new Date(account.createdAt);
            const accountCreatedDateString = accountCreatedDate.toISOString().split("T")[0]; // Get date in 'YYYY-MM-DD' format

            // Convert fromDate and toDate to YYYY-MM-DD strings (if they exist)
            const fromDateString = fromDate ? new Date(fromDate).toISOString().split("T")[0] : null;
            const toDateString = toDate ? new Date(toDate).toISOString().split("T")[0] : null;

            // Apply date filter if fromDate or toDate are set
            const isWithinDateRange = (() => {
                if (!fromDateString && !toDateString) return true; // If no date filters, include all accounts

                if (fromDateString && toDateString) {
                    // Include accounts created between fromDate and toDate (inclusive)
                    return (
                        accountCreatedDateString >= fromDateString &&
                        accountCreatedDateString <= toDateString
                    );
                } else if (fromDateString) {
                    // Include accounts created on or after fromDate
                    return accountCreatedDateString >= fromDateString;
                } else if (toDateString) {
                    // Include accounts created on or before toDate
                    return accountCreatedDateString <= toDateString;
                }
                return true;
            })();

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

            const isActiveStatus = account.isActive ? "active" : "inactive"; // Determine status text

            // Check if any search term matches the relevant fields AND the account is within the date and balance range
            return (
                isWithinDateRange &&
                isWithinBalanceRange &&
                searchTerms.every(
                    (term) =>
                        account.accountNumber.toString().includes(term) ||
                        account.accountName.toLowerCase().includes(term) ||
                        account.accountCatagory.toLowerCase().includes(term) ||
                        account.accountSubcatagory.toLowerCase().includes(term) ||
                        term === account.balance.toFixed(2) || //account.balance.toFixed(2).includes(term) ||
                        account.accountDescription.toLowerCase().includes(term) ||
                        term === isActiveStatus // isActiveStatus.includes(term)
                )
            );
        });
    };

    const filteredJournal = handleSearch(searchQuery);

    const handleViewLedger = (accountId) => {
        // Store the chosen account ID in localStorage
        localStorage.setItem("account", accountId);
        // Navigate to the ledger page
        navigate("/account-ledger");
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const toggleCalculator = () => {
        setShowCalculator(!showCalculator);
    };

    const content = (
        <section className="account">
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
                    {/* Main heading for manager/accountant users to allow new account creation */}
                    {(storedUserRole === "Accountant" || storedUserRole === "Manager") && (
                        <div className="header-main">
                            <h1 className="header-title">Journalize</h1>
                            <button
                                className="action-button1"
                                title="Add a new account"
                                onClick={() => setIsAddJournalVisible(true)}
                            >
                                + Add
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
                    <div className="search-filter">
                        <input
                            type="text"
                            className="search"
                            title="Search the accounts"
                            placeholder="Search accounts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <table className="account-table">
                            <thead>
                                <tr>
                                    <td>{/*Date, not shown*/}</td>
                                    <th>Type</th>
                                    <th>Creator</th>
                                    <th>Accounts</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJournal
                                .sort((a, b) => a.accountNumber - b.accountNumber)
                                .map((account, index) => (
                                    <tr>
                                        <td>{`${new Date(account.createdAt).toLocaleDateString()}`}</td>
                                        <td>{/*Journal "Type" HERE*/}</td>
                                        <td>{account.createdBy}</td>
                                        <td>
                                            {/* First row: Show only the debited account (account number and name) */}
                                            {account.debit > 0 && (
                                                <div>
                                                <span style={{ color: 'blue' }}>{account.accountNumber}</span> - <strong>{account.accountName}</strong>
                                                </div>
                                            )}
                                            
                                            
                                            {/*
                                            // Filter and display debited accounts for the same ledger //
                                            {debit.filter(account => account.ledgerId === currentLedgerId).length > 0 && (
                                                <>
                                                // Display the first debited account if it exists //
                                                <div>
                                                    <span style={{ color: 'blue' }}>{debit[0].accountNumber}</span> - <strong>{debit[0].accountName}</strong>
                                                </div>

                                                // Display additional debited accounts in the same ledger //
                                                {debit.slice(1).filter(account => account.ledgerId === currentLedgerId).map((account, index) => (
                                                    <div key={index} style={{ paddingLeft: '10px' }}>
                                                    <span style={{ color: 'blue' }}>{account.accountNumber}</span> - <strong>{account.accountName}</strong>
                                                    </div>
                                                ))}
                                                </>
                                            )}
                                            */}
                                            

                                            {/* Second row: Show only the credited account (account number and name) */}
                                            {account.credit > 0 && (
                                            <div>
                                                <span style={{ paddingLeft: '20px', color: 'blue' }}>{account.accountNumber}</span> - <strong>{account.accountName}</strong>
                                            </div>
                                            )}
                                            {/* Third row: Description */}
                                            <div>
                                                <span style={{ fontWeight: 'bold' }}>Description: </span>{account.accountDescription}.
                                            </div>
                                        </td>
                                        <td>
                                            {account.debit
                                                ? `$${formatWithCommas(account.debit.toFixed(2))}`
                                                : " "}
                                        </td>{" "}
                                        {/* Show blank if debit is 0 or debit equals credit */}
                                        <td>
                                            <div>
                                                {account.credit
                                                    ? `$${formatWithCommas(account.credit.toFixed(2))}`
                                                    : " "}
                                            </div>
                                        </td>{" "}
                                        {/* Show blank if credit is 0 or credit equals debit */}
                                    </tr>
                                ))};
                            </tbody>
                </table>

                {/* Edit Journal Entry Modal */}
                {isEditJournalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setIsEditJournalVisible(false)}>
                                &times;
                            </span>
                            <h2>Edit Journal Entry</h2>
                            <form>
                                <label>
                                    Account Name:
                                    <input
                                        type="text"
                                        id="accountName"
                                        name="accountName"
                                        title="Edit account name"
                                        value={accountName}
                                        onChange={handleEditInputChange}
                                        placeholder="Account Name"
                                    />
                                </label>
                                <label>
                                    Account Desciption:
                                    <input
                                        type="text"
                                        id="accountDescription"
                                        name="accountDescription"
                                        title="Edit account description"
                                        value={accountDescription}
                                        onChange={handleEditInputChange}
                                        placeholder="Account Description"
                                    />
                                </label>
                                <label>
                                    Account Number:
                                    <input
                                        type="text"
                                        id="accountNumber"
                                        name="accountNumber"
                                        value={accountNumber}
                                        onChange={handleEditInputChange}
                                        placeholder="Account Number"
                                        disabled
                                    />
                                </label>
                                <label>
                                    Debit:
                                    <input
                                        type="tel"
                                        id="debit"
                                        name="debit"
                                        title="Edit account's debit total"
                                        value={debit}
                                        onChange={handleDebitChange}
                                        placeholder="0.00"
                                        inputMode="numeric"
                                    />
                                </label>
                                <label>
                                    Credit:
                                    <input
                                        type="tel"
                                        id="credit"
                                        name="credit"
                                        title="Edit account's credit total"
                                        value={credit}
                                        onChange={handleCreditChange}
                                        placeholder="0.00"
                                        inputMode="numeric"
                                    />
                                </label>
                            </form>
                            <div className="modal-btns">
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Submit changes made to account"
                                    onClick={handleEditJournal}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal for Adding an Journal Entry */}
                {isAddJournalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setIsAddJournalVisible(false)}>
                                &times;
                            </span>
                            <h2>Add New Journal Entry</h2>
                            <form>
                                <label>
                                    Account Name:
                                    <input
                                        type="text"
                                        id="newAccountName"
                                        name="newAccountName"
                                        title="Give the account a unique name"
                                        value={newAccountName}
                                        onChange={handleNewInputChange}
                                        placeholder="Account Name"
                                    />
                                </label>
                                <label>
                                    Account Desciption:
                                    <input
                                        type="text"
                                        id="newAccountDescription"
                                        name="newAccountDescription"
                                        title="Give the account a description"
                                        value={newAccountDescription}
                                        onChange={handleNewInputChange}
                                        placeholder="Account Description"
                                    />
                                </label>
                                <label>
                                    Account Number:
                                    <input
                                        type="text"
                                        id="newAccountNumber"
                                        name="newAccountNumber"
                                        value={newAccountNumber}
                                        onChange={handleNewInputChange}
                                        placeholder="Account Number"
                                        disabled
                                    />
                                </label>
                                <label>
                                    Debit:
                                    <input
                                        type="tel"
                                        id="newDebit"
                                        name="newDebit"
                                        title="Give the account an initial debit total"
                                        value={newDebit}
                                        onChange={handleNewDebitChange}
                                        placeholder="0.00"
                                        inputMode="numeric"
                                        disabled={isDisabled2}
                                    />
                                </label>
                                <label>
                                    Credit:
                                    <input
                                        type="tel"
                                        id="newCredit"
                                        name="newCredit"
                                        title="Give the account an initial credit total"
                                        value={newCredit}
                                        onChange={handleNewCreditChange}
                                        placeholder="0.00"
                                        inputMode="numeric"
                                        disabled={isDisabled2}
                                    />
                                </label>
                            </form>
                            <div className="modal-btns">
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Submit details for account creation"
                                    onClick={handleAddNewJournal}
                                    disabled={isAddNewDisabled}
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Clear all inputs"
                                    onClick={handleClearAll}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Clear all inputs"
                                    onClick={handleClearAll}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </section>
    );
    return content;
};

export default Journalize;
