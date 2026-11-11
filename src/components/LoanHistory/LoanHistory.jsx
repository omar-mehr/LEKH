import { useState } from "react";
import {getLoanHistoryBySerialNumber,getLoanDetailsById} from "../../../functions/fetch/loanFetch.js";
const API_URL = import.meta.env.VITE_API_URL;
import "./LoanHistory.css";

function LoanHistory({ token }) {
    const [serialNumber, setSerialNumber] = useState("");
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState("");
    const [selectedLoan, setSelectedLoan] = useState(null);

    async function handleSearch(event) {
        event.preventDefault();

        setError("");
        setLoans([]);
        setSelectedLoan(null);

        if (!serialNumber) {
            setError("Serial number is required");
            return;
        }

        try {
            const result = await getLoanHistoryBySerialNumber(
                token,
                serialNumber
            );

            setLoans(result);
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleLoanClick(loanId) {
        setError("");

        if (selectedLoan && selectedLoan[0].loan_id === loanId) {
            setSelectedLoan(null);
            return;
        }

        try {
            const result = await getLoanDetailsById(
                token,
                loanId
            );

            setSelectedLoan(result);
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="loan-history">
            <h2>Equipment loan history</h2>

            <form
                className="loan-history-form"
                onSubmit={handleSearch}
            >
                <label htmlFor="serialNumber">
                    Equipment serial number
                </label>

                <input
                    id="serialNumber"
                    type="text"
                    value={serialNumber}
                    onChange={(event) => setSerialNumber(event.target.value)}
                    placeholder="Enter serial number"
                />

                <button type="submit">
                    Search
                </button>
            </form>

            {error && (
                <p className="loan-history-error">
                    {error}
                </p>
            )}

            {loans.length > 0 && (
                <div>
                    <h3>Loan history</h3>

                    <div className="loan-history-list">
                        {loans.map((loan) => (
                            <div key={loan.loan_id}>
                                <div
                                    className="loan-history-item"
                                    onClick={() => handleLoanClick(loan.loan_id)}
                                >
                                    <p>
                                        <strong>Loan ID:</strong>{" "}
                                        {loan.loan_id}
                                    </p>

                                    <p>
                                        <strong>User:</strong>{" "}
                                        {loan.user_name}
                                    </p>

                                    <p>
                                        <strong>Equipment:</strong>{" "}
                                        {loan.equipment_name}
                                    </p>

                                    <p>
                                        <strong>Start date:</strong>{" "}
                                        {loan.start_date.split("T")[0]}
                                    </p>

                                    <p>
                                        <strong>Due date:</strong>{" "}
                                        {loan.due_date.split("T")[0]}
                                    </p>

                                    <p>
                                        <strong>Return date:</strong>{" "}
                                        {loan.return_date &&
                                            loan.return_date.split("T")[0] ||
                                            "Not returned"}
                                    </p>
                                </div>

                                {selectedLoan &&
                                    selectedLoan[0].loan_id === loan.loan_id && (
                                        <div className="selected-loan">
                                            <h3>Loan details</h3>

                                            <p>
                                                <strong>Loan ID:</strong>{" "}
                                                {selectedLoan[0].loan_id}
                                            </p>

                                            <p>
                                                <strong>Student:</strong>{" "}
                                                {selectedLoan[0].name}
                                            </p>

                                            <p>
                                                <strong>Email:</strong>{" "}
                                                {selectedLoan[0].email}
                                            </p>

                                            <p>
                                                <strong>Phone:</strong>{" "}
                                                {selectedLoan[0].phone_number}
                                            </p>

                                            <p>
                                                <strong>Equipment:</strong>{" "}
                                                {selectedLoan[0].equipment_name}
                                            </p>

                                            <p>
                                                <strong>Serial number:</strong>{" "}
                                                {selectedLoan[0].serial_number}
                                            </p>

                                            <p>
                                                <strong>Start date:</strong>{" "}
                                                {selectedLoan[0].start_date.split("T")[0]}
                                            </p>

                                            <p>
                                                <strong>Due date:</strong>{" "}
                                                {selectedLoan[0].due_date.split("T")[0]}
                                            </p>

                                            <p>
                                                <strong>Return date:</strong>{" "}
                                                {selectedLoan[0].return_date &&
                                                    selectedLoan[0].return_date.split("T")[0] ||
                                                    "Not returned"}
                                            </p>

                                            <div className="condition-photos">
                                                <h3>Condition photos</h3>

                                                <div className="condition-photo-list">
                                                    {selectedLoan.map((photo) => (
                                                        photo.photo_url && (
                                                            <div
                                                                className="condition-photo"
                                                                key={photo.photo_id}
                                                            >
                                                                <img
                                                                     src={`${API_URL}${photo.photo_url}`}
                                                                    alt="Equipment condition"
                                                                />

                                                                <p>
                                                                    {photo.photo_url.includes("/before-")
                                                                        ? "Before loan"
                                                                        : "After return"}
                                                                </p>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoanHistory;

