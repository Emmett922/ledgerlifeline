import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Users.css";
import { Link } from "react-router-dom";
import Select from "react-select";
import Calendar from "react-calendar";
import Calculator from "../calc/Calculator";
import Draggable from "react-draggable";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
    // Function variables
    const [isEditUserVisible, setIsEditUserVisible] = useState(false);
    const [isSuspendUserVisible, setIsSuspendUserVisible] = useState(false);
    const [isExpiredPasswordsVisible, setIsExpiredPasswordsVisible] = useState(false);
    const [isEditUserRoleVisible, setIsEditUserRoleVisible] = useState(false);
    const [isEditUserActiveVisible, setIsEditUserActiveVisible] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [isEmailUserVisible, setIsEmailUserVisible] = useState(false);
    const [isEmailAllVisible, setIsEmailAllVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [changedState, setChangedState] = useState(false);
    const [postalCode, setPostalCode] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [question, setSecurityQuestion] = useState("");
    const [changedSecurityQuestion, setChangedSecurityQuestion] = useState(false);
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [role, setRole] = useState("");
    const [changedRole, setChangedRole] = useState(false);
    const [active, setActive] = useState(false);
    const [changedActive, setChangedActive] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [userArray, setUserArray] = useState([]);
    const [userTable, setUserTable] = useState(1);
    const [storedUserName, setStoredUserName] = useState("");
    const [storedUserFullName, setStoredUserFullName] = useState("");
    const [isEmailAllUserVisible, setIsEmailAllUserVisible] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;
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

        // Ensure that the user has the proper role to view this page
        if (storedUser.role !== "Admin") {
            navigate("/dashboard", { replace: true });
        }

        // If all other checks are met, get the storedUser's username
        if (storedUser) {
            setStoredUserName(storedUser.username);
            setStoredUserFullName(`${storedUser.full_name} ${storedUser.last_name}`);
        }
    });

    // Fetch users from the database
    useEffect(() => {
        // Get all users from database
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

        const userCreationResult = localStorage.getItem("userCreated");
        if (userCreationResult) {
            toast("New user created! Please accept the request in your email!", {
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
                localStorage.removeItem("userCreated");
            }, 500);
        }
    }, [API_URL]);

    // Function specifically handling state change
    const handleStateChange = (selectedOption) => {
        setState(selectedOption);
        setChangedState(true);
    };

    // Function specifically for handling state change
    const handleSecurityQuestionChange = (selectedOption) => {
        setSecurityQuestion(selectedOption);
        setChangedSecurityQuestion(true);
    };

    // Handle the input changes from editing the user
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "role") {
            setRole(value);
            setChangedRole(true);
        } else if (name === "active") {
            setActive(value === "true");
            setChangedActive(true);
        } else if (name === "firstName") {
            setFirstName(value);
        } else if (name === "lastName") {
            setLastName(value);
        } else if (name === "street") {
            setStreet(value);
        } else if (name === "city") {
            setCity(value);
        } else if (name === "postalCode") {
            setPostalCode(value);
        } else if (name === "dob") {
            setDob(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "securityAnswer") {
            setSecurityAnswer(value);
        } else if (name === "start-date") {
            setStartDate(value);
        } else if (name === "end-date") {
            setEndDate(value);
        }
    };

    // Security question options
    const securityQuestionOptions = [
        {
            value: "What is your mother's maiden name?",
            label: "What is your mother's maiden name?",
        },
        {
            value: "What was the name of your first pet?",
            label: "What was the name of your first pet?",
        },
        {
            value: "What was the name of your elementary school?",
            label: "What was the name of your elementary school?",
        },
        { value: "What is your favorite book?", label: "What is your favorite book?" },
    ];

    // State options for users to choose from when inputting address
    const stateOptions = [
        { value: "AL", label: "Alabama" },
        { value: "AK", label: "Alaska" },
        { value: "AZ", label: "Arizona" },
        { value: "AR", label: "Arkansas" },
        { value: "CA", label: "California" },
        { value: "CO", label: "Colorado" },
        { value: "CT", label: "Connecticut" },
        { value: "DE", label: "Deleware" },
        { value: "DC", label: "District of Columbia" },
        { value: "FL", label: "Florida" },
        { value: "GA", label: "Georgia" },
        { value: "HI", label: "Hawaii" },
        { value: "ID", label: "Idaho" },
        { value: "IL", label: "Illinois" },
        { value: "IN", label: "Indiana" },
        { value: "IA", label: "Iowa" },
        { value: "KS", label: "Kansas" },
        { value: "KY", label: "Kentucky" },
        { value: "LA", label: "Louisiana" },
        { value: "ME", label: "Maine" },
        { value: "MD", label: "Maryland" },
        { value: "MA", label: "Massachusetts" },
        { value: "MI", label: "Michigan" },
        { value: "MN", label: "Minnesota" },
        { value: "MS", label: "Mississippi" },
        { value: "MO", label: "Missouri" },
        { value: "MT", label: "Montana" },
        { value: "NE", label: "Nebraska" },
        { value: "NV", label: "Nevada" },
        { value: "NH", label: "New Hampshire" },
        { value: "NJ", label: "New Jersey" },
        { value: "NM", label: "New Mexico" },
        { value: "NY", label: "New York" },
        { value: "NC", label: "North Carolina" },
        { value: "ND", label: "North Dakota" },
        { value: "OH", label: "Ohio" },
        { value: "OK", label: "Oklahoma" },
        { value: "OR", label: "Oregon" },
        { value: "PA", label: "Pennsylvania" },
        { value: "RI", label: "Rhode Island" },
        { value: "SC", label: "South Carolina" },
        { value: "SD", label: "South Dakota" },
        { value: "TN", label: "Tennessee" },
        { value: "TX", label: "Texas" },
        { value: "UT", label: "Utah" },
        { value: "VT", label: "Vermont" },
        { value: "VA", label: "Virginia" },
        { value: "WA", label: "Washington" },
        { value: "WV", label: "West Virginia" },
        { value: "WI", label: "Wisconsin" },
        { value: "WY", label: "Wyoming" },
    ];

    const handleEditUser = async () => {
        // Specifically handling the value of the state input
        let updatedState = state;
        if (changedState && state.value) {
            updatedState = state.value;
        }

        // Specifically handling the value of the security question input
        let updatedSecurityQuestion = question;
        if (changedSecurityQuestion && question.value) {
            updatedSecurityQuestion = question.value;
        }

        const editUserData = {
            username: selectedUser.username,
            first_name: firstName,
            last_name: lastName,
            address: {
                street: street,
                city: city,
                state: updatedState,
                postal_code: postalCode,
            },
            email: email,
            dob: new Date(dob).toISOString(),
            securityQuestion: {
                question: updatedSecurityQuestion,
                answer: securityAnswer,
            },
            adminUser: storedUserName,
        };

        try {
            const response = await fetch(`${API_URL}/users/edit-user`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editUserData),
            });

            const result = await response.json();

            //Store message locally to deliver on page reload
            localStorage.setItem("toastMessage", result.message);
        } catch (error) {
            console.error("Error submitting edit:", error);
            alert("An error occurred. Please try again.");
        }

        setIsEditUserVisible(false);
        window.location.reload();
    };

    // Specifically handling the change of a users role
    const handleChangeRole = async () => {
        // Handle role change if applicable
        if (changedRole) {
            const userData = {
                username: selectedUser.username,
                role: role,
                adminUser: storedUserName,
            };

            try {
                const response = await fetch(`${API_URL}/users/role`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });

                const result = await response.json();

                //Store message locally to deliver on page reload
                localStorage.setItem("toastMessage", result.message);
            } catch (error) {
                console.error("Error submitting edit:", error);
                alert("An error occurred. Please try again.");
            }
            window.location.reload();
        } else {
            toast("No new role chosen!", {
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

    // Specifically handling the change of a user's active status
    const handleChangeActive = async () => {
        // Handle active status change if applicable
        if (changedActive) {
            const userData = {
                username: selectedUser.username,
                isActive: active,
                adminUser: storedUserName,
            };

            try {
                const response = await fetch(`${API_URL}/users/active`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });

                const result = await response.json();

                //Store message locally to deliver on page reload
                localStorage.setItem("toastMessage", result.message);
            } catch (error) {
                console.error("Error submitting edit:", error);
                alert("An error occurred. Please try again.");
            }
            setIsEditUserVisible(false);
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

    const handleUserSuspension = async () => {
        const userData = {
            username: selectedUser.username,
            isSuspended: true,
            start: new Date(startDate).toISOString(),
            end: new Date(endDate).toISOString(),
        };

        try {
            const response = await fetch(`${API_URL}/users/suspended`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            //Store message locally to deliver on page reload
            localStorage.setItem("toastMessage", result.message);
        } catch (error) {
            console.error("Error submitting edit:", error);
        }

        window.location.reload();
    };

    const disableSuspension = async () => {
        const userData = {
            username: selectedUser.username,
            isSuspended: false,
            start: null,
            end: null,
        };

        try {
            const response = await fetch(`${API_URL}/users/suspended`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            //Store message locally to deliver on page reload
            localStorage.setItem("toastMessage", result.message);
        } catch (error) {
            console.error("Error submitting edit:", error);
        }

        window.location.reload();
    };

    const handleEmailToUser = async () => {
        const formattedMessage = emailMessage.replace(/\n/g, "<br>");

        console.log("Selected User for Email:", selectedUser);
        console.log("Email Subject:", emailSubject);
        console.log("Formatted Message:", formattedMessage);

        setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}/email/send-custom-email`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user: selectedUser,
                        subject: emailSubject,
                        message: formattedMessage,
                        senderName: storedUserFullName,
                    }),
                });

                console.log("Response Status:", response.status);
                const result = await response.json();
                console.log("Response Result:", result);

                if (response.ok) {
                    // Store the message in localStorage
                    localStorage.setItem("toastMessage", result.message);

                    // Reload the page after storing the message
                    window.location.reload();
                } else {
                    alert(`Failed to send email: ${result.message}`);
                }
            } catch (error) {
                console.error("Error sending email:", error);
                alert("Failed to send email.");
            }
        }, 0); // Delay execution of the fetch request

        setIsEmailUserVisible(false);
    };

    const handleEmailToAll = async () => {
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

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user data
        navigate("/"); // Redirect to login
    };

    const isSuspendedBtnsDisabled = !(startDate && endDate);

    const content = (
        <section className="users">
            <ToastContainer />
            <aside className="sidebar">
                <div className="app-logo">
                    <img className="logo" src="/ledgerlifelinelogo.png" alt="LedgerLifeline Logo" />
                </div>
                <ul className="sidebar-btns">
                    <Link
                        className="sidebar-button"
                        id="dashboard-link"
                        title="Dashboard page link"
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
                        title="Users page link"
                        to="/users"
                    >
                        Users
                    </Link>
                    <Link
                        className="sidebar-button"
                        id="event-log-link"
                        title="Event Logs page link"
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

            <main className="main-content">
                <header className="header">
                    <div className="header-main">
                        <h1 className="header-title">Users</h1>
                        <Link className="action-button1" title="Add a new user" to="/register">
                            + Add User
                        </Link>
                        <button
                            className="action-button1"
                            title="View the expired passwords of all users"
                            onClick={() => setIsExpiredPasswordsVisible(true)}
                        >
                            View Expired Passwords
                        </button>
                    </div>
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

                {/* Main User Table */}
                {userTable === 1 && (
                    <div className="table-content">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Employee</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userArray
                                    .filter((user) => user.role !== "Employee")
                                    .map((user, index) => (
                                        <tr key={index}>
                                            <td id="username">
                                                <button
                                                    className="link-button"
                                                    title="Edit user details"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setActive(user.active);
                                                        setRole(user.role);
                                                        setFirstName(user.first_name);
                                                        setLastName(user.last_name);
                                                        setStreet(user.address.street);
                                                        setCity(user.address.city);
                                                        setState(user.address.state);
                                                        setPostalCode(user.address.postal_code);

                                                        // Convert the DOB to 'YYYY-MM-DD' format
                                                        const formattedDob = new Date(user.dob)
                                                            .toISOString()
                                                            .split("T")[0];
                                                        setDob(formattedDob);
                                                        setEmail(user.email);
                                                        setSecurityQuestion(
                                                            user.securityQuestion.question
                                                        );
                                                        setSecurityAnswer(
                                                            user.securityQuestion.answer
                                                        );

                                                        // Safely handle user.suspended and its properties
                                                        if (user.suspended) {
                                                            // Check and convert suspension start and end dates to 'YYYY-MM-DD' format
                                                            if (
                                                                user.suspended.start_date !== null
                                                            ) {
                                                                const formattedStart = new Date(
                                                                    user.suspended.start_date
                                                                )
                                                                    .toISOString()
                                                                    .split("T")[0];
                                                                setStartDate(formattedStart);
                                                            } else {
                                                                setStartDate(""); // Clear start date if not suspended or date is invalid
                                                            }

                                                            if (user.suspended.end_date !== null) {
                                                                const formattedEnd = new Date(
                                                                    user.suspended.end_date
                                                                )
                                                                    .toISOString()
                                                                    .split("T")[0];
                                                                setEndDate(formattedEnd);
                                                            } else {
                                                                setEndDate(""); // Clear end date if not suspended or date is invalid
                                                            }
                                                        } else {
                                                            setStartDate(""); // Clear both dates if user is not suspended
                                                            setEndDate("");
                                                        }

                                                        setIsEditUserVisible(true);
                                                    }}
                                                >
                                                    {user.username}
                                                </button>
                                            </td>
                                            <td className="users-name">
                                                {`${user.first_name} ${user.last_name}`}{" "}
                                                <button
                                                    className="action-button1"
                                                    id="single-email"
                                                    title="Email user"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsEmailUserVisible(true);
                                                        setEmail(user.email);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faEnvelope} size="lg" />
                                                </button>
                                            </td>
                                            <td>
                                                <Link
                                                    className="user-role-link"
                                                    title="Change user's role"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setRole(user.role);
                                                        setIsEditUserRoleVisible(true);
                                                    }}
                                                >
                                                    {user.role}
                                                </Link>
                                            </td>
                                            <td>
                                                <Link
                                                    className="user-active-link"
                                                    title="Change user's active status"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setActive(user.active);
                                                        setIsEditUserActiveVisible(true);
                                                    }}
                                                >
                                                    {user.active ? "Active" : "Inactive"}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Edit User Modal */}
                {isEditUserVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span
                                className="close"
                                title="Close modal"
                                onClick={() => setIsEditUserVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Edit User</h2>
                            <form>
                                <label>
                                    First Name:
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        title="Edit user's first name"
                                        value={firstName}
                                        onChange={handleInputChange}
                                        placeholder="Firt Name"
                                    />
                                </label>
                                <label>
                                    Last Name:
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        title="Edit user's last name"
                                        value={lastName}
                                        onChange={handleInputChange}
                                        placeholder="Last Name"
                                    />
                                </label>
                                <label>
                                    Address:
                                    <input
                                        type="text"
                                        id="street"
                                        name="street"
                                        title="Edit user's street address"
                                        value={street}
                                        onChange={handleInputChange}
                                        placeholder="Street"
                                    />
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        title="Edit user's city address"
                                        value={city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                    />
                                    <Select
                                        className="state-select"
                                        id="state"
                                        name="state"
                                        title="Select user's state address"
                                        value={stateOptions.find(
                                            (option) => option.value === state
                                        )}
                                        options={stateOptions}
                                        onChange={handleStateChange}
                                        isSearchable={true}
                                        placeholder="State"
                                    />
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        title="Edit user's postal code"
                                        value={postalCode}
                                        onChange={handleInputChange}
                                        placeholder="Postal/Zip Code"
                                    />
                                </label>
                                <label>
                                    Date of Birth:
                                    <input
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        title="Edit user's date of birth"
                                        value={dob}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        title="Edit user's email"
                                        value={email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                    />
                                </label>
                                <label>
                                    Secuirty Question:
                                    <Select
                                        id="securityQuestion"
                                        name="securityQuestion"
                                        title="Select user's security question"
                                        value={securityQuestionOptions.find(
                                            (option) => option.value === question
                                        )}
                                        onChange={handleSecurityQuestionChange}
                                        options={securityQuestionOptions}
                                        placeholder="Choose security question"
                                    />
                                </label>
                                <label>
                                    Security Answer:
                                    <input
                                        type="text"
                                        id="secuirtyAnswer"
                                        name="securityAnswer"
                                        title="Edit user's security answer"
                                        value={securityAnswer}
                                        onChange={handleInputChange}
                                        placeholder="Answer"
                                    />
                                </label>
                            </form>
                            <div className="modal-btns">
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Save changes made to user's details"
                                    onClick={handleEditUser}
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Select suspension date(s) for user"
                                    onClick={() => setIsSuspendUserVisible(true)}
                                >
                                    Suspend User
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Role Modal */}
                {isEditUserRoleVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span
                                className="close"
                                title="Close modal"
                                onClick={() => setIsEditUserRoleVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Edit User's Role</h2>
                            <form>
                                <h3 className="form-sub-title">
                                    User:{" "}
                                    <p className="name">
                                        {selectedUser.first_name} {selectedUser.last_name}
                                    </p>
                                </h3>
                                <label>
                                    Role:
                                    <select
                                        id="role"
                                        name="role"
                                        title="Select user's role"
                                        value={role}
                                        onChange={handleInputChange}
                                        defaultValue={
                                            selectedUser?.role === "Employee"
                                                ? ""
                                                : selectedUser?.role
                                        }
                                    >
                                        <option value="" disabled>
                                            Select a role
                                        </option>
                                        <option value="Admin">Admin</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Accountant">Accountant</option>
                                    </select>
                                </label>
                            </form>
                            <div className="modal-btns">
                                <button
                                    type="button"
                                    className="action-button2"
                                    title="Save changes made to user's role"
                                    onClick={handleChangeRole}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Active Status Modal */}
                {isEditUserActiveVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span
                                className="close"
                                title="Close modal"
                                onClick={() => setIsEditUserActiveVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Edit User's Active Status</h2>
                            <form>
                                <h3 className="form-sub-title">
                                    User:{" "}
                                    <p className="name">
                                        {selectedUser.first_name} {selectedUser.last_name}
                                    </p>
                                </h3>
                                <label>
                                    Active:
                                    <select
                                        id="active"
                                        name="active"
                                        title="Select user's active status"
                                        value={active ? "true" : "false"}
                                        onChange={handleInputChange}
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
                                    title="Save changes made to user's active status"
                                    onClick={handleChangeActive}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Suspend User Modal */}
                {isSuspendUserVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span
                                className="close"
                                title="Close modal"
                                onClick={() => setIsSuspendUserVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Suspend User</h2>
                            <form>
                                <label>
                                    Start Date:
                                    <input
                                        type="date"
                                        id="start-date"
                                        name="start-date"
                                        title="User suspension start date"
                                        value={startDate}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Expiry Date:
                                    <input
                                        type="date"
                                        id="end-date"
                                        name="end-date"
                                        title="User suspension end date"
                                        value={endDate}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <div className="modal-btns">
                                    <button
                                        type="button"
                                        className="action-button1"
                                        title="Submit user suspension"
                                        onClick={handleUserSuspension}
                                        disabled={isSuspendedBtnsDisabled}
                                    >
                                        Suspend User
                                    </button>
                                    <button
                                        type="button"
                                        className="action-button1"
                                        title="Remove user suspension"
                                        onClick={disableSuspension}
                                        disabled={isSuspendedBtnsDisabled}
                                    >
                                        Remove Suspension
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Expired Passwords Modal */}
                {isExpiredPasswordsVisible && (
                    <div className="modal">
                        <div className="modal-expired-content">
                            <span
                                className="close"
                                title="Close modal"
                                onClick={() => setIsExpiredPasswordsVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Expired Passwords</h2>
                            <div className="expired-table">
                                <table className="expired-passwords-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Encrypted Password</th>
                                            <th>Expired At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userArray
                                            .filter(
                                                (user) =>
                                                    user.passwordHistory &&
                                                    user.passwordHistory.length > 0
                                            ) // Filter out users without expired passwords
                                            .map((user) => {
                                                return user.passwordHistory.map(
                                                    (password, index) => (
                                                        <tr key={password._id}>
                                                            {index === 0 && (
                                                                <td
                                                                    rowSpan={
                                                                        user.passwordHistory.length
                                                                    }
                                                                >
                                                                    {`${user.first_name} ${user.last_name}`}
                                                                </td>
                                                            )}
                                                            <td>{password.password}</td>
                                                            <td>{`${new Date(
                                                                password.expiresAt
                                                            ).toLocaleString()}`}</td>
                                                        </tr>
                                                    )
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pop-up section to email single user */}
                {isEmailUserVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span
                                className="close"
                                title="Close modal"
                                onClick={() => setIsEmailUserVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>
                                Send Email to {selectedUser?.first_name} {selectedUser?.last_name}
                            </h2>
                            <form onSubmit={handleEmailToUser}>
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
                                    ></textarea>
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

                {/* Pop-up section to email all users */}
                {isEmailAllVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span
                                className="close"
                                title="Close modal"
                                onClick={() => setIsEmailAllVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Send Email to All Users</h2>
                            <form onSubmit={handleEmailToAll}>
                                <div className="form-group">
                                    <label htmlFor="emailSubject">Subject</label>
                                    <input
                                        type="text"
                                        id="emailSubject"
                                        name="emailSubject"
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
                                        placeholder="Enter your message"
                                        value={emailMessage}
                                        onChange={(e) => setEmailMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="modal-btns">
                                    <button type="submit" className="send-button">
                                        Send Email
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => setIsEmailAllVisible(false)}
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

export default Users;
