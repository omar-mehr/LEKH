import { useState, useEffect } from "react";
import { getFaultReportsForEquipmentType,closeFaultReport } from "../../../functions/fetch/faultReportFetch.js";
import { jwtDecode } from "jwt-decode";
import "../ViewFaultReports/ViewFaultReports.css";

function ViewTypeFaultReports({ token, equipmentTypeId, onCancel }) {
    const [faultReports, setFaultReports] = useState([]);
    const [message, setMessage] = useState("");
    const user = jwtDecode(token);
    const role = user.role;

    async function handleCloseFaultReport(faultReportId) {
        try {
                await closeFaultReport(token, faultReportId);

                const reports = await getFaultReportsForEquipmentType(
                    token,
                    equipmentTypeId
                );

                setFaultReports(reports);
                setMessage("");
            } catch (error) {
                setMessage(error.message);
            }
        }

    useEffect(() => {
        async function fetchFaultReports() {
            try {
                const data = await getFaultReportsForEquipmentType(
                    token,
                    equipmentTypeId
                );

                setFaultReports(data);
            } catch (error) {
                setMessage(error.message);
            }
        }

        fetchFaultReports();
    }, [token, equipmentTypeId]);

    return (
        <div className="fault-reports">
            <h2>Type Fault Reports</h2>

            {message && (
                <p className="fault-reports-message fault-reports-error">
                    {message}
                </p>
            )}

            {!message && faultReports.length === 0 && (
                <p className="fault-reports-message">
                    No fault reports found for this equipment type.
                </p>
            )}

            {faultReports.length > 0 && (
                <div className="fault-reports-list">
                    {faultReports.map((faultReport) => (
                        <div
                            className="fault-report-card"
                            key={faultReport.id}
                        >
                            <p className="fault-report-description">
                                <strong>Description:</strong>{" "}
                                {faultReport.description}
                            </p>

                            <div className="fault-report-detail">
                                <span className="fault-report-label">
                                    Reported
                                </span>

                                <span className="fault-report-value">
                                    {new Date(
                                        faultReport.created_at
                                    ).toLocaleString()}
                                </span>
                            </div>

                            {(role === "administrator" || role === "caretaker") && (
                                <button
                                    type="button"
                                    onClick={() => handleCloseFaultReport(faultReport.id)}
                                >
                                    Close Fault Report
                                </button>
                            )}
                        </div>
                        
                        
                    ))}
                </div>
            )}

            <button
                type="button"
                className="fault-reports-close"
                onClick={onCancel}
            >
                Close
            </button>
        </div>
    );
}

export default ViewTypeFaultReports;
