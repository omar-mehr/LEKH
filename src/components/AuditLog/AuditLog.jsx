import { useEffect, useState } from "react";
import { getAuditLog } from "../../../functions/fetch/auditFetch.js";
import "./AuditLog.css";

function AuditLog({ token }) {
    const [auditLogs, setAuditLogs] = useState([]);

    useEffect(() => {
        async function fetchAuditLog() {
            try {
                const logs = await getAuditLog(token);
                setAuditLogs(logs);
            } catch (error) {
                console.error(error);
            }
        }

        fetchAuditLog();
    }, [token]);

    return (
        <div className="audit-log">
            <h2>Audit Log</h2>

            <div className="audit-log-table-container">
                <table className="audit-log-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Action</th>
                            <th>Entity</th>
                            <th>Entity ID</th>
                            <th>Details</th>
                            <th>Created</th>
                        </tr>
                    </thead>

                    <tbody>
                        {auditLogs.map((log) => (
                            <tr key={log.id}>
                                <td>{log.id}</td>
                                <td>{log.action}</td>
                                <td>{log.entity}</td>
                                <td>{log.entity_id}</td>
                                <td>{log.details}</td>
                                <td>{new Date(log.created_at).toLocaleString("sv-SE").replace(",", "")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AuditLog;