import "./ProfileProfession.scss";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ProfessionCard } from "../ProfessionCard/ProfessionCard.jsx";
import { api } from "../../api/axios";

export const ProfileProfession = () => {
    const { user, role } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const endpoint =
        role === "specialist"
            ? `/resumes/viewprofile/${user.id}`
            : role === "employer"
                ? `/vacancies/viewprofile/${user.id}`
                : null;

    console.log("Current user ID:", user?.id);
    console.log("Full endpoint:", endpoint);
    useEffect(() => {
        if (!endpoint || !user?.id) return;

        const fetchPosts = async () => {
            try {
                const res = await api.get(endpoint);

                const incomingData = res?.data?.data;

                if (Array.isArray(incomingData)) {
                    setPosts(incomingData);
                } else if (incomingData && typeof incomingData === 'object') {
                    setPosts([incomingData]);
                } else {
                    setPosts([]);
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    setPosts([]);
                } else {
                    console.error("Error fetching posts:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [endpoint, user?.id]);

    const handleCreate = () => {
        if (role === "specialist") {
            navigate("/createResume");
        } else if (role === "employer") {
            navigate("/createVacancy");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <section className="profession">
            <h2>{role === "specialist" ? "Resumes" : "Vacancies"}</h2>

            {posts.length === 0 && <h3>It's empty so far</h3>}

            <section className="profession__cont">
                {posts.map((post) => (
                    <ProfessionCard key={post.id} data={post} role={role} />
                ))}
            </section>

            <button onClick={handleCreate}>
                {role === "specialist" ? "Add Resume" : "Add Vacancy"}
            </button>
        </section>
    );
};