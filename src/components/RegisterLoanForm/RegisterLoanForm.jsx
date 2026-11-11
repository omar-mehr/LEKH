import "../Form.css";
import { useState, useEffect } from "react";
import {getStudents} from "../../../functions/fetch/authFetch.js";
import {getAvailableEquipment} from "../../../functions/fetch/equipmentFetch.js"
import {registerCaretakerLoan} from "../../../functions/fetch/loanFetch.js"

function RegisterLoanForm({ token }) {
    const [student, setStudent] = useState("");
    const [equipment, setEquipment] = useState("");
    const [students, setStudents] = useState([]);
    const [availableEquipment, setAvailableEquipment] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        getStudents(token)
            .then((data) => {
                setStudents(data);
            })
            .catch((error) => {
                setError(error.message);
            });

        getAvailableEquipment(token)
            .then((data) => {
                setAvailableEquipment(data);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, [token]);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        const data = {
            studentId: student,
            equipmentId: equipment
        };

        try {
            await registerCaretakerLoan(token, data);

            setMessage("Loan registered successfully");
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register Equipment Loan</h2>

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
                <label htmlFor="student">
                    Student
                </label>

                <select
                    id="student"
                    className="select-field"
                    value={student}
                    onChange={(event) => setStudent(event.target.value)}
                >
                    <option value="">Select student</option>

                    {students.map((student) => (
                        <option
                            key={student.id}
                            value={student.id}
                        >
                            {student.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="category-group">
                <label htmlFor="equipment">
                    Equipment
                </label>

                <select
                    id="equipment"
                    className="select-field"
                    value={equipment}
                    onChange={(event) => setEquipment(event.target.value)}
                >
                    <option value="">Select equipment</option>

                    {availableEquipment.map((equipment) => (
                        <option
                            key={equipment.id}
                            value={equipment.id}
                        >
                            {equipment.name} - {equipment.serial_number}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="submit-button"
            >
                Register loan
            </button>
        </form>
    );
}

export default RegisterLoanForm;
