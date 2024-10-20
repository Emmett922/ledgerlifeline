import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Journalize.css";
import { Link } from "react-router-dom";
import Select from "react-select";
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
    const [viewEntryDetails, setViewEntryDetails] = useState(false);
    const [isAddJournalVisible, setIsAddJournalVisible] = useState(false);
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
    const [debit, setDebit] = useState("0.00");
    const [newDebit, setNewDebit] = useState("0.00");
    const [credit, setCredit] = useState("0.00");
    const [newCredit, setNewCredit] = useState("0.00");
    const [balance, setBalance] = useState("0.00");
    const [newBalance, setNewBalance] = useState("0.00");
    const [order, setOrder] = useState("");
    const [newOrder, setNewOrder] = useState("");
    const [statement, setStatement] = useState("");
    const [comment, setComment] = useState("");
    const [newComment, setNewComment] = useState("");
    const [accountArray, setAccountArray] = useState([]);
    const [journalEntryArray, setJournalEntryArray] = useState([]);
    const [errorMessageArray, setErrorMessageArray] = useState([]);
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
    const [journalType, setJournalType] = useState("");
    const [journalDescription, setJournalDescription] = useState("");
    const [selectedDebitAccount, setSelectedDebitAccount] = useState("");
    const [selectedCreditAccount, setSelectedCreditAccount] = useState("");
    const [debitInputValues, setDebitInputValues] = useState([{ account: "", amount: "" }]);
    const [creditInputValues, setCreditInputValues] = useState([{ account: "", amount: "" }]);
    const [debitValue, setDebitValue] = useState("");
    const [creditValue, setCreditValue] = useState("");
    const [entryType, setEntryType] = useState("");
    const [entryDescription, setEntryDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [fullSizeImage, setFullSizeImage] = useState(null);
    const [selectedEntry, setSelectedEntry] = useState("");
    const [selectedEntryStatus, setSelectedEntryStatus] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);
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

    // Get the currently selected accounts from debit and credit inputs
    const selectedDebitAccounts = debitInputValues.map((debit) => debit.account._id);
    const selectedCreditAccounts = creditInputValues.map((credit) => credit.account._id);
    const selectedAccounts = new Set([...selectedDebitAccounts, ...selectedCreditAccounts]);

    const accountOptions = accountArray
        .filter((account) => !selectedAccounts.has(account._id)) // Use _id for filtering
        .map((account) => ({
            value: account, // This is the entire account object
            label: `${account.accountNumber} ${account.accountName}`,
        }));

    const formatWithCommas = (value) => {
        const [integerPart, decimalPart] = value.split(".");

        // Format the integer part with commas
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Return formatted value with the decimal part
        return `${formattedInteger}.${decimalPart}`;
    };

    const handleEditJournal = async () => {
        const approvalOrRejectionData = {
            journalEntryID: selectedEntry._id,
            status: selectedEntryStatus,
            managerID: storedUserName,
            reason: rejectionReason ? rejectionReason : null,
        };

        try {
            const response = await fetch(`${API_URL}/journal-entry`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(approvalOrRejectionData),
            });

            const result = await response.json();

            //Store message locally to deliver on page reload
            localStorage.setItem("toastMessage", result.message);
        } catch (error) {
            console.error("Error editing entry status:", error);
            alert("An error occurred. Please try again.");
        }

        setIsEditJournalVisible(false);
        window.location.reload();
    };

    const handleAddNewJournal = async () => {
        const formattedDebitValues = debitInputValues.map((item) => ({
            account: item.account._id, // Ensure this points to the ObjectId
            amount: parseFloat(item.amount), // Ensure amount is a number
        }));

        const formattedCreditValues = creditInputValues.map((item) => ({
            account: item.account._id, // Ensure this points to the ObjectId
            amount: parseFloat(item.amount), // Ensure amount is a number
        }));

        // Calculate total debit and credit amounts
        const totalDebitAmount = formattedDebitValues.reduce((acc, item) => acc + item.amount, 0);
        const totalCreditAmount = formattedCreditValues.reduce((acc, item) => acc + item.amount, 0);

        // Check if debit and credit totals are equal
        if (totalDebitAmount !== totalCreditAmount) {
            // Show toast message
            toast(errorForImbalanceOfValues.message, {
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
            return; // Prevent submission if the totals are not equal
        }

        const accountData = {
            debit: formattedDebitValues,
            credit: formattedCreditValues,
            type: journalType,
            description: journalDescription,
            createdBy: storedUserName,
        };

        // Prepare FormData to include the journal data and files
        const formData = new FormData();
        formData.append("journalEntry", JSON.stringify(accountData)); // Append journal data as a string
        for (let file of files) {
            console.log("File being uploaded:", file); // Log the file object
            formData.append("files", file);
        }

        try {
            const response = await fetch(`${API_URL}/journal-entry`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorResult = await response.json(); // Get the error details
                console.error("Error response:", errorResult);
                alert(`Error: ${errorResult.message}`);
                return; // Stop further execution if there's an error
            }

            const result = await response.json();
            localStorage.setItem("toastMessage", result.message);
            setIsAddJournalVisible(false);
            window.location.reload();
        } catch (error) {
            console.error("Error submitting new journal entry details", error);
            alert("An error occurred. Please try again.");
        }
    };

    // Add Debit Input
    const addDebitInput = () => {
        setDebitInputValues([...debitInputValues, { account: "", amount: "" }]);
    };

    // Remove Debit Input
    const removeDebitInput = (index) => {
        if (debitInputValues.length > 1) {
            const newDebitValues = debitInputValues.filter((_, i) => i !== index);
            setDebitInputValues(newDebitValues);
        }
    };

    // Add Credit Input
    const addCreditInput = () => {
        setCreditInputValues([...creditInputValues, { account: "", amount: "" }]);
    };

    // Remove Credit Input
    const removeCreditInput = (index) => {
        if (creditInputValues.length > 1) {
            const newCreditValues = creditInputValues.filter((_, i) => i !== index);
            setCreditInputValues(newCreditValues);
        }
    };

    // Update Debit Input Values
    const handleDebitInputChange = (index, field, value) => {
        const updatedDebits = [...debitInputValues];
        updatedDebits[index][field] = value; // Here, value should be the entire account object
        setDebitInputValues(updatedDebits);
    };

    const formatInputValue = (value) => {
        const input = value.replace(/\D/g, ""); // Remove non-digit characters
        const debitValue = parseFloat(input) / 100; // Convert to decimal
        return debitValue.toFixed(2); // Format to two decimal places
    };

    const handleInputChange = (event, index, type) => {
        const value = event.target.value;
        const formattedValue = formatInputValue(value);

        // Update the state with the formatted value
        if (type === "d") {
            handleDebitInputChange(index, "amount", formattedValue);
        } else {
            handleCreditInputChange(index, "amount", formattedValue);
        }
    };

    // Update Credit Input Values
    const handleCreditInputChange = (index, field, value) => {
        console.log("Selected account:", value);
        const updatedCredits = [...creditInputValues];
        updatedCredits[index][field] = value;
        setCreditInputValues(updatedCredits);
    };

    // Handle files selected via drag-and-drop or input field
    const handleFiles = (fileList) => {
        const fileArray = Array.from(fileList);
        setFiles((prevFiles) => [...prevFiles, ...fileArray]);
    };

    // Handle drag over event
    const handleDragOver = (e) => {
        e.preventDefault(); // Prevent default behavior (opening the file in the browser)
        e.stopPropagation();
        e.target.classList.add("drag-over");
    };

    // Handle drag leave event
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.remove("drag-over");
    };

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.remove("drag-over");

        const droppedFiles = e.dataTransfer.files;
        handleFiles(droppedFiles);
    };

    // Handle input field file selection
    const handleFileInputChange = (e) => {
        const selectedFiles = e.target.files;
        handleFiles(selectedFiles);
    };

    // Clicking on the drop area to trigger file input
    const handleClick = () => {
        document.getElementById("file-input").click();
    };

    // Remove file from the list by index
    const removeFile = (indexToRemove) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleClearAll = () => {
        setJournalType("");
        setJournalDescription("");
        setFiles([]);
        // Clear all values but keep one set of debit and credit inputs
        setDebitInputValues((prevValues) => {
            if (prevValues.length > 0) {
                return [
                    {
                        account: "", // keep the first account
                        amount: "", // clear the amount
                    },
                ];
            }
            return [{ account: "", amount: "" }]; // default if no previous values
        });

        setCreditInputValues((prevValues) => {
            if (prevValues.length > 0) {
                return [
                    {
                        account: "", // keep the first account
                        amount: "", // clear the amount
                    },
                ];
            }
            return [{ account: "", amount: "" }]; // default if no previous values
        });
    };

    const handleCancel = () => {
        setJournalType("");
        setJournalDescription("");
        setFiles([]);
        // Clear all values but keep one set of debit and credit inputs
        setDebitInputValues((prevValues) => {
            if (prevValues.length > 0) {
                return [
                    {
                        account: "", // keep the first account
                        amount: "", // clear the amount
                    },
                ];
            }
            return [{ account: "", amount: "" }]; // default if no previous values
        });

        setCreditInputValues((prevValues) => {
            if (prevValues.length > 0) {
                return [
                    {
                        account: "", // keep the first account
                        amount: "", // clear the amount
                    },
                ];
            }
            return [{ account: "", amount: "" }]; // default if no previous values
        });

        setIsAddJournalVisible(false);
    };

    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/"); // Redirect to login
    };

    const areDebitInputsValid = debitInputValues.every(
        (debit) => debit.account && debit.amount && debit.amount > 0 // Ensure account and amount are filled
    );

    const areCreditInputsValid = creditInputValues.every(
        (credit) => credit.account && credit.amount && credit.amount > 0 // Ensure account and amount are filled
    );

    const isDebitAccountSelected = debitInputValues.every((debit) => debit.account);
    const isDebitValueInput = debitInputValues.every((debit) => debit.amount && debit.amount > 0);

    const isCreditAccountSelected = creditInputValues.every((credit) => credit.account);
    const isCreditValueInput = creditInputValues.every(
        (credit) => credit.amount && credit.amount > 0
    );

    const isJournalEntrySubmitDisabled = !(
        journalType &&
        journalDescription &&
        files.length > 0 &&
        areDebitInputsValid &&
        areCreditInputsValid
    );

    const isEntryStatusChangeSubmissionDisabled =
        !selectedEntryStatus || (selectedEntryStatus === "Rejected" && !rejectionReason);

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

    const handleStatusClick = (entry) => {
        setSelectedAccount(entry);
        setIsEditJournalVisible(true);
    };

    const handlePostReferenceClick = (pr) => {

    }

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const toggleCalculator = () => {
        setShowCalculator(!showCalculator);
    };

    // -- Error messages -- //
    // Entry Type Error
    const errorForJournalType = errorMessageArray.find((error) => error.errorID === "ER1");

    // Entry Description Error
    const errorForEntryDescription = errorMessageArray.find((error) => error.errorID === "ER2");

    // Entry Documentation Error
    const errorForEntryDocumentation = errorMessageArray.find((error) => error.errorID === "ER3");

    // Account selection error
    const errorForAccountSelect = errorMessageArray.find((error) => error.errorID === "ER4");

    // Selection value error
    const errorForInputValue = errorMessageArray.find((error) => error.errorID === "ER5");

    // Imbalance error
    const errorForImbalanceOfValues = errorMessageArray.find((error) => error.errorID === "ER6");

    // Reason for rejection error
    const errorForRejectionReason = errorMessageArray.find((error) => error.errorID === "ER7");

    const content = (
        <section className="journalize">
            <ToastContainer />
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

            <main className="main-content">
                <header className="header">
                    <div className="header-main">
                        <h1 className="header-title">General Journal</h1>
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

                <div className={toggleState === 1 ? "content active-content" : "content"}>
                    <table className="journal-entry-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Type</th>
                                <th>Creator</th>
                                <th>PR</th>
                                <th>Accounts</th>
                                <th>Debit</th>
                                <th>Credit</th>
                            </tr>
                        </thead>
                        {storedUserRole === "Manager" && (
                            <tbody className="manager-view">
                                {filteredJournalEntries.map((entry, index) => (
                                    <tr key={index} onClick={() => handleRowClick(entry)}>
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
                                                            entry.status === "Pending"
                                                                ? "underline"
                                                                : "none",
                                                        cursor:
                                                            entry.status === "Pending"
                                                                ? "pointer"
                                                                : "default",
                                                    }}
                                                    onClick={
                                                        entry.status === "Pending"
                                                            ? () => handleStatusClick(entry)
                                                            : null
                                                    }
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
                                                        color: "#007bff",
                                                        textDecoration: "underline",
                                                    }}
                                                >
                                                    <br />
                                                    {entry.updatedBy}
                                                </span>
                                            )}
                                        </td>
                                        <td>{entry.type}</td>
                                        <td>{entry.createdBy}</td>
                                        {entry.status === "Approved" && (
                                            <td>
                                                {entry.debit.map((debitAccount, index) => (
                                                    <div key={index}>
                                                    <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => handlePostReferenceClick(debitAccount.account.accountNumber)}>
                                                            {debitAccount.account.accountNumber}
                                                        </span>
                                                    </div>
                                                ))}
                                                <br />
                                                {entry.credit.map((creditAccount, index) => (
                                                    <div key={index}>
                                                    <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => handlePostReferenceClick(creditAccount.account.accountNumber)}>
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
                                                {entry.description}.
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
                        )}

                        {storedUserRole === "Accountant" && (
                            <tbody className="accountant-view">
                                {filteredJournalEntries.map((entry, index) => (
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
                                                            entry.status === "Pending"
                                                                ? "underline"
                                                                : "none",
                                                        cursor:
                                                            entry.status === "Pending"
                                                                ? "pointer"
                                                                : "default",
                                                    }}
                                                    onClick={
                                                        entry.status === "Pending"
                                                            ? () => handleStatusClick(entry)
                                                            : null
                                                    }
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
                                                        color: "#007bff",
                                                        textDecoration: "underline",
                                                    }}
                                                >
                                                    <br />
                                                    {entry.updatedBy}
                                                </span>
                                            )}
                                        </td>
                                        <td>{entry.type}</td>
                                        <td>{entry.createdBy}</td>
                                        {entry.status === "Approved" && (
                                            <td>
                                                {entry.debit.map((debitAccount, index) => (
                                                    <div key={index}>
                                                    <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => handlePostReferenceClick(debitAccount.account.accountNumber)}>
                                                            {debitAccount.account.accountNumber}
                                                        </span>
                                                    </div>
                                                ))}
                                                <br />
                                                {entry.credit.map((creditAccount, index) => (
                                                    <div key={index}>
                                                    <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => handlePostReferenceClick(creditAccount.account.accountNumber)}>
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
                                                {entry.description}.
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
                        )}
                    </table>
                </div>

                <div className={toggleState === 2 ? "content active-content" : "content"}>
                    <table className="journal-entry-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Type</th>
                                <th>Creator</th>
                                <th>PR</th>
                                <th>Accounts</th>
                                <th>Debit</th>
                                <th>Credit</th>
                            </tr>
                        </thead>
                        {storedUserRole === "Manager" && (
                            <tbody className="manager-view">
                                {filteredJournalEntries
                                    .filter((entry) => entry.status === "Approved")
                                    .map((entry, index) => (
                                        <tr key={index} onClick={() => handleRowClick(entry)}>
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
                                                                entry.status === "Pending"
                                                                    ? "underline"
                                                                    : "none",
                                                            cursor:
                                                                entry.status === "Pending"
                                                                    ? "pointer"
                                                                    : "default",
                                                        }}
                                                        onClick={
                                                            entry.status === "Pending"
                                                                ? () => handleStatusClick(entry)
                                                                : null
                                                        }
                                                    >
                                                        {entry.status}
                                                    </span>
                                                </strong>
                                                <br />
                                                <br />
                                                {(entry.status === "Approved" ||
                                                    entry.status === "Rejected") && (
                                                    <span
                                                        style={{
                                                            color: "#007bff",
                                                            textDecoration: "underline",
                                                        }}
                                                    >
                                                        {entry.updatedBy}
                                                    </span>
                                                )}
                                            </td>
                                            <td>{entry.type}</td>
                                            <td>{entry.createdBy}</td>
                                            {entry.status === "Approved" && (
                                                <td>
                                                    {entry.debit.map((debitAccount, index) => (
                                                        <div key={index}>
                                                        <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => handlePostReferenceClick(debitAccount.account.accountNumber)}>
                                                                {debitAccount.account.accountNumber}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <br />
                                                    {entry.credit.map((creditAccount, index) => (
                                                        <div key={index}>
                                                        <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => handlePostReferenceClick(creditAccount.account.accountNumber)}>
                                                                {
                                                                    creditAccount.account
                                                                        .accountNumber
                                                                }
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
                                                    <div
                                                        key={index}
                                                        style={{ paddingLeft: "40px" }}
                                                    >
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
                                                    {entry.description}.
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
                        )}

                        {storedUserRole === "Accountant" && (
                            <tbody className="accountant-view">
                                {filteredJournalEntries
                                    .filter((entry) => entry.status === "Approved")
                                    .map((entry, index) => (
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
                                                        }}
                                                    >
                                                        {entry.status}
                                                    </span>
                                                </strong>
                                                <br />
                                                <br />
                                                {(entry.status === "Approved" ||
                                                    entry.status === "Rejected") && (
                                                    <span
                                                        style={{
                                                            color: "#007bff",
                                                            textDecoration: "underline",
                                                        }}
                                                    >
                                                        {entry.updatedBy}
                                                    </span>
                                                )}
                                            </td>
                                            <td>{entry.type}</td>
                                            <td>{entry.createdBy}</td>
                                            {entry.status === "Approved" && (
                                                <td>
                                                    {entry.debit.map((debitAccount, index) => (
                                                        <div key={index}>
                                                        <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => handlePostReferenceClick(debitAccount.account.accountNumber)}>
                                                                {debitAccount.account.accountNumber}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <br />
                                                    {entry.credit.map((creditAccount, index) => (
                                                        <div key={index}>
                                                        <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => handlePostReferenceClick(creditAccount.account.accountNumber)}>
                                                                {
                                                                    creditAccount.account
                                                                        .accountNumber
                                                                }
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
                                                    <div
                                                        key={index}
                                                        style={{ paddingLeft: "40px" }}
                                                    >
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
                                                    {entry.description}.
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
                        )}
                    </table>
                </div>

                <div className={toggleState === 3 ? "content active-content" : "content"}>
                    <table className="journal-entry-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Type</th>
                                <th>Creator</th>
                                <th>PR</th>
                                <th>Accounts</th>
                                <th>Debit</th>
                                <th>Credit</th>
                            </tr>
                        </thead>
                        {storedUserRole === "Manager" && (
                            <tbody className="manager-view">
                                {filteredJournalEntries
                                    .filter((entry) => entry.status === "Rejected")
                                    .map((entry, index) => (
                                        <tr key={index} onClick={() => handleRowClick(entry)}>
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
                                                                entry.status === "Pending"
                                                                    ? "underline"
                                                                    : "none",
                                                            cursor:
                                                                entry.status === "Pending"
                                                                    ? "pointer"
                                                                    : "default",
                                                        }}
                                                        onClick={
                                                            entry.status === "Pending"
                                                                ? () => handleStatusClick(entry)
                                                                : null
                                                        }
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
                                                            color: "#007bff",
                                                            textDecoration: "underline",
                                                        }}
                                                    >
                                                        <br />
                                                        {entry.updatedBy}
                                                    </span>
                                                )}
                                            </td>
                                            <td>{entry.type}</td>
                                            <td>{entry.createdBy}</td>
                                            {entry.status === "Approved" && (
                                                <td>
                                                    {entry.debit.map((debitAccount, index) => (
                                                        <div key={index}>
                                                            <span style={{ color: "#007bff" }}>
                                                                {debitAccount.account.accountNumber}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <br />
                                                    {entry.credit.map((creditAccount, index) => (
                                                        <div key={index}>
                                                            <span style={{ color: "#007bff" }}>
                                                                {
                                                                    creditAccount.account
                                                                        .accountNumber
                                                                }
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
                                                    <div
                                                        key={index}
                                                        style={{ paddingLeft: "40px" }}
                                                    >
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
                                                    {entry.description}.
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
                        )}

                        {storedUserRole === "Accountant" && (
                            <tbody className="accountant-view">
                                {filteredJournalEntries
                                    .filter((entry) => entry.status === "Rejected")
                                    .map((entry, index) => (
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
                                                                entry.status === "Pending"
                                                                    ? "underline"
                                                                    : "none",
                                                            cursor:
                                                                entry.status === "Pending"
                                                                    ? "pointer"
                                                                    : "default",
                                                        }}
                                                        onClick={
                                                            entry.status === "Pending"
                                                                ? () => handleStatusClick(entry)
                                                                : null
                                                        }
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
                                                            color: "#007bff",
                                                            textDecoration: "underline",
                                                        }}
                                                    >
                                                        <br />
                                                        {entry.updatedBy}
                                                    </span>
                                                )}
                                            </td>
                                            <td>{entry.type}</td>
                                            <td>{entry.createdBy}</td>
                                            {entry.status === "Approved" && (
                                                <td>
                                                    {entry.debit.map((debitAccount, index) => (
                                                        <div key={index}>
                                                            <span style={{ color: "#007bff" }}>
                                                                {debitAccount.account.accountNumber}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <br />
                                                    {entry.credit.map((creditAccount, index) => (
                                                        <div key={index}>
                                                            <span style={{ color: "#007bff" }}>
                                                                {
                                                                    creditAccount.account
                                                                        .accountNumber
                                                                }
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
                                                    <div
                                                        key={index}
                                                        style={{ paddingLeft: "40px" }}
                                                    >
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
                                                    {entry.description}.
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
                        )}
                    </table>
                </div>

                <div className={toggleState === 4 ? "content active-content" : "content"}>
                    <table className="journal-entry-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Type</th>
                                <th>Creator</th>
                                <th>PR</th>
                                <th>Accounts</th>
                                <th>Debit</th>
                                <th>Credit</th>
                            </tr>
                        </thead>
                        {storedUserRole === "Manager" && (
                            <tbody className="manager-view">
                                {filteredJournalEntries
                                    .filter((entry) => entry.status === "Pending")
                                    .map((entry, index) => (
                                        <tr key={index} onClick={() => handleRowClick(entry)}>
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
                                                                entry.status === "Pending"
                                                                    ? "underline"
                                                                    : "none",
                                                            cursor:
                                                                entry.status === "Pending"
                                                                    ? "pointer"
                                                                    : "default",
                                                        }}
                                                        onClick={
                                                            entry.status === "Pending"
                                                                ? () => handleStatusClick(entry)
                                                                : null
                                                        }
                                                    >
                                                        {entry.status}
                                                    </span>
                                                </strong>
                                                <br />
                                                <br />
                                                {(entry.status === "Approved" ||
                                                    entry.status === "Rejected") && (
                                                    <span
                                                        style={{
                                                            color: "#007bff",
                                                            textDecoration: "underline",
                                                        }}
                                                    >
                                                        {entry.updatedBy}
                                                    </span>
                                                )}
                                            </td>
                                            <td>{entry.type}</td>
                                            <td>{entry.createdBy}</td>
                                            {entry.status === "Approved" && (
                                                <td>
                                                    {entry.debit.map((debitAccount, index) => (
                                                        <div key={index}>
                                                        <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => handlePostReferenceClick(debitAccount.account.accountNumber)}>
                                                                {debitAccount.account.accountNumber}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <br />
                                                    {entry.credit.map((creditAccount, index) => (
                                                        <div key={index}>
                                                            <span style={{ color: "#007bff" }}>
                                                                {
                                                                    creditAccount.account
                                                                        .accountNumber
                                                                }
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
                                                    <div
                                                        key={index}
                                                        style={{ paddingLeft: "40px" }}
                                                    >
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
                                                    {entry.description}.
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
                        )}

                        {storedUserRole === "Accountant" && (
                            <tbody className="accountant-view">
                                {filteredJournalEntries
                                    .filter((entry) => entry.status === "Pending")
                                    .map((entry, index) => (
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
                                                        }}
                                                    >
                                                        {entry.status}
                                                    </span>
                                                </strong>
                                            </td>
                                            <td>{entry.type}</td>
                                            <td>{entry.createdBy}</td>
                                            {entry.status === "Approved" && (
                                                <td>
                                                    {entry.debit.map((debitAccount, index) => (
                                                        <div key={index}>
                                                        <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => handlePostReferenceClick(debitAccount.account.accountNumber)}>
                                                                {debitAccount.account.accountNumber}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <br />
                                                    {entry.credit.map((creditAccount, index) => (
                                                        <div key={index}>
                                                            <span style={{ color: "#007bff" }}>
                                                                {
                                                                    creditAccount.account
                                                                        .accountNumber
                                                                }
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
                                                    <div
                                                        key={index}
                                                        style={{ paddingLeft: "40px" }}
                                                    >
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
                                                    {entry.description}.
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
                        )}
                    </table>
                </div>

                {/* Edit Journal Entry Modal */}
                {isEditJournalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setIsEditJournalVisible(false)}>
                                &times;
                            </span>
                            <h2>Approve/Deny Entry</h2>
                            <form>
                                <label>
                                    Approve or Deny Entry:
                                    <select
                                        id="entryStatus"
                                        name="entryStatus"
                                        title="Approve or Deny the Selected Journal Entry"
                                        style={{ marginTop: "3%" }}
                                        value={selectedEntryStatus}
                                        onChange={(e) => setSelectedEntryStatus(e.target.value)}
                                        defaultValue=""
                                        required
                                    >
                                        <option value="" disabled>
                                            Select status
                                        </option>
                                        <option value="Approved">Approve</option>
                                        <option value="Rejected">Reject</option>
                                    </select>
                                </label>
                                {selectedEntryStatus === "Rejected" && (
                                    <label>
                                        Reason
                                        <textarea
                                            id="rejectionReason"
                                            name="rejectionReason"
                                            title="Give a reason for rejection of entry"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Reason for rejection"
                                            required
                                        />
                                        {!rejectionReason && errorForRejectionReason && (
                                            <div className="error-message">
                                                {errorForRejectionReason.message}{" "}
                                            </div>
                                        )}
                                    </label>
                                )}
                            </form>
                            <div className="modal-btns">
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Submit the approval/rejection choice"
                                    onClick={handleEditJournal}
                                    disabled={isEntryStatusChangeSubmissionDisabled}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal for viewing the source documentation of */}
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
                                            <img
                                                src={file.url}
                                                alt={file.filename}
                                                className="thumbnail"
                                                onClick={() => setFullSizeImage(file.url)} // Set the full size image URL on click
                                            />
                                            {/*
                                            <a
                                                href={file.url}
                                                download={file.filename} // Correctly handle file downloading
                                                className="download-link"
                                            >
                                                Download
                                            </a>
                                             */}
                                        </div>
                                    ))}
                            </div>
                        </div>
                        {fullSizeImage && ( // This shows the enlarged image
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

                {/* Modal for Adding an Journal Entry */}
                {isAddJournalVisible && (
                    <div className="modal">
                        <div className="modal-new-journal-entry-content">
                            <span className="close" onClick={() => setIsAddJournalVisible(false)}>
                                &times;
                            </span>
                            <h2>Add New Journal Entry</h2>
                            <form>
                                <table className="journal-entry-creation-table">
                                    <thead>
                                        <tr>
                                            <th>New Journal Entry</th>
                                            <th>Accounts</th>
                                            <th>Debit</th>
                                            <th>Credit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="debit-row">
                                            {/* New Entry Column - Spanning both Debit and Credit rows */}
                                            <td className="new-entry-column" rowSpan="2">
                                                <div className="new-entry-inputs">
                                                    <select
                                                        id="journalType"
                                                        name="journalType"
                                                        value={journalType}
                                                        onChange={(event) => {
                                                            setJournalType(event.target.value);
                                                        }}
                                                        defaultValue=""
                                                        required
                                                    >
                                                        <option value="" disabled>
                                                            Select Type
                                                        </option>
                                                        <option value="Regular">Regular</option>
                                                        <option value="Adjusting">Adjusting</option>
                                                    </select>
                                                    {/* Render the error message below the select input */}
                                                    {!journalType && errorForJournalType && (
                                                        <div className="error-message">
                                                            {errorForJournalType.message}{" "}
                                                            {/* Display the message for ER1 */}
                                                        </div>
                                                    )}
                                                    <textarea
                                                        id="journalDescription"
                                                        name="journalDescription"
                                                        value={journalDescription}
                                                        onChange={(event) => {
                                                            setJournalDescription(
                                                                event.target.value
                                                            );
                                                        }}
                                                        placeholder="Description"
                                                    />
                                                    {/* Render the error message below the select input */}
                                                    {!journalDescription &&
                                                        errorForEntryDescription && (
                                                            <div className="error-message">
                                                                {errorForEntryDescription.message}{" "}
                                                                {/* Display the message for ER1 */}
                                                            </div>
                                                        )}
                                                    <br />
                                                    <div
                                                        id="file-drop-area"
                                                        onClick={handleClick}
                                                        onDragOver={handleDragOver}
                                                        onDragLeave={handleDragLeave}
                                                        onDrop={handleDrop}
                                                    >
                                                        <p>
                                                            Drag and drop files here or click to
                                                            browse
                                                        </p>
                                                        <input
                                                            type="file"
                                                            id="file-input"
                                                            accept=".doc,.docx,.pdf,.xls,.xlsx,.csv,.png,.jpg"
                                                            multiple
                                                            onChange={handleFileInputChange}
                                                            style={{ display: "none" }} // Hide the input field
                                                        />
                                                    </div>
                                                    <div id="file-list">
                                                        {files.length > 0 &&
                                                            files.map((file, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="file-item"
                                                                >
                                                                    <p>
                                                                        {file.name} (
                                                                        {(file.size / 1024).toFixed(
                                                                            2
                                                                        )}{" "}
                                                                        KB)
                                                                    </p>
                                                                    <button
                                                                        onClick={() =>
                                                                            removeFile(index)
                                                                        }
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            ))}
                                                    </div>
                                                    {/* Render the error message below the select input */}
                                                    {!files.length > 0 &&
                                                        errorForEntryDocumentation && (
                                                            <div className="error-message">
                                                                {errorForEntryDocumentation.message}{" "}
                                                                {/* Display the message for ER1 */}
                                                            </div>
                                                        )}
                                                </div>
                                            </td>
                                            {/* Debit Row with Existing Inputs */}
                                            <td className="account-column">
                                                {/* Debit Account */}
                                                <div className="debit-account-input">
                                                    {debitInputValues.map((debit, index) => (
                                                        <div
                                                            key={`debit-account-${index}`}
                                                            className="debit-account-input"
                                                        >
                                                            <Select
                                                                id={`debit-account-${index}`}
                                                                name={`debit-account-${index}`}
                                                                title="Select debit account"
                                                                value={
                                                                    debit.account
                                                                        ? {
                                                                              value: debit.account, // Ensure this is the same object structure as in accountOptions
                                                                              label: `${debit.account.accountNumber} ${debit.account.accountName}`,
                                                                          }
                                                                        : null
                                                                }
                                                                onChange={(option) =>
                                                                    handleDebitInputChange(
                                                                        index,
                                                                        "account",
                                                                        option.value
                                                                    )
                                                                }
                                                                options={accountOptions}
                                                                isSearchable={true}
                                                                required
                                                                placeholder="Select debit account"
                                                            />

                                                            <div className="account-btns">
                                                                <button
                                                                    type="button"
                                                                    className="add-btn"
                                                                    onClick={() => addDebitInput()}
                                                                >
                                                                    +
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="del-btn"
                                                                    onClick={() =>
                                                                        removeDebitInput(index)
                                                                    }
                                                                >
                                                                    -
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Render the error message below the select input */}
                                                {!isDebitAccountSelected &&
                                                    errorForAccountSelect && (
                                                        <div className="error-message">
                                                            {errorForAccountSelect.message}{" "}
                                                            {/* Display the message for ER1 */}
                                                        </div>
                                                    )}
                                            </td>
                                            <td className="debit-column">
                                                {/* Debit Input */}
                                                <div className="debit-input">
                                                    {debitInputValues.map((debit, index) => (
                                                        <div
                                                            key={`debit-input-${index}`}
                                                            className="debit-input"
                                                        >
                                                            <span>$</span>
                                                            <input
                                                                type="tel"
                                                                name={`debit-amount-${index}`}
                                                                placeholder="0.00"
                                                                value={
                                                                    debitInputValues[index]
                                                                        ?.amount || "0.00"
                                                                } // Default to "0.00"
                                                                onChange={(event) =>
                                                                    handleInputChange(
                                                                        event,
                                                                        index,
                                                                        "d"
                                                                    )
                                                                }
                                                                inputMode="numeric"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Render the error message below the select input */}
                                                {!isDebitValueInput && errorForInputValue && (
                                                    <div className="error-message">
                                                        {errorForInputValue.message}{" "}
                                                        {/* Display the message for ER1 */}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="credit-column"></td>{" "}
                                            {/* Empty column for alignment */}
                                        </tr>

                                        {/* Credit Row with Existing Inputs */}
                                        <tr className="credit-row">
                                            <td className="account-column">
                                                {/* Credit Account */}
                                                <div
                                                    className="credit-account-input"
                                                    style={{ paddingLeft: "10%" }}
                                                >
                                                    {creditInputValues.map((credit, index) => (
                                                        <div
                                                            key={`credit-account-${index}`}
                                                            className="credit-account-input"
                                                        >
                                                            <Select
                                                                id={`credit-account-${index}`}
                                                                name={`credit-account-${index}`}
                                                                title="Select credit account"
                                                                value={
                                                                    credit.account
                                                                        ? {
                                                                              value: credit.account, // Ensure this is the same object structure as in accountOptions
                                                                              label: `${credit.account.accountNumber} ${credit.account.accountName}`,
                                                                          }
                                                                        : null
                                                                }
                                                                onChange={(option) =>
                                                                    handleCreditInputChange(
                                                                        index,
                                                                        "account",
                                                                        option.value
                                                                    )
                                                                }
                                                                options={accountOptions}
                                                                isSearchable={true}
                                                                required
                                                                placeholder="Select credit account"
                                                            />
                                                            <div className="account-btns">
                                                                <button
                                                                    type="button"
                                                                    className="add-btn"
                                                                    onClick={() => addCreditInput()}
                                                                >
                                                                    +
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="del-btn"
                                                                    onClick={() =>
                                                                        removeCreditInput(index)
                                                                    }
                                                                >
                                                                    -
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Render the error message below the select input */}
                                                {!isCreditAccountSelected &&
                                                    errorForAccountSelect && (
                                                        <div
                                                            className="error-message"
                                                            style={{ paddingLeft: "10%" }}
                                                        >
                                                            {errorForAccountSelect.message}{" "}
                                                            {/* Display the message for ER1 */}
                                                        </div>
                                                    )}
                                            </td>
                                            <td className="debit-column"></td>{" "}
                                            {/* Empty column for alignment */}
                                            <td className="credit-column">
                                                {/* Credit Input */}
                                                <div className="credit-input">
                                                    {creditInputValues.map((credit, index) => (
                                                        <div
                                                            key={`credit-input-${index}`}
                                                            className="credit-input"
                                                        >
                                                            <span>$</span>
                                                            <input
                                                                type="tel"
                                                                name={`credit-amount-${index}`}
                                                                placeholder="0.00"
                                                                value={
                                                                    creditInputValues[index]
                                                                        ?.amount || "0.00"
                                                                } // Default to "0.00"
                                                                onChange={(event) =>
                                                                    handleInputChange(
                                                                        event,
                                                                        index,
                                                                        "c"
                                                                    )
                                                                }
                                                                inputMode="numeric"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Render the error message below the select input */}
                                                {!isCreditValueInput && errorForInputValue && (
                                                    <div className="error-message">
                                                        {errorForInputValue.message}{" "}
                                                        {/* Display the message for ER1 */}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                            <div className="modal-btns">
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Submit details for account creation"
                                    onClick={handleAddNewJournal}
                                    disabled={isJournalEntrySubmitDisabled}
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Clear all inputs"
                                    onClick={handleClearAll}
                                >
                                    Clear
                                </button>
                                <button
                                    type="button"
                                    className="action-button2 cancel"
                                    title="Clear all inputs"
                                    onClick={handleCancel}
                                >
                                    Cancel
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
