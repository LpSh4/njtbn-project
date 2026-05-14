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
        console.log("=== ПОПЫТКА УДАЛЕНИЯ ОТКЛИКА ===");
        console.log("Переданный ID:", id);

        if (!id) {
            console.warn("Внимание: ID равен undefined!");
            alert("Ошибка: не удалось определить ID отклика для удаления");
            return;
        }

        try {
            const response = await api.delete(`/applications/${id}`);
            console.log("Ответ сервера на удаление:", response.data);

            setNotifications(notifications.filter(n => n.id !== id && n._id !== id));
            alert("Отклик успешно удален");
        } catch (err) {
            console.error("Полная ошибка удаления:", err);
            console.error("Статус ответа сервера:", err.response?.status);
            console.error("Данные ошибки от сервера:", err.response?.data);
            alert(`Не удалось удалить отклик: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="notifications-page">
            <div className="notifications-page__container">
                <h1 className="notifications-page__title">Notifications</h1>

                <div className="notifications-list">
                    {notifications.length > 0 ? (
                        notifications.map((n) => {
                            const targetId = n.id || n._id || n.applicationId;

                            return (
                                <div key={targetId} className="notifications-item">
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
                                        {/* ПЕРЕДАЕМ ВЫЧИСЛЕННЫЙ targetId ВМЕСТО СТАРOГO n.id */}
                                        <button className="btn-action delete" onClick={() => handleDelete(targetId)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })
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