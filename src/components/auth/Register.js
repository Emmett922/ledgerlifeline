import { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import "./styles/Register.css";

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
    const [step, setStep] = useState(1);

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

        // -- username creation -- //
        const now = new Date(); // Get current date when user was created
        const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Get two-digit month
        const year = now.getFullYear().toString().slice(-2); // Get last two digits of year
        // Construct username
        const username = `${firstName
            .charAt(0)
            .toLowerCase()}${lastName.toLowerCase()}${month}${year}`;

        // Prepare data to send
        const userData = {
            username,
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
            alert(`${result.message}`);
            setStep(2);
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

    // Securit question options
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
            <div className="top-of-page"></div>
            <img className="logo" src="" alt="LedgerLifeline Logo" />
            <div className="register-page-container">
                {/* Step 1: Create new user form */}
                {step === 1 && (
                    <form id="registerForm" onSubmit={handleSubmit}>
                        <h2>Create New Account</h2>
                        <div className="register-input-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
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
                            disabled={isButtonDisabled}
                        >
                            Submit
                        </button>
                    </form>
                )}

                {/* Step 2: Confirmation Page & Redirection */}
                {step === 2 && (
                    <form id="registerForm">
                        <h2>User Creation Successful</h2>
                        <div className="register-input-group">
                            <p>
                                You will receive an email from the admin confirming your user creation request. Until then, you will not be able to login to the system.
                            </p>
                        </div>
                        <Link to="/" className="register-submit-btn">
                            Back
                        </Link>
                    </form>
                )}
            </div>
        </section>
    );
    return content;
};

export default Register;
