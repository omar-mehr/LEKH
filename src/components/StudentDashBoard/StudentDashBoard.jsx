import { useState } from "react";
import { QrCode } from "lucide-react";
import BackButton from "../BackButton/BackButton";
import LogOutButton from "../LogOutButton/LogOutButton";
import EquipmentOverview from "../EquipmentOverview/EquipmentOverview";
import EquipmentTypePage from "../EquipmentTypePage/EquipmentTypePage";
import BorrowRequestOverview from "../BorrowRequestOverview/BorrowRequestOverview";
import LoanOverView from "../LoanOverView/LoanOverView";
import ScanQrCode from "../ScanQrCode/ScanQRCode"
import SearchInterface from "../SearchInterface/SearchInterface";
import "./StudentDashBoard.css";
import "../DashboardActions.css";

function StudentDashboard({ token, setToken, setPage }) {
    const [showEquipment, setShowEquipment] = useState(false);
    const [selectedEquipmentType, setSelectedEquipmentType] = useState(null);
    const [showBorrowRequests, setShowBorrowRequests] = useState(false);
    const [showLoans, setShowLoans] = useState(false);
    const [showScanQr, setScanQr] = useState(false);
  

    function closeEquipment() {
        setSelectedEquipmentType(null);
        setShowEquipment(false);
    }

    return (
        <div className="dashboard">
            <header className="student-header">
                <div>
                    <h1>Student Dashboard</h1>
                    <p>View equipment, borrow requests and your loans.</p>
                </div>
            </header>
            

            {!showEquipment &&!showBorrowRequests && !showLoans && !showScanQr && (
                    <>
                     <LogOutButton
                        setToken={setToken}
                        setPage={setPage}
                    />
                    <div className="dashboard-actions">
                        <button 
                            type="button" 
                            className="scan-qr-button" 
                            onClick={() => setScanQr(true)} 
                        > 
                            <QrCode size={24} /> 
                            <span>Scan QR code</span> 
                        </button>

                        <SearchInterface token={token} />
                    </div>
                    <div className="student-menu">

                        <button
                            type="button"
                            className="student-menu-button"
                            onClick={() => {
                                setShowEquipment(true);
                                setSelectedEquipmentType(null);
                            }}
                        >
                            <span>Equipment overview</span>
                            <small>View available equipment</small>
                        </button>

                        <button
                            type="button"
                            className="student-menu-button"
                            onClick={() => setShowBorrowRequests(true)}
                        >
                            <span>My borrow requests</span>
                            <small>View your borrow requests</small>
                        </button>

                        <button
                            type="button"
                            className="student-menu-button"
                            onClick={() => setShowLoans(true)}
                        >
                            <span>My loans</span>
                            <small>View your current loans</small>
                        </button>

                    </div>
                    </>
                )}

            {showEquipment && !selectedEquipmentType && (
                <>
                    <BackButton
                        onClick={closeEquipment}
                    />

                    <EquipmentOverview
                        token={token}
                        onSelectEquipmentType={setSelectedEquipmentType}
                    />
                </>
            )}

            {showEquipment && selectedEquipmentType && (
                <>
                    <BackButton
                        onClick={() =>
                            setSelectedEquipmentType(null)
                        }
                    />

                    <EquipmentTypePage
                        token={token}
                        equipmentType={selectedEquipmentType}
                    />
                </>
            )}

            {showBorrowRequests && (
                <>
                    <BackButton
                        onClick={() => setShowBorrowRequests(false)}
                    />
                    <BorrowRequestOverview token={token} setShowBorrowRequests={setShowBorrowRequests} />
                </>
            )}

            {showLoans && (
                <>
                    <BackButton
                        onClick={() => setShowLoans(false)}
                    />

                    <LoanOverView token={token} />
                </>
            )}
            {showScanQr && (
            <>
                <BackButton
                    onClick={() => setScanQr(false)}
                />

                <ScanQrCode token={token} 
                setPage={setPage}/>
            </>
            )}

           
        </div>
    );
}

export default StudentDashboard;
