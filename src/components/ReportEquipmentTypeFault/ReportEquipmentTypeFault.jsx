import { useState } from "react";
import { createFaultReport } from "../../../functions/fetch/faultReportFetch.js";
import "../Form.css";

function ReportEquipmentTypeFault({ token, equipmentTypeId, onCancel }) {
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");

        try {
            await createFaultReport(token, {
                equipmentTypeId: equipmentTypeId,
                description: description
            });

            setIsError(false);
            setMessage("Fault report submitted successfully.");
            setDescription("");
        } catch (error) {
            setIsError(true);
            setMessage(error.message);
        }
    }

    return (
        <div className="form-container">
            <h2>Report Equipment Type Fault</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="description">
                    Fault Description
                </label>

                <textarea
                    id="description"
                    name="description"
                    className="input-field"
                    value={description}
                    onChange={(event) => {
                        setDescription(event.target.value);
                    }}
                    placeholder="Describe the fault..."
                    required
                />

                {message && (
                    <p style={{ color: isError ? "red" : "green" }}>
                        {message}
                    </p>
                )}

                <div className="equipment-buttons">
                    <button type="submit">
                        Submit Fault Report
                    </button>

                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ReportEquipmentTypeFault;
