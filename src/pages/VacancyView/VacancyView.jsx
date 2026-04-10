import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { PostView } from "../../components/PostView/postView.jsx";


export const VacancyView = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const res = await api.get(`/vacancies/${id}`);
                setData(res.data.data);
            } catch (e) {
                console.error(e);
            }
        };

        fetchVacancy();
    }, [id]);

    if (!data) return <p>Loading...</p>;

    return <PostView data={data} type="vacancy" />;
};