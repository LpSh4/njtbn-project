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
            ? `/resumes/viewprofile/${user?.id}`
            : role === "employer"
                ? `/vacancies/viewprofile/${user?.id}`
                : null;

    const handleCreate = () => {
        if (role === "specialist") {
            navigate("/createResume");
        } else if (role === "employer") {
            navigate("/createVacancy");
        }
    };

    useEffect(() => {
        if (!user?.id || !endpoint) return;

        const fetchPosts = async () => {
            try {
                const res = await api.get(endpoint);
                const incomingData = res?.data?.data;

                console.log("RAW DATA FROM BACKEND:", incomingData);

                if (Array.isArray(incomingData)) {
                    setPosts(incomingData);
                } else if (incomingData && typeof incomingData === 'object') {
                    const actualData = incomingData.resume || incomingData.vacancy || incomingData;
                    setPosts(Array.isArray(actualData) ? actualData : [actualData]);
                } else {
                    setPosts([]);
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [endpoint, user?.id]);

    if (!user?.id && loading) return <p>Loading user data...</p>;
    if (loading) return <p>Loading posts...</p>;

    return (
        <section className="profession">
            <h2>{role === "specialist" ? "Resumes" : "Vacancies"}</h2>

            {posts.length === 0 ? (
                <h3>It's empty so far</h3>
            ) : (
                <section className="profession__cont">
                    {posts.map((post, idx) => (
                        <ProfessionCard
                            key={post.id || idx}
                            data={{
                                ...post,
                                city: post.city || user.city || "Unknown",
                                experience: post.experience ?? post.exp ?? user.experience ?? user.exp
                            }}
                            role={role}
                        />
                    ))}
                </section>
            )}

            <button onClick={handleCreate}>
                {role === "specialist" ? "Add Resume" : "Add Vacancy"}
            </button>
        </section>
    );
};