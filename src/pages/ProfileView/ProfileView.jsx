import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostViewProfile } from "../../components/PostViewProfile/PostViewProfile.jsx";
import { PostDeclarationsCard } from "../../components/PostDeclarationsCard/PostDeclarationsCard.jsx";
import "./ProfileView.scss";

export const ProfileView = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                
                const userRes = await fetch(`/api/users/${id}`);
                const userData = await userRes.json();
                const currentUser = userData.data;
                setUser(currentUser);


                let postsUrl = "";
                if (currentUser.role === "specialist") {
                    postsUrl = `/api/resumes/viewprofile/${id}`;
                } else {
                    postsUrl = `/api/vacancies/viewprofile/${id}`;
                }

                const postsRes = await fetch(postsUrl);
                const postsData = await postsRes.json();

                setPosts(postsData.data || []);

            } catch (error) {
                console.error("Ошибка загрузки:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    if (loading) return <div className="loader">Loading profile...</div>;
    if (!user) return <div className="error">User not found</div>;

    return (
        <main className="profile-view">
            <div className="profile-view__container">
                {}
                <div className="profile-view__main">
                    <section className="profile-view__bio">
                        <div className="profile-view__description">
                            <h3>Description:</h3>
                            <p>{user.description || "No description provided."}</p>
                        </div>

                        {user.role === "specialist" && user.educations && (
                            <div className="profile-view__extra">
                                <h3>Education</h3>
                                <ul>
                                    {user.educations.map((edu, i) => <li key={i}>{edu}</li>)}
                                </ul>
                            </div>
                        )}
                    </section>

                    <section className="profile-view__posts">
                        <h2>{user.role === "employer" ? "Active Vacancies" : "Resumes"}</h2>
                        <div className="profile-view__grid">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <PostDeclarationsCard
                                        key={post.id}
                                        data={post}
                                        type={user.role === "employer" ? "vacancy" : "resume"}
                                    />
                                ))
                            ) : (
                                <p>No publications yet.</p>
                            )}
                        </div>
                    </section>
                </div>

                {}
                <aside className="profile-view__sidebar">
                    <PostViewProfile data={user} type={user.role === "employer" ? "vacancy" : "resume"} />
                </aside>
            </div>
        </main>
    );
};