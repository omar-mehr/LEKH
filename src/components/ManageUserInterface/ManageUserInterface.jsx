import { useEffect, useState } from "react";
import {  getUserRoles,updateUserRole} from "../../../functions/fetch/authFetch.js";
import "./ManageUserInterface.css";

function ManageUserInterface({ token }) {
    const [users, setUsers] = useState([]);
    const [searchEmail, setSearchEmail] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    

    useEffect(() => {
        async function loadUsers() {
            const result = await getUserRoles(token);

            result.forEach((user) => {
                user.selectedRole = user.role;
            });
            setUsers(result);
            setFilteredUsers(result);
        }
        loadUsers();
    }, [token]);

    function handleSearch(event) {
        const value = event.target.value;

        setSearchEmail(value);

        if (!value) {
        setFilteredUsers(users);
        return;
        }

        const result = users.filter((user) => {
            return user.email.toLowerCase().includes(value.toLowerCase());
        });

        setFilteredUsers(result);
    }

    const handleUpdate = async (userId, role) => {
        try {
            await updateUserRole(token, userId, role);

            alert("User role updated successfully");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleRoleChange = (userId, role) => {
        const newUsers = users.map((user) => {
            if (user.id === userId) {
                user.selectedRole = role;
            }

            return user;
        });

        setUsers(newUsers);
    };


    return (
        <div className="manage-users">
            <h2>Manage users</h2>
            <input
                className="user-search-input"
                type="text"
                placeholder="Search by email"
                value={searchEmail}
                onChange={handleSearch}
            />

            <div className="user-list">
                {filteredUsers.map((user) => (
                    <div className="user-card" key={user.id}>
                        <div className="user-info">
                            <p><strong>{user.name}</strong></p>
                            <p>{user.email}</p>
                        </div>

                        <div className="user-role">
                            <select
                                value={user.selectedRole}
                                onChange={(event) => {
                                    handleRoleChange(
                                        user.id,
                                        event.target.value
                                    );
                                }}
                            >
                                <option value="student">
                                    student
                                </option>

                                <option value="caretaker">
                                    caretaker
                                </option>

                                <option value="administrator">
                                    administrator
                                </option>
                            </select>

                            <button
                                type="button"
                                onClick={() => {
                                    handleUpdate(
                                        user.id,
                                        user.selectedRole
                                    );
                                }}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default ManageUserInterface;