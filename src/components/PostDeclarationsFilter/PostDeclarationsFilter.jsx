import { useState } from "react";
import "./PostDeclarationsFilter.scss";

export const PostDeclarationsFilter = ({ onSubmit, type }) => {
    const [filters, setFilters] = useState({
        sortBy: "fresh",
        salaryFrom: "",
        salaryTo: "",
        workFormat: "",
        expFrom: "",
        expTo: "",
        city: "",
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

        const payload = {};
        Object.keys(filters).forEach(key => {
            if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
                if (["salaryFrom", "salaryTo", "expFrom", "expTo"].includes(key)) {
                    payload[key] = Number(filters[key]);
                } else {
                    payload[key] = filters[key];
                }
            }
        });

        console.log("=== ОТПРАВКА ФИЛЬТРОВ НА СЕРВЕР ===");
        console.log("Сформированный payload:", payload);

        onSubmit(payload);
    };

    return (
        <form className="search-filter" onSubmit={handleSubmit}>
            <div className="search-filter__text-cont">
                <h2>Filters</h2>
                <div className="search-filter__input-cont">

                    <p>
                        <label>Sort by:</label>
                        <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
                            <option value="fresh">Newest</option>
                            <option value="most_paid">Salary ↑</option>
                            <option value="least_paid">Salary ↓</option>
                            <option value="most_popular">Popular ↑</option>
                        </select>
                    </p>

                    <div className="search-filter__input-field">
                        <label>Wage $</label>
                        <div className="search-filter__inputs-row">
                            {}
                            <input name="salaryFrom" value={filters.salaryFrom} placeholder="From" type="number" onChange={handleChange} />
                            <input name="salaryTo" value={filters.salaryTo} placeholder="To" type="number" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="search-filter__input-field">
                        <label>Experience (years)</label>
                        <div className="search-filter__inputs-row">
                            {}
                            <input name="expFrom" value={filters.expFrom} placeholder="From" type="number" onChange={handleChange} />
                            <input name="expTo" value={filters.expTo} placeholder="To" type="number" onChange={handleChange} />
                        </div>
                    </div>

                    <p>
                        <label>Job format</label>
                        {}
                        <select name="workFormat" value={filters.workFormat} onChange={handleChange}>
                            <option value="">Any</option>
                            <option value="remote">Remote</option>
                            <option value="office">Office</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </p>

                    <p className="city">
                        <label>City</label>
                        {}
                        <input
                            name="city"
                            value={filters.city}
                            type="text"
                            placeholder="Enter city"
                            onChange={handleChange}
                        />
                    </p>
                </div>
            </div>
            <button type="submit">Apply Filters</button>
        </form>
    );
};