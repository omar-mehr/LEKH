import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getEquipmentTypes } from "../../../functions/fetch/equipmentFetch.js";
import ReportEquipmentTypeFault from "../ReportEquipmentTypeFault/ReportEquipmentTypeFault.jsx";
const API_URL = import.meta.env.VITE_API_URL;
import "./EquipmentOverview.css";

function EquipmentOverview({ token,onSelectEquipmentType }) {
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [faultEquipmentType, setFaultEquipmentType] = useState(null);
    const user = jwtDecode(token);
    const role = user.role;

    useEffect(() => {
        getEquipmentTypes()
            .then((data) => {
                setEquipmentTypes(data);
            })
            .catch((error) => {
                alert(error.message);
            });
    }, []);

    return (
        <div className="equipment-overview">
            <h1>Equipment Overview</h1>

            <div className="equipment-type-grid">
                {equipmentTypes.map((equipmentType) => (
                    <div
                        className="equipment-type-card"
                        key={equipmentType.id}
                    >
                        {equipmentType.image_url && (
                            <img
                                src={`${API_URL}${equipmentType.image_url}`}
                                alt={equipmentType.name}
                                className="equipment-type-image"
                            />
                        )}

                        <h2>
                            {equipmentType.name}

                            <span className="equipment-unit-count">
                                {equipmentType.unit_count} units
                            </span>
                        </h2>

                        <p className="equipment-description">
                            {equipmentType.description}
                        </p>
                    
                    <div className="equipment-buttons">
                        <button
                            type="button"
                            className="view-equipment-button"
                            onClick={() => {
                                onSelectEquipmentType(equipmentType);
                            }}
                        >
                            View equipment
                        </button>

                        {(role === "caretaker" || role === "administrator") && (
                            <button
                                type="button"
                                className="view-equipment-button"
                                onClick={() => {
                                    setFaultEquipmentType(equipmentType);
                                }}
                            >
                                Report Type Fault
                            </button>
                        )}

                        
                    </div>
                    </div>
                ))}
            </div>

            {faultEquipmentType && (
                <div className="popup-box">
                    <ReportEquipmentTypeFault
                        token={token}
                        equipmentTypeId={faultEquipmentType.id}
                        onCancel={() => {
                            setFaultEquipmentType(null);
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default EquipmentOverview;