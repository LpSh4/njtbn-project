import { useState, useEffect } from "react";
import { api } from "../../api/axios";
import "./NotificationsPage.scss";

export function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllNotifications = async () => {
            try {
                const res = await api.get('/applications');
                setNotifications(res.data.data || []);
            } catch (err) {
                console.error("Ошибка при загрузке откликов", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllNotifications();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/applications/${id}`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error("Ошибка удаления:", err);
            alert("Не удалось удалить отклик");
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="notifications-page">
            <div className="notifications-page__container">
                <h1 className="notifications-page__title">Notifications</h1>

                <div className="notifications-list">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div key={n.id} className="notifications-item">
                                <div className="notifications-item__info">
                                    <h3 className="notifications-item__subject">
                                        {n.profession || "Vacancy Application"}
                                    </h3>
                                    <p className="notifications-item__text">
                                        Status: <span className={`status-${n.status}`}>{n.status}</span>
                                        {n.workFormat && ` • Format: ${n.workFormat}`}
                                    </p>
                                    <span className="notifications-item__date">
                                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Date unknown"}
                                    </span>
                                </div>
                                <div className="notifications-item__actions">
                                    <button className="btn-action delete" onClick={() => handleDelete(n.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="notifications-empty">
                            <p>You have no notifications at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}