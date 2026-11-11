import { useEffect, useState,useRef } from "react";
import {getMyLoans,createRenewalRequest,returnLoan} from "../../../functions/fetch/loanFetch.js";
import "./LoanOverView.css";

function LoanOverView({ token }) {
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState("");
    const [renewalMessage, setRenewalMessage] = useState("");
    const [renewalSuccess, setRenewalSuccess] = useState(false);
    const [returnMessage, setReturnMessage] = useState("");
    const [returnSuccess, setReturnSuccess] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [returnLoanId, setReturnLoanId] = useState(null);

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        getMyLoans(token)
            .then((data) => {
                setLoans(data);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, [token]);

    async function handleRenewalRequest(loanId) {
        try {
            await createRenewalRequest(token, loanId);

            const updatedLoans = await getMyLoans(token);
            setLoans(updatedLoans);

            setRenewalMessage("Renewal request submitted");
            setRenewalSuccess(true);

            setTimeout(() => {
                setRenewalMessage("");
            }, 2000);
        } catch (error) {
            setRenewalMessage(error.message);
            setRenewalSuccess(false);

            setTimeout(() => {
                setRenewalMessage("");
            }, 2000);
        }
    }

    async function handleReturn(loanId, photo)  {
    try {
        await returnLoan(token, loanId, photo);

        const updatedLoans = await getMyLoans(token);
        setLoans(updatedLoans);

        setReturnMessage("Equipment returned successfully");
        setReturnSuccess(true);

        setTimeout(() => {
            setReturnMessage("");
        }, 2000);

    } catch (error) {
        setReturnMessage(error.message);
        setReturnSuccess(false);

        setTimeout(() => {
            setReturnMessage("");
        }, 2000);
    }
    }
    async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        streamRef.current = stream;
       

        setCameraOpen(true);
    } catch (error) {
        setError("Could not access camera");
    }
}
    function stopCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                track.stop();
            });

            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setCameraOpen(false);
    }
    useEffect(() => {
        if (cameraOpen && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [cameraOpen]);

function takePhoto() {
    const video = videoRef.current;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    canvas.toBlob((blob) => {
        if (!blob) {
            setError("Could not take photo");
            return;
        }

        const file = new File(
            [blob],
            "condition-photo.jpg",
            {
                type: "image/jpeg"
            }
        );

        setPhoto(file);
        stopCamera();
        handleReturn(returnLoanId, file);
    }, "image/jpeg");
}

    return (
        <div className="loan-page">
            <div className="loan-page-header">
                <div>
                    <h1>My Loans</h1>
                    <p>View your current equipment loans.</p>
                </div>

                <div className="loan-total">
                    <strong>{loans.length}</strong>
                    <span>Loans</span>
                </div>
            </div>

            {error && (
                <div className="loan-error">
                    {error}
                </div>
            )}

            {renewalMessage && (
                <p className={renewalSuccess ? "renewal-success" : "renewal-error"}>
                    {renewalMessage}
                </p>
            )}
            {returnMessage && (
                <p className={returnSuccess ? "renewal-success" : "renewal-error"}>
                    {returnMessage}
                </p>
            )}

            {loans.length === 0 && !error && (
                <div className="loan-empty">
                    <h2>No loans</h2>
                    <p>
                        You currently have no active equipment loans.
                    </p>
                </div>
            )}

            <div className="loan-list">
                {loans.map((loan) => (
                    <div
                        className="loan-card"
                        key={loan.id}
                    >
                        <div className="loan-card-top">
                            <div>
                                <span className="loan-label">Loan</span>
                                <h2>#{loan.id}</h2>
                            </div>

                            <div className="loan-equipment-name">
                                <span className="loan-label">Equipment</span>
                                <strong>{loan.equipment_name}</strong>
                            </div>

                            <span className="loan-status">
                                Active
                            </span>
                        </div>

                        <div className="loan-dates">
                            <div>
                                <span className="loan-label">
                                    Start date
                                </span>

                                <strong>
                                    {new Date(loan.start_date)
                                        .toISOString()
                                        .split("T")[0]}
                                </strong>
                            </div>

                            <div>
                                <span className="loan-label">
                                    Due date
                                </span>

                                <strong>
                                    {new Date(loan.due_date)
                                        .toISOString()
                                        .split("T")[0]}
                                </strong>
                            </div>
                        </div>

                        <div className="renewal-status">
                            <span className="loan-label">
                                Renewal request
                            </span>

                            <strong>
                                {loan.renewal_status
                                    ? loan.renewal_status
                                    : "None"}
                            </strong>
                        </div>

                        <div className="loan-actions">
                            {loan.renewal_status !== "pending" && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRenewalRequest(loan.id)
                                    }
                                >
                                    Request renewal
                                </button>
                            )}

                            <button
                                type="button"
                                 onClick={() => {
                                    setReturnLoanId(loan.id);
                                    startCamera();
                                }}
                            >
                                Return equipment
                            </button>
                        </div>

                        {cameraOpen && returnLoanId === loan.id && (
                            <div className="camera-section">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="camera-preview"
                                ></video>

                                <button
                                    type="button"
                                    onClick={takePhoto}
                                >
                                    Take photo
                                </button>
                            </div>
                        )}

                        {photo && returnLoanId === loan.id && (
                            <div className="camera-section">
                                <label>Condition photo</label>

                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt="Condition"
                                    className="condition-photo-preview"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LoanOverView;