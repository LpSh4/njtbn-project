import { useState } from "react";
import { searchResumes, searchVacancies } from "../api/authApi.js";

export const useDeclarations = (type) => {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDeclarations = async (filters = {}) => {
        setLoading(true);

        try {
            const cleaned = Object.fromEntries(
                Object.entries(filters).filter(
                    ([_, v]) => v !== "" && v !== null && v !== undefined
                )
            );

            const res =
                type === "resume"
                    ? await searchResumes(cleaned)
                    : await searchVacancies(cleaned);

            setData(res.data.data || []);
            setMeta(res.data.meta);
        } catch (err) {
            console.error("SEARCH ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    return { data, meta, loading, fetchDeclarations };
};