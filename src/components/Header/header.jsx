import { useState } from "react";
import "./header.scss";
import { Link, useNavigate } from "react-router-dom";
import logo from "./icons/logo.png";
import menu from "./icons/Menu.png";

export default function Header({ setIsLoginOpen }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const isAuth = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <header className="header">
            <div className="header__element-cont">
                <Link to="/" className="header__img">
                    <img src={logo} alt="" />
                </Link>

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
                        <button onClick={() => navigate("/profile")}>
                            Профиль
                        </button>

                        <button onClick={handleLogout}>
                            Выйти
                        </button>
                    </>
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
                                    <button onClick={() => navigate("/profile")}>
                                        Профиль
                                    </button>
                                </li>

                                <li className="mobile-menu__item">
                                    <button onClick={handleLogout}>
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