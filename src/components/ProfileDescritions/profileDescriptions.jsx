import "./profileDescriptions.scss";
import edit from "./icons/edit.png";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useProfileUpdate } from "../../hooks/useProfileUpdate";

export const ProfileDescriptions = () => {
    const { user } = useContext(AuthContext);
    const { updateProfile } = useProfileUpdate();

    const [isEdit, setIsEdit] = useState(false);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setDescription(user.description || "");
        }
    }, [user]);

    const handleSave = async () => {
        const res = await updateProfile({
            description,
        });

        if (res.success) {
            setIsEdit(false);
            setError("");
        } else {
            setError(res.errors?.description || "Error");
        }
    };

    return (
        <section className="description">
            <div className="description__title">
                <h2>Profile description</h2>

                {!isEdit ? (
                    <button onClick={() => setIsEdit(true)}>
                        <img src={edit} alt="" />
                    </button>
                ) : (
                    <button onClick={handleSave}>
                        Save
                    </button>
                )}
            </div>

            <div className="description__text-cont">
                {isEdit ? (
                    <>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description..."
                        />
                        {error && <span className="error">{error}</span>}
                    </>
                ) : (
                    <p>
                        {user?.description || "No description yet"}
                    </p>
                )}
            </div>
        </section>
    );
};

export default ProfileDescriptions;