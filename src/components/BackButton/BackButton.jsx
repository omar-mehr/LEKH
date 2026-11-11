import "./BackButton.css";

function BackButton({ onClick }) {
    return (
        <button
            type="button"
            className="back-button"
            onClick={onClick}
        >
            ← 
        </button>
    );
}

export default BackButton;