import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getMyBorrowRequests } from "../../../functions/fetch/loanFetch.js";
import "../BorrowRequestManagement/BorrowRequestManagement.css";
import SelfServiceCheckoutForm from "../SelfServiceCheckoutForm/SelfServiceCheckoutForm";

function BorrowRequestOverview({ token,setShowBorrowRequests }) {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState("");
    const [checkoutRequestId, setCheckoutRequestId] = useState(null);

    useEffect(() => {
        getMyBorrowRequests(token)
            .then((data) => {
                setRequests(data);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, [token]);

    if (checkoutRequestId) {
    return (
        <div className="borrow-request-overview">
            <SelfServiceCheckoutForm
                token={token}
                borrowRequestId={checkoutRequestId}
                setShowBorrowRequests={setShowBorrowRequests}
            />
        </div>
    );
}

    

    return (
        <div className="borrow-request-overview">
            <div className="borrow-request-header">
                <div>
                    <h1>My Borrow Requests</h1>
                    <p>
                        View your equipment borrow requests and their status.
                    </p>
                </div>

                <div className="request-count">{requests.length}
                    <span>Requests</span>
                </div>
            </div>

            {error && (
                <div className="borrow-request-error">
                    {error}
                </div>
            )}

            {requests.length === 0 && !error && (
                <div className="no-borrow-requests">
                    <h2>No borrow requests</h2>
                    <p>
                        You have not submitted any borrow requests.
                    </p>
                </div>
            )}

            <div className="borrow-request-list">
                
                {requests.map((request) => (
                    
                    <div
                        className="borrow-request-card"
                        key={request.id}
                    >
                        <div className="borrow-request-card-header">
                            <div>
                                <h2>Request #{request.id}</h2>

                                <span
                                    className={`request-status ${request.status}`}
                                >{request.status}</span>
                            </div>
                        </div>

                        <div className="borrow-request-info">
                            <div>
                                <span className="info-label">Equipment</span>
                                <strong>{request.equipment_name}</strong>
                            </div>

                            <div>
                                <span className="info-label"> Serial number</span>
                                <strong>{request.serial_number}</strong>
                            </div>
                        </div>

                        <div className="borrow-request-purpose">
                            <span className="info-label">Purpose</span>
                            <p>{request.purpose}</p>
                        </div>

                        {request.status === "approved" && request.expires_at && (
                            <div className="borrow-request-expiration">
                                <span className="info-label">Expires</span>
                                <strong>
                                    {new Date(request.expires_at).toLocaleString()}
                                </strong>
                            </div>
                        )}

                       {request.status === "approved" && (
                            <div className="checkout-section">

                                <div className="qr-code">
                                    <span className="info-label">Checkout QR Code</span>

                                    <QRCodeSVG
                                        value={`br-${request.id.toString()}`}
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="submit-button"
                                    onClick={() => setCheckoutRequestId(request.id)}
                                >
                                    Check out equipment
                                </button>

                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BorrowRequestOverview;