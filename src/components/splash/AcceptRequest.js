import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/AcceptRequest.css";

const AcceptRequest = () => {
    const { username } = useParams();
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    const CustomCloseButton = ({ closeToast }) => (
        <button
            onClick={closeToast}
            style={{ color: "white", background: "transparent", border: "none", fontSize: "16px" }}
        >
            X
        </button>
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        const API_URL = process.env.REACT_APP_API_URL;

        try {
            const response = await fetch(`${API_URL}/admin/accept`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, role }),
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
                    <button type="submit" className="form-submit-btn" disabled={isButtonDisabled}>
                        Accept
                    </button>
                </form>
            </div>
        </section>
    );

    return content;
};

export default AcceptRequest;
