import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axios";
import "./CreatePost.scss";

export const CreatePost = ({ type, onPostCreated }) => {
    const { role } = useContext(AuthContext);
    const navigate = useNavigate();

    const WorkFormat = ["office", "remote", "hybrid", "other"];
    const WorkSchedule = ["6/1","5/2","4/4","4/3","4/2","3/3","3/2","2/2","2/1","1/3","1/2","weekends","flexible","negotiable"];
    const WorkingHours = ["2","3","4","5","6","7","8","9","10","11","12","24","negotiable"];

    const [formData, setFormData] = useState({
        profession: "",
        speciality: "",
        workFormat: "",
        workSchedule: "",
        workingHours: "",
        salaryFrom: "",
        salaryTo: "",
        experience: "",
        city: "",
        deadLine: "",
        skills: "",
        description: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let errs = {};

        if (!formData.profession.trim()) errs.profession = "Profession is required";
        if (!formData.city.trim()) errs.city = "City is required";

        if (type === "vacancy") {
            if (!WorkFormat.includes(formData.workFormat)) errs.workFormat = "Select valid work format";
            if (!WorkSchedule.includes(formData.workSchedule)) errs.workSchedule = "Select valid work schedule";
            if (!WorkingHours.includes(formData.workingHours)) errs.workingHours = "Select valid working hours";
            if (!formData.description.trim()) errs.description = "Description is required";
            if (!formData.deadLine) errs.deadLine = "Deadline is required";
            if (!formData.skills.trim()) errs.skills = "At least one skill is required";

            if (formData.salaryFrom && isNaN(Number(formData.salaryFrom))) errs.salaryFrom = "Salary must be a number";
            if (formData.salaryTo && isNaN(Number(formData.salaryTo))) errs.salaryTo = "Salary must be a number";
            if (formData.experience && isNaN(Number(formData.experience))) errs.experience = "Experience must be a number";
        }

        if (type === "resume") {
            if (!WorkFormat.includes(formData.workFormat)) errs.workFormat = "Select valid work format";
            if (!formData.experience || isNaN(Number(formData.experience))) errs.experience = "Experience is required and must be a number";
            if (!formData.salaryFrom || isNaN(Number(formData.salaryFrom))) errs.salaryFrom = "Desired salary is required and must be a number";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("SUBMIT CLICKED");

        if (!validate()) {
            console.log("Validation failed", errors);
            return;
        }

        if (formData.salaryFrom && formData.salaryTo && Number(formData.salaryFrom) > Number(formData.salaryTo)) {
            setErrors(prev => ({ ...prev, salaryTo: "Salary To must be greater than Salary From" }));
            return;
        }

        if (type === "vacancy" && !formData.skills?.trim()) {
            setErrors(prev => ({ ...prev, skills: "At least one skill is required" }));
            return;
        }

        try {
            let newPost = null;

            if (type === "resume") {
                const res = await api.post("/resumes/create", {
                    profession: formData.profession,
                    experience: Number(formData.experience),
                    experienceDescription: formData.description,
                    skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : [],
                    desiredSalaryFrom: Number(formData.salaryFrom),
                    city: formData.city,
                    workFormat: formData.workFormat,
                });
                newPost = res.data;
            } else if (type === "vacancy") {
                const res = await api.post("/vacancies/create", {
                    profession: formData.profession,
                    workFormat: formData.workFormat,
                    workSchedule: formData.workSchedule,
                    workingHours: formData.workingHours,
                    salaryFrom: formData.salaryFrom ? Number(formData.salaryFrom) : null,
                    salaryTo: formData.salaryTo ? Number(formData.salaryTo) : null,
                    experience: formData.experience ? Number(formData.experience) : null,
                    city: formData.city,
                    description: formData.description,
                    deadLine: formData.deadLine,
                    requiredSkills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : [],
                });
                newPost = res.data;
            }

            alert(`${type === "resume" ? "Resume" : "Vacancy"} created successfully!`);

            if (onPostCreated && newPost?.data) {
                onPostCreated(newPost.data);
            }

            navigate("/profile")
        } catch (err) {
            console.error("BACKEND ERROR:", err.response?.data);
            alert("Error creating post");
        }
    };

    const labelText = (employerText, specialistText) => role === "employer" ? employerText : specialistText;

    return (
        <section className="post">
            <form className="post__form" onSubmit={handleSubmit}>
                <div className="post__content">
                    <div className="post__input-field">

                        <p>
                            <label>{labelText("Vacancy profession", "Profession")}</label>
                            <input type="text" name="profession" value={formData.profession} onChange={handleChange} />
                            {errors.profession && <span className="error">{errors.profession}</span>}
                        </p>

                        <p>
                            <label>{labelText("Work format", "Work format")}</label>
                            <select name="workFormat" value={formData.workFormat} onChange={handleChange}>
                                <option value="">Select</option>
                                {WorkFormat.map(wf => <option key={wf} value={wf}>{wf}</option>)}
                            </select>
                            {errors.workFormat && <span className="error">{errors.workFormat}</span>}
                        </p>

                        {type === "vacancy" && (
                            <>
                                <p>
                                    <label>Work schedule</label>
                                    <select name="workSchedule" value={formData.workSchedule} onChange={handleChange}>
                                        <option value="">Select</option>
                                        {WorkSchedule.map(ws => <option key={ws} value={ws}>{ws}</option>)}
                                    </select>
                                    {errors.workSchedule && <span className="error">{errors.workSchedule}</span>}
                                </p>

                                <p>
                                    <label>Working hours</label>
                                    <select name="workingHours" value={formData.workingHours} onChange={handleChange}>
                                        <option value="">Select</option>
                                        {WorkingHours.map(wh => <option key={wh} value={wh}>{wh}</option>)}
                                    </select>
                                    {errors.workingHours && <span className="error">{errors.workingHours}</span>}
                                </p>

                                <p>
                                    <label>Deadline</label>
                                    <input type="date" name="deadLine" value={formData.deadLine} onChange={handleChange} />
                                    {errors.deadLine && <span className="error">{errors.deadLine}</span>}
                                </p>

                                <p>
                                    <label>Required skills (comma separated)</label>
                                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} />
                                    {errors.skills && <span className="error">{errors.skills}</span>}
                                </p>
                            </>
                        )}

                        <p>
                            <label>City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} />
                            {errors.city && <span className="error">{errors.city}</span>}
                        </p>

                        <p>
                            <label>Experience</label>
                            <input type="text" name="experience" value={formData.experience} onChange={handleChange} />
                            {errors.experience && <span className="error">{errors.experience}</span>}
                        </p>

                        <div className="post__input-cont">
                            <label>{labelText("Promised salary", "Desired salary")}</label>
                            <div>
                                <input placeholder="from" type="text" name="salaryFrom" value={formData.salaryFrom} onChange={handleChange} />
                                <input placeholder="to" type="text" name="salaryTo" value={formData.salaryTo} onChange={handleChange} />
                            </div>
                            {(errors.salaryFrom || errors.salaryTo) && (
                                <span className="error">{errors.salaryFrom || errors.salaryTo}</span>
                            )}
                        </div>


                        <div className="description-cont">
                            <h2>Description</h2>
                            <textarea name="description" value={formData.description} onChange={handleChange} />
                            {errors.description && <span className="error">{errors.description}</span>}
                        </div>
                    </div>
                </div>
                <button type="submit">{type === "resume" ? "Create Resume" : "Create Vacancy"}</button>
            </form>
        </section>
    );
};