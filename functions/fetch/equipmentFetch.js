const API_URL = import.meta.env.VITE_API_URL;

export async function getCategories() {
    const response = await fetch(`${API_URL}/lekhapi/categories`)

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data;
}

export async function createCategory(name, token) {
    const response = await fetch(`${API_URL}/lekhapi/categories`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name
            })
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return result;
}

export async function createEquipmentType(data, token) {
    const response = await fetch(`${API_URL}/lekhapi/equipment-types`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return result;
}

export async function getEquipmentTypes() {
    const response = await fetch(`${API_URL}/lekhapi/equipment-types`)

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data;
}

export async function deleteEquipmentTypePhoto(id, token) {
    const response = await fetch(`${API_URL}/lekhapi/equipment-types/${id}/photo`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return result;
}

export async function updateEquipmentTypePhoto(id, photo, token) {
    const data = new FormData();
    data.append("photo", photo);

    const response = await fetch(
        `${API_URL}/lekhapi/equipment-types/${id}/photo`,
        {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return result;
}

export async function createEquipment(data, token) {
    const response = await fetch(
        `${API_URL}/lekhapi/create-equipment`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return result;
}

export async function getEquipment(equipmentTypeId) {
    const response = await fetch(
        `${API_URL}/lekhapi/individual-equipment?equipment_type_id=${equipmentTypeId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch equipment");
    }

    return response.json();
}

export async function getLocations() {
    const response = await fetch(`${API_URL}/lekhapi/locations`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data;
}


export async function createLocation(data, token) {
    const response = await fetch(
        `${API_URL}/lekhapi/locations`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return result;
}

export async function updateEquipment(id, data, token) {
    const response = await fetch(`${API_URL}/lekhapi/individual-equipment/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return result;
}


export async function getAvailableEquipment(token) {
    const response = await fetch(`${API_URL}/lekhapi/individual-equipment/available`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch available equipment");
    }

    return response.json();
}

export async function getEquipmentBySerialNumber(serialNumber) {
    const response = await fetch(`${API_URL}/lekhapi/individual-equipment/serial/${serialNumber}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch equipment");
    }

    return response.json();
}