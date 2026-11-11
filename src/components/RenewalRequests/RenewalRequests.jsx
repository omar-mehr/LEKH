import { useEffect, useState } from "react";
import { getRenewalRequests,updateRenewalRequest } from "../../../functions//fetch/loanFetch.js";
import "./RenewalRequests.css";

function RenewalRequests({ token }) {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getRenewalRequests(token)
            .then((data) => {
                setRequests(data);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, [token]);

    async function handleRequest(requestId, status) {
    try {
        await updateRenewalRequest(
            token,
            requestId,
            status
        );

        const updatedRequests = await getRenewalRequests(token);

        setRequests(updatedRequests);
    } catch (error) {
        setError(error.message);
    }
}

    return (
        <div className="renewal-page">
            <div className="renewal-page-header">
                <div>
                    <h1>Renewal Requests</h1>
                    <p>Manage student requests to extend their loans.</p>
                </div>

                <div className="renewal-total">
                    <strong>{requests.length}</strong>
                    <span>Requests</span>
                </div>
            </div>

            {error && (
                <div className="renewal-error">
                    {error}
                </div>
            )}

            {requests.length === 0 && !error && (
                <div className="renewal-empty">
                    <h2>No renewal requests</h2>
                    <p>
                        There are currently no renewal requests.
                    </p>
                </div>
            )}

            <div className="renewal-list">
                {requests.map((request) => (
                    <div
                        className="renewal-card"
                        key={request.id}
                    >
                        <div className="renewal-card-top">
                            <div>
                                <span className="renewal-label">
                                    Request
                                </span>
                                <h2>#{request.id}</h2>
                            </div>

                            <span className={`renewal-status ${request.status}`}>
                                {request.status}
                            </span>
                        </div>

                        <div className="renewal-details">
                            <div>
                                <span className="renewal-label">
                                    Student
                                </span>
                                <strong>
                                    {request.student_name}
                                </strong>
                            </div>

                            <div>
                                <span className="renewal-label">
                                    Equipment
                                </span>
                                <strong>
                                    {request.equipment_name}
                                </strong>
                            </div>

                            <div>
                                <span className="renewal-label">
                                    Due date
                                </span>
                                <strong>
                                    {new Date(request.due_date)
                                        .toISOString()
                                        .split("T")[0]}
                                </strong>
                            </div>
                        </div>

                        {request.status === "pending" && (
                            <div className="renewal-actions">
                               <button
                                    type="button"
                                    onClick={() => handleRequest(request.id, "approved")}
                                >
                                    Approve
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleRequest(request.id, "rejected")}
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RenewalRequests;