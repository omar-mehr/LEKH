import { useState } from "react";
import { QrCode } from "lucide-react";
import BackButton from "../BackButton/BackButton";
import LogOutButton from "../LogOutButton/LogOutButton";
import EquipmentOverview from "../EquipmentOverview/EquipmentOverview";
import EquipmentTypePage from "../EquipmentTypePage/EquipmentTypePage";
import EquipmentTypeForm from "../EquipmentTypeForm/EquipmentTypeForm";
import EquipmentForm from "../EquipmentForm/EquipmentForm";
import LocationForm from "../LocationForm/LocationForm";
import BorrowRequestManagement from "../BorrowRequestManagement/BorrowRequestManagement";
import RenewalRequests from "../RenewalRequests/RenewalRequests";
import EquipmentPhotoForm from "../EquipmentPhotoForm/EquipmentPhotoForm";
import ScanQrCode from "../ScanQrCode/ScanQRCode"
import RegisterLoanForm from "../RegisterLoanForm/RegisterLoanForm";
import GuideInterface from "../GuideInterface/GuideInterface"
import GuideEditInterface from "../GuideEditInterface/GuideEditInterface";
import SearchLoan from "../SearchLoan/SearchLoan";
import LoanHistory from "../LoanHistory/LoanHistory";
import SearchInterface from "../SearchInterface/SearchInterface";
import "./CareTakerDashBoard.css";
import "../DashboardActions.css";

function CareTakerDashBoard({ token, setToken, setPage }) {
    const [showEquipment, setShowEquipment] = useState(false);
    const [selectedEquipmentType, setSelectedEquipmentType] = useState(null);
    const [showEquipmentType, setShowEquipmentType] = useState(false);
    const [showEquipmentForm, setShowEquipmentForm] = useState(false);
    const [showLocation, setShowLocation] = useState(false);
    const [showBorrowRequests, setShowBorrowRequests] = useState(false);
    const [showRenewalRequests, setShowRenewalRequests] = useState(false);
    const [showEquipmentPhotos, setShowEquipmentPhotos] = useState(false);
    const [showScanQr, setScanQr] = useState(false);
    const [showRegisterLoan, setShowRegisterLoan] = useState(false);
    const [showGuides, setShowGuides] = useState(false);
    const [showGuideEdit, setShowGuideEdit] = useState(false);
    const [showSearchLoan, setShowSearchLoan] = useState(false);
    const [showLoanHistory, setShowLoanHistory] = useState(false);

    function closeEquipment() {
        setSelectedEquipmentType(null);
        setShowEquipment(false);
    }

    return (
        <div className="caretaker-dashboard">
            <header className="caretaker-header">
                <div>
                    <h1>Caretaker Dashboard</h1>
                    <p>Handle equipment, loans, returns and borrow requests</p>
                
                </div>
            </header>

            {
                !showEquipment &&
                !showEquipmentType &&
                !showEquipmentForm &&
                !showLocation &&
                !showBorrowRequests &&
                !showRenewalRequests &&
                !showEquipmentPhotos &&
                !showScanQr &&
                !showRegisterLoan &&
                !showGuides && 
                !showGuideEdit &&
                !showSearchLoan &&
                !showLoanHistory && (
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
                    
                    <div className="caretaker-menu">
                        <button
                            type="button"
                            className="caretaker-menu-button"
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
                            className="caretaker-menu-button"
                            onClick={() => setShowEquipmentType(true)}
                        >
                            <span>Equipment types</span>
                            <small>Manage equipment types</small>
                        </button>

                        <button
                            type="button"
                            className="caretaker-menu-button"
                            onClick={() => setShowEquipmentForm(true)}
                        >
                            <span>Equipment</span>
                            <small>Manage individual equipment</small>
                        </button>

                        <button
                            type="button"
                            className="caretaker-menu-button"
                            onClick={() => setShowLocation(true)}
                        >
                            <span>Locations</span>
                            <small>Create a new location</small>
                        </button>

                        <button
                            type="button"
                            className="caretaker-menu-button"
                            onClick={() => setShowBorrowRequests(true)}
                        >
                            <span>Borrow requests</span>
                            <small>Review and manage requests</small>
                        </button>

                        <button
                            type="button"
                            className="caretaker-menu-button"
                            onClick={() => setShowRenewalRequests(true)}
                        >
                            <span>Renewal requests</span>
                            <small>Manage loan renewal requests</small>
                        </button>

                        <button
                            type="button"
                            className="caretaker-menu-button"
                            onClick={() => setShowEquipmentPhotos(true)}
                        >
                            <span>Manage equipment photos</span>
                            <small>Add, update or delete equipment photos</small>
                        </button>

                        <button
                            type="button"
                            className="caretaker-menu-button"
                            onClick={() => setShowRegisterLoan(true)}
                        >
                            <span>Register loan</span>
                            <small>Register equipment checkout for a student</small>
                        </button>


                        <button
                            type="button"
                            className="caretaker-menu-button"
                            onClick={() => setShowGuides(true)}
                        >
                            <span>Manage guides</span>
                            <small>Create and edit equipment guides</small>
                        </button>

                        <button
                            type="button"
                            className="caretaker-menu-button"
                            onClick={() => setShowGuideEdit(true)}
                        >
                            <span>Edit existing guides</span>
                            <small>Edit guides and their steps</small>
                        </button>

                        <button
                            type="button"
                            className="caretaker-menu-button"
                            onClick={() => setShowSearchLoan(true)}
                        >
                            <span>Search loan</span>
                            <small>View loan and condition photos</small>
                        </button>

                        <button
                            type="button"
                            className="caretaker-menu-button"
                            onClick={() => setShowLoanHistory(true)}
                        >
                            <span>Equipment loan history</span>
                            <small>View loan history for equipment</small>
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
                        onSelectEquipmentType={setSelectedEquipmentType}
                        token={token}
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

            {showEquipmentType && (
                <>
                    <BackButton
                        onClick={() => setShowEquipmentType(false)}
                    />

                    <EquipmentTypeForm token={token} />
                </>
            )}

            {showEquipmentForm && (
                <>
                    <BackButton
                        onClick={() => setShowEquipmentForm(false)}
                    />

                    <EquipmentForm token={token} />
                </>
            )}

            {showLocation && (
                <>
                    <BackButton
                        onClick={() => setShowLocation(false)}
                    />

                    <LocationForm token={token} />
                </>
            )}

            {showBorrowRequests && (
                <>
                    <BackButton
                        onClick={() => setShowBorrowRequests(false)}
                    />

                    <BorrowRequestManagement token={token} />
                </>
            )}

            {showRenewalRequests && (
                <>
                    <BackButton
                        onClick={() => setShowRenewalRequests(false)}
                    />

                    <RenewalRequests token={token} />
                </>
            )}

            {showEquipmentPhotos && (
                <>
                    <BackButton
                        onClick={() => setShowEquipmentPhotos(false)}
                    />

                    <EquipmentPhotoForm token={token} />
                </>
            )}

            {showScanQr && (
            <>
                <BackButton
                    onClick={() => setScanQr(false)}
                />

                <ScanQrCode />
            </>
            )}

            {showRegisterLoan && (
            <>
                <BackButton
                    onClick={() => setShowRegisterLoan(false)}
                />

                <RegisterLoanForm token={token} />
            </>
            )}
            {showGuides && (
            <>
                <BackButton
                    onClick={() => setShowGuides(false)}
                />

                <GuideInterface token={token} />
                </>
            )}

            {showGuideEdit && (
                <>
                    <BackButton onClick={() => setShowGuideEdit(false)} />
                    <GuideEditInterface token={token} />
                </>
            )}
            {showSearchLoan && (
            <>
                <BackButton
                    onClick={() => setShowSearchLoan(false)}
                />

                <SearchLoan token={token} />
            </>
            )}
            {showLoanHistory && (
                <>
                    <BackButton
                        onClick={() => setShowLoanHistory(false)}
                    />

                    <LoanHistory token={token} />
                </>
            )}
        </div>
    );
}

export default CareTakerDashBoard;