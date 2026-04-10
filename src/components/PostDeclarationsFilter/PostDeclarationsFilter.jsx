import "./PostDeclarationsFilter.scss";
import { useState } from "react";

export const PostDeclarationsFilter = ({ onSubmit, type }) => {

    const [filters, setFilters] = useState({
        sortBy: "",
        salaryFrom: "",
        salaryTo: "",
        workFormat: "",
        expFrom: "",
        expTo: "",
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

        let payload = {};

        if (filters.sortBy) payload.sortBy = filters.sortBy;
        if (filters.workFormat) payload.workFormat = filters.workFormat;
        if (filters.city) payload.city = filters.city;

        if (type === "vacancy") {
            if (filters.salaryFrom) payload.salaryFrom = Number(filters.salaryFrom);
        }

        if (type === "resume") {
            if (filters.salaryFrom) payload.desiredSalaryFrom = Number(filters.salaryFrom);
        }

        if (filters.expFrom) payload.expFrom = Number(filters.expFrom);
        if (filters.expTo) payload.expTo = Number(filters.expTo);

        if (filters.workSchedule) payload.workSchedule = filters.workSchedule;
        if (filters.workingHours) payload.workingHours = filters.workingHours;

        if (filters.education) {
            payload.educations = [filters.education];
        }

        onSubmit(payload);
    };

    return (
        <form className="search-filter" onSubmit={handleSubmit}>
            <div className="search-filter__text-cont">
                <h2>Filters</h2>

                <div className="search-filter__input-cont">

                    <p>
                        <label>Sort by:</label>
                        <select name="sortBy" onChange={handleChange}>
                            <option value="most_paid">Salary ↑</option>
                            <option value="least_paid">Salary ↓</option>
                            <option value="fresh">Newest</option>
                        </select>
                    </p>

                    <div className="search-filter__input-field">
                        <label>Wage $</label>
                        <p>
                            <input name="salaryFrom" type="number" onChange={handleChange} />
                            <input name="salaryTo" type="number" onChange={handleChange} />
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

                    <div className="search-filter__input-field">
                        <label>Experience</label>
                        <p>
                            <input name="expFrom" type="number" onChange={handleChange} />
                            <input name="expTo" type="number" onChange={handleChange} />
                        </p>
                    </div>

                    <p>
                        <label>Working schedule</label>
                        <select name="workSchedule" onChange={handleChange}>
                            <option value="">---</option>
                            <option value="5/2">5/2</option>
                            <option value="2/2">2/2</option>
                            <option value="flexible">Flexible</option>
                            <option value="negotiable">Negotiable</option>
                        </select>
                    </p>

                    <p>
                        <label>Working hours</label>
                        <select name="workingHours" onChange={handleChange}>
                            <option value="">---</option>
                            <option value="8">8</option>
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="negotiable">Negotiable</option>
                        </select>
                    </p>

                    <p>
                        <label>Region</label>
                        <select name="city" onChange={handleChange}>
                            <option value="">---</option>
                            <option value="Moscow">Moscow</option>
                            <option value="Saint Petersburg">Saint Petersburg</option>
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
    );
};