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
    const [error, setError] = useState(null); // Добавили стейт для ошибок
    const navigate = useNavigate();

    const effectiveId = profileId || currentUser?.id;
    const isOwnProfile = !profileId || (currentUser?.id && profileId === currentUser.id);

    const handleCreate = () => {
        if (currentRole === "specialist") navigate("/createResume");
        else if (currentRole === "employer") navigate("/createVacancy");
    };

    useEffect(() => {
        const fetchProfileContent = async () => {
            if (!effectiveId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                let roleToUse = null;

                if (!isOwnProfile) {
                    try {
                        const userRes = await api.get(`/users/${effectiveId}`);
                        roleToUse = userRes.data?.data?.role || userRes.data?.role;

                        if (!roleToUse) throw new Error("Role not found in user data");
                    } catch (err) {
                        console.error("Ошибка при получении роли пользователя:", err);
                        setError("Пользователь не найден или сервер не отвечает");
                        setLoading(false);
                        return;
                    }
                } else {
                    roleToUse = currentRole;
                }

                setTargetRole(roleToUse);

                if (roleToUse) {
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
                }
            } catch (err) {
                console.error("Ошибка при загрузке контента профиля:", err);
                setPosts([]);
                if (err.response?.status !== 404) {
                    setError("Ошибка загрузки данных");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileContent();
    }, [effectiveId, isOwnProfile, currentRole]);

    if (loading) return <div className="loader-cont"><p className="loader">Загрузка данных...</p></div>;

    if (error) return (
        <section className="profession">
            <div className="error-message">
                <h3>{error}</h3>
                <p>Проверьте правильность ссылки или состояние сервера.</p>
            </div>
        </section>
    );

    return (
        <section className="profession">
            <h2>{targetRole === "specialist" ? "Resume" : "Vacancy"}</h2>

            {posts.length === 0 ? (
                <div className="empty-state">
                    <h3>Здесь пока пусто</h3>
                    {isOwnProfile && <p>Создайте вашу первую запись!</p>}
                </div>
            ) : (
                <section className="profession__cont">
                    {posts.map((post, idx) => (
                        <ProfessionCard
                            key={post.id || idx}
                            data={{
                                ...post,
                                city: post.city || "Не указан",
                            }}
                            role={targetRole}
                        />
                    ))}
                </section>
            )}

            {isOwnProfile && currentRole && (
                <button className="create-btn" onClick={handleCreate}>
                    {currentRole === "specialist" ? "Create" : "Create  "}
                </button>
            )}
        </section>
    );
};