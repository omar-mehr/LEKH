import { LogOut } from "lucide-react";
import "./LogOutButton.css";

function LogOutButton({ setToken, setPage }) {
    const handleLogout = () => {
        setToken("");
        setPage("login");
    };

    return (
        <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
        >
             <LogOut size={24} />
        </button>
    );
}

export default LogOutButton;