import { useState, useEffect } from "react";
import {getBorrowRequests,updateBorrowRequest} from "../../../functions/fetch/loanFetch.js";
import "./BorrowRequestManagement.css";

function BorrowRequestManagement({ token }) {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState("");
    const [searchBorrowRequestId, setsearchBorrowRequestId] = useState("");
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        getBorrowRequests(token)
            .then((data) => {
                setRequests(data);
                setFilteredRequests(data);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, [token]);

    async function handleUpdate(id, status) {
        try {
            await updateBorrowRequest(token, id, status);

            const data = await getBorrowRequests(token);
            setRequests(data);
            setFilteredRequests(data);
        } catch (error) {
            setError(error.message);
        }
    }

    function handleSearch(event) {
        const value = event.target.value;

        setsearchBorrowRequestId(value);

        if (!value) {
            setFilteredRequests(requests);
            return;
        }

        const result = requests.filter((request) => {
            return request.id.toString().includes(value);
        });

        setFilteredRequests(result);
    }

    return (
        <div className="borrow-request-management">
            <div className="borrow-request-header">
                <div>
                    <h1>Borrow Requests</h1>
                    <p>
                        Review and manage equipment borrow requests.
                    </p>
                </div>

                <div className="request-count">
                {requests.filter((request) => request.status === "pending").length}
                <span>Requests</span>
            </div>
            </div>
         <input
                    className="borrow-request-search-input"
                    type="text"
                    placeholder="Search by request ID"
                    value={searchBorrowRequestId}
                    onChange={handleSearch}
                />

            {error && (
                <div className="borrow-request-error">
                    {error}
                </div>
            )}

            {requests.length === 0 && !error && (
                <div className="no-borrow-requests">
                    <h2>No borrow requests</h2>
                    <p>
                        There are currently no borrow requests to review.
                    </p>
                </div>
            )}

            <div className="borrow-request-list">
                {filteredRequests.map((request) => (
                    <div
                        className="borrow-request-card"
                        key={request.id}
                    >
                        <div className="borrow-request-card-header">
                            <div>
                                <h2>Request: #{request.id}</h2>

                                <span
                                    className={`request-status ${request.status}`}>{request.status}</span>
                            </div>
                        </div>

                        <div className="borrow-request-info">
                            <div>
                                <span className="info-label">Name</span>
                                <strong>{request.name}</strong>
                            </div>
                            <div>
                                <span className="info-label">Role</span>
                                <strong>{request.role}</strong>
                            </div>

                            <div>
                                <span className="info-label">Email</span>
                                <strong>{request.email}</strong>
                            </div>

                            <div>
                                <span className="info-label">Phone</span>
                                <strong>{request.phone_number}</strong>
                            </div>
                            <div>
                                <span className="info-label"> Address</span>
                                <strong>{request.address}</strong>
                            </div>
                            <div>
                                <span className="info-label"> Equipment name</span>
                                <strong>{request.equipment_name}</strong>
                            </div>
                        </div>

                        <div className="borrow-request-purpose">
                            <span className="info-label">
                                Purpose
                            </span>

                            <p>{request.purpose}</p>
                        </div>

                        {request.status === "pending" && (
                            <div className="borrow-request-actions">
                                <button
                                    type="button"
                                    className="approve-button"
                                    onClick={() =>
                                        handleUpdate(
                                            request.id,
                                            "approved"
                                        )
                                    }
                                >
                                    Approve
                                </button>

                                <button
                                    type="button"
                                    className="reject-button"
                                    onClick={() =>
                                        handleUpdate(
                                            request.id,
                                            "rejected"
                                        )
                                    }
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

export default BorrowRequestManagement;
