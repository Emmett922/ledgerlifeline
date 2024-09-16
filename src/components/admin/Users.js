import { useState, useEffect } from "react";
import "./styles/Users.css";

const Users = () => {
    const [isEditUserVisible, setIsEditUserVisible] = useState(false);
    const [isSuspendUserVisible, setIsSuspendUserVisible] = useState(false);
    const [isExpiredPasswordsVisible, setIsExpiredPasswordsVisible] = useState(false);
    const [isRegisterVisible, setIsRegisterVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userArray, setUserArray] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

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
                    alert("Failed to retrieve users!");
                }
            } catch (error) {
                alert("An error occured. Failed to retrieve users!");
            }
        };

        fetchUsers();
    }, [API_URL]);

    // example profile image URL and name
    const profileImageUrl = "src/img/Default_pfp.svg.png"; // This needs to be fixed with "Profile-img.png"
    const accountName = "John Doe";

    const expiredPasswords = [
        { name: "John Doe", lastChange: "2024-01-15" },
        { name: "Jane Smith", lastChange: "2023-12-01" },
    ];

    const handleSendEmail = () => {
        if (selectedUser) {
            // Add your email sending logic here
            alert(`Sending email to ${selectedUser.name}`);
        }
    };

    const content = (
        <section className="dashboard">
            <aside className="sidebar">
                <div className="profile-img">
                    <img src={profileImageUrl} alt="Profile" className="profile-img" />
                </div>
                <div className="profile-name">
                    <span className="profile-name">{accountName}</span>
                </div>
                <ul>
                    <a>
                        <button className="sidebar-button">Dashboard</button>
                    </a>
                    <a>
                        <button className="sidebar-button">Users</button>
                    </a>
                    <a>
                        <button className="sidebar-button" id="logout-btn">
                            Logout
                        </button>
                    </a>
                </ul>
            </aside>

            <main className="main-content">
                <header className="header">
                    <h1 className="header-title">Users</h1>
                    <button className="action-button1" onClick={() => setIsRegisterVisible(true)}>
                        + Add User
                    </button>
                    <button
                        className="action-button"
                        onClick={() => setIsExpiredPasswordsVisible(true)}
                    >
                        View Expired Passwords
                    </button>
                </header>

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
                        {userArray.map((user, index) => (
                            <tr key={index}>
                                <td>
                                    <button className="link-button" onClick={() => { setSelectedUser(user); setIsEditUserVisible(true); }}>
                                    {user.username}
                                    </button>
                                </td>
                                <td>{`${user.first_name} ${user.last_name}`}</td>
                                <td>{user.role}</td>
                                <td>{user.active ? "Active" : "Inactive"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Edit User Modal */}
                {isEditUserVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setIsEditUserVisible(false)}>
                                &times;
                            </span>
                            <h2>Edit User</h2>
                            <form>
                                <label>
                                    Name:
                                    <input type="text" defaultValue={selectedUser?.name} />
                                </label>
                                <label>
                                    Role:
                                    <select defaultValue={selectedUser?.status}>
                                        <option value="Admin">Admin</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Accountant">Accountant</option>
                                    </select>
                                </label>
                                <label>
                                    Status:
                                    <select defaultValue={selectedUser?.status}>
                                        <option value="Active">Active</option>
                                        <option value="Not Active">Not Active</option>
                                    </select>
                                </label>
                                <button
                                    type="button"
                                    className="action-button2"
                                    onClick={() => setIsEditUserVisible(false)}
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="action-button2"
                                    onClick={() => setIsSuspendUserVisible(true)}
                                >
                                    Suspend User
                                </button>
                                <button
                                    type="button"
                                    className="action-button2"
                                    onClick={handleSendEmail}
                                >
                                    Send Email
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Suspend User Modal */}
                {isSuspendUserVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setIsSuspendUserVisible(false)}>
                                &times;
                            </span>
                            <h2>Suspend User</h2>
                            <form>
                                <label>
                                    Start Date:
                                    <input type="date" />
                                </label>
                                <label>
                                    Expiry Date:
                                    <input type="date" />
                                </label>
                                <button
                                    type="button"
                                    className="action-button"
                                    onClick={() => setIsSuspendUserVisible(false)}
                                >
                                    Suspend User
                                </button>
                                <button
                                    type="button"
                                    className="action-button"
                                    onClick={() => setIsSuspendUserVisible(false)}
                                >
                                    Close
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Expired Passwords Modal */}
                {isExpiredPasswordsVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span
                                className="close"
                                onClick={() => setIsExpiredPasswordsVisible(false)}
                            >
                                &times;
                            </span>
                            <h2>Expired Passwords</h2>
                            <table className="expired-passwords-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Last Password Change</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expiredPasswords.map((password) => (
                                        <tr key={password.name}>
                                            <td>{password.name}</td>
                                            <td>{password.lastChange}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                type="button"
                                className="action-button"
                                onClick={() => setIsExpiredPasswordsVisible(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Register Modal */}
                {isRegisterVisible && (
                    <div className="modal">
                        <div className="modal-content register-modal-content">
                            <span className="close" onClick={() => setIsRegisterVisible(false)}>
                                &times;
                            </span>
                            <h2>Add New User</h2>
                            <form id="registerForm" className="modal-form">
                                <label>
                                    First Name:
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        placeholder="Enter your first name"
                                    />
                                </label>
                                <label>
                                    Last Name:
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        placeholder="Enter your last name"
                                    />
                                </label>
                                <label>
                                    Address:
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        placeholder="Enter your address"
                                    />
                                </label>
                                <label>
                                    Date of Birth:
                                    <input type="date" name="dob" required />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Enter your email"
                                    />
                                </label>
                                <label>
                                    Password:
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="Enter password"
                                    />
                                </label>
                                <label>
                                    Confirm Password:
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        placeholder="Confirm password"
                                    />
                                </label>
                                <button type="submit" className="action-button">
                                    Submit
                                </button>
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
