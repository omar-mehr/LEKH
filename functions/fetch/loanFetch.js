const API_URL = import.meta.env.VITE_API_URL;

export async function createBorrowRequest(token, data) {
    const response = await fetch(
        `${API_URL}/lekhapi/borrow-requests`,
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

export async function getBorrowRequests(token) {
    const response = await fetch(
        `${API_URL}/lekhapi/borrow-requests`,
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

export async function updateBorrowRequest(token, id, status) {
    const response = await fetch(`${API_URL}/lekhapi/borrow-requests/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                status: status
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
}

export async function getMyBorrowRequests(token) {
    const response = await fetch(
        `${API_URL}/lekhapi/my-borrow-requests`,
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

export async function getMyLoans(token) {
    const response = await fetch(`${API_URL}/lekhapi/my-loans`,
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


export async function createRenewalRequest(token, loanId) {
    const response = await fetch(`${API_URL}/lekhapi/loans/${loanId}/renewal-requests`,
        {
            method: "POST",
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

export async function getRenewalRequests(token) {
    const response = await fetch(`${API_URL}/lekhapi/renewal-requests`,
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

export async function updateRenewalRequest(token, requestId, status) {
    const response = await fetch(`${API_URL}/lekhapi/renewal-requests/${requestId}`,
        {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: status
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
}

export async function registerCaretakerLoan(token, data) {
    const response = await fetch(`${API_URL}/lekhapi/loans/caretaker`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    );

    if (!response.ok) {
        const result = await response.json();

        throw new Error(result.error);
    }

    return response.json();
}


export async function getBorrowRequestById(token, borrowRequestId) {
    const response = await fetch(`${API_URL}/lekhapi/borrow-requests/${borrowRequestId}`,
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

export async function checkoutBorrowRequest(token, borrowRequestId, photo) {
    const formData = new FormData();

    formData.append("photo", photo);

    const response = await fetch(`${API_URL}/lekhapi/borrow-requests/${borrowRequestId}/checkout`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
}

export async function returnLoan(token, loanId, photo) {
    const formData = new FormData();

    formData.append("photo", photo);

    const response = await fetch(
        `${API_URL}/lekhapi/loans/${loanId}/return`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
}

export async function getAllActiveLoans(token) {
    const response = await fetch(`${API_URL}/lekhapi/loans`,
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


export async function getLoanDetailsById(token, loanId) {
    const response = await fetch(
        `${API_URL}/lekhapi/loan/${loanId}`,
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

export async function getLoanHistoryBySerialNumber(token, serialNumber) {
    const response = await fetch(
        `${API_URL}/lekhapi/loan/history/${serialNumber}`,
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