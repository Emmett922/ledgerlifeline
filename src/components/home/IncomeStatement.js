import { useState, useEffect, useRef } from "react";
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

const IncomeStatement = () => {
    // Function variables
    const [selectedAccount, setSelectedAccount] = useState("");
    const [fetchedAccount, setFetchedAccount] = useState("");
    const [storedUserName, setStoredUserName] = useState("");
    const [storedUserRole, setStoredUserRole] = useState("");
    const [storedUserEmail, setStoredUserEmail] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [fetchedEntry, setFetchedEntry] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [minBalance, setMinBalance] = useState("0.00");
    const [maxBalance, setMaxBalance] = useState("0.00");
    const [errorMessageArray, setErrorMessageArray] = useState([]);
    const [accountArray, setAccountArray] = useState([]);
    const incomeStatementRef = useRef(null);
    const [isViewGeneratedFileVisible, setIsViewGeneratedFileVisible] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [asOfDate, setAsOfDate] = useState("");
    const [yearDate, setYearDate] = useState("");
    const isTableEnabled = yearDate;
    const [isEmailUserVisible, setIsEmailUserVisible] = useState(false);
    const [storedUserFullName, setStoredUserFullName] = useState("");
    const [userArray, setUserArray] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
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

        // If all other checks are met, get the storedUser's username, role, and email
        if (storedUser) {
            setStoredUserName(storedUser.username);
            setStoredUserRole(storedUser.role);
            setStoredUserEmail(storedUser.email);
            setStoredUserFullName(`${storedUser.first_name} ${storedUser.last_name}`);
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

    const handleInputChange = (e) => {
        const year = e.target.value;

        // Update the input value state regardless
        setYearDate(year);

        // Check if the input year is exactly "2024" and has a length of 4
        if (year.length === 4 && year === "2024") {
            // Create a date for December 31st of the year 2024
            const date = new Date(`${year}-12-31`);
            setAsOfDate(date);
        } else {
            // Clear the date if the input year isn't complete or isn't 2024
            setAsOfDate(null);
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

        return netIncome.toFixed(2); // Return as a string formatted to 2 decimal places
    };

    // Usage in the component
    const netIncome = calculateNetIncome(filteredAccounts);

    const handleGeneratePDF = async () => {
        if (incomeStatementRef.current) {
            const htmlContent = incomeStatementRef.current.innerHTML;

            try {
                // Send HTML content to api
                const response = await fetch(`${API_URL}/files/generate-income-statement`, {
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
            statementType: "Income Statement",
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

    console.log(asOfDate)

    const content = (
        <section className="income-statement">
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
                    {storedUserRole === "Accountant" && (
                        <div className="header-main">
                            <h1 className="header-title">Income Statement</h1>
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

                    {storedUserRole === "Manager" && (
                        <div className="header-main">
                            <h1 className="header-title">Income Statement</h1>
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
                <div ref={incomeStatementRef} className="account-ledger-table-container">
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
                            Income Statement
                        </div>
                        <div
                            className="as-of-date"
                            style={{
                                color: "white",
                                fontSize: "18px",
                                marginTop: "10px",
                            }}
                        >
                            For the year ending December 31st,
                            <input
                                type="number"
                                id="as-of-year"
                                name="as-of-year"
                                value={yearDate}
                                onChange={handleInputChange}
                                required
                                title="Choose a year"
                                style={{
                                    borderRadius: "5px",
                                    background: "none",
                                    marginLeft: "5px",
                                    fontSize: "18px",
                                    textAlign: "center",
                                    border: "2px solid",
                                    filter: "invert(1)",
                                }}
                                min="1900"
                                max="2100"
                                step="1"
                                placeholder="YYYY"
                            />
                        </div>
                    </div>

                    {isTableEnabled && (
                        <table className="account-ledger-table">
                            <thead>
                                <tr>
                                    <th
                                        style={{
                                            textAlign: "left",
                                            fontWeight: "bold",
                                            fontSize: "22px",
                                        }}
                                    >
                                        Revenue
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "right",
                                            paddingRight: "50px",
                                        }}
                                    ></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAccounts
                                    .filter(
                                        (account) =>
                                            account.accountName.toLowerCase().includes("revenue") &&
                                            !account.accountName
                                                .toLowerCase()
                                                .includes("unearned") &&
                                            findClosestBalance(account.journalEntries, asOfDate) > 0
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
                                                        paddingRight: "250px", // Match the padding of Total Amount
                                                    }}
                                                >
                                                    {findClosestBalance(
                                                        account.journalEntries,
                                                        asOfDate
                                                    )
                                                        ? `$${formatWithCommas(
                                                              findClosestBalance(
                                                                  account.journalEntries,
                                                                  asOfDate
                                                              ).toFixed(2)
                                                          )}`
                                                        : "$0.00"}
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                            </tbody>
                        </table>
                    )}

                    {isTableEnabled && (
                        <div
                            className="total-revenue-container"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontWeight: "bold",
                                marginTop: "20px",
                            }}
                        >
                            <div
                                className="total-revenue"
                                style={{
                                    width: "600px",
                                    textAlign: "left",
                                    paddingLeft: "50px",
                                }}
                            >
                                Total Revenue:
                            </div>
                            <div
                                className="total-balance"
                                style={{
                                    textAlign: "right",
                                    width: "200px",
                                    paddingRight: "50px",
                                    textDecoration: "underline",
                                    textUnderlineOffset: "3px",
                                }}
                            >
                                {`$${formatWithCommas(
                                    filteredAccounts
                                        .filter(
                                            (account) =>
                                                account.accountName
                                                    .toLowerCase()
                                                    .includes("revenue") &&
                                                !account.accountName
                                                    .toLowerCase()
                                                    .includes("unearned")
                                        )
                                        .reduce(
                                            (total, account) =>
                                                total +
                                                (findClosestBalance(
                                                    account.journalEntries,
                                                    asOfDate
                                                ) || 0),
                                            0
                                        )
                                        .toFixed(2)
                                )}`}
                            </div>
                        </div>
                    )}

                    {isTableEnabled && (
                        <table
                            className="account-ledger-table"
                            style={{
                                marginTop: "10px",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th
                                        colSpan={2}
                                        style={{
                                            textAlign: "left",
                                            fontWeight: "bold",
                                            fontSize: "22px",
                                        }}
                                    >
                                        Expenses
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAccounts
                                    .filter(
                                        (account) =>
                                            account.accountName.toLowerCase().includes("expense") &&
                                            findClosestBalance(account.journalEntries, asOfDate) > 0
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
                                                        paddingRight: "250px", // Match the padding of Total Amount
                                                    }}
                                                >
                                                    {findClosestBalance(
                                                        account.journalEntries,
                                                        asOfDate
                                                    )
                                                        ? `$${formatWithCommas(
                                                              findClosestBalance(
                                                                  account.journalEntries,
                                                                  asOfDate
                                                              ).toFixed(2)
                                                          )}`
                                                        : "$0.00"}
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                            </tbody>
                        </table>
                    )}

                    {isTableEnabled && (
                        <div
                            className="total-expense-container"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontWeight: "bold",
                                marginTop: "20px",
                            }}
                        >
                            <div
                                className="total-expense"
                                style={{
                                    width: "600px",
                                    textAlign: "left",
                                    paddingLeft: "50px",
                                }}
                            >
                                Total Expenses:
                            </div>
                            <div
                                className="total-balance"
                                style={{
                                    textAlign: "right",
                                    width: "200px",
                                    paddingRight: "50px",
                                    textDecoration: "underline",
                                    textUnderlineOffset: "3px",
                                }}
                            >
                                {`$${formatWithCommas(
                                    filteredAccounts
                                        .filter((account) =>
                                            account.accountName.toLowerCase().includes("expense")
                                        )
                                        .reduce(
                                            (total, account) =>
                                                total +
                                                (findClosestBalance(
                                                    account.journalEntries,
                                                    asOfDate
                                                ) || 0),
                                            0
                                        )
                                        .toFixed(2)
                                )}`}
                            </div>
                        </div>
                    )}

                    {isTableEnabled && (
                        <table
                            className="account-ledger-table"
                            style={{
                                marginTop: "10px",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th
                                        colSpan={2}
                                        style={{
                                            textAlign: "left",
                                            fontWeight: "bold",
                                            fontSize: "22px",
                                        }}
                                    >
                                        Net Income
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    )}

                    {isTableEnabled && (
                        <div
                            className="total-revenue-container"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontWeight: "bold",
                                marginTop: "20px",
                                paddingBottom: "10px",
                            }}
                        >
                            <div
                                className="total-revenue"
                                style={{
                                    width: "600px",
                                    textAlign: "left",
                                    paddingLeft: "50px",
                                }}
                            >
                                Total Income:
                            </div>
                            <div
                                className="total-balance"
                                style={{
                                    textAlign: "right",
                                    width: "200px",
                                    paddingRight: "50px",
                                    textDecoration: "double underline",
                                    textUnderlineOffset: "3px",
                                }}
                            >
                                {`$${formatWithCommas(netIncome)}`}
                            </div>
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
                            <h2 style={{ marginBottom: "10%" }}>Income Statement File Generated</h2>
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

export default IncomeStatement;
