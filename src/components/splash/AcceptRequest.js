import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./styles/AcceptRequest.css";

const AcceptRequest = () => {
    const { username } = useParams();
    const [role, setRole] = useState("");
    const [initialRole, setInitialRole] = useState("");
    const [searchParams] = useSearchParams();
    const adminEmail = searchParams.get("adminEmail");
    const [adminUser, setAdminUser] = useState("");
    const navigate = useNavigate();
    const CustomCloseButton = ({ closeToast }) => (
        <button
            onClick={closeToast}
            style={{ color: "white", background: "transparent", border: "none", fontSize: "16px" }}
        >
            X
        </button>
    );

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userResponse = await fetch(
                    `${API_URL}/users/user-by-username?username=${username}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json",
                        },
                    }
                );

                const userDetails = await userResponse.json();
                setInitialRole(userDetails.role);

                if (!userResponse.ok) {
                    alert("Failed to retrieve user details.");
                    return;
                }

                if (!userDetails) {
                    setInitialRole("DELETED");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("An error occurred getting user details. Please try again.");
            }
        };

        const fetchAdmin = async () => {
            try {
                const adminResponse = await fetch(
                    `${API_URL}/users/user-by-email?email=${adminEmail}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json",
                        },
                    }
                );

                const userDetails = await adminResponse.json();
                setAdminUser(userDetails.username);
                if (!adminResponse.ok) {
                    alert("Failed to retrieve user details.");
                    return;
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("An error occured getting admin details. Please try again.");
            }
        };

        fetchUser();
        fetchAdmin();
    }, [API_URL]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const API_URL = process.env.REACT_APP_API_URL;

        try {
            const response = await fetch(`${API_URL}/admin/accept`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, role, adminUser }),
            });

            if (!response.ok) {
                throw new Error("Failed to accept user request");
            }

            const result = await response.json();
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
            navigate("/dashboard");
        } catch (error) {
            console.error("Error:", error);
        }
        navigate("/dashboard");
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "role") {
            setRole(value);
        }
    };

    const isButtonDisabled = !role;

    const content = (
        <section className="acceptRequest">
            <ToastContainer />
            <img className="logo" src="/ledgerlifelinelogo.png" alt="LedgerLifeline Logo" />
            <div className="img-heading"></div>

            {/* Content for updating user to an appropriate role */}
            {initialRole === "Employee" && (
                <div className="accept-request-page-container">
                    <form id="acceptRequestForm" onSubmit={handleSubmit}>
                        <h2>Accept User Request</h2>
                        <div className="request-form-subtitle">
                            <p>Assign the user an appropriate role</p>
                        </div>
                        <div className="formInputGroup">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>
                                    Select a role
                                </option>
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                                <option value="Accountant">Accountant</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="form-submit-btn"
                            disabled={isButtonDisabled}
                        >
                            Accept
                        </button>
                    </form>
                </div>
            )}

            {/* Content for letting  */}
            {initialRole !== "Employee" && (
                <div className="accept-request-page-container">
                    <form id="acceptRequestForm">
                        <h2>User Request Has Been Handled</h2>
                        <div className="request-form-subtitle">
                            <p>Click below to return to the app</p>
                        </div>
                        <Link type="submit" className="form-submit-btn" to="/dashboard">
                            Return
                        </Link>
                    </form>
                </div>
            )}
        </section>
    );

    return content;
};

export default AcceptRequest;
