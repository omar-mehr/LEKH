import { useState } from "react";
import { createBorrowRequest } from "../../../functions/fetch/loanFetch.js";
import "../Form.css";

function BorrowRequestForm({ equipment, onCancel, token }) {
    const [purpose, setPurpose] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        try {
            await createBorrowRequest(token, {
                equipmentId: equipment.id,
                purpose: purpose
            });

            setSuccess("Borrow request submitted successfully");
            setPurpose("");

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Request borrow</h2>

            <p>
                Equipment: <strong>{equipment.name}</strong>
            </p>

            <p>
                Serial number: {equipment.serial_number}
            </p>

            <label htmlFor="purpose">
                Purpose
            </label>

            <textarea
                id="purpose"
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                className="input-field"
                required />

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {success && (
                <p className="success-message">
                    {success}
                </p>
            )}

            <div className="form-buttons">
    <button
        type="submit"
        className="submit-button"
    >
        Submit request
    </button>

    <button
        type="button"
        className="cancel-button"
        onClick={onCancel}
    >
        Cancel
    </button>
</div>
        </form>
    );
}

export default BorrowRequestForm;
