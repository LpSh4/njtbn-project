import "./profileUser.scss";
import Check from "./icons/check.png";
import userico from "./img/user.png";
import { AuthContext } from "../../context/AuthContext";
import { useProfileUpdate } from "../../hooks/useProfileUpdate";
import { useContext, useState, useEffect } from "react";

export const ProfileUser = () => {
    const { user } = useContext(AuthContext);
    const { updateProfile } = useProfileUpdate();

    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        birthDate: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                surname: user.surname || "",
                birthDate: user.birthDate
                    ? user.birthDate.split("T")[0]
                    : "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleSave = async (e) => {


        const payload = {};

        if (formData.name !== user.name) {
            payload.name = formData.name;
        }

        if (formData.surname !== user.surname) {
            payload.surname = formData.surname;
        }

        const currentBirth = user.birthDate
            ? user.birthDate.split("T")[0]
            : "";

        if (formData.birthDate !== currentBirth) {
            payload.birthDate = formData.birthDate || "";
        }

        if (Object.keys(payload).length === 0) {
            console.log("Nothing changed");
            setIsEdit(false);
            return;
        }

        console.log("SEND:", payload);

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
                <div>
                    <img src={Check} alt="" />
                </div>

                <form className="user__form">
                    <div className="user__input-field">
                        {isEdit ? (
                            <>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                />
                                {errors.name && <span>{errors.name}</span>}

                                <input
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    placeholder="Surname"
                                />
                                {errors.surname && <span>{errors.surname}</span>}

                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                />
                                {errors.birthDate && <span>{errors.birthDate}</span>}
                            </>
                        ) : (
                            <>
                                <p>Name: {user?.name}</p>
                                <p>Surname: {user?.surname}</p>
                                <p>
                                    Birth Date:{" "}
                                    {user?.birthDate
                                        ? new Date(user.birthDate).toLocaleDateString()
                                        : "No date"}
                                </p>
                            </>
                        )}
                    </div>

                    {isEdit ? (
                        <button type="button" onClick={handleSave}>
                            Save
                        </button>                    ) : (
                        <button type="button" onClick={() => setIsEdit(true)}>
                            Edit
                        </button>
                    )}
                </form>
            </div>

            <div className="user__profile">
                <div>
                    <img src={userico} alt="" />
                </div>
            </div>
        </section>
    );
};

export default ProfileUser;