import "../Form.css";
import { useState,useEffect } from "react";
import { getEquipmentTypes} from "../../../functions/fetch/equipmentFetch.js";
import {createGuide,createGuideStep } from "../../../functions/fetch/guideFetch.js"

function GuideInterface({ token }) {
    const [guides, setGuides] = useState([]);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [equipmentType, setEquipmentType] = useState("");
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [guideId, setGuideId] = useState(null);
    const [stepNumber, setStepNumber] = useState(1);
    const [stepContent, setStepContent] = useState("");
    const [image, setImage] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    useEffect(() => {
        getEquipmentTypes()
            .then((data) => {
                setEquipmentTypes(data);
            })
            .catch((error) => {
                setError(error.message);
            });
        }, []);
    
async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const data = {
        title: title,
        description: description,
        equipmentTypeId: equipmentType
    };

    try {
        const guide = await createGuide(token, data);
        setGuideId(guide.id);
        console.log("Guide ID:", guide.id);
        setMessage("Guide created successfully");
    } catch (error) {
        setError(error.message);
    }
}
async function handleAddStep() {
    setError("");
    setMessage("");

    const data = {
        stepNumber: stepNumber,
        content: stepContent,
        image: image,
        videoUrl: videoUrl
    };

    try {
        await createGuideStep(
            token,
            guideId,
            data
        );

        setMessage("Guide step added successfully");

        setStepNumber(stepNumber + 1);
        setStepContent("");
        setImage(null);
        setVideoUrl("");
    } catch (error) {
        setError(error.message);
    }
}



    return (
        <form onSubmit={handleSubmit}>
            <h2>Manage Guides</h2>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}

            <div className="category-group">
                <label htmlFor="title">
                    Title
                </label>

                <input
                    id="title"
                    type="text"
                    className="input-field"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>

            <div className="category-group">
                <label htmlFor="description">
                    Description
                </label>

                <textarea
                    id="description"
                    className="input-field"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>

            <div className="category-group">
                <label htmlFor="equipmentType">
                    Equipment type
                </label>

                <select
                        id="equipmentType"
                        className="select-field"
                        value={equipmentType}
                        onChange={(event) => setEquipmentType(event.target.value)}
                    >
                        <option value="">
                            Select equipment type
                        </option>

                        {equipmentTypes.map((equipmentType) => (
                            <option
                                key={equipmentType.id}
                                value={equipmentType.id}
                            >
                                {equipmentType.name}
                            </option>
                        ))}
                    </select>
            </div>

            <button
                type="submit"
                className="submit-button"
            >
                Create guide
            </button>
            {guideId && (
                <>
                    <h3>Guide step</h3>
                    <p>
                         Add one instruction at a time. Click "Add step" to create the next step.
                    </p>

                    <div className="category-group">
                        <label htmlFor="stepNumber">
                            Step number
                        </label>

                        <input
                            id="stepNumber"
                            type="number"
                            className="input-field"
                            value={stepNumber}
                            onChange={(event) => setStepNumber(event.target.value)}
                            readOnly
                        />
                    </div>

                    <div className="category-group">
                        <label htmlFor="stepContent">
                            Content
                        </label>

                        <textarea
                            id="stepContent"
                            className="input-field"
                            value={stepContent}
                            onChange={(event) => setStepContent(event.target.value)}
                        />
                    </div>

                    <div className="category-group">
                        <label htmlFor="guide-image">
                            Image (optional)

                        </label>

                        <input
                            id="guide-image"
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                setImage(event.target.files[0]);
                            }}
                        />
                    </div>

                    <div className="category-group">
                        <label htmlFor="videoUrl">
                            YouTube video URL (optional)
                        </label>

                        <input
                            id="videoUrl"
                            type="text"
                            className="input-field"
                            value={videoUrl}
                            onChange={(event) => setVideoUrl(event.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="submit-button"
                        onClick={handleAddStep}
                    >
                        Add step
                    </button>
                </>
            )}
        </form>
    );
}

export default GuideInterface;