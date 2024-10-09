import { useState, useEffect, useRef } from "react";
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

const Accounts = () => {
    // Function variables
    const [isEditAccountVisible, setIsEditAccountVisible] = useState(false);
    const [isEditAccountActiveVisible, setIsEditAccountActiveVisible] = useState(false);
    const [isAddAccountVisible, setIsAddAccountVisible] = useState(false);
    const [viewAccountDetails, setViewAccountDetails] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
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

        const accountCreationResult = localStorage.getItem("accountCreated");
        if (accountCreationResult) {
            toast("New Account created!", {
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
                localStorage.removeItem("accountCreated");
            }, 500);
        }
    }, [API_URL]);

    const handleViewLedger = (accountId) => {
        // Store the chosen account ID in localStorage
        localStorage.setItem("account", accountId);
        // Navigate to the ledger page
        navigate("/account-ledger");
    };

    // Handle the input changes from editing the account
    const handleEditInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "accountName") {
            setAccountName(value);
        } else if (name === "accountNumber") {
            setAccountNumber(value);
        } else if (name === "accountDescription") {
            setAccountDescription(value);
        } else if (name === "accountSubcatagory") {
            setAccountSubcatagory(value);
        } else if (name === "debit") {
            setDebit(value);
        } else if (name === "credit") {
            setCredit(value);
        } else if (name === "order") {
            setOrder(value);
        } else if (name === "statement") {
            setStatement(value);
        } else if (name === "comment") {
            setComment(value);
        } else if (name === "isActive") {
            setIsActive(value === "true");
            setChangeIsActive(true);
        }
    };

    const handleNewInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "newAccountName") {
            setNewAccountName(value);
        } else if (name === "newAccountNumber") {
            setNewAccountNumber(value);
        } else if (name === "newAccountDescription") {
            setNewAccountDescription(value);
        } else if (name === "newAccountSubcatagory") {
            setNewAccountSubcatagory(value);
        } else if (name === "newDebit") {
            setNewDebit(value);
        } else if (name === "newCredit") {
            setNewCredit(value);
        } else if (name === "newOrder") {
            setNewOrder(value);
        } else if (name === "newStatement") {
            setNewStatement(value);
        } else if (name === "newComment") {
            setNewComment(value);
        }
    };

    const handleAccountType = (event, isEdit = false, selectedAccount = null) => {
        const { name, value } = event.target;

        // Function to generate the account number based on category and existing accounts
        const generateAccountNumber = (category, accountArray) => {
            let prefix = ""; // Prefix based on the category
            switch (category) {
                case "Asset":
                    prefix = "1";
                    break;
                case "Liability":
                    prefix = "2";
                    break;
                case "Equity":
                    prefix = "3";
                    break;
                case "Expense":
                    prefix = "4";
                    break;
                case "Revenue":
                    prefix = "5";
                    break;
                default:
                    return null;
            }

            // Filter existing accounts by the same category
            const categoryAccounts = accountArray.filter((acc) => acc.accountCatagory === category);

            // Get the sequence number for this category
            const sequenceNumber = categoryAccounts.length + 1;

            // Generate account number with padding and increment logic
            const accountNumber = prefix + sequenceNumber.toString().padStart(4, "0"); // Pad with zeros up to 4 digits

            return accountNumber;
        };

        // Check for new account creation
        if (name === "newAccountCatagory") {
            setNewAccountCatagory(value);

            if (value === "Asset" || value === "Expense") {
                if (newNormalSide === "Credit") {
                    const newValue = (newDebit - newCredit).toFixed(2);
                    setNewNormalSide("Debit");
                    setNewInitialBalance(newValue);
                    setNewBalance(newValue);
                } else {
                    setNewNormalSide("Debit");
                }

                if (value === "Asset") {
                    setIsNewSubcategoryDisabled(false);
                } else if (value === "Expense") {
                    setIsNewSubcategoryDisabled(true);
                }
            } else if (value === "Liability" || value === "Equity" || value === "Revenue") {
                if (newNormalSide === "Debit") {
                    const newValue = (newCredit - newDebit).toFixed(2);
                    setNewNormalSide("Credit");
                    setNewInitialBalance(newValue);
                    setNewBalance(newValue);
                } else {
                    setNewNormalSide("Credit");
                }

                if (value === "Liability") {
                    setIsNewSubcategoryDisabled(false);
                } else if (value === "Equity" || value === "Revenue") {
                    setIsNewSubcategoryDisabled(true);
                }
            }

            // Generate the account number for new accounts
            const newAccountNumber = generateAccountNumber(value, accountArray);
            setNewAccountNumber(newAccountNumber);
        }
        // Handle changes for existing accounts (editing scenario)
        else if (name === "accountCatagory" && isEdit && selectedAccount) {
            const originalCategory = selectedAccount.accountCatagory;
            const originalAccountNumber = selectedAccount.accountNumber;

            // Update the account category when editing
            setAccountCatagory(value);

            // Update the normal side and subcategory handling
            if (value === "Asset" || value === "Expense") {
                if (normalSide === "Credit") {
                    const newValue = (debit - credit).toFixed(2);
                    setNormalSide("Debit");
                    setBalance(newValue);
                } else {
                    setNormalSide("Debit");
                }

                if (value === "Asset") {
                    setIsSubcategoryDisabled(false);
                } else if (value === "Expense") {
                    setIsSubcategoryDisabled(true);
                }
            } else if (value === "Liability" || value === "Equity" || value === "Revenue") {
                if (normalSide === "Debit") {
                    const newValue = (credit - debit).toFixed(2);
                    setNormalSide("Credit");
                    setBalance(newValue);
                } else {
                    setNormalSide("Credit");
                }

                if (value === "Liability") {
                    setIsSubcategoryDisabled(false);
                } else if (value === "Equity" || value === "Revenue") {
                    setIsSubcategoryDisabled(true);
                }
            }

            // Handle category change for existing account
            if (value !== originalCategory) {
                // Category changed, generate new account number
                const newAccountNumber = generateAccountNumber(value, accountArray);
                setAccountNumber(newAccountNumber);
            } else {
                // Category is switched back, restore original account number
                setAccountNumber(originalAccountNumber);
            }
        }
    };

    const isDisabled2 = !newAccountCatagory;

    const isAddNewDisabled = !(
        newAccountName &&
        newAccountNumber &&
        newAccountCatagory &&
        newAccountDescription &&
        newAccountSubcatagory &&
        newOrder &&
        newComment
    );

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

    const handleEditAccount = async () => {
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

        setIsEditAccountVisible(false);
        window.location.reload();
    };

    // Specifically handling the change of a account's active status
    const handleChangeIsActive = async () => {
        // Handle active status change if applicable
        if (changeIsActive) {
            const accountData = {
                accountName: selectedAccount.accountName,
                balance: selectedAccount.balance,
                isActive: isActive,
                updatedBy: storedUserName,
            };

            console.log(accountData);

            try {
                const response = await fetch(`${API_URL}/accounts/active`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(accountData),
                });

                const result = await response.json();

                //Store message locally to deliver on page reload
                localStorage.setItem("toastMessage", result.message);
            } catch (error) {
                console.error("Error submitting edit:", error);
                alert("An error occurred. Please try again.");
            }
            setIsEditAccountVisible(false);
            window.location.reload();
        } else {
            toast("No new active status chosen!", {
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

    const handleAddNewAccount = async () => {
        const accountData = {
            accountName: newAccountName,
            accountNumber: newAccountNumber,
            accountDescription: newAccountDescription,
            normalSide: newNormalSide === "Debit" ? "L" : "R",
            accountCatagory: newAccountCatagory,
            accountSubcatagory: newAccountSubcatagory,
            initialBalance: newInitialBalance,
            debit: newDebit,
            credit: newCredit,
            balance: newBalance,
            createdBy: storedUserName,
            order: newOrder,
            statement: newStatement,
            comment: newComment,
            isActive: true,
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
            setIsAddAccountVisible(false);
            window.location.reload();
        } catch (error) {
            console.error("Error submitting new account details", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear account data
        navigate("/"); // Redirect to login
    };

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
                        account.balance.toFixed(2).includes(term) ||
                        account.accountDescription.toLowerCase().includes(term) ||
                        isActiveStatus.includes(term)
                )
            );
        });
    };

    const filteredAccounts = handleSearch(searchQuery);

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const toggleCalculator = () => {
        setShowCalculator(!showCalculator);
    };

    const content = (
        <section className="chartOfAccount">
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
                            id="chart-of-accounts-link"
                            title="Chart of Accounts Page Link"
                            to="/chart-of-accounts"
                        >
                            Chart of Accounts
                        </Link>
                        <Link
                            className="sidebar-button"
                            id="accounts-link"
                            title="Accounts Page Link"
                            to="/accounts"
                        >
                            Accounts
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
                            id="chart-of-accounts-link"
                            title="Chart of Accounts Page Link"
                            to="/chart-of-accounts"
                        >
                            Chart of Accounts
                        </Link>
                        <Link
                            className="sidebar-button"
                            id="accounts-link"
                            title="Accounts Page Link"
                            to="/accounts"
                        >
                            Accounts
                        </Link>
                        <Link
                            className="sidebar-button"
                            title="Journalize Page Link"
                            id="journalize-link"
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
                    {storedUserRole === "Admin" && (
                        <div className="header-main">
                            <h1 className="header-title">Chart of Accounts</h1>
                            <button
                                className="action-button1"
                                title="Add a new account"
                                onClick={() => setIsAddAccountVisible(true)}
                            >
                                + Add Account
                            </button>
                        </div>
                    )}
                    {/* Default main heading */}
                    {storedUserRole === "Manager" && (
                        <div className="header-main">
                            <h1 className="header-title">Chart of Accounts</h1>
                        </div>
                    )}
                    {/* Main content header-main for accountant users */}
                    {storedUserRole === "Accountant" && (
                        <div className="header-main">
                            <h1 className="header-title accountant">Chart of Accounts</h1>
                            <button
                                onClick={toggleCalendar}
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                            >
                                <FontAwesomeIcon icon={faCalendar} size="2x" />
                            </button>
                            <button
                                onClick={toggleCalculator}
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
                            <th>Number</th>
                            <th>Name</th>{" "}
                            {/*name of the account (cash, accounts receivable, etc.)*/}
                            <th>Type</th> {/*type of the account (asset, liability, equity, et.)*/}
                            <th>Sub-Type</th> {/*current/long term*/}
                            <th>Balance</th> {/*name of the admin's username*/}
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAccounts
                            .filter((account) => account.balance !== 0)
                            .sort((a, b) => a.accountNumber - b.accountNumber)
                            .map((account, index) => (
                                <tr key={index}>
                                    <td id="accountNumber">
                                        <button
                                            className="link-button"
                                            title="View account details"
                                            onClick={() => {
                                                setSelectedAccount(account);
                                                setAccountNumber(account.accountNumber);
                                                setAccountName(account.accountName);
                                                setAccountDescription(account.accountDescription);
                                                if (account.normalSide === "L") {
                                                    setNormalSide("Debit");
                                                } else if (account.normalSide === "R") {
                                                    setNormalSide("Credit");
                                                }
                                                setAccountCatagory(account.accountCatagory);
                                                if (
                                                    account.accountCatagory === "Asset" ||
                                                    account.accountCatagory === "Liability"
                                                ) {
                                                    setIsSubcategoryDisabled(false);
                                                }
                                                setAccountSubcatagory(account.accountSubcatagory);
                                                setInitialBalance(
                                                    account.initialBalance.toFixed(2)
                                                );
                                                setDebit(account.debit.toFixed(2));
                                                setCredit(account.credit.toFixed(2));
                                                setBalance(account.balance.toFixed(2));
                                                setDateAccountAdded(account.createdAt);
                                                setDateAccountUpdated(account.updatedAt);
                                                setUserID(account.createdBy);
                                                setOrder(account.order);
                                                setStatement(account.statement);
                                                setComment(account.comment);
                                                setIsActive(account.isActive);

                                                setViewAccountDetails(true);
                                            }}
                                        >
                                            {account.accountNumber}
                                        </button>
                                    </td>
                                    <td>{account.accountName}</td> {/* Account name */}
                                    <td>{account.accountCatagory}</td> {/* Account type */}
                                    <td>{account.accountSubcatagory}</td>{" "}
                                    {/* Term (current/long term) */}
                                    <td>
                                        {account.balance
                                            ? `$${formatWithCommas(account.balance.toFixed(2))}`
                                            : "$0.00"}
                                    </td>{" "}
                                    {/* Account balance with dollar sign */}
                                    <td>{account.accountDescription}</td> {/* Comments */}
                                    {/* Treat active status cell as link only for admin users */}
                                    {storedUserRole === "Admin" && (
                                        <td>
                                            <Link
                                                className="account-active-link"
                                                onClick={() => {
                                                    setSelectedAccount(account);
                                                    setIsActive(account.isActive);
                                                    setIsEditAccountActiveVisible(true);
                                                }}
                                            >
                                                {account.isActive ? "Active" : "Inactive"}
                                            </Link>
                                        </td>
                                    )}
                                    <td>
                                        {/* Ensure account.id is being passed correctly */}
                                        <Link
                                            type="button"
                                            className="action-button2"
                                            title="view account ledger"
                                            onClick={() => {
                                                handleViewLedger(account._id);
                                            }}
                                        >
                                            View Ledger
                                        </Link>
                                    </td>
                                    {(storedUserRole === "Manager" ||
                                        storedUserRole === "Accountant") && (
                                        <td>{account.isActive ? "Active" : "Inactive"}</td>
                                    )}
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* View Account Details Modal For Admin User */}
                {viewAccountDetails && storedUserRole === "Admin" && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setViewAccountDetails(false)}>
                                &times;
                            </span>
                            <h2>Account Details</h2>
                            <form>
                                <label>
                                    Account Number:
                                    <input
                                        type="text"
                                        id="accountNumber"
                                        name="accountNumber"
                                        value={accountNumber}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Account Name:
                                    <input
                                        type="text"
                                        id="accountName"
                                        name="accountName"
                                        value={accountName}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Account Desciption:
                                    <input
                                        type="text"
                                        id="accountDescription"
                                        name="accountDescription"
                                        value={accountDescription}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Account Catagory:
                                    <input
                                        type="text"
                                        id="accountCatagory"
                                        name="accountCatagory"
                                        value={accountCatagory}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Normal Side:
                                    <input
                                        type="text"
                                        id="normalSide"
                                        name="normalSide"
                                        value={normalSide}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Account Subcatagory:
                                    <input
                                        type="text"
                                        id="accountSubcatagory"
                                        name="accountSubcatagory"
                                        value={accountSubcatagory}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Debit:
                                    <input
                                        type="tel"
                                        id="debit"
                                        name="debit"
                                        value={debit}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Credit:
                                    <input
                                        type="tel"
                                        id="credit"
                                        name="credit"
                                        value={credit}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Initial Balance:
                                    <input
                                        type="text"
                                        id="initialBalance"
                                        name="initialBalance"
                                        value={initialBalance}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Balance:
                                    <input
                                        type="text"
                                        id="balance"
                                        name="balance"
                                        value={balance}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Order:
                                    <input
                                        type="text"
                                        id="order"
                                        name="order"
                                        value={order}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Statement:
                                    <input
                                        type="text"
                                        id="statement"
                                        name="statement"
                                        value={statement}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Comment:
                                    <input
                                        type="text"
                                        id="comment"
                                        name="comment"
                                        value={comment}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Status:
                                    <input
                                        type="text"
                                        id="status"
                                        name="status"
                                        value={isActive ? "Active" : "Inactive"}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Created By:
                                    <input
                                        type="text"
                                        id="createdBy"
                                        name="createdBy"
                                        value={userID}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Time of Account Creation:
                                    <input
                                        type="text"
                                        id="createdAt"
                                        name="createdAt"
                                        value={new Date(dateAccountAdded).toLocaleString("en-US")}
                                        disabled
                                    ></input>
                                </label>
                                <label>
                                    Time of Most Recent Update:
                                    <input
                                        type="text"
                                        id="updatedAt"
                                        name="updatedAt"
                                        value={new Date(dateAccountUpdated).toLocaleString("en-US")}
                                        disabled
                                    ></input>
                                </label>
                            </form>
                            <div className="modal-btns">
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Edit account details"
                                    onClick={() => {
                                        setIsEditAccountVisible(true);
                                        setViewAccountDetails(false);
                                    }}
                                >
                                    Edit
                                </button>
                                <Link
                                    type="button"
                                    className="action-button2"
                                    title="view account ledger"
                                    onClick={handleViewLedger(selectedAccount._id)}
                                >
                                    View Ledger
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* View account detials for Manager and Accountant */}
                {viewAccountDetails &&
                    (storedUserRole === "Accountant" || storedUserRole === "Manager") && (
                        <div className="modal">
                            <div className="modal-content">
                                <span
                                    className="close"
                                    onClick={() => setViewAccountDetails(false)}
                                >
                                    &times;
                                </span>
                                <h2>Account Details</h2>
                                <form>
                                    <label>
                                        Account Number:
                                        <input
                                            type="text"
                                            id="accountNumber"
                                            name="accountNumber"
                                            value={accountNumber}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Account Name:
                                        <input
                                            type="text"
                                            id="accountName"
                                            name="accountName"
                                            value={accountName}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Account Desciption:
                                        <input
                                            type="text"
                                            id="accountDescription"
                                            name="accountDescription"
                                            value={accountDescription}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Account Catagory:
                                        <input
                                            type="text"
                                            id="accountCatagory"
                                            name="accountCatagory"
                                            value={accountCatagory}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Normal Side:
                                        <input
                                            type="text"
                                            id="normalSide"
                                            name="normalSide"
                                            value={normalSide}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Account Subcatagory:
                                        <input
                                            type="text"
                                            id="accountSubcatagory"
                                            name="accountSubcatagory"
                                            value={accountSubcatagory}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Debit:
                                        <input
                                            type="tel"
                                            id="debit"
                                            name="debit"
                                            value={debit}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Credit:
                                        <input
                                            type="tel"
                                            id="credit"
                                            name="credit"
                                            value={credit}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Initial Balance:
                                        <input
                                            type="text"
                                            id="initialBalance"
                                            name="initialBalance"
                                            value={initialBalance}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Balance:
                                        <input
                                            type="text"
                                            id="balance"
                                            name="balance"
                                            value={balance}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Order:
                                        <input
                                            type="text"
                                            id="order"
                                            name="order"
                                            value={order}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Statement:
                                        <input
                                            type="text"
                                            id="statement"
                                            name="statement"
                                            value={statement}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Comment:
                                        <input
                                            type="text"
                                            id="comment"
                                            name="comment"
                                            value={comment}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Status:
                                        <input
                                            type="text"
                                            id="status"
                                            name="status"
                                            value={isActive ? "Active" : "Inactive"}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Created By:
                                        <input
                                            type="text"
                                            id="createdBy"
                                            name="createdBy"
                                            value={userID}
                                            disabled
                                        />
                                    </label>
                                    <label>
                                        Time of Account Creation:
                                        <input
                                            type="text"
                                            id="createdAt"
                                            name="createdAt"
                                            value={new Date(dateAccountAdded).toLocaleString(
                                                "en-US"
                                            )}
                                            disabled
                                        ></input>
                                    </label>
                                    <label>
                                        Time of Most Recent Update:
                                        <input
                                            type="text"
                                            id="updatedAt"
                                            name="updatedAt"
                                            value={new Date(dateAccountUpdated).toLocaleString(
                                                "en-US"
                                            )}
                                            disabled
                                        ></input>
                                    </label>
                                </form>
                                <div className="modal-btns">
                                    <Link
                                        type="button"
                                        className="action-button2"
                                        title="view account ledger"
                                        onClick={handleViewLedger(selectedAccount._id)}
                                    >
                                        View Ledger
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Edit Account Modal */}
                {isEditAccountVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setIsEditAccountVisible(false)}>
                                &times;
                            </span>
                            <h2>Edit Account</h2>
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
                                    Account Catagory:
                                    <select
                                        id="accountCatagory"
                                        name="accountCatagory"
                                        title="Select account's category"
                                        value={accountCatagory}
                                        onChange={(event) =>
                                            handleAccountType(event, true, selectedAccount)
                                        }
                                    >
                                        <option value="" disabled>
                                            Select a catagory
                                        </option>
                                        <option value="Asset">Asset</option>
                                        <option value="Expense">Expense</option>
                                        <option value="Liability">Liability</option>
                                        <option value="Equity">Equity</option>
                                        <option value="Revenue">Revenue</option>
                                    </select>
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
                                    Normal Side:
                                    <input
                                        type="text"
                                        id="normalSide"
                                        name="normalSide"
                                        value={normalSide}
                                        placeholder="Normal Side"
                                        disabled
                                    />
                                </label>
                                <label>
                                    Account Subcatagory:
                                    <select
                                        id="accountSubcatagory"
                                        name="accountSubcatagory"
                                        title="Select account subcategory, is applicable"
                                        value={accountSubcatagory}
                                        onChange={handleEditInputChange}
                                        disabled={isSubcategoryDisabled}
                                    >
                                        <option value="" disabled>
                                            Select a subcategory
                                        </option>
                                        <option value="Current">Current</option>
                                        <option value="Long-Term">Long-Term</option>
                                    </select>
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
                                <label>
                                    Balance:
                                    <input
                                        type="text"
                                        id="balance"
                                        name="balance"
                                        value={balance}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Order:
                                    <input
                                        type="text"
                                        id="order"
                                        name="order"
                                        title="Edit account's order"
                                        value={order}
                                        onChange={handleEditInputChange}
                                        placeholder="Order"
                                    />
                                </label>
                                <label>
                                    Statement:
                                    <select
                                        id="statement"
                                        name="statement"
                                        title="Select a statement for account"
                                        value={statement}
                                        onChange={handleEditInputChange}
                                    >
                                        <option value="" disabled>
                                            Select a statement
                                        </option>
                                        <option value="Income Statement">Income Statement</option>
                                        <option value="Balance Sheet">Balance Sheet</option>
                                        <option value="Retained Earnings">Retained Earnings</option>
                                    </select>
                                </label>
                                <label>
                                    Comment:
                                    <input
                                        type="text"
                                        id="comment"
                                        name="comment"
                                        title="Edit comment for account"
                                        value={comment}
                                        onChange={handleEditInputChange}
                                        placeholder="comment"
                                    />
                                </label>
                            </form>
                            <div className="modal-btns">
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Submit changes made to account"
                                    onClick={handleEditAccount}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Account Active Status Modal */}
                {isEditAccountActiveVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span
                                className="close"
                                onClick={() => setIsEditAccountActiveVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Edit Account's Active Status</h2>
                            <form>
                                <h3 className="form-sub-title">
                                    Account: <p className="name">{selectedAccount.accountName}</p>
                                    Account Balance:{" "}
                                    <p className="name">${selectedAccount.balance.toFixed(2)}</p>
                                </h3>
                                <label>
                                    Active:
                                    <select
                                        id="isActive"
                                        name="isActive"
                                        title="Change the account's active status"
                                        value={isActive ? "true" : "false"}
                                        onChange={handleEditInputChange}
                                    >
                                        <option value="" disabled>
                                            Select status
                                        </option>
                                        <option value="true">Active</option>
                                        <option value="false">Not Active</option>
                                    </select>
                                </label>
                            </form>
                            <div className="modal-btns">
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Submit changes made to the account"
                                    onClick={handleChangeIsActive}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal for Adding an account */}
                {isAddAccountVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setIsAddAccountVisible(false)}>
                                &times;
                            </span>
                            <h2>Add New Account</h2>
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
                                    Account Catagory:
                                    <select
                                        id="newAccountCatagory"
                                        name="newAccountCatagory"
                                        title="Select an account category"
                                        value={newAccountCatagory}
                                        onChange={handleAccountType}
                                    >
                                        <option value="" disabled>
                                            Select a catagory
                                        </option>
                                        <option value="Asset">Asset</option>
                                        <option value="Expense">Expense</option>
                                        <option value="Liability">Liability</option>
                                        <option value="Equity">Equity</option>
                                        <option value="Revenue">Revenue</option>
                                    </select>
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
                                    Normal Side:
                                    <input
                                        type="text"
                                        id="newNormalSide"
                                        name="newNormalSide"
                                        value={newNormalSide}
                                        placeholder="Normal Side"
                                        disabled
                                    />
                                </label>
                                <label>
                                    Account Subcatagory:
                                    <select
                                        id="newAccountSubcatagory"
                                        name="newAccountSubcatagory"
                                        title="Select an account subcategory, if applicable"
                                        value={newAccountSubcatagory}
                                        onChange={handleNewInputChange}
                                        disabled={isNewSubcategoryDisabled}
                                    >
                                        <option value="" disabled>
                                            Select a subcategory
                                        </option>
                                        <option value="Current">Current</option>
                                        <option value="Long-Term">Long-Term</option>
                                    </select>
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
                                <label>
                                    Initial Balance:
                                    <input
                                        type="text"
                                        id="newInitialBalance"
                                        name="newInitialBalance"
                                        value={newInitialBalance}
                                        placeholder="0.00"
                                        disabled
                                    />
                                </label>
                                <label>
                                    Balance:
                                    <input
                                        type="text"
                                        id="newBalance"
                                        name="newBalance"
                                        placeholder="0.00"
                                        value={newBalance}
                                        disabled
                                    />
                                </label>
                                <label>
                                    Order:
                                    <input
                                        type="text"
                                        id="newOrder"
                                        name="newOrder"
                                        title="Give the account an order"
                                        value={newOrder}
                                        onChange={handleNewInputChange}
                                        placeholder="Order"
                                        disabled={isDisabled2}
                                    />
                                </label>
                                <label>
                                    Statement:
                                    <select
                                        id="newStatement"
                                        name="newStatement"
                                        title="Select a statement for the account"
                                        value={newStatement}
                                        onChange={handleNewInputChange}
                                        disabled={isDisabled2}
                                    >
                                        <option value="" disabled>
                                            Select a statement
                                        </option>
                                        <option value="Income Statement">Income Statement</option>
                                        <option value="Balance Sheet">Balance Sheet</option>
                                        <option value="Retained Earnings">Retained Earnings</option>
                                    </select>
                                </label>
                                <label>
                                    Comment:
                                    <input
                                        type="text"
                                        id="newComment"
                                        name="newComment"
                                        title="Give the account a comment"
                                        value={newComment}
                                        onChange={handleNewInputChange}
                                        placeholder="Comment"
                                        disabled={isDisabled2}
                                    />
                                </label>
                            </form>
                            <div className="modal-btns">
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Submit details for account creation"
                                    onClick={handleAddNewAccount}
                                    disabled={isAddNewDisabled}
                                >
                                    Submit
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

export default Accounts;
