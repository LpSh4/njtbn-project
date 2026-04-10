import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { PostView } from "../../components/PostView/PostView";

export const ResumeView = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await api.get(`/resumes/${id}`);

                const raw = res.data.data;

                const normalized = raw.resume
                    ? {
                        ...raw.resume,
                        ...raw.user
                    }
                    : raw;

                setData(normalized);
            } catch (e) {
                console.error(e);
            }
        };

        fetchResume();
    }, [id]);

    if (!data) return <p>Loading...</p>;

    return <PostView data={data} type="resume" />;
};