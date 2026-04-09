import "./ProfileBasicInfo.scss";
import {useState, useEffect, useContext} from "react";
import {AuthContext} from "../../context/AuthContext";
import {useProfileUpdate} from "../../hooks/useProfileUpdate";

const STATUS_OPTIONS = [
    {value: "searching", label: "Ищу работу"},
    {value: "inactive", label: "Не ищу"},
    {value: "considering", label: "Рассматриваю"},
    {value: "openToOffers", label: "Открыт к предложениям"},
];

const EDUCATION_OPTIONS = [
    {value: "SECONDARY_VOCATIONAL", label: "Среднее спец."},
    {value: "BACHELOR", label: "Бакалавр"},
    {value: "SPECIALIST", label: "Специалист"},
    {value: "MASTER", label: "Магистр"},
    {value: "POSTGRADUATE", label: "Аспирантура"},
    {value: "DOCTORAL", label: "Докторантура"},
];

export const ProfileBasicInfo = () => {
    const { user } = useContext(AuthContext);
    const { updateProfile } = useProfileUpdate();

    const [isEdit, setIsEdit] = useState(false);

    const [formData, setFormData] = useState({
        phone: "",
        gender: "",
        city: "",
        managerPosition: "",
        companyName: "",
        companyWebsite: "",
        educations: [],
        status: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                phone: user.phone || "",
                gender: user.gender || "",
                city: user.city || "",
                managerPosition: user.managerPosition || "",
                companyName: user.companyName || "",
                companyWebsite: user.companyWebsite || "",
                educations: user.educations || [],
                status: user.status || "",
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

    const handleEducationChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map(
            (opt) => opt.value
        );

        setFormData((prev) => ({
            ...prev,
            educations: selected,
        }));
    };

    const normalizePhone = (phone) => {
        return phone
            .replace(/\D/g, "")
            .replace(/^7/, "8");
    };

    const buildPayload = () => {
        const payload = {
            gender: formData.gender || user.gender,
            city: formData.city || user.city,
            birthDate: user.birthDate,
        };

        if (formData.phone && formData.phone.trim() !== "") {
            payload.phone = normalizePhone(formData.phone);
        }

        if (user.role === "employer") {
            payload.companyName = formData.companyName || user.companyName;
            payload.managerPosition = formData.managerPosition || user.managerPosition;
            payload.companyWebsite = formData.companyWebsite || user.companyWebsite;
        }

        if (user.role === "specialist") {
            payload.status = formData.status || user.status;
            payload.educations = formData.educations?.length
                ? formData.educations
                : user.educations;
        }

        return payload;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const res = await updateProfile(buildPayload());

            if (res.success) {
                setIsEdit(false);
                setErrors({});
            } else {
                setErrors(res.errors || {});
            }
        } catch (err) {
            console.log("SAVE ERROR:", err);
        }
    };

    return (
        <section className="info">
            <div className="info__redact">
                <form onSubmit={handleSave}>
                    <h2>User information:</h2>
                    {isEdit ? (
                        <>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                            />
                            {errors.phone && <span>{errors.phone}</span>}

                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                            />
                            {errors.city && <span>{errors.city}</span>}

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Выберите пол</option>
                                <option value="male">Мужской</option>
                                <option value="female">Женский</option>
                                <option value="notSpecified">Не указан</option>
                                <option value="other">Другой</option>
                            </select>

                            {user.role === "employer" && (
                                <>
                                    <input
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="Company"
                                    />

                                    <input
                                        name="managerPosition"
                                        value={formData.managerPosition}
                                        onChange={handleChange}
                                        placeholder="Position"
                                    />

                                    <input
                                        name="companyWebsite"
                                        value={formData.companyWebsite}
                                        onChange={handleChange}
                                        placeholder="Website"
                                    />
                                </>
                            )}

                            {user.role === "specialist" && (
                                <>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="">Выберите статус</option>
                                        {STATUS_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={formData.educations}
                                        onChange={handleEducationChange}
                                    >
                                        {EDUCATION_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}

                            <button type="submit">Save</button>
                        </>
                    ) : (
                        <>
                        <p>Phone: {formData.phone}</p>
                        <p>City: {formData.city}</p>
                            <p>Gender: {formData.gender}</p>

                            {user?.role === "employer" && (
                                <>
                                    <p>Company: {formData.companyName}</p>
                                    <p>Position: {formData.managerPosition}</p>
                                    <p>Website: {formData.companyWebsite}</p>
                                </>
                            )}

                            {user?.role === "specialist" && (
                                <><p>
                                    Status: {
                                    STATUS_OPTIONS.find(s => s.value === formData.status)?.label || "—"
                                }
                                </p>

                                    <p>
                                        Education: {
                                        formData.educations?.map(e =>
                                            EDUCATION_OPTIONS.find(opt => opt.value === e)?.label
                                        ).join(", ") || "—"
                                    }
                                    </p>
                                </>
                            )}

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