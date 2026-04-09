import "./PostDeclarationsFilter.scss";
import { useState } from "react";

export const PostDeclarationsFilter = ({ onSubmit, type }) => {

    const [filters, setFilters] = useState({
        sort: "",
        salaryFrom: "",
        salaryTo: "",
        workFormat: "",
        experienceFrom: "",
        experienceTo: "",
        workSchedule: "",
        workingHours: "",
        city: "",
        education: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let payload = {
            workFormat: filters.workFormat,
            city: filters.city,
        };

        if (type === "vacancy") {
            payload.salaryFrom = filters.salaryFrom;
            payload.salaryTo = filters.salaryTo;
        }

        if (type === "resume") {
            payload.desiredSalaryFrom = filters.salaryFrom;
        }

        if (filters.experienceFrom) payload.experienceFrom = Number(filters.experienceFrom);
        if (filters.experienceTo) payload.experienceTo = Number(filters.experienceTo);

        if (filters.workSchedule) payload.workSchedule = filters.workSchedule;
        if (filters.workingHours) payload.workingHours = filters.workingHours;
        if (filters.education) payload.educations = [filters.education];

        payload = Object.fromEntries(
            Object.entries(payload).filter(
                ([_, v]) => v !== "" && v !== null && v !== undefined
            )
        );

        onSubmit(payload);
    };

    return (
        <>
            <form className="search-filter" onSubmit={handleSubmit}>
                <div className="search-filter__text-cont">
                    <h2>Filters</h2>

                    <div className="search-filter__input-cont">
                        <p>
                            <label>Sort by:</label>
                            <select name="sort" onChange={handleChange}>
                                <option value="">---</option>
                                <option value="salary_asc">Salary ↑</option>
                                <option value="salary_desc">Salary ↓</option>
                            </select>
                        </p>

                        <div className="search-filter__input-field">
                            <label>Wage $</label>
                            <p>
                                <input
                                    name="salaryFrom"
                                    placeholder="From"
                                    type="number"
                                    onChange={handleChange}
                                />
                                <input
                                    name="salaryTo"
                                    placeholder="To"
                                    type="number"
                                    onChange={handleChange}
                                />
                            </p>
                        </div>

                        <p>
                            <label>Job format</label>
                            <select name="workFormat" onChange={handleChange}>
                                <option value="">---</option>
                                <option value="remote">Remote</option>
                                <option value="office">Office</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </p>

                        <div  className="search-filter__input-field">
                            <label>Experience</label>
                            <p>
                                <input
                                    name="experienceFrom"
                                    placeholder="From"
                                    type="number"
                                    onChange={handleChange}
                                />
                                <input
                                    name="experienceTo"
                                    placeholder="To"
                                    type="number"
                                    onChange={handleChange}
                                />
                            </p>
                        </div>

                        <p>
                            <label>Working schedule</label>
                            <select name="workSchedule" onChange={handleChange}>
                                <option value="">---</option>
                                <option value="fulltime">Full-time</option>
                                <option value="parttime">Part-time</option>
                            </select>
                        </p>

                        <p>
                            <label>Working hours</label>
                            <select name="workingHours" onChange={handleChange}>
                                <option value="">---</option>
                                <option value="day">Day</option>
                                <option value="night">Night</option>
                            </select>
                        </p>

                        <p>
                            <label>Region</label>
                            <select name="city" onChange={handleChange}>
                                <option value="">---</option>
                                <option value="Moscow">Moscow</option>
                                <option value="SPB">Saint Petersburg</option>
                            </select>
                        </p>

                        <p>
                            <label>Education level</label>
                            <select name="education" onChange={handleChange}>
                                <option value="">---</option>
                                <option value="BACHELOR">Bachelor</option>
                                <option value="MASTER">Master</option>
                            </select>
                        </p>
                    </div>
                </div>

                <button type="submit">Submit</button>
            </form>
        </>
    );
};