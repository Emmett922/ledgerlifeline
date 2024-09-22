import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AcceptRequest = () => {
    const { username } = useParams();
    const [role, setRole] = useState("");
    const navigate = useNavigate();

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
            alert(`${result.message}`);
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
