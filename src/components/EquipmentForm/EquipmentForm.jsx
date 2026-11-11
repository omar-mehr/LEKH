import { useState, useEffect } from "react";
import "../Form.css";
import {getEquipmentTypes,createEquipment,getLocations,updateEquipment} from "../../../functions/fetch/equipmentFetch.js";

function EquipmentForm({ equipment, onCancel, onUpdate,  token  }) {
    const [name, setName] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [equipmentTypeId, setEquipmentTypeId] = useState("");
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [locationId, setLocationId] = useState("");
    const [condition, setCondition] = useState("");
    const [status, setStatus] = useState("available");
    const [mobility, setMobility] = useState("");
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (equipment) {
            setName(equipment.name)
            setSerialNumber(equipment.serial_number)
            setEquipmentTypeId(equipment.equipment_type_id)
            setLocationId(equipment.location_id || "")
            setCondition(equipment.condition)
            setStatus(equipment.status);
            setMobility(equipment.mobility)
        }
    }, [equipment]);

    useEffect(() => {
        getEquipmentTypes()
            .then((data) => {
                setEquipmentTypes(data);
            })
            .catch((error) => {
                setError(error.message);
            });

        getLocations()
            .then((data) => {
                setLocations(data);
            })
            .catch((error) => {
               setError(error.message);
            });
    }, []);

    function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (equipment) {
        updateEquipment(equipment.id, 
            {
                locationId: locationId,
                condition: condition,
                status: status,
                mobility: mobility
            },token)
            .then(() => {
                setSuccess("Equipment updated successfully!");
                 onUpdate();
            })
            .catch((error) => {
                setError(error.message);
            });

        return;
    }

    const data = {
        name: name,
        serialNumber: serialNumber,
        equipmentTypeId: equipmentTypeId,
        locationId: locationId,
        condition: condition,
        status: status,
        mobility: mobility
    };

    createEquipment(data,token)
        .then(() => {
            setName("");
            setSerialNumber("");
            setEquipmentTypeId("");
            setLocationId("");
            setSuccess("Equipment created successfully!");

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        })
        .catch((error) => {
            setError(error.message);
        });
    }

    return (
        <form className="equipment-form" onSubmit={handleSubmit}>
           
                <label>Name</label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="input-field"
                    required
                    disabled={equipment}
                />

                <label>Serial number</label>

                <input
                    id="serialNumber"
                    name="serialNumber"
                    placeholder="Enter the device serial number"
                    type="text"
                    value={serialNumber}
                    onChange={(event) => setSerialNumber(event.target.value)}
                    className="input-field"
                    required
                    disabled={equipment}
                />

                <label>Equipment type</label>

                <select
                    id="equipmentTypeId"
                    name="equipmentTypeId"
                    value={equipmentTypeId}
                    onChange={(event) => setEquipmentTypeId(event.target.value)}
                    className="select-field"
                    required
                    disabled={equipment}
                >
                    <option value="">Select equipment type</option>

                    {equipmentTypes.map((equipmentType) => (
                        <option
                            key={equipmentType.id}
                            value={equipmentType.id}
                        >
                            {equipmentType.name}
                        </option>
                    ))}
                </select>

                <label>Location</label>
                <select
                    id="locationId"
                    name="locationId"
                    value={locationId}
                    onChange={(event) => setLocationId(event.target.value)}
                    className="select-field"
                >
                     <option value="">Select location</option>
                     {locations.map((location) => (
                    <option
                        key={location.id}
                        value={location.id}
                    >
                        {location.name}
                    </option>
                ))}
                   
                </select>

                <label>Condition</label>

                    <select
                        id="condition"
                        name="condition"
                        value={condition}
                        onChange={(event) => setCondition(event.target.value)}
                        className="select-field"
                        required
                    >
                        <option value="">Select condition</option>
                        <option value="new">New</option>
                        <option value="good">Good</option>
                        <option value="worn">Worn</option>
                        <option value="damaged">Damaged</option>
                    </select>

              <label>Status</label>

                    <select
                        id="status"
                        name="status"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="select-field"
                        required
                    >
                        <option value="available">Available</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="retired">Retired</option>
                        <option value="out_of_service">Out Of Service</option>
                    </select>

                <label>Mobility</label>

                <select
                    id="mobility"
                    name="mobility"
                    value={mobility}
                    onChange={(event) => setMobility(event.target.value)}
                    className="select-field"
                    required
                >
                    <option value="">Select mobility</option>
                    <option value="stationary">Stationary</option>
                    <option value="portable">Portable</option>
                </select>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="success-message">
                        {success}
                    </p>
                )}

                {equipment ? (
                    <>
                        <button
                            className="submit-button"
                            type="submit"
                        >
                            Update
                        </button>

                        <button
                            className="submit-button"
                            onClick={onCancel}
                            type="button"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className="submit-button"
                        type="submit"
                    >
                        Register equipment
                    </button>
                )}
            
        </form>
    );
}

export default EquipmentForm;