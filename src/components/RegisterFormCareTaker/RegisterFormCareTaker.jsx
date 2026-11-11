import { useState } from "react";
import "../Form.css";
import { createCaretaker } from "../../../functions/fetch/authFetch.js";

function RegisterFormCareTaker({ token, setShowCaretaker })  {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const passwordRequirements = {
        length: password.length >= 10,
        letter: /[A-Za-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!passwordRequirements.length) {
            setErrorMessage("Password must be at least 10 characters long");

            setTimeout(() => {
                setErrorMessage("");
            }, 3000);

            return;
        }

        if (!passwordRequirements.letter) {
            setErrorMessage("Password must contain at least one letter");

            setTimeout(() => {
                setErrorMessage("");
            }, 3000);

            return;
        }

        if (!passwordRequirements.number) {
            setErrorMessage("Password must contain at least one number");

            setTimeout(() => {
                setErrorMessage("");
            }, 3000);

            return;
        }

        if (!passwordRequirements.special) {
            setErrorMessage("Password must contain at least one special character");

            setTimeout(() => {
                setErrorMessage("");
            }, 3000);

            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");

            setTimeout(() => {
                setErrorMessage("");
            }, 3000);

            return;
        }

        try {
            const data = {
                name: name,
                email: email,
                address: address,
                phoneNumber: phoneNumber,
                password: password
            };

            await createCaretaker(token, data);

            setSuccessMessage("Caretaker account created successfully!");

            setTimeout(() => {
                setShowCaretaker(false);
            }, 3000);
        } catch (error) {
            setErrorMessage(error.message);

            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} >
                <h3>Create caretaker account</h3>

                <label>Name:</label>
                <input
                    type="text"
                    placeholder="First Name + Last Name"
                    className="input-field"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />

                <label>Email:</label>
                <input
                    type="email"
                    placeholder="Enter caretaker email"
                    className="input-field"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="new-email"
                />

                <label>Address:</label>
                <input
                    type="text"
                    placeholder="Street, postal code, city"
                    className="input-field"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    required
                />

                <label>Phone:</label>
                <input
                    type="tel"
                    placeholder="07X-XXX XX XX"
                    className="input-field"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    required
                />

                <label>Password:</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    className="input-field"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                />

                <div className="password-requirements">
                    <p className={passwordRequirements.length ? "valid" : "invalid"}>
                        {passwordRequirements.length ? "✓" : "✗"} At least 10 characters
                    </p>

                    <p className={passwordRequirements.letter ? "valid" : "invalid"}>
                        {passwordRequirements.letter ? "✓" : "✗"} At least one letter
                    </p>

                    <p className={passwordRequirements.number ? "valid" : "invalid"}>
                        {passwordRequirements.number ? "✓" : "✗"} At least one number
                    </p>

                    <p className={passwordRequirements.special ? "valid" : "invalid"}>
                        {passwordRequirements.special ? "✓" : "✗"} At least one special character
                    </p>
                </div>

                <label>Confirm password:</label>
                <input
                    type="password"
                    placeholder="Confirm your password"
                    className="input-field"
                    value={confirmPassword}
                    onChange={(event) =>
                    setConfirmPassword(event.target.value)
                    }
                    required
                />

                {errorMessage && (
                    <p className="error-message">
                        {errorMessage}
                    </p>
                )}

                {successMessage && (
                    <p className="success-message">
                        {successMessage}
                    </p>
                )}

                <button type="submit">
                    Create caretaker
                </button>
            </form>
        </>
    );
}

export default RegisterFormCareTaker;

