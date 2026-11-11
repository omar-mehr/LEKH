import { useState } from "react";
import { loginUser } from "../../../functions/fetch/authFetch.js";
import "../Form.css";

function LoginForm({ setToken,  setPage }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
        const result = await loginUser(email, password);
        

        setToken(result.token);
        if(result && result.user.role === "administrator"){
            setPage("AdminDashBoard")
        }
        else if (result && result.user.role === "student"){
            setPage("StudentDashBoard")
        }
        else{
            setPage("CareTakerDashBoard")
        }
    } catch (error) {
        setErrorMessage(error.message);
        setTimeout(() => { setErrorMessage(""); 
            
        }, 3000); 
    }
    
};
    return (
        <>

        <form onSubmit={handleSubmit}>
            <h3>Log in</h3>

            <label>Email:</label>
            <input
                type="email"
                 className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label>Password:</label>
            <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            {errorMessage && ( 
                <p className="error-message"> 
                    {errorMessage} 
                </p> 
            )}

            <button type="submit">Log in</button>
        </form>
        <div className="auth-toggle">
            <span>Don't have an account? </span>
            <span
                className="text-button"
                onClick={() => setPage("register")}
            >
                Sign up here
            </span>
        </div>
        </>
    );
}

export default LoginForm;