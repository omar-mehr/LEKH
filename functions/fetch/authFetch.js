const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/lekhapi/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
}

export async function getUserRoles(token) {
    const response = await fetch(
        `${API_URL}/lekhapi/user-roles`,
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

export async function updateUserRole(token, userId, role) {
    const response = await fetch(
        `${API_URL}/lekhapi/user-roles/${userId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                role: role
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
}


export async function registerUser(data) {
    const response = await fetch(
        `${API_URL}/lekhapi/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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

export async function createCaretaker(token, data) {
    const response = await fetch(
        `${API_URL}/lekhapi/caretakers`,
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

export async function getStudents(token) {
    const response = await fetch(`${API_URL}/lekhapi/users/students`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch students");
    }

    return response.json();
}
