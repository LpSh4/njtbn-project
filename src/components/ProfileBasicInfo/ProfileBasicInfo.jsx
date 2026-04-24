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
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({});

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
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSave = async (e) => {
        e.preventDefault();


        const cleanPhone = formData.phone.replace(/\D/g, "").replace(/^7/, "8");
        const payload = { ...formData, phone: cleanPhone };

        const res = await updateProfile(payload);
        if (res.success) {
            setIsEdit(false);
            setErrors({});
        } else {
            setErrors(res.errors || {});
        }
    };

    if (!user) return null;

    return (
        <section className="info">
            <div className="info__redact">
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
                            </select>

                            {user.role === "employer" && (
                                <>
                                    <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company" />
                                    <input name="managerPosition" value={formData.managerPosition} onChange={handleChange} placeholder="Position" />
                                </>
                            )}

                            {user.role === "specialist" && (
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            )}

                            <button type="submit">Save Changes</button>
                        </div>
                    ) : (
                        <div className="view-grid">
                            <p><strong>Phone:</strong> {user.phone || "—"}</p>
                            <p><strong>City:</strong> {user.city || "—"}</p>
                            <p><strong>Gender:</strong> {user.gender || "—"}</p>

                            {user.role === "employer" && (
                                <p><strong>Company:</strong> {user.companyName} ({user.managerPosition})</p>
                            )}

                            {user.role === "specialist" && (
                                <p><strong>Status:</strong> {STATUS_OPTIONS.find(s => s.value === user.status)?.label || "—"}</p>
                            )}

                            <button type="button" onClick={() => setIsEdit(true)}>Edit Info</button>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
};