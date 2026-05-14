import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useProfileUpdate } from "../../hooks/useProfileUpdate";
import editIco from "./icons/edit.png";
import "./profileDescriptions.scss";

export const ProfileDescriptions = () => {
    const { user } = useContext(AuthContext);
    const { updateProfile } = useProfileUpdate();

    const [isEdit, setIsEdit] = useState(false);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setDescription(user?.description || "");
    }, [user]);

    const handleSave = async () => {
        setError("");


        if (description.trim() === (user?.description || "").trim()) {
            return setIsEdit(false);
        }

        try {
            const res = await updateProfile({ description });


            if (res && (res.success || res.data || !res.errors)) {
                setIsEdit(false);
                setError("");
            } else {
                setError(res?.errors?.description || "Failed to update");
            }
        } catch (err) {
            console.error("Ошибка при сохранении описания:", err);
            setError("Network error. Try again.");
        }
    };
    return (
        <section className="description">
            <div className="description__title">
                <h2>Profile description</h2>
                <button onClick={isEdit ? handleSave : () => setIsEdit(true)}>
                    {isEdit ? "Save" : <img src={editIco} alt="edit" />}
                </button>
            </div>
            <div className="description__text-cont">
                {isEdit ? (
                    <>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about yourself..." />
                        {error && <span className="error">{error}</span>}
                    </>
                ) : (
                    <p>{user?.description || "No description yet"}</p>
                )}
            </div>
        </section>
    );
};