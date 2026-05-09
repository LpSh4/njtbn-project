import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { PostView } from "../../components/PostView/postView";

export const ResumeView = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await api.get(`/resumes/${id}`);

                const raw = res.data?.data || res.data;

                if (!raw) {
                    setError(true);
                    return;
                }

                const normalized = raw.resume
                    ? { ...raw.resume, ...raw.user }
                    : raw;

                setData(normalized);
            } catch (e) {
                console.error("Ошибка при получении резюме:", e);
                setError(true);
            }
        };

        if (id) fetchResume();
    }, [id]);

    if (error) return <p className="error-404">Error 404 not found</p>;
    if (!data) return <p className="loader">Loading...</p>;

    return <PostView data={data} type="resume" />;
};