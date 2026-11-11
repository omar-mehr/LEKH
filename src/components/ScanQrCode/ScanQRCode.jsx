
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { getEquipmentBySerialNumber } from "../../../functions/fetch/equipmentFetch.js";
import EquipmentPage from "../EquipmentPage/EquipmentPage";
import SelfServiceCheckoutForm from "../SelfServiceCheckoutForm/SelfServiceCheckoutForm";
import "./ScanQRCode.css";

function ScanQRCode({ token,setPage }) {
    const [equipment, setEquipment] = useState(null);
    const [scannedValue, setScannedValue] = useState("");
    const [error, setError] = useState("");
    const [borrowRequestId, setBorrowRequestId] = useState("");

    async function handleScan(result) {
        if (result) {
            const value = result[0].rawValue;

            console.log("QR VALUE:", value);

            setScannedValue(value);
            setError("");

            if (value.startsWith("br-")) {
                const borrowRequestId = value.replace("br-", "");

                setBorrowRequestId(borrowRequestId);

                console.log("Borrow request ID:", borrowRequestId);

                return;
            }

            try {
                const equipment = await getEquipmentBySerialNumber(value);

                console.log("Equipment:", equipment);

                setEquipment(equipment);
            } catch (error) {
                console.error("Equipment error:", error);
                setError(error.message);
            }
        }
    }

    return (
        <div className="scan-container">
            <h2>Scan QR code</h2>

            {!equipment && !borrowRequestId && (
                <div className="scanner-wrapper">
                    <Scanner
                        onScan={handleScan}
                        onError={(error) => console.log("Camera error:", error)}
                    />
                </div>
            )}

            <p>Scanned value: {scannedValue}</p>

            {error && (
                <p>
                    Error: {error}
                </p>
            )}

            <EquipmentPage equipment={equipment} />

            {borrowRequestId && (
                <SelfServiceCheckoutForm 
                    token={token}
                    borrowRequestId={borrowRequestId}
                    setPage={setPage}
                />
            )}
        </div>
    );
}

export default ScanQRCode;
