import { useState } from "react";
import "../Form.css";
import { createLocation } from "../../../functions/fetch/equipmentFetch.js";

function LocationForm({ token })  {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        const data = {
            name: name,
            description: description
        };
        createLocation(data, token)
            .then(() => {
                setName("");
                setDescription("");
                setMessage("Location created successfully!");

                setTimeout(() => {
                    setMessage("");
                }, 3000);
            })
            .catch((error) => {
                alert(error.message);
            });
    }

    return (
        <form  onSubmit={handleSubmit}>
            <label>Name</label>

            <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter location name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="input-field"
                required
            />

            <label>Description</label>

            <textarea
                id="description"
                name="description"
                type="text"
                placeholder="Enter location description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="input-field"
                required
            />

            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}

            <button
                className="submit-button"
                type="submit"
            >
                Create location
            </button>
        </form>
    );
}

export default LocationForm;