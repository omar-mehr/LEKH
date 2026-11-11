import { useState, useEffect } from "react";
import {getEquipmentTypes,updateEquipmentTypePhoto, deleteEquipmentTypePhoto} from "../../../functions/fetch/equipmentFetch.js";
import "./EquipmentPhotoForm.css";
function EquipmentPhotoForm({ token }) {
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [selectedEquipmentType, setSelectedEquipmentType] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getEquipmentTypes()
            .then((data) => {
                setEquipmentTypes(data);
            })
            .catch((error) => {
                alert(error.message);
            });
    }, []);

    function handleUpdatePhoto() {
        if (!photo || !selectedEquipmentType) {
            return;
        }

        updateEquipmentTypePhoto(
            selectedEquipmentType.id,
            photo,
            token
        )
            .then(() => {
                setPhoto(null);
                setMessage("Photo updated successfully!");

                return getEquipmentTypes();
            })
            .then((data) => {
                setEquipmentTypes(data);
            })
            .catch((error) => {
                alert(error.message);
            });
    }

    function handleDeletePhoto() {
        if (!selectedEquipmentType) {
            return;
        }

        deleteEquipmentTypePhoto(
            selectedEquipmentType.id,
            token
        )
            .then(() => {
                setMessage("Photo deleted successfully!");

                return getEquipmentTypes();
            })
            .then((data) => {
                setEquipmentTypes(data);
                setSelectedEquipmentType(null);
            })
            .catch((error) => {
                alert(error.message);
            });
    }

    return (
        <div className="equipment-photo-form">
            <h2>Manage equipment photos</h2>

            <label htmlFor="equipment-type">
                Equipment type
            </label>

            <select
                id="equipment-type"
                value={
                    selectedEquipmentType
                        ? selectedEquipmentType.id
                        : ""
                }
                onChange={(event) => {
                    const equipmentType = equipmentTypes.find(
                        (item) =>
                            item.id === Number(event.target.value)
                    );

                    setSelectedEquipmentType(equipmentType);
                    setPhoto(null);
                    setMessage("");
                }}
            >
                <option value="">
                    Select equipment type
                </option>

                {equipmentTypes.map((equipmentType) => (
                    <option
                        key={equipmentType.id}
                        value={equipmentType.id}
                    >
                        {equipmentType.name}
                    </option>
                ))}
            </select>

            {selectedEquipmentType && (
                <div>
                    <h3>{selectedEquipmentType.name}</h3>

                    {selectedEquipmentType.image_url && (
                        <img
                            src={`http://localhost:3000${selectedEquipmentType.image_url}`}
                            alt={selectedEquipmentType.name}
                            className="equipment-type-image"
                        />
                    )}

                   

                    <input
                            id="equipment-photo"
                            type="file"
                            accept="image/*"
                            className="photo-input"
                            onChange={(event) => {
                                setPhoto(event.target.files[0]);
                            }}
                        />

                        <label
                            htmlFor="equipment-photo"
                            className="photo-upload-button"
                        >
                            Select photo
                        </label>
                    <div className="equipment-photo-buttons">
                    <button
                        type="button"
                        onClick={handleUpdatePhoto}
                        disabled={!photo}
                       
                    >
                        Update photo
                    </button>

                    {selectedEquipmentType.image_url && (
                        <button
                            type="button"
                            onClick={handleDeletePhoto}
                        >
                            Delete photo
                        </button>
                    )}
                </div>
                </div>
            )}

            {message && (
                <p>{message}</p>
            )}
        </div>
    );
}

export default EquipmentPhotoForm;