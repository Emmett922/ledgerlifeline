import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Accounts.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountLedger = () => {
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

    const handleLogout = () => {
        localStorage.removeItem("user");
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
                        <Link
                            type="help-button"
                            id="help-link"
                            title="Help Page Link"
                            to="/help"
                        >
                            <img className="pfp2" src="/question2.png" alt="LedgerLifeline Logo"/>
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
                            to="dashboard"
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
                        <Link
                            type="help-button"
                            id="help-link"
                            title="Help Page Link"
                            to="/help"
                        >
                            <img className="pfp2" src="/question2.png" alt="LedgerLifeline Logo"/>
                        </Link>
                    </div>
                </aside>
            )}

            <main className="main-content">
                <header className="header">
                    {/* Main heading for admin users to allow new account creation */}
                    {storedUserRole === "Admin" && (
                        <div className="header-main">
                            <h1 className="header-title">Ledger</h1>
                        </div>
                    )}
                    {/* Default main heading */}
                    {(storedUserRole === "Manager" || storedUserRole === "Accountant") && (
                        <div className="header-main">
                            <h1 className="header-title">Ledger</h1>
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
                    <div className="search-filter">
                        <input
                            type="text"
                            className="search"
                            title="Search"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <table className="account-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Refernce No.</th>
                            <th>Description</th>
                            <th>Debit</th>
                            <th>Credit</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Calculate total balance */}
                        {filteredAccounts.length > 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'right', fontWeight: 'bold'}}>
                                    {`$${formatWithCommas(filteredAccounts.reduce((total, account) => total + account.balance, 0).toFixed(2))}`}
                                </td>
                            </tr>
                        )}
                        {filteredAccounts
                            .filter((account) => account.accountNumber)
                            .map((account, index) => (
                                <tr key={index}>
                                    <td>{new Date(account.createdAt).toLocaleDateString('en-US')}</td> {/* Date the transaction Took place */}
                                    <td>{index + 1}</td> {/* This will increment per row */}
                                    <td>{account.accountDescription}</td> {/* Comments */}
                                    <td>{account.debit !== 0 && account.debit !== account.credit
                                        ? `$${formatWithCommas(account.balance.toFixed(2))}`
                                        : ''}
                                     </td> {/* Show blank if debit is 0 or debit equals credit */}
                                    <td>{account.credit !== 0 && account.credit !== account.debit
                                        ? `$${formatWithCommas(account.balance.toFixed(2))}`
                                        : ''}
                                    </td> {/* Show blank if credit is 0 or credit equals debit */}
                                    <td>
                                        {account.balance
                                            ? `$${formatWithCommas(account.balance.toFixed(2))}`
                                            : "$0.00"}
                                    </td>{" "}
                                    {/* Account balance with dollar sign */}
                                </tr>
                            ))}
                    </tbody>
                </table>
                <div className="back-btn">
                    <Link
                            type="button"
                            id="accounts-link"
                            title="Accounts Page Link"
                            to="/accounts"
                            style={{
                                textDecoration: 'none',
                                color: 'white',
                                backgroundColor: '#007bff',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                fontWeight: 'lighter',
                            }}
                        >
                            Back to Accounts
                        </Link>
                </div>
            </main>
        </section>
    );
    return content;
};

export default AccountLedger;
