import { useState, useEffect } from "react";
import "../Form.css";
import {getCategories,createCategory,createEquipmentType} from "../../../functions/fetch/equipmentFetch.js";

function EquipmentTypeForm({ token }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [message, setMessage] = useState("");
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        getCategories()
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                alert(error.message);
            });
    }, []);

    function handleCreateCategory() {
        if (!newCategory) {
            return;
        }
         console.log(token);

        createCategory(newCategory, token)
            .then(() => {
                return getCategories();
            })
            .then((data) => {
                setCategories(data);
                setNewCategory("");
                setShowNewCategory(false);
            })
            .catch((error) => {
                alert(error.message);
            });
    }

    function handleToggleNewCategory() {
        setShowNewCategory(!showNewCategory);

        if (showNewCategory) {
            setNewCategory("");
        }
    }

    function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData();

    data.append("name", name);
    data.append("description", description);
    data.append("categoryId", categoryId);

    if (photo) {
        data.append("photo", photo);
    }

    createEquipmentType(data,token)
        .then(() => {
            setName("");
            setDescription("");
            setCategoryId("");
            setPhoto(null);
            setMessage("Equipment type created successfully!");

            setTimeout(() => {
                setMessage("");
            }, 3000);
        })
        .catch((error) => {
            alert(error.message);
        });
}

    return (
        <form onSubmit={handleSubmit}>
            
                <label>Name</label>

                <input id="name"name="name" placeholder="Enter equipment type, e.g. Raspberry Pi"type="text" value={name} onChange={(event) => setName(event.target.value)} className="input-field" required/>

            
                <label>Description</label>

                <textarea id="description"name="description" placeholder="Enter Description"value={description}onChange={(event) => setDescription(event.target.value)}className="input-field" required/>
    
           
                <label>Category</label>
                <select id="categoryId"name="categoryId" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="select-field"  required> 
                    <option value="">Select category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    className="new-category-button"
                    onClick={handleToggleNewCategory}
                >
                    + Create new category
                </button>
            
            {showNewCategory && (
                <>
                    <div className="category-group">
                    <label>New category</label>

                    <input
                        id="newCategory"
                        type="text"
                        placeholder="Enter category name"
                        value={newCategory}
                        onChange={(event) => setNewCategory(event.target.value)}
                        className="input-field"
                       
                    />

                    <button
                        type="button"
                        className="create-category-button"
                        onClick={handleCreateCategory}
                    >
                        Create category
                    </button>
                    </div>
                </>
            )}

            <label>Photo</label>

                <div className="photo-upload">
                    <label htmlFor="photo" className="photo-upload-button">
                        Choose photo
                    </label>

                    <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={(event) => setPhoto(event.target.files[0])}
                        className="photo-input"
                    />

                    {photo && (
                        <span className="photo-name">
                            {photo.name}
                        </span>
                    )}
                </div>

            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}
            <button className="submit-button" type="submit">
                Create equipment type
                
            </button>
        
            
        </form>

    );
}
export default EquipmentTypeForm;