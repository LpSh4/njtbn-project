import "./ProfileBasicInfo.scss";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateUser } from "../../api/authApi";

export const ProfileBasicInfo = () => {
    const { user, login } = useContext(AuthContext);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                birthDate: formData.birthDate,
            };
            const res = await updateUser(payload);
            login({ ...user, ...res.data.data });
            setFormData({ ...formData, ...res.data.data });
            setErrors({});
            setIsEdit(false);
        } catch (err) {
            const responseData = err.response?.data;
            if (responseData?.errors) {
                const newErrors = {};
                responseData.errors.forEach((e) => {
                    newErrors[e.field] = e.message;
                });
                setErrors(newErrors);
            } else {
                console.log("ERROR:", responseData);
            }
        }
    };

    return (
        <section className="info">
            <div className="info__redact">
                <div>
                </div>
                <form onSubmit={handleSave}>
                    {isEdit ? (
                        <>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                            />
                            {errors.firstName && <span className="error">{errors.firstName}</span>}

                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                            />
                            {errors.lastName && <span className="error">{errors.lastName}</span>}

                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate || ""}
                                onChange={handleChange}
                            />
                            {errors.birthDate && <span className="error">{errors.birthDate}</span>}

                            <button type="submit">Save</button>
                        </>
                    ) : (
                        <>
                            <p>First Name: {user?.firstName}</p>
                            <p>Last Name: {user?.lastName}</p>
                            <p>
                                Birth Date:{" "}
                                {user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : "No date"}
                            </p>
                            <button type="button" onClick={() => setIsEdit(true)}>
                                Redact
                            </button>
                        </>
                    )}
                </form>
            </div>
        </section>
    );
};

export default ProfileBasicInfo;