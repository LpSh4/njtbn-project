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
    const [formData, setFormData] = useState({ name: "", surname: "", birthDate: "" });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                surname: user.surname || "",
                birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
            });
        }
    }, [user]);

    const handleSave = async () => {

        const payload = {};
        if (formData.name !== user.name) payload.name = formData.name;
        if (formData.surname !== user.surname) payload.surname = formData.surname;

        const currentBirth = user.birthDate?.split("T")[0] || "";
        if (formData.birthDate !== currentBirth) payload.birthDate = formData.birthDate;

        if (Object.keys(payload).length === 0) return setIsEdit(false);

        const res = await updateProfile(payload);
        if (res.success) {
            setIsEdit(false);
            setErrors({});
        } else {
            setErrors(res.errors || {});
        }
    };

    return (
        <section className="user">
            <div className="user__redact">
                <div><img src={Check} alt="Check" /></div>
                <form className="user__form" onSubmit={(e) => e.preventDefault()}>
                    <div className="user__input-field">
                        {isEdit ? (
                            <>
                                <input name="name" value={formData.name} placeholder="Name"
                                       onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                {errors.name && <span className="error">{errors.name}</span>}

                                <input name="surname" value={formData.surname} placeholder="Surname"
                                       onChange={(e) => setFormData({...formData, surname: e.target.value})} />
                                {errors.surname && <span className="error">{errors.surname}</span>}

                                <input type="date" name="birthDate" value={formData.birthDate}
                                       onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
                            </>
                        ) : (
                            <>
                                <p>Name: {user?.name}</p>
                                <p>Surname: {user?.surname}</p>
                                <p>Birth Date: {user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : "—"}</p>
                            </>
                        )}
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