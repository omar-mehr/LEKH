
const API_URL = import.meta.env.VITE_API_URL;

export async function createFaultReport(token, data) {
    const response = await fetch(`${API_URL}/lekhapi/fault-reports`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
}


export async function getFaultReportsForEquipment(token, equipmentUnitId) {
    const response = await fetch(
        `${API_URL}/lekhapi/fault-reports/equipment/${equipmentUnitId}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
}

export async function getFaultReportsForEquipmentType(token, equipmentTypeId) {
    const response = await fetch(
        `${API_URL}/lekhapi/fault-reports/type/${equipmentTypeId}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
}



export async function closeFaultReport(token, faultReportId) {
    const response = await fetch(
        `${API_URL}/lekhapi/fault-reports/${faultReportId}/close`,
        {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
}
