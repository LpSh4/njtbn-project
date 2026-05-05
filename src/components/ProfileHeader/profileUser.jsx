import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useProfileUpdate } from "../../hooks/useProfileUpdate";
import Check from "./icons/check.png";
import userico from "./img/user.png";
import "./profileUser.scss";
export const ProfileUser = () => {

    const { user } = useContext(AuthContext);
    const { updateProfile } = useProfileUpdate();

    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({ birthDate: "" });


    const canEdit = user?.role === "specialist";

    useEffect(() => {
        if (user) {
            setFormData({
                birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (user.role !== "specialist") return;

        const payload = {
            phone: user.phone,
            gender: user.gender,
            city: user.city,
            birthDate: formData.birthDate
        };

        try {
            const success = await updateProfile(payload);
            if (success) setIsEdit(false);
        } catch (err) {
            console.error("Ошибка сохранения:", err.response?.data);
        }
    };

    return (
        <section className="user">
            <div className="user__redact">
                <div><img src={Check} alt="Check" /></div>
                <form className="user__form" onSubmit={(e) => e.preventDefault()}>
                    <div className="user__input-field">
                        <p><strong>Name:</strong> {user?.name}</p>
                        <p><strong>Surname:</strong> {user?.surname}</p>

                        {}
                        {user?.role === "specialist" && (
                            <div className="user__birth-field">
                                <strong>Birth Date: </strong>
                                {isEdit ? (
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ birthDate: e.target.value })}
                                    />
                                ) : (
                                    <span>{user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : "—"}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {}
                    {canEdit && (
                        <button type="button" onClick={isEdit ? handleSave : () => setIsEdit(true)}>
                            {isEdit ? "Save" : "Edit"}
                        </button>
                    )}
                </form>
            </div>
            <div className="user__profile">
                <img src={userico} alt="Profile" />
            </div>
        </section>
    );
};