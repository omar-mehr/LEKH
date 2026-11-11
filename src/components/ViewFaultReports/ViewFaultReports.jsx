
import { useState, useEffect } from "react";
import {
    getFaultReportsForEquipment,
    getFaultReportsForEquipmentType,
    closeFaultReport
} from "../../../functions/fetch/faultReportFetch.js";
import { jwtDecode } from "jwt-decode";
import "./ViewFaultReports.css";

function ViewFaultReports({
    token,
    equipmentUnitId,
    equipmentTypeId,
    onCancel
}) {
    const [faultReports, setFaultReports] = useState([]);
    const [typeFaultReports, setTypeFaultReports] = useState([]);
    const [message, setMessage] = useState("");

    const user = jwtDecode(token);
    const role = user.role;

    async function handleCloseFaultReport(faultReportId) {
        try {
            await closeFaultReport(token, faultReportId);

            const reports = await getFaultReportsForEquipment(token,equipmentUnitId);

            setFaultReports(reports);
            setMessage("");
        } catch (error) {
            setMessage(error.message);
        }
    }

    useEffect(() => {
        async function fetchFaultReports() {
            try {
                const data = await getFaultReportsForEquipment(
                    token,
                    equipmentUnitId
                );

                const typeData = await getFaultReportsForEquipmentType(
                    token,
                    equipmentTypeId
                );

                setFaultReports(data);
                setTypeFaultReports(typeData);
            } catch (error) {
                setMessage(error.message);
            }
        }

        fetchFaultReports();
    }, [token, equipmentUnitId, equipmentTypeId]);

    return (
        <div className="fault-reports">
            <h2>Fault Reports</h2>

            {message && (
                <p className="fault-reports-message fault-reports-error">
                    {message}
                </p>
            )}

            {!message &&
                typeFaultReports.length === 0 &&
                faultReports.length === 0 && (
                    <p className="fault-reports-message">
                        No fault reports found.
                    </p>
                )}

            {typeFaultReports.length > 0 && (
                <>
                    <h5>Known Faults for This Equipment Type</h5>

                    <div className="fault-reports-list">
                        {typeFaultReports.map((faultReport) => (
                            <div
                                className="fault-report-card"
                                key={faultReport.id}
                            >
                                <p className="fault-report-description">
                                    <strong>Description:</strong>{" "}
                                    {faultReport.description}
                                </p>

                                <div className="fault-report-details">
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
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {faultReports.length > 0 && (
                <>
                    <h5>Faults Reported for This Unit</h5>

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

                                <div className="fault-report-details">
                                    <div className="fault-report-detail">
                                        <span className="fault-report-label">
                                            Status
                                        </span>

                                        <span className="fault-report-status">
                                            {faultReport.status}
                                        </span>
                                    </div>

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
                                </div>

                                {(role === "administrator" || role === "caretaker") && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCloseFaultReport(faultReport.id)
                                        }
                                    >
                                        Close Fault
                                    </button>
                                 )}
                            </div>
                        ))}
                    </div>
                </>
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

export default ViewFaultReports;
