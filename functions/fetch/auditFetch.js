const API_URL = import.meta.env.VITE_API_URL;

export async function getAuditLog(token) {
    const response = await fetch(`${API_URL}/lekhapi/audit-log`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch audit log");
    }
    return response.json();
}