import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Accounts.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [newAccountSubcatagory, setNewAccountSubcatagory] = useState("");
    const [accountTerm, setAccountTerm] = useState("");
    const [newAccountTerm, setNewAccountTerm] = useState("");
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
    const [accountTable, setAccountTable] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;
    const [storedUserName, setStoredUserName] = useState("");
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

        // Ensure that the user has the proper role to view this page
        if (storedUser.role !== "Admin") {
            navigate("/dashboard", { replace: true });
        }

        // If all other checks are met, get the storedUser's username
        if (storedUser) {
            setStoredUserName(storedUser.username);
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
        } else if (name === "accountTerm") {
            setAccountTerm(value);
        } else if (name === "debit") {
            setDebit(value);
        } else if (name === "credit") {
            setCredit(value);
        } else if (name === "dateAccountAdded") {
            setDateAccountAdded(value);
        } else if (name === "userID") {
            setUserID(value);
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
        } else if (name === "newAccountTerm") {
            setNewAccountTerm(value);
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

    const handleAccountType = (event) => {
        const { name, value } = event.target;

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
            } else if (value === "Liability" || value === "Equity" || value === "Revenue") {
                if (newNormalSide === "Debit") {
                    const newValue = (newCredit - newDebit).toFixed(2);
                    setNewNormalSide("Credit");
                    setNewInitialBalance(newValue);
                    setNewBalance(newValue);
                } else {
                    setNewNormalSide("Credit");
                }
            }
        } else if (name === "accountCatagory") {
            setAccountCatagory(value);
            if (value === "Asset" || value === "Expense") {
                if (normalSide === "Credit") {
                    const newValue = (debit - credit).toFixed(2);
                    setNormalSide("Debit");
                    setBalance(newValue);
                } else {
                    setNormalSide("Debit");
                }
            } else if (value === "Liability" || value === "Equity" || value === "Revenue") {
                if (normalSide === "Debit") {
                    const newValue = (credit - debit).toFixed(2);
                    setNormalSide("Credit");
                    setBalance(newValue);
                } else {
                    setNormalSide("Credit");
                }
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
        newAccountTerm &&
        newOrder &&
        newComment
    );

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

    const handleEditAccount = async () => {
        const editAccountData = {
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
            term: newAccountTerm,
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
        localStorage.removeItem("account"); // Clear account data
        navigate("/"); // Redirect to login
    };

    const handleSearch = (query) => {
        const searchTerms = query.toLowerCase().split(/[\s,]+/); // Split by space or comma

        return accountArray.filter((account) => {
            const isActiveStatus = account.isActive ? "active" : "inactive"; // Determine status text

            // Check if any search term matches the relevant fields
            return searchTerms.every(
                (term) =>
                    account.accountNumber.toString().includes(term) ||
                    account.accountName.toLowerCase().includes(term) ||
                    account.accountCatagory.toLowerCase().includes(term) ||
                    account.accountSubcatagory.toLowerCase().includes(term) ||
                    account.term.toLowerCase().includes(term) ||
                    account.balance.toFixed(2).includes(term) ||
                    account.accountDescription.toLowerCase().includes(term) ||
                    isActiveStatus.includes(term)
            );
        });
    };

    const filteredAccounts = handleSearch(searchQuery);

    const content = (
        <section className="chartOfAccount">
            <ToastContainer />
            <aside className="sidebar">
                <div className="app-logo">
                    <img className="logo" src="/ledgerlifelinelogo.png" alt="LedgerLifeline Logo" />
                </div>
                <ul className="sidebar-btns">
                    <Link className="sidebar-button" id="dashboard-link" to="/dashboard">
                        Dashboard
                    </Link>
                    <Link
                        className="sidebar-button"
                        id="chart-of-accounts-link"
                        to="/chart-of-accounts"
                    >
                        Chart of Accounts
                    </Link>
                    <Link className="sidebar-button" id="accounts-link" to="/accounts">
                        Accounts
                    </Link>
                    <Link className="sidebar-button" id="users-link" to="/users">
                        Users
                    </Link>
                    <Link className="sidebar-button" id="event-log-link" to="/event-logs">
                        Event Logs
                    </Link>
                </ul>
            </aside>

            <main className="main-content">
                <header className="header">
                    <div className="header-main">
                        <h1 className="header-title">Chart of Accounts</h1>
                        <Link
                            className="action-button1"
                            onClick={() => setIsAddAccountVisible(true)}
                        >
                            + Add Account
                        </Link>
                    </div>
                    <div className="user-profile">
                        <img className="pfp" src="/Default_pfp.svg.png" alt="LedgerLifeline Logo" />
                        <span className="profile-name">{storedUserName}</span>
                        <a>
                            <button className="action-button1" onClick={handleLogout}>
                                Logout
                            </button>
                        </a>
                    </div>
                </header>

                <div className="table-filter">
                    <div className="date-filter">
                        From:
                        <input type="date" id="from" name="from" />
                        To:
                        <input type="date" id="to" name="to" />
                    </div>
                    <div className="search-filter">
                        <input
                            type="text"
                            className="search"
                            placeholder="Search accounts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <table className="account-table">
                    <thead>
                        <tr>
                            <th>Account Number</th>
                            <th>Name</th>{" "}
                            {/*name of the account (cash, accounts receivable, etc.)*/}
                            <th>Type</th> {/*type of the account (asset, liability, equity, et.)*/}
                            <th>Sub-Type</th> {/*current/long term*/}
                            <th>Term</th> {/*account balance*/}
                            <th>Balance</th> {/*name of the admin's username*/}
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAccounts
                            .filter((account) => account.balance !== 0)
                            .map((account, index) => (
                                <tr key={index}>
                                    <td id="accountNumber">
                                        <button
                                            className="link-button"
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
                                                setAccountSubcatagory(account.accountSubcatagory);
                                                setAccountTerm(account.term);
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
                                    <td>{account.term}</td>{" "}
                                    <td>
                                        ${account.balance ? account.balance.toFixed(2) : "0.00"}
                                    </td>{" "}
                                    {/* Account balance with dollar sign */}
                                    <td>{account.accountDescription}</td> {/* Comments */}
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
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* View Account Details Modal */}
                {viewAccountDetails && (
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
                                    Account Term:
                                    <input
                                        type="text"
                                        id="accountTerm"
                                        name="accountTerm"
                                        value={accountTerm}
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
                                    onClick={() => {
                                        setIsEditAccountVisible(true);
                                        setViewAccountDetails(false);
                                    }}
                                >
                                    Edit
                                </button>
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
                                    Account Number:
                                    <input
                                        type="text"
                                        id="accountNumber"
                                        name="accountNumber"
                                        value={accountNumber}
                                        onChange={handleEditInputChange}
                                        placeholder="Account Number"
                                    />
                                </label>
                                <label>
                                    Account Name:
                                    <input
                                        type="text"
                                        id="accountName"
                                        name="accountName"
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
                                        value={accountCatagory}
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
                                    <input
                                        type="text"
                                        id="accountSubcatagory"
                                        name="accountSubcatagory"
                                        value={accountSubcatagory}
                                        onChange={handleEditInputChange}
                                        placeholder="Account Subcatagory"
                                    />
                                </label>
                                <label>
                                    Account Term:
                                    <select
                                        id="accountTerm"
                                        name="accountTerm"
                                        value={accountTerm}
                                        onChange={handleEditInputChange}
                                    >
                                        <option value="" disabled>
                                            Select a term
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
                                    Account Number:
                                    <input
                                        type="text"
                                        id="newAccountNumber"
                                        name="newAccountNumber"
                                        value={newAccountNumber}
                                        onChange={handleNewInputChange}
                                        placeholder="Account Number"
                                    />
                                </label>
                                <label>
                                    Account Name:
                                    <input
                                        type="text"
                                        id="newAccountName"
                                        name="newAccountName"
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
                                    <input
                                        type="text"
                                        id="newAccountSubcatagory"
                                        name="newAccountSubcatagory"
                                        value={newAccountSubcatagory}
                                        onChange={handleNewInputChange}
                                        placeholder="Account Subcatagory"
                                        disabled={isDisabled2}
                                    />
                                </label>
                                <label>
                                    Account Term:
                                    <select
                                        id="newAccountTerm"
                                        name="newAccountTerm"
                                        value={newAccountTerm}
                                        onChange={handleNewInputChange}
                                        disabled={isDisabled2}
                                    >
                                        <option value="" disabled>
                                            Select a term
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
