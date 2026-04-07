import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import "./header.scss";
import logo from "./icons/logo.png";
import menu from "./icons/Menu.png";
import { Link, useNavigate, useLocation } from "react-router-dom";


export default function Header({ setIsLoginOpen }) {



    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const { isAuth, logout } = useContext(AuthContext);
    const location = useLocation();
    const isProfilePage =
        location.pathname === "/profile" ||
        location.pathname === "/profileEmployer" ||
        location.pathname === "/profileSpecialist";
    const handleLogout = () => {
        logout();
        navigate("/");
    };


    return (
        <header className="header">
            <div className="header__element-cont">

                <div className="header__img">
                    <img src={logo} alt="" />
                </div>
                <nav className="header__nav">
                    <ul className="header__list">
                        <li><a href="">О компании</a></li>
                        <li><a href="">Партнёрам</a></li>
                        <li><a href="">Требования к ПО</a></li>
                    </ul>
                </nav>
            </div>

            <div className="header__url">
                {!isAuth ? (
                    <button onClick={() => setIsLoginOpen(true)}>
                        Войти
                    </button>
                ) : (
                    <>
                        {!isProfilePage && (
                                <button onClick={() => navigate("/profile")}>
                                    Профиль
                                </button>
                        )}
                        <button onClick={handleLogout}>Выйти</button>                    </>
                )}
            </div>

            <div className="burger">
                <button
                    className="burger__btn"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <img src={menu} alt="" />
                </button>

                <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
                    <ul className="mobile-menu__list">

                        {!isAuth ? (
                            <li className="mobile-menu__item">
                                <button onClick={() => setIsLoginOpen(true)}>
                                    Войти
                                </button>
                            </li>
                        ) : (
                            <>
                                <li className="mobile-menu__item">
                                    {location.pathname !== "/profile" && (
                                        <button onClick={() => navigate("/profile")}>
                                            Профиль
                                        </button>
                                    )}
                                </li>

                                <li className="mobile-menu__item">
                                    <button onClick={logout}>
                                        Выйти
                                    </button>
                                </li>
                            </>
                        )}

                        <li className="mobile-menu__item"><a href="">О компании</a></li>
                        <li className="mobile-menu__item"><a href="">Партнёрам</a></li>
                        <li className="mobile-menu__item"><a href="">Требования к ПО</a></li>
                    </ul>
                </div>
            </div>
        </header>
    );
}