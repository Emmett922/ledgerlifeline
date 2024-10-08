import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./styles/Register.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [dob, setDOB] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const navigate = useNavigate();
    const CustomCloseButton = ({ closeToast }) => (
        <button
            onClick={closeToast}
            style={{ color: "white", background: "transparent", border: "none", fontSize: "16px" }}
        >
            X
        </button>
    );

    // Password validation states
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        startsWithLetter: false,
        hasLetter: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    // Validate Password function
    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const startsWithLetter = /^[a-zA-Z]/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^*()<>?":{}|<>]/.test(password);

        setPasswordRequirements({
            minLength,
            startsWithLetter,
            hasLetter,
            hasNumber,
            hasSpecialChar,
        });

        setIsPasswordValid(
            minLength && startsWithLetter && hasLetter && hasNumber && hasSpecialChar
        );
    };

    // Function specifically for handling state change
    const handleStateChange = (state) => {
        setState(state);
    };

    // Function specifically for handling state change
    const handleSecurityQuestionChange = (securityQuestion) => {
        setSecurityQuestion(securityQuestion);
    };

    // Function to handle the rest of the input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "firstName") {
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
            setDOB(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
            // Call validatePassword whenever the password changes
            validatePassword(value);

            // Clear confirm password if password is cleared
            if (!value) {
                setConfirmPassword("");
            }
        } else if (name === "confirmPassword") {
            setConfirmPassword(value);
        } else if (name === "securityAnswer") {
            setSecurityAnswer(value);
        }
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare data to send
        const userData = {
            password,
            first_name: firstName,
            last_name: lastName,
            email,
            address: {
                street,
                city,
                state: state.value,
                postal_code: postalCode,
            },
            dob: new Date(dob).toISOString(),
            securityQuestion: {
                question: securityQuestion.value,
                answer: securityAnswer,
            },
        };

        // Get API url
        const API_URL = process.env.REACT_APP_API_URL;

        // Handle form submission here
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

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

            localStorage.setItem("userCreated", true)

            navigate(-1);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please try again.");
        }
    };

    // Check if passwords match
    const passwordMatch = password === confirmPassword;

    // Check if all fields are filled
    const isButtonDisabled = !(
        firstName &&
        lastName &&
        street &&
        city &&
        state &&
        postalCode &&
        dob &&
        email &&
        password &&
        confirmPassword &&
        passwordMatch &&
        isPasswordValid &&
        securityQuestion &&
        securityAnswer
    );

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

    // Page content
    const content = (
        <section className="register">
            <ToastContainer />
            <div className="top-of-page"></div>
            <img className="logo" src="/ledgerlifelinelogo.png" alt="LedgerLifeline Logo" />
            <div className="img-heading"></div>
            <div className="register-page-container">
                <div className="step1-form">
                    <form id="registerForm" onSubmit={handleSubmit}>
                        <h2>Create New Account</h2>
                        <div className="register-input-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                title="Enter your first name"
                                value={firstName}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div className="register-input-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                title="Enter your last name"
                                value={lastName}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your last name"
                            />
                        </div>
                        <div className="register-input-group">
                            <label htmlFor="#address">Address</label>
                            <div className="register-input-group" id="address">
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    title="Enter the street of your address"
                                    value={street}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Street"
                                />
                            </div>
                            <div className="register-input-group" id="address">
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    title="Enter the city of your address"
                                    value={city}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="City"
                                />
                            </div>
                            <div className="register-input-group" id="address">
                                <Select
                                    id="state"
                                    name="state"
                                    title="Select the state of your address"
                                    value={state}
                                    onChange={handleStateChange}
                                    options={stateOptions}
                                    isSearchable={true}
                                    required
                                    placeholder="State"
                                />
                            </div>
                            <div className="register-input-group" id="address">
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    title="Enter the postal code of your address"
                                    value={postalCode}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Postal/Zip Code"
                                />
                            </div>
                        </div>
                        <div className="register-input-group">
                            <label htmlFor="dob">Date of Birth</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                title="Enter your date of birth"
                                value={dob}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="register-input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                title="Enter your email"
                                value={email}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="register-input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                title="Enter a strong password"
                                value={password}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter password"
                                className={password ? (isPasswordValid ? "valid" : "invalid") : ""}
                            />
                            <div className="password-requirements">
                                <p className={passwordRequirements.minLength ? "valid" : "invalid"}>
                                    - Minmum 8 characters
                                </p>
                                <p
                                    className={
                                        passwordRequirements.startsWithLetter ? "valid" : "invalid"
                                    }
                                >
                                    - Starts with a letter
                                </p>
                                <p className={passwordRequirements.hasLetter ? "valid" : "invalid"}>
                                    - Contains a letter
                                </p>
                                <p className={passwordRequirements.hasNumber ? "valid" : "invalid"}>
                                    - Contains a number
                                </p>
                                <p
                                    className={
                                        passwordRequirements.hasSpecialChar ? "valid" : "invalid"
                                    }
                                >
                                    - Contains a special character
                                </p>
                            </div>
                        </div>
                        <div className="register-input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                title="Confirm the entered password"
                                value={confirmPassword}
                                onChange={handleInputChange}
                                onFocus={(event) => event.target.select()} // Selects entire value of field on focus
                                required
                                placeholder="Confirm password"
                                disabled={!isPasswordValid} // Disable until password is filled
                                // If user input does not match password, set classname to mismatch
                                // Else, set classname to match
                                className={
                                    confirmPassword ? (passwordMatch ? "match" : "mismatch") : ""
                                }
                            />
                            {confirmPassword && ( // Status message for confirmPassowrd
                                <p
                                    className={`password-message ${
                                        passwordMatch ? "match" : "mismatch"
                                    }`}
                                >
                                    {passwordMatch ? "Matches password" : "Does not match password"}
                                </p>
                            )}
                        </div>
                        <div className="register-input-group">
                            <label htmlFor="securityQuestion">Security Question</label>
                            <Select
                                id="securityQuestion"
                                name="securityQuestion"
                                title="Select a security question"
                                value={securityQuestion}
                                onChange={handleSecurityQuestionChange}
                                options={securityQuestionOptions}
                                required
                                placeholder="Choose security question"
                            />
                        </div>
                        {securityQuestion && (
                            <div className="register-input-group">
                                <label htmlFor="securityAnswer">Answer</label>
                                <input
                                    type="text"
                                    id="securityAnswer"
                                    name="securityAnswer"
                                    title="Enter an answer to your chosen security question"
                                    value={securityAnswer}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter answer to security question"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="register-submit-btn"
                            title="Submit user creation details"
                            disabled={isButtonDisabled}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
    return content;
};

export default Register;
