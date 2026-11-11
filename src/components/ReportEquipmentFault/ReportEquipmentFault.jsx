import { useState } from "react";
import "../Form.css";
import { createFaultReport } from "../../../functions/fetch/faultReportFetch.js";

function ReportEquipmentFault({ token, equipmentUnitId, onCancel }) {
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        const data = {
            equipmentUnitId: equipmentUnitId,
            description: description
        };

        try {
            await createFaultReport(token, data);

            setMessage("Fault report submitted successfully");
            setDescription("");
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Report a Fault</h2>

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

            <label htmlFor="description">Fault Description</label>

            <textarea
                id="description"
                className="input-field"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the problem with the equipment"
                required
            />

            <button type="submit" className="submit-button">
                Submit Fault Report
            </button>

            <button
                type="button"
                onClick={onCancel}
            >
                Close
            </button>
        </form>
    );
}

export default ReportEquipmentFault;
