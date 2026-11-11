const API_URL = import.meta.env.VITE_API_URL;
export async function search(search, token) {
    const response = await fetch(
        `${API_URL}/lekhapi/search?search=${encodeURIComponent(search)}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Search failed");
    }

    return await response.json();
}