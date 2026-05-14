import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import "./header.scss";
import logo from "./icons/logo.png";
import menu from "./icons/Menu.png";
import notification from "./icons/notification.png";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../api/axios";

export default function Header({ setIsLoginOpen }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const navigate = useNavigate();
    const { isAuth, logout, role } = useContext(AuthContext);

    const currentRole = role?.replace(/"/g, '') || "";

    useEffect(() => {
        if (isAuth && isNotifOpen) {
            api.get('/applications')
                .then(res => setNotifications(res.data.data?.slice(0, 5) || []))
                .catch(err => console.log("Ошибка загрузки уведомлений:", err));
        }
    }, [isNotifOpen, isAuth]);

    const location = useLocation();

    const isProfilePage = ["/profile", "/profileEmployer", "/profileSpecialist"].includes(location.pathname);
    const isSearchPage = ["/resumes", "/vacancies"].includes(location.pathname);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate("/");
    };

    const handleMobileNav = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <header className="header">
            <div className="header__element-cont">
                <div className="header__img">
                    <img src={logo} alt="logo" />
                </div>
            </div>

            {}
            <div className="header__url">
                {!isAuth ? (
                    <button onClick={() => setIsLoginOpen(true)}>SignIn</button>
                ) : (
                    <>
                        <div className="header__notification-wrapper" style={{ position: 'relative' }}>
                            <div className="header__notification" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                                <img style={{ width: "25px", cursor: "pointer" }} src={notification} alt="Notifications" />
                                {notifications.length > 0 && <span className="notif-count">{notifications.length}</span>}
                            </div>

                            {isNotifOpen && (
                                <div className="header__notif-modal">
                                    <div className="notif-modal__header">Recent Applications</div>
                                    <div className="notif-modal__content">
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <div key={n.id} className="notif-modal__item" onClick={() => { navigate("/notifications"); setIsNotifOpen(false); }}>
                                                    <p>{n.profession || "Application"}</p>
                                                    <span>{n.status}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="notif-empty">No notifications</p>
                                        )}
                                    </div>
                                    <button className="notif-modal__all-btn" onClick={() => { navigate("/notifications"); setIsNotifOpen(false); }}>
                                        See all
                                    </button>
                                </div>
                            )}
                        </div>

                        {currentRole === "specialist" && !isSearchPage && (
                            <button onClick={() => navigate("/vacancies")}>Vacancy</button>
                        )}
                        {currentRole === "employer" && !isSearchPage && (
                            <button onClick={() => navigate("/resumes")}>Resume</button>
                        )}
                        {!isProfilePage && (
                            <button onClick={() => navigate("/profile")}>Profile</button>
                        )}
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>

            {}
            <div className="burger">
                {isAuth && (
                    <div className="header__notification" onClick={() => navigate("/notifications")}>
                        <img style={{ width: "25px" }} src={notification} alt="Notifications" />
                    </div>
                )}
                <button className="burger__btn" onClick={() => setIsOpen(!isOpen)}>
                    <img src={menu} alt="menu" />
                </button>

                <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
                    <ul className="mobile-menu__list">
                        {!isAuth ? (
                            <li className="mobile-menu__item">
                                <button onClick={() => { setIsLoginOpen(true); setIsOpen(false); }}>SignIn</button>
                            </li>
                        ) : (
                            <>
                                {}
                                {currentRole === "specialist" && !isSearchPage && (
                                    <li className="mobile-menu__item">
                                        <button onClick={() => handleMobileNav("/vacancies")}>Vacancy</button>
                                    </li>
                                )}
                                {currentRole === "employer" && !isSearchPage && (
                                    <li className="mobile-menu__item">
                                        <button onClick={() => handleMobileNav("/resumes")}>Resume</button>
                                    </li>
                                )}

                                {}
                                {!isProfilePage && (
                                    <li className="mobile-menu__item">
                                        <button onClick={() => handleMobileNav("/profile")}>Profile</button>
                                    </li>
                                )}

                                <li className="mobile-menu__item">
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}