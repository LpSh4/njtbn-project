import "./profileUser.scss";
import Check from "./icons/check.png";
import userico from "./img/user.png";
import Vk from "./icons/contact-vk-icon.png";
import Telegram from "./icons/contact-telegram-icon.png";
import Twitter from "./icons/contact-twitter-icon.png";
import { AuthContext } from "../../context/AuthContext";
import { updateUser } from "../../api/authApi";
import { useContext, useState, useEffect } from "react";

export const ProfileUser = () => {
    const { user, login } = useContext(AuthContext);

    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        phone: "",
        gender: "",
        city: "",
        birthDate: "",
        socialLinks: [],
        managerPosition: "",
        companyName: "",
        companyWebsite: "",
        educations: [],
        status: "",
        description: "",
        citizenship: false,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                phone: user.phone || "",
                gender: user.gender || "",
                city: user.city || "",
                birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
                socialLinks: user.socialLinks || [],
                managerPosition: user.managerPosition || "",
                companyName: user.companyName || "",
                companyWebsite: user.companyWebsite || "",
                educations: user.educations || [],
                status: user.status || "",
                description: user.description || "",
                citizenship: user.citizenship || false,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const buildPayload = () => {
        const payload = {
            phone: formData.phone.replace(/\D/g, "").replace(/^7/, "8"),
            gender: formData.gender,
            city: formData.city,
        };

        if (formData.birthDate) payload.birthDate = formData.birthDate;
        if (formData.socialLinks.length) payload.socialLinks = formData.socialLinks;

        if (user.role === "specialist") {
            if (formData.description) payload.description = formData.description;
            if (formData.status) payload.status = formData.status;
            if (formData.educations.length) payload.educations = formData.educations;
            payload.citizenship = formData.citizenship;
        }

        if (user.role === "employer") {
            if (formData.companyName) payload.companyName = formData.companyName;
            if (formData.managerPosition) payload.managerPosition = formData.managerPosition;
            if (formData.companyWebsite) payload.companyWebsite = formData.companyWebsite;
        }

        return payload;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const payload = buildPayload();
            const res = await updateUser(payload);

            login({ ...user, ...res.data.data });
            setFormData((prev) => ({ ...prev, ...res.data.data }));
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
        <section className="user">
            <div className="user__redact">
                <div>
                    <img src={Check} alt="" />
                </div>
                <form className="user__form" onSubmit={handleSave}>
                    <div className="user__input-field">
                        {isEdit ? (
                            <>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone"
                                />
                                {errors.phone && <span className="error">{errors.phone}</span>}

                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                />
                                {errors.city && <span className="error">{errors.city}</span>}

                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select gender</option>
                                    <option value="MALE">MALE</option>
                                    <option value="FEMALE">FEMALE</option>
                                    <option value="NOT_SPECIFIED">NOT_SPECIFIED</option>
                                </select>
                                {errors.gender && <span className="error">{errors.gender}</span>}

                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate || ""}
                                    onChange={handleChange}
                                />
                            </>
                        ) : (
                            <>
                                <p>Phone: {user?.phone}</p>
                                <p>City: {user?.city}</p>
                                <p>Gender: {user?.gender}</p>
                                <p>
                                    {user?.birthDate
                                        ? new Date(user.birthDate).toLocaleDateString()
                                        : "No date specified"}
                                </p>
                            </>
                        )}

                        <p>{user?.role}</p>

                        {!isEdit && user?.role === "employer" && (
                            <>
                                <p>Company: {user?.companyName}</p>
                                <p>Position: {user?.managerPosition}</p>
                                <p>Website: {user?.companyWebsite}</p>
                            </>
                        )}

                        {!isEdit && user?.role === "specialist" && (
                            <>
                                <p>Status: {user?.status}</p>
                                <p>Description: {user?.description}</p>
                            </>
                        )}

                        {user?.role === "employer" && isEdit && (
                            <>
                                <input
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Company name"
                                />
                                {errors.companyName && <span className="error">{errors.companyName}</span>}

                                <input
                                    name="managerPosition"
                                    value={formData.managerPosition}
                                    onChange={handleChange}
                                    placeholder="Manager position"
                                />
                                {errors.managerPosition && <span className="error">{errors.managerPosition}</span>}

                                <input
                                    name="companyWebsite"
                                    value={formData.companyWebsite}
                                    onChange={handleChange}
                                    placeholder="Website"
                                />
                                {errors.companyWebsite && <span className="error">{errors.companyWebsite}</span>}
                            </>
                        )}

                        {user?.role === "specialist" && isEdit && (
                            <>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                />
                                {errors.description && <span className="error">{errors.description}</span>}

                                <input
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    placeholder="Status"
                                />
                                {errors.status && <span className="error">{errors.status}</span>}
                            </>
                        )}
                    </div>

                    {isEdit ? (
                        <button type="submit">Save</button>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsEdit(true);
                            }}
                        >
                            redact
                        </button>
                    )}
                </form>
            </div>

            <div className="user__profile">
                <div className="user__url">
                    <a href="">
                        <img loading={"lazy"} src={Vk} alt="" />
                    </a>
                    <a href="">
                        <img loading={"lazy"} src={Telegram} alt="" />
                    </a>
                    <a href="">
                        <img loading={"lazy"} src={Twitter} alt="" />
                    </a>
                </div>
                <div>
                    <img src={userico} alt="" />
                </div>
            </div>
        </section>
    );
};

export default ProfileUser;