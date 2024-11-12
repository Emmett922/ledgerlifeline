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

const RetainedEarnings = () => {
    // Function variables
    const [selectedAccount, setSelectedAccount] = useState("");
    const [fetchedAccount, setFetchedAccount] = useState("");
    const [storedUserName, setStoredUserName] = useState("");
    const [storedUserRole, setStoredUserRole] = useState("");
    const [storedUserEmail, setStoredUserEmail] = useState("");
    const [initialBalance, setInitialBalance] = useState("0.00");
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
    const retainedEarningsRef = useRef(null);
    const [isViewGeneratedFileVisible, setIsViewGeneratedFileVisible] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [asOfDate, setAsOfDate] = useState("");
    const isTableEnabled = asOfDate;
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
            setStoredUserEmail(storedUser.email);
        }

        if (storedUserRole === "Admin") {
            navigate("/dashbord");
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "as-of-date") {
            setAsOfDate(value);
        }
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

    // Function to find the closest balance based on asOfDate
    const findClosestBalance = (journalEntries, asOfDate) => {
        const asOfDateString = formatDateString(asOfDate);

        if (!asOfDateString) {
            console.error("Invalid asOfDate provided:", asOfDate);
            return 0;
        }

        console.log("Formatted asOfDate:", asOfDateString);

        // Filter entries with dates less than or equal to the asOfDateString
        const validEntries = journalEntries
            .filter((entry) => {
                const entryDateString = formatDateString(entry.date);
                console.log("Entry date:", entryDateString, "CurrBalance:", entry.currBalance);

                return entryDateString && entryDateString <= asOfDateString;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort in descending order by date

        // Log sorted valid entries for debugging
        console.log("Filtered and sorted entries:", validEntries);

        // Get the closest entry's currBalance, take its absolute value if available, or default to 0 if none found
        return validEntries.length > 0 ? Math.abs(validEntries[0].currBalance) : 0;
    };

    const calculateNetIncome = (accounts) => {
        // Calculate total revenue
        const totalRevenue = accounts
            .filter(
                (account) =>
                    account.accountName.toLowerCase().includes("revenue") &&
                    !account.accountName.toLowerCase().includes("unearned")
            )
            .reduce(
                (total, account) => total + findClosestBalance(account.journalEntries, asOfDate),
                0
            );

        // Calculate total expenses
        const totalExpenses = accounts
            .filter((account) => account.accountName.toLowerCase().includes("expense"))
            .reduce(
                (total, account) => total + findClosestBalance(account.journalEntries, asOfDate),
                0
            );

        // Calculate net income
        const netIncome = totalRevenue - totalExpenses;

        return netIncome; // Return as a string formatted to 2 decimal places
    };

    // Usage in the component
    const netIncome = calculateNetIncome(filteredAccounts);

    const handleGeneratePDF = async () => {
        if (retainedEarningsRef.current) {
            const htmlContent = retainedEarningsRef.current.innerHTML;

            try {
                // Send HTML content to api
                const response = await fetch(`${API_URL}/files/generate-retained-earnings`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        htmlContent,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setPdfUrl(data.pdfUrl);
                }
                // Handle PDF download
            } catch (error) {
                console.error("Error generating PDF:", error);
            }
            setIsViewGeneratedFileVisible(true);
        }
    };

    const emailFinancialStatementFile = async () => {
        const emailContent = {
            userEmail: storedUserEmail,
            pdfUrl,
            statementType: "Retained Earnings",
        };

        try {
            const response = await fetch(`${API_URL}/email/email-financial-statement`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ emailContent }),
            });

            if (response.ok) {
                toast("Financial statement emailed successfully!", {
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
            console.error("Error emailing the file:", error);
        }
    };

    const downloadFinancialStatementFile = async () => {
        try {
            // Call the backend download endpoint
            const response = await fetch(`${API_URL}/files/download/${pdfUrl.split("/").pop()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/pdf",
                },
            });

            if (response.ok) {
                const blob = await response.blob(); // Convert response to a Blob
                const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
                const link = document.createElement("a"); // Create a link element
                link.href = url;
                link.download = `${pdfUrl.split("/").pop()}`; // Use filename from URL
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link); // Clean up
                window.URL.revokeObjectURL(url); // Release URL
            } else {
                console.error("Failed to download PDF:", response.statusText);
            }
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    };

    const openAndPrintPDF = async () => {
        if (!pdfUrl) {
            console.error("PDF URL not set.");
            return;
        }

        try {
            // Fetch the PDF file
            const response = await fetch(pdfUrl);

            if (!response.ok) {
                throw new Error("Failed to fetch PDF.");
            }

            // Create a Blob from the response
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            // Open the Blob URL in a new window/tab to trigger printing
            const printWindow = window.open(blobUrl);

            printWindow.onload = () => {
                // Wait for the PDF to load and then print
                printWindow.print();
                URL.revokeObjectURL(blobUrl); // Clean up the Blob URL
            };
        } catch (error) {
            console.error("Error downloading and printing the PDF:", error);
        }
    };

    const content = (
        <section className="retained-earnings">
            <ToastContainer />
            {/* Side nav for accountand && manager */}
            <aside className="sidebar accountant">
                <div className="app-logo">
                    <img className="logo" src="/ledgerlifelinelogo.png" alt="LedgerLifeline Logo" />
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
                        title="Trial Balance Page Link"
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

            <main className="main-content">
                <header className="header">
                    {/* Main heading for admin users to allow new account creation */}
                    {(storedUserRole === "Admin" || storedUserRole === "Accountant") && (
                        <div className="header-main">
                            <h1 className="header-title">Statement of Retained Earnings</h1>
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
                            <h1 className="header-title">Statement of Retained Earnings</h1>
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
                <div ref={retainedEarningsRef} className="account-ledger-table-container">
                    <div
                        style={{
                            backgroundColor: "#007bff",
                            padding: "20px",
                            borderRadius: "8px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center", // Ensures text is centered
                        }}
                    >
                        <div
                            className="company-title"
                            style={{
                                fontWeight: "bold",
                                color: "white",
                                fontSize: "24px",
                            }}
                        >
                            Addams & Family Inc.
                        </div>
                        <div
                            className="page-title"
                            style={{
                                color: "white",
                                fontSize: "20px",
                                marginTop: "10px",
                            }}
                        >
                            Statement of Retained Earnings
                        </div>
                        <div
                            className="as-of-date"
                            style={{
                                color: "white",
                                fontSize: "18px",
                                marginTop: "10px",
                            }}
                        >
                            For the period ending
                            <input
                                type="date"
                                id="as-of-date"
                                name="as-of-date"
                                value={asOfDate}
                                onChange={handleInputChange}
                                required
                                title="Chose as of date"
                                style={{
                                    borderRadius: "5px",
                                    background: "none",
                                    marginLeft: "5px",
                                    fontSize: "18px",
                                    textAlign: "center",
                                    border: "2px solid",
                                    filter: "invert(1)",
                                }}
                            />
                        </div>
                    </div>

                    {isTableEnabled && (
                        <div
                            className="total-amount-container"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: "20px",
                            }}
                        >
                            <div
                                className="total-amount"
                                style={{
                                    textAlign: "right",
                                    width: "85%",
                                    paddingRight: "50px",
                                    marginBottom: "20px",
                                    fontWeight: "bold",
                                }}
                            >
                                Total Amount
                            </div>

                            {filteredAccounts
                                .filter((account) => account.accountName === "Retained Earnings")
                                .map((account, index) => {
                                    // Calculate ending balance
                                    const beginningBalance = account.initialBalance || 0;
                                    const netIncomeValue = netIncome || 0;
                                    const totalIncome = beginningBalance + netIncomeValue;
                                    const drawings = account.initialBalance || 0; // Adjust if there is a specific drawings field
                                    const endingBalance =
                                        beginningBalance + netIncomeValue - drawings;

                                    return (
                                        <React.Fragment key={index}>
                                            {/* Beginning Balance */}
                                            <div
                                                className="balance-row"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    width: "85%",
                                                    padding: "10px 50px",
                                                }}
                                            >
                                                <div className="label">Beginning Balance</div>
                                                <div
                                                    className="value"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {`$${formatWithCommas(
                                                        beginningBalance.toFixed(2)
                                                    )}`}
                                                </div>
                                            </div>

                                            {/* Net Income */}
                                            <div
                                                className="balance-row"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    width: "85%",
                                                    padding: "10px 50px",
                                                }}
                                            >
                                                <div className="label">Add: Net Income</div>
                                                <div
                                                    className="value"
                                                    style={{
                                                        fontWeight: "bold",
                                                        textDecoration: "underline",
                                                        textUnderlineOffset: "3px",
                                                    }}
                                                >
                                                    {`$${formatWithCommas(netIncome.toFixed(2))}`}
                                                </div>
                                            </div>

                                            {/* Total Income */}
                                            <div
                                                className="balance-row"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    width: "80%",
                                                    padding: "10px 50px",
                                                    marginLeft: "5%",
                                                }}
                                            >
                                                <div className="label">Total Income</div>
                                                <div
                                                    className="value"
                                                    style={{
                                                        fontWeight: "bold",
                                                        textDecoration: "underline",
                                                        textUnderlineOffset: "3px",
                                                    }}
                                                >{`$${formatWithCommas(
                                                    totalIncome.toFixed(2)
                                                )}`}</div>
                                            </div>

                                            {/* Less Drawings */}
                                            <div
                                                className="balance-row"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    width: "85%",
                                                    padding: "10px 50px",
                                                }}
                                            >
                                                <div className="label">Less: Dividends</div>
                                                <div
                                                    className="value"
                                                    style={{
                                                        fontWeight: "bold",
                                                        textDecoration: "underline",
                                                        textUnderlineOffset: "3px",
                                                    }}
                                                >
                                                    {`$${formatWithCommas(drawings.toFixed(2))}`}
                                                </div>
                                            </div>

                                            {/* Ending Balance */}
                                            <div
                                                className="balance-row"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    width: "85%",
                                                    padding: "10px 50px",
                                                }}
                                            >
                                                <div className="label">Ending Balance</div>
                                                <div
                                                    className="value"
                                                    style={{
                                                        fontWeight: "bold",
                                                        textDecoration: "double underline",
                                                        textUnderlineOffset: "3px",
                                                    }}
                                                >
                                                    {`$${formatWithCommas(
                                                        endingBalance.toFixed(2)
                                                    )}`}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                        </div>
                    )}
                </div>

                {isTableEnabled && (
                    <button
                        className="action-button1"
                        onClick={handleGeneratePDF}
                        disabled={!isTableEnabled}
                    >
                        Generate Document
                    </button>
                )}

                {/* Pop-up modal to view the generated file */}
                {isViewGeneratedFileVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span
                                className="close"
                                title="Close modal"
                                onClick={() => setIsViewGeneratedFileVisible(false)}
                            >
                                &times;
                            </span>
                            <h2 style={{ marginBottom: "10%" }}>
                                Statement of Retained Earnings File Generated
                            </h2>
                            <div
                                className="main-button"
                                style={{
                                    marginBottom: "10%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <button
                                    className="action-button1"
                                    title="View the contents of the generated file"
                                    style={{
                                        width: "50%",
                                        padding: "12px 0",
                                        backgroundColor: "#d0d0d0", // Darker grey background
                                        color: "black",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        textAlign: "center", // Ensures text is centered within the button
                                    }}
                                    onClick={() => window.open(pdfUrl, "_blank")}
                                >
                                    View File
                                </button>
                            </div>

                            <div
                                className="minor-buttons"
                                style={{ display: "flex", gap: "10px", justifyContent: "center" }}
                            >
                                <button
                                    className="action-button1"
                                    title="Download the file"
                                    style={{
                                        padding: "10px 20px",
                                        fontSize: "14px",
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    onClick={downloadFinancialStatementFile}
                                >
                                    Download
                                </button>
                                <button
                                    className="action-button1"
                                    title="Email the file to yourself"
                                    style={{
                                        padding: "10px 20px",
                                        fontSize: "14px",
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    onClick={emailFinancialStatementFile}
                                >
                                    Email
                                </button>
                                <button
                                    className="action-button1"
                                    title="Print the file"
                                    style={{
                                        padding: "10px 20px",
                                        fontSize: "14px",
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    onClick={openAndPrintPDF}
                                >
                                    Print
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

export default RetainedEarnings;
