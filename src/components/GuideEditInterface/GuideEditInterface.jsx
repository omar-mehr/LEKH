import "../Form.css";
import "./GuideEditInterface.css";
import { useState, useEffect } from "react";
import {getGuides,getGuideSteps,updateGuide,updateGuideStep,createGuideStep} from "../../../functions/fetch/guideFetch.js";

function GuideEditInterface({ token }) {
    const [guides, setGuides] = useState([]);
    const [selectedGuide, setSelectedGuide] = useState("");
    const [guide, setGuide] = useState(null);
    const [steps, setSteps] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [stepContents, setStepContents] = useState({});
    const [stepVideos, setStepVideos] = useState({});
    const [stepImages, setStepImages] = useState({});

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        getGuides(token)
            .then((data) => {
                setGuides(data);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, [token]);

    async function handleUpdateGuide(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        const data = {
            id: guide.id,
            title: title,
            description: description,
            equipmentTypeId: guide.equipment_type_id
        };

        try {
            await updateGuide(token,guide.id,data);

            for (const step of steps) {
                const stepData = {
                    stepNumber: step.step_number,
                    content: stepContents[step.id],
                    image: stepImages[step.id],
                    videoUrl: stepVideos[step.id]
                };

                if (step.newStep) {
                    await createGuideStep(
                        token,
                        guide.id,
                        stepData
                    );
                } else {
                    await updateGuideStep(
                        token,
                        guide.id,
                        step.id,
                        stepData
                    );
                }
            }

            setMessage("Guide updated successfully");

        } catch (error) {
            setError(error.message);
        }
    }

    async function handleGuideChange(event) {
        const guideId = event.target.value;

        setSelectedGuide(guideId);
        setMessage("");
        setError("");

        if (!guideId) {
            setGuide(null);
            setSteps([]);
            setTitle("");
            setDescription("");
            setStepContents({});
            setStepVideos({});
            setStepImages({});
            return;
        }

        const selectedGuide = guides.find(
            (guide) =>
                guide.id === Number(guideId)
        );

        setGuide(selectedGuide);
        setTitle(selectedGuide.title);
        setDescription(selectedGuide.description);

        try {
            const data = await getGuideSteps(
                token,
                guideId
            );

            setSteps(data);

            const contents = {};
            const videos = {};

            data.forEach((step) => {
                contents[step.id] = step.content;
                videos[step.id] = step.video_url || "";
            });

            setStepContents(contents);
            setStepVideos(videos);
            setStepImages({});

        } catch (error) {
            setError(error.message);
        }
    }

    function handleStepContentChange(stepId, value) {
        const contents = Object.assign({}, stepContents);

        contents[stepId] = value;

        setStepContents(contents);
    }

    function handleStepImageChange(stepId, file) {
        const images = Object.assign({}, stepImages);

        images[stepId] = file;

        setStepImages(images);
    }

    function handleStepVideoChange(stepId, value) {
        const videos = Object.assign({}, stepVideos);

        videos[stepId] = value;

        setStepVideos(videos);
    }

    function handleAddStep() {
        const newStep = {
            id: `new-${steps.length + 1}`,
            step_number: steps.length + 1,
            content: "",
            image_url: "",
            video_url: "",
            newStep: true
        };

        const updatedSteps = steps.slice();

        updatedSteps.push(newStep);

        setSteps(updatedSteps);
}
    return (
        <form onSubmit={handleUpdateGuide}>

            <h2>Edit existing guides</h2>

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

            <div className="guide-selector">

                <label htmlFor="guide">  {/* Connect the label to the select field using the same id  "guide" */}
                    Select guide
                </label>

                <select
                    id="guide"
                    className="select-field"
                    value={selectedGuide}
                    onChange={handleGuideChange}
                >
                    <option value="">
                        Select guide
                    </option>

                    {guides.map((guide) => (
                        <option
                            key={guide.id}
                            value={guide.id}
                        >
                            {guide.title}
                        </option>
                    ))}
                </select>

            </div>

            {guide && (
                <div className="guide-edit-layout">

                    <div className="guide-information">

                        <div className="guide-section-title">
                            Guide information
                        </div>

                        <div className="category-group">

                            <label htmlFor="guideTitle">
                                Title
                            </label>

                            <input
                                id="guideTitle"
                                type="text"
                                className="input-field"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                            />

                        </div>

                        <div className="category-group">

                            <label htmlFor="guideDescription">
                                Description
                            </label>

                            <textarea
                                id="guideDescription"
                                className="input-field"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />

                        </div>

                        <p>
                            <strong>Equipment type:</strong>{" "}
                            {guide.equipment_type_name}
                        </p>

                    </div>

                    <div className="guide-steps">

                        <div className="guide-section-title">
                            Guide steps
                        </div>

                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className="guide-step"
                            >

                                <div className="guide-step-header">

                                    <div className="guide-step-title">
                                        Step {step.step_number}
                                    </div>

                                </div>

                                <div className="guide-step-content">

                                    <label>
                                        Content
                                    </label>

                                    <textarea
                                        className="input-field"
                                        value={
                                            stepContents[step.id] || ""
                                        }
                                        onChange={(event) =>
                                            handleStepContentChange(
                                                step.id,
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="guide-step-media">

                                    <div className="guide-step-image">

                                        <label>
                                            Image
                                        </label>

                                        {step.image_url ? (
                                            <img
                                                src={
                                                    `http://localhost:3000${step.image_url}`
                                                }
                                                alt={
                                                    `Step ${step.step_number}`
                                                }
                                                className="guide-step-image-preview"
                                            />
                                        ) : (
                                            <p>
                                                No image added
                                            </p>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) =>
                                                handleStepImageChange(
                                                    step.id,
                                                    event.target.files[0]
                                                )
                                            }
                                        />

                                    </div>

                                    <div className="guide-step-video">

                                        <label>
                                            Video URL
                                        </label>

                                        <input
                                            type="text"
                                            className="input-field"
                                            value={
                                                stepVideos[step.id] || ""
                                            }
                                            onChange={(event) =>
                                                handleStepVideoChange(
                                                    step.id,
                                                    event.target.value
                                                )
                                            }
                                        />

                                        {stepVideos[step.id] ? (
                                            <a
                                                href={stepVideos[step.id]}
                                            >
                                                Open video
                                            </a>
                                        ) : (
                                            <p>
                                                No video added
                                            </p>
                                        )}

                                    </div>

                                </div>

                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddStep}
                        >
                            Add new step
                        </button>

                        <button
                            type="submit"
                            className="submit-button guide-save-button"
                        >
                            Save changes
                        </button>

                    </div>

                </div>
            )}

        </form>
    );
}

export default GuideEditInterface;