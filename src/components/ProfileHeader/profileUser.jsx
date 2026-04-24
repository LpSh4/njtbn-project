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
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ birthDate: "" });

    useEffect(() => {
        if (user) {
            setFormData({
                birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
            });
        }
    }, [user]);

    const handleSave = async () => {
        const newDate = formData.birthDate;

        if (!newDate) {
            setIsEdit(false);
            return;
        }

        const payload = {
            birthDate: newDate
        };

        console.log("Отправка на сервер:", payload);

        const res = await updateProfile(payload);

        if (res.success) {
            setIsEdit(false);
            setErrors({});
        } else {
            console.error("Ошибка от бэка:", res.errors);
            setErrors(res.errors || { birthDate: "Ошибка валидации" });
        }
    };

    return (
        <section className="user">
            <div className="user__redact">
                <div><img src={Check} alt="Check" /></div>
                <form className="user__form" onSubmit={(e) => e.preventDefault()}>
                    <div className="user__input-field">
                        {}
                        <p><strong>Name:</strong> {user?.name}</p>
                        <p><strong>Surname:</strong> {user?.surname}</p>

                        <div className="user__birth-field">
                            <strong>Birth Date: </strong>
                            {isEdit ? (
                                <>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ birthDate: e.target.value })}
                                    />
                                    {errors.birthDate && <span className="error">{errors.birthDate}</span>}
                                </>
                            ) : (
                                <span>{user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : "—"}</span>
                            )}
                        </div>
                    </div>
                    <button type="button" onClick={isEdit ? handleSave : () => setIsEdit(true)}>
                        {isEdit ? "Save" : "Edit"}
                    </button>
                </form>
            </div>
            <div className="user__profile">
                <img src={userico} alt="Profile" />
            </div>
        </section>
    );
};