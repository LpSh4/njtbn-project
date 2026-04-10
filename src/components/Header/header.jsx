import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import "./header.scss";
import logo from "./icons/logo.png";
import menu from "./icons/Menu.png";
import { Link, useNavigate, useLocation } from "react-router-dom";


export default function Header({ setIsLoginOpen }) {



    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();


    const { isAuth, logout, role } = useContext(AuthContext);

    const location = useLocation();
    const isProfilePage =
        location.pathname === "/profile" ||
        location.pathname === "/profileEmployer" ||
        location.pathname === "/profileSpecialist";
    const isSearchPage =
        location.pathname === "/resumes" ||
        location.pathname === "/vacancies";
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

                    </ul>
                </nav>
            </div>

            <div className="header__url">
                {!isAuth ? (
                    <button onClick={() => setIsLoginOpen(true)}>SignIn</button>
                ) : (
                    <>
                        {role === "specialist" && !isSearchPage && (
                            <button onClick={() => navigate("/vacancies")}>Vacancy</button>
                        )}
                        {role === "employer" && !isSearchPage && (
                            <button onClick={() => navigate("/resumes")}>Resume</button>
                        )}

                        {!isProfilePage && (
                            <button onClick={() => navigate("/profile")}>Profile</button>
                        )}

                        <button onClick={handleLogout}>Logout</button>
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
                                <button onClick={() => setIsLoginOpen(true)}>SignIn</button>
                            </li>
                        ) : (
                            <>
                                {role === "specialist" && (
                                    <li className="mobile-menu__item">
                                        <button onClick={() => navigate("/vacancies")}>Vacancy</button>
                                    </li>
                                )}
                                {role === "employer" && (
                                    <li className="mobile-menu__item">
                                        <button onClick={() => navigate("/resumes")}>Resume</button>
                                    </li>
                                )}

                                {!isProfilePage && (
                                    <li className="mobile-menu__item">
                                        <button onClick={() => navigate("/profile")}>Profile</button>
                                    </li>
                                )}

                                <li className="mobile-menu__item">
                                    <button onClick={logout}>Logout</button>
                                </li>
                            </>
                        )}

                       
                    </ul>
                </div>
            </div>
        </header>
    );
}