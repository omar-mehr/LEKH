import "../Form.css";
import { useState, useEffect,useRef } from "react";
import { getBorrowRequestById , checkoutBorrowRequest} from "../../../functions/fetch/loanFetch.js";

function SelfServiceCheckoutForm({ token, borrowRequestId,setShowBorrowRequests }) {
    const [equipment, setEquipment] = useState(null);
    const [purpose, setPurpose] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [photo, setPhoto] = useState(null);
    const [cameraOpen, setCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
    getBorrowRequestById(token, borrowRequestId)
        .then((data) => {
            setEquipment({
                name: data.equipment_name,
                serial_number: data.serial_number
            });

            setPurpose(data.purpose);
        })
        .catch((error) => {
            setError(error.message);
        });
}, [token, borrowRequestId]);

async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
        await checkoutBorrowRequest(token, borrowRequestId, photo);

        setMessage("Equipment checked out successfully");
      

        setTimeout(() => {
            setShowBorrowRequests(false);
        }, 3000);
    } catch (error) {
        setError(error.message);
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
    }, "image/jpeg");
}


useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
    }
}, [cameraOpen]);

    return (
        <form onSubmit={handleSubmit}>
            <h2>Checkout Equipment</h2>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}

            {equipment && (
                <>
                    <div className="category-group">
                        <label>
                            Equipment
                        </label>

                        <p>
                            {equipment.name}
                        </p>
                    </div>

                    <div className="category-group">
                        <label>
                            Serial number
                        </label>

                        <p>
                            {equipment.serial_number}
                        </p>
                    </div>
                </>
            )}

            <div className="category-group">
                <label>
                    Purpose
                </label>

                <p>
                    {purpose}
                </p>
            </div>
            {!cameraOpen && !photo && (
                <button
                    type="button"
                    className="submit-button"
                    onClick={startCamera}
                >
                    Open camera
                </button>
            )}
            {cameraOpen && (
                <div className="camera-section">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="camera-preview"
                    ></video>

                    <button 
                        type="button" 
                        className="submit-button"
                        onClick={takePhoto}
                    >
                        Take photo 
                    </button>
                </div>
            )}
            {photo && (
                <div className="camera-section">
                    <label>Condition photo</label>

                    <img
                        src={URL.createObjectURL(photo)}
                        alt="Condition"
                        className="condition-photo-preview"
                    />
                </div>
            )}
            <button
                type="submit"
                className="submit-button"
            >
                Check out equipment
            </button>
        </form>
    );
}

export default SelfServiceCheckoutForm;