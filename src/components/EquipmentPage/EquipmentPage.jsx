import "./EquipmentPage.css";

function EquipmentPage({ equipment }) {
    if (!equipment) {
        return null;
    }

    return (
        <div className="equipment-page">
            <h2>{equipment.name}</h2>

            <div className="equipment-information">
                <p>
                    <strong>ID</strong> {equipment.id}
                </p>

                 <p>
                    <strong>Name</strong> {equipment.name}
                </p>

                <p>
                    <strong>Serial number</strong> {equipment.serial_number}
                </p>

                <p>
                    <strong>Equipment type </strong> {equipment.equipment_type}
                </p>

                <p>
                    <strong>Location</strong> {equipment.location_name}
                </p>

                <p>
                    <strong>Condition</strong> {equipment.condition}
                </p>

                <p>
                     <strong>Status</strong>
                    <span className={`status-label status-${equipment.status}`}>
                        {equipment.status.replaceAll("_", " ")}
                    </span>
                </p>
            

                <p>
                    <strong>Mobility</strong> {equipment.mobility}
                </p>
            </div>
        </div>
    );
}

export default EquipmentPage;