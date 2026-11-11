import { useState, useEffect } from "react";
import { getEquipment} from "../../../functions/fetch/equipmentFetch.js";
import { getGuidesByEquipmentTypeId,getGuideSteps} from "../../../functions/fetch/guideFetch.js"
import EquipmentForm from "../EquipmentForm/EquipmentForm";
import BorrowRequestForm from "../BorrowRequestForm/BorrowRequestForm";
import ReportEquipmentFault from "../ReportEquipmentFault/ReportEquipmentFault";
import ViewFaultReports from "../ViewFaultReports/ViewFaultReports.jsx";
import ViewTypeFaultReports from "../ViewTypeFaultReports/ViewTypeFaultReports.jsx";
import { jwtDecode } from "jwt-decode";
import { QRCodeSVG } from "qrcode.react";
import "./EquipmentTypePage.css";

function EquipmentTypePage({ token, equipmentType }) {
    const user = jwtDecode(token);
    const role = user.role;

    const [equipment, setEquipment] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [faultEquipment, setFaultEquipment] = useState(null);
    const [viewFaultEquipment, setViewFaultEquipment] = useState(null);
    const [borrowEquipment, setBorrowEquipment] = useState(null);
    const [qrEquipment, setQrEquipment] = useState(null);
    const [guides, setGuides] = useState([]);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [guideSteps, setGuideSteps] = useState([]);
    const [viewTypeFaults, setViewTypeFaults] = useState(false);
    
    useEffect(() => {
        getEquipment(equipmentType.id)
            .then((data) => {
                setEquipment(data);
            })
            .catch((error) => {
                alert(error.message);
             });
        getGuidesByEquipmentTypeId(token, equipmentType.id)
        .then((data) => {
            setGuides(data);
        })
        .catch((error) => {
            alert(error.message);
        });
}, [equipmentType.id, token]);

    function refreshEquipment() {
        getEquipment(equipmentType.id)
            .then((data) => {
                setEquipment(data);
            })
            .catch((error) => {
                alert(error.message);
            });
    }

    return (
        <div className="equipment-type-page">

            <div className="equipment-type-header">

                {equipmentType.image_url && (
                    <img
                        src={`http://localhost:3000${equipmentType.image_url}`}
                        alt={equipmentType.name}
                        className="equipment-type-page-image"
                    />
                )}

                <div>
                    <h1>{equipmentType.name}</h1>

                    <span className="equipment-unit-count">
                        {equipmentType.unit_count} units
                    </span>

                     <button
                        type="button"
                        className="view-type-faults-button"
                        onClick={() => setViewTypeFaults(true)}
                    >
                        View Type Fault Reports
                    </button>

                    <p>
                        {equipmentType.description}
                    </p>
                </div>

            </div>

            <h2>Individual equipment</h2>

            {equipment.length === 0 ? (
                <p className="no-equipment">
                    No individual equipment registered.
                </p>
            ) : (
                <div className="individual-equipment-grid">

                    {equipment.map((item) => (
                        <div
                            className="individual-equipment-card"
                            key={item.id}
                        >
                            <h3>{item.name}</h3>
                            <p><strong>Category: </strong> {item.category_name}</p>
                            <p><strong>Serial number: </strong> {item.serial_number}</p>

                            <p><strong>Location: </strong>  {item.location}</p>

                            <p><strong>Condition: </strong> {item.condition}</p>

                           <p>
                                <strong>Status: </strong>
                                <span className={`status-label status-${item.status}`}> {item.status.replaceAll("_", " ")}</span>
                            </p>
                            <p><strong>Mobility:</strong> {item.mobility}</p>

                            <div className="equipment-buttons">

                                {(role === "administrator" ||
                                    role === "caretaker") && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedEquipment(item);
                                        }}
                                    >
                                        Update equipment
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQrEquipment(item);
                                        }}
                                    >
                                        Generate QR
                                    </button>
                                    
                                </>
                                    
                                )}
                               
                            {role === "student" && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBorrowEquipment(item);
                                        }}
                                    >
                                        Request borrow
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFaultEquipment(item);
                                        }}
                                    >
                                        Report a Fault
                                    </button>

                                    
                                </>
                            )}

                                <button
                                    type="button"
                                    onClick={() => setViewFaultEquipment(item)}
                                >
                                    View Fault Reports
                                </button>

                            </div>

                        </div>
                    ))}

                    

                </div>
            )}

            <h2>Guides</h2>

                {guides.length === 0 ? (
                    <p className="no-equipment">
                        No guides available.
                    </p>
                ) : (
                    <div className="guide-list">
                        {guides.map((guide) => (
                            <div
                                key={guide.id}
                                className="guide-card"
                               onClick={() => { 
                                    if ( selectedGuide && selectedGuide.id === guide.id ){
                                         setSelectedGuide(null) 
                                         setGuideSteps([]) 
                                         return;
                                        } 
                                        setSelectedGuide(guide);
                                        getGuideSteps(token, guide.id) 
                                            .then((data) => 
                                            {setGuideSteps(data); 
                                            }) 
                                            .catch((error) => { 
                                                console.error(error)
                                                })
                                            
                                }} 
                        >
                                <div className="guide-card-info">
                                    <h6>{guide.title}</h6>
                                    <p>{guide.description}</p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
                            {selectedGuide && (
                <div className="guide-details">
                    <h2>{selectedGuide.title}</h2>

                    <p>{selectedGuide.description}</p>

                    {guideSteps.map((step) => (
                        <div
                            key={step.id}
                            className="guide-step"
                        >
                            <h6>Step {step.step_number}</h6>

                            <p>{step.content}</p>

                            {step.image_url && (
                                <img
                                    src={`http://localhost:3000${step.image_url}`}
                                    alt={`Step ${step.step_number}`}
                                />
                            )}

                            {step.video_url && (
                                <a
                                    href={step.video_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Watch video
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {selectedEquipment && (
                <div className="popup-box">
                    <EquipmentForm
                        equipment={selectedEquipment}
                        onCancel={() => {
                            setSelectedEquipment(null);
                        }}
                        onUpdate={refreshEquipment}
                        token={token}
                    />
                </div>
            )}

            {borrowEquipment && (
                <div className="popup-box">
                    <BorrowRequestForm
                        equipment={borrowEquipment}
                        onCancel={() => {
                            setBorrowEquipment(null);
                        }}
                        token={token}
                    />
                </div>
            )}

            {faultEquipment && (
                <div className="popup-box">
                    <ReportEquipmentFault
                        token={token}
                        equipmentUnitId={faultEquipment.id}
                        onCancel={() => {
                            setFaultEquipment(null);
                        }}
                    />
                </div>
            )}

            {viewFaultEquipment && (
            <div className="popup-box">
                <ViewFaultReports
                    token={token}
                    equipmentUnitId={viewFaultEquipment.id}
                    equipmentTypeId={equipmentType.id}
                    onCancel={() => setViewFaultEquipment(null)}
                />


            </div>
            )}

            
            {viewTypeFaults && (
                <div className="popup-box">
                    <ViewTypeFaultReports
                        token={token}
                        equipmentTypeId={equipmentType.id}
                        onCancel={() => setViewTypeFaults(false)}
                    />
                </div>
            )}


                   {qrEquipment && (
                    <div className="popup-box">
                        <h2>QR Code</h2>

                        <div className="qr-code">
                            <QRCodeSVG value={qrEquipment.serial_number} />
                        </div>

                        <p>
                            Serial number: {qrEquipment.serial_number}
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                window.print();
                            }}
                        >
                            Print QR
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setQrEquipment(null);
                            }}
                        >
                            Close
                        </button>
                    </div>
                )}

        </div>
    );
}

export default EquipmentTypePage;