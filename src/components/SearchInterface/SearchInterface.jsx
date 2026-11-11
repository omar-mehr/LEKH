import { useState } from "react";
import { search } from "../../../functions/fetch/searchFetch.js";
import { getEquipmentBySerialNumber } from "../../../functions/fetch/equipmentFetch.js";
import { getGuideSteps } from "../../../functions/fetch/guideFetch.js";
import EquipmentPage from "../EquipmentPage/EquipmentPage";
import "./SearchInterface.css";

function SearchInterface({ token }) {
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState(null);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [guideSteps, setGuideSteps] = useState([]);

    async function handleSearch(event) {
        const value = event.target.value;

        setSearchText(value);
        setSelectedEquipment(null);
        setSelectedGuide(null);
        setGuideSteps([]);

        if (!value) {
            setResults(null);
            return;
        }

        try {
            const data = await search(value, token);

            setResults(data);
        } catch (error) {
            console.log(error);
            setResults(null);
        }
    }

    async function handleEquipmentClick(serialNumber) {
        try {
            const equipment = await getEquipmentBySerialNumber(serialNumber);

            setSelectedEquipment(equipment);
            setSelectedGuide(null);
            setGuideSteps([]);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleGuideClick(guide) {
        try {
            const steps = await getGuideSteps(token, guide.id);

            setSelectedGuide(guide);
            setGuideSteps(steps);
            setSelectedEquipment(null);
        } catch (error) {
            console.log(error);
        }
    }

    function handleBackToResults() {
        setSelectedEquipment(null);
        setSelectedGuide(null);
        setGuideSteps([]);
    }

    return (
        <div className="search-interface">
            <input
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Search..."
            />

            {!selectedEquipment && !selectedGuide && results && (
                <div className="search-results">
                    <div className="search-result-section">
                        <div className="search-result-title">
                            Equipment
                        </div>

                        {results.equipment.length > 0 ? (
                            results.equipment.map((equipment) => (
                                <div
                                    className="search-result-item"
                                    key={equipment.id}
                                    onClick={() =>
                                        handleEquipmentClick(
                                            equipment.serial_number
                                        )
                                    }
                                >
                                    <div className="search-result-name">
                                        {equipment.name}
                                    </div>

                                    <div className="search-result-details">
                                        {equipment.serial_number}
                                    </div>

                                    <div className="search-result-details">
                                        {equipment.equipment_type}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="search-no-results">
                                No equipment found
                            </div>
                        )}
                    </div>

                    <div className="search-result-section">
                        <div className="search-result-title">
                            Guides
                        </div>

                        {results.guides.length > 0 ? (
                            results.guides.map((guide) => (
                                <div
                                    className="search-result-item"
                                    key={guide.id}
                                    onClick={() =>
                                        handleGuideClick(guide)
                                    }
                                >
                                    <div className="search-result-name">
                                        {guide.title}
                                    </div>

                                    <div className="search-result-details">
                                        {guide.description}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="search-no-results">
                                No guides found
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedEquipment && (
                <div className="search-selected-content">
                    <button
                        type="button"
                        className="search-back-button"
                        onClick={handleBackToResults}
                    >
                        ← Back to search results
                    </button>

                    <EquipmentPage equipment={selectedEquipment} />
                </div>
            )}

            {selectedGuide && (
                <div className="search-selected-content">
                    <button
                        type="button"
                        className="search-back-button"
                        onClick={handleBackToResults}
                    >
                        ← Back to search results
                    </button>

                    <div className="guide-details">
                        <h2>{selectedGuide.title}</h2>

                        <p>{selectedGuide.description}</p>

                        {guideSteps.map((step) => (
                            <div
                                key={step.id}
                                className="guide-step"
                            >
                                <h6>Step {step.step_number}</h6>

                                <p>{step.content}</p>

                                {step.image_url && (
                                    <img
                                        src={`http://localhost:3000${step.image_url}`}
                                        alt={`Step ${step.step_number}`}
                                    />
                                )}

                                {step.video_url && (
                                    <a
                                        href={step.video_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Watch video
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchInterface;

