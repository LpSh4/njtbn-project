import "./ProfileProfession.scss";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ProfessionCard } from "../ProfessionCard/ProfessionCard.jsx";
import { api } from "../../api/axios";

export const ProfileProfession = () => {
    const { user: currentUser, role: currentRole } = useContext(AuthContext);
    const { id: profileId } = useParams();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [targetRole, setTargetRole] = useState(null);
    const navigate = useNavigate();

    const effectiveId = profileId || currentUser?.id;
    const isOwnProfile = !profileId || (currentUser?.id && profileId === currentUser.id);

    const handleCreate = () => {
        if (currentRole === "specialist") navigate("/createResume");
        else if (currentRole === "employer") navigate("/createVacancy");
    };

    useEffect(() => {
        const getProfileInfo = async () => {
            if (!effectiveId) return;
            setLoading(true);
            try {
                let roleToUse = null;

                if (!isOwnProfile) {
                    const userRes = await api.get(`/users/${effectiveId}`);
                    roleToUse = userRes.data?.data?.role;
                } else {
                    roleToUse = currentRole;
                }

                setTargetRole(roleToUse);

                if (!roleToUse) {
                    setLoading(false);
                    return;
                }

                const endpoint = roleToUse === "specialist"
                    ? `/resumes/viewprofile/${effectiveId}`
                    : `/vacancies/viewprofile/${effectiveId}`;

                const res = await api.get(endpoint);
                const incomingData = res?.data?.data;

                if (Array.isArray(incomingData)) {
                    setPosts(incomingData);
                } else if (incomingData && typeof incomingData === 'object') {
                    const actualData = incomingData.resumes || incomingData.vacancies ||
                        incomingData.resume || incomingData.vacancy || incomingData;
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

        getProfileInfo();
    }, [effectiveId, isOwnProfile, currentRole]);

    if (loading) return <p className="loader">Loading posts...</p>;

    return (
        <section className="profession">
            <h2>{targetRole === "specialist" ? "Resumes" : "Vacancies"}</h2>

            {posts.length === 0 ? (
                <h3>It's empty so far</h3>
            ) : (
                <section className="profession__cont">
                    {posts.map((post, idx) => (
                        <ProfessionCard
                            key={post.id || idx}
                            data={{
                                ...post,
                                city: post.city || "Unknown",
                            }}
                            role={targetRole}
                        />
                    ))}
                </section>
            )}

            {isOwnProfile && currentRole && (
                <button onClick={handleCreate}>
                    {currentRole === "specialist" ? "Add Resume" : "Add Vacancy"}
                </button>
            )}
        </section>
    );
};