import { useState } from "react";
import { getLoanDetailsById } from "../../../functions/fetch/loanFetch.js";
import "./SearchLoan.css";

const API_URL = import.meta.env.VITE_API_URL;

function SearchLoan({ token }) {
    const [loanId, setLoanId] = useState("");
    const [loan, setLoan] = useState(null);
    const [error, setError] = useState("");

    async function handleSearch(event) {
        event.preventDefault();

        setError("");
        setLoan(null);

        try {
            const result = await getLoanDetailsById(token, loanId);

            if (result.length === 0) {
                setError("No loan found by ID");
                return;
            }

            setLoan(result);
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="search-loan">

            <div className="search-loan-header">
                <h2>Search loan</h2>

                <p>
                    Search for a loan to view equipment and condition photos.
                </p>
            </div>

            <form
                className="search-loan-form"
                onSubmit={handleSearch}
            >
                <div className="search-loan-field">
                    <label htmlFor="loanId">
                        Loan number
                    </label>

                    <input
                        id="loanId"
                        type="number"
                        value={loanId}
                        onChange={(event) => setLoanId(event.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="search-loan-button"
                >
                    Search
                </button>
            </form>

            {error && (
                <p className="search-loan-error">
                    {error}
                </p>
            )}

            {loan && (
                <div className="loan-result">

                    <div className="loan-result-header">
                        <h2>Loan details</h2>

                        <p>
                            Loan #{loan[0].loan_id}
                        </p>
                    </div>

                    <div className="loan-information">

                        <div className="loan-information-item">
                            <span>Student</span>
                            <strong>{loan[0].name}</strong>
                        </div>

                        <div className="loan-information-item">
                            <span>Email</span>
                            <strong>{loan[0].email}</strong>
                        </div>

                        <div className="loan-information-item">
                            <span>Phone</span>
                            <strong>{loan[0].phone_number}</strong>
                        </div>

                        <div className="loan-information-item">
                            <span>Equipment</span>
                            <strong>{loan[0].equipment_name}</strong>
                        </div>

                        <div className="loan-information-item">
                            <span>Serial number</span>
                            <strong>{loan[0].serial_number}</strong>
                        </div>

                        <div className="loan-information-item">
                            <span>Start date</span>

                            <strong>
                                {loan[0].start_date.split("T")[0]}
                            </strong>
                        </div>

                        <div className="loan-information-item">
                            <span>Due date</span>

                            <strong>
                                {loan[0].due_date.split("T")[0]}
                            </strong>
                        </div>

                        <div className="loan-information-item">
                            <span>Return date</span>

                            <strong>
                                {loan[0].return_date &&
                                    loan[0].return_date.split("T")[0] ||
                                    "Not returned"}
                            </strong>
                        </div>

                    </div>

                    <div className="condition-section">

                        <h3>Condition photos</h3>

                        <div className="condition-photos">

                            {loan.map((photo) => (
                                photo.photo_url &&
                                photo.photo_url.includes("/before-") && (
                                    <div
                                        className="condition-photo"
                                        key={photo.photo_id}
                                    >
                                        <div className="condition-photo-title">
                                            Checkout condition
                                        </div>

                                        <img
                                            src={`${API_URL}${photo.photo_url}`}
                                            alt="Equipment condition at checkout"
                                        />

                                        <div className="condition-photo-info">
                                            <p>
                                                {photo.created_at}
                                            </p>
                                        </div>
                                    </div>
                                )
                            ))}

                            {loan[0].return_date && (
                                loan.map((photo) => (
                                    photo.photo_url &&
                                    photo.photo_url.includes("/after-") && (
                                        <div
                                            className="condition-photo"
                                            key={photo.photo_id}
                                        >
                                            <div className="condition-photo-title">
                                                Return condition
                                            </div>

                                            <img
                                                 src={`${API_URL}${photo.photo_url}`}
                                                alt="Equipment condition at return"
                                            />

                                            <div className="condition-photo-info">
                                                <p>
                                                    {photo.created_at}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                ))
                            )}

                            {!loan[0].return_date && (
                                <p>
                                    Not returned yet
                                </p>
                            )}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default SearchLoan;