const API_URL = import.meta.env.VITE_API_URL;

export async function createGuide(token, data) {
    const response = await fetch(`${API_URL}/lekhapi/guides`,
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


export async function createGuideStep(token, guideId, data) {
    const formData = new FormData();

    formData.append("stepNumber", data.stepNumber);
    formData.append("content", data.content);
    formData.append("videoUrl", data.videoUrl);

    if (data.image) {
        formData.append("photo", data.image);
    }

    const response = await fetch(`${API_URL}/lekhapi/guides/${guideId}/steps`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return result;
}

export async function getGuides(token) {
    const response = await fetch(
        `${API_URL}/lekhapi/guides`,
        {
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
export async function updateGuide(token, guideId, data) {
    const response = await fetch(`${API_URL}/lekhapi/guides/${guideId}`,
        {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
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

export async function getGuideSteps(token, guideId) {
    const response = await fetch(`${API_URL}/lekhapi/guides/${guideId}/steps`,
        {
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


export async function updateGuideStep(token, guideId, stepId, data) {
    const formData = new FormData();

    formData.append("stepNumber", data.stepNumber);
    formData.append("content", data.content);
    formData.append("videoUrl", data.videoUrl);

    if (data.image) {
        formData.append("photo", data.image);
    }

    const response = await fetch(`${API_URL}/lekhapi/guides/${guideId}/steps/${stepId}`,
        {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return result;
}

export async function getGuidesByEquipmentTypeId(token,equipmentTypeId) {
    const response = await fetch(
        `${API_URL}/lekhapi/guides/equipment-type/${equipmentTypeId}`,
        {
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
