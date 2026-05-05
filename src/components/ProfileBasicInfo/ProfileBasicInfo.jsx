import "./ProfileBasicInfo.scss";
import {useState, useEffect, useContext} from "react";
import {AuthContext} from "../../context/AuthContext";
import {useProfileUpdate} from "../../hooks/useProfileUpdate";

const STATUS_OPTIONS = [
    {value: "searching", label: "Want job"},
    {value: "inactive", label: "Not want"},
    {value: "considering", label: "I'm considering"},
    {value: "openToOffers", label: "I am open to suggestions"},
];

const EDUCATION_OPTIONS = [
    {value: "SECONDARY_VOCATIONAL", label: "Average spec."},
    {value: "BACHELOR", label: "Bachelor"},
    {value: "SPECIALIST", label: "Specialist"},
    {value: "MASTER", label: "Master"},
    {value: "POSTGRADUATE", label: "Postgraduate study"},
    {value: "DOCTORAL", label: "Doctoral studies"},
];

export const ProfileBasicInfo = () => {
    const { user } = useContext(AuthContext);
    const { updateProfile } = useProfileUpdate();
    const [isEdit, setIsEdit] = useState(false);

    const [formData, setFormData] = useState(() => ({
        phone: user?.phone || "",
        gender: user?.gender || "notSpecified",
        city: user?.city || "",
        managerPosition: user?.managerPosition || "",
        companyName: user?.companyName || "",
        companyWebsite: user?.companyWebsite || "",
        educationLevel: user?.educationLevel || "",
        status: user?.status || "searching",
    }));

    useEffect(() => {
        if (user && !isEdit) {
            setFormData({
                phone: user.phone || "",
                gender: user.gender || "notSpecified",
                city: user.city || "",
                managerPosition: user.managerPosition || "",
                companyName: user.companyName || "",
                companyWebsite: user.companyWebsite || "",
                educationLevel: user.educations?.[0] || user.educationLevel || "",
                status: user.status || "searching",
            });
        }
    }, [user, isEdit]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const payload = {
            name: user.name,
            surname: user.surname,
        };

        if (formData.city?.trim()) payload.city = formData.city.trim();
        if (formData.gender && formData.gender !== "notSpecified") payload.gender = formData.gender;

        if (formData.phone) {
            let cleanPhone = formData.phone.replace(/\D/g, "");
            if (cleanPhone) {
                if (cleanPhone.startsWith("7")) cleanPhone = "8" + cleanPhone.slice(1);
                if (!cleanPhone.startsWith("8")) cleanPhone = "8" + cleanPhone;
                payload.phone = cleanPhone;
            }
        }

        if (user.role === "employer") {
            payload.companyName = formData.companyName?.trim() || "";
            payload.managerPosition = formData.managerPosition?.trim() || "";
            payload.companyWebsite = formData.companyWebsite?.trim() || "";
        } else {
            payload.status = formData.status;
            if (formData.educationLevel) {
                payload.educations = [formData.educationLevel];
            }
        }

        try {
            const success = await updateProfile(payload);
            if (success) {
                setIsEdit(false);
            }
        } catch (err) {
            console.error("Save failed", err);
            alert("Error saving data");
        }
    };
    if (!user) return null;

    return (
        <section className="info">
            <div className="info__redact">
                {}
                <form onSubmit={handleSave}>
                    <h2>Basic Information</h2>
                    {isEdit ? (
                        <div className="edit-grid">
                            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                            <input name="city" value={formData.city} onChange={handleChange} placeholder="City" />

                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="notSpecified">Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>

                            {user.role === "specialist" && (
                                <>
                                    <select name="status" value={formData.status} onChange={handleChange}>
                                        {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                    <select name="educationLevel" value={formData.educationLevel} onChange={handleChange}>
                                        <option value="">Education Level</option>
                                        {EDUCATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </>
                            )}

                            {user.role === "employer" && (
                                <>
                                    <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company" />
                                    <input name="managerPosition" value={formData.managerPosition} onChange={handleChange} placeholder="Position" />
                                    <input name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="Website" />
                                </>
                            )}

                            <button className="save" type="submit">Save Changes</button>
                        </div>
                    ) : (

                        <div className="view-grid">
                            {}
                            {console.log("RENDER VIEW WITH USER:", user)}

                            <p><strong>Phone:</strong> {user?.phone || "—"}</p>
                            <p><strong>City:</strong> {user?.city || "—"}</p>
                            <p><strong>Gender:</strong> {user?.gender || "—"}</p>

                            {user?.role === "specialist" && (
                                <>
                                    <p><strong>Status:</strong> {STATUS_OPTIONS.find(s => s.value === user.status)?.label || "—"}</p>
                                    <p>
                                        <strong>Education:</strong> {
                                        EDUCATION_OPTIONS.find(e =>
                                            e.value === user.educations?.[0] || e.value === user.educationLevel
                                        )?.label || "—"
                                    }
                                    </p>
                                </>
                            )}

                            {user?.role === "employer" && (
                                <>
                                    <p><strong>Company:</strong> {user.companyName || "—"}</p>
                                    <p><strong>Position:</strong> {user.managerPosition || "—"}</p>
                                    {user.companyWebsite && <p><strong>Website:</strong> {user.companyWebsite}</p>}
                                </>
                            )}

                            <button type="button" onClick={() => setIsEdit(true)}>
                                Edit Info
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
};