import "./header.scss";
import {Link} from "react-router-dom";
import logo from "./icons/logo.png";
import bell from "./icons/Bell.png";
import fav from "./icons/fav-icon.png";
import chat from "./icons/chat-thing.png";

export default function Header() {
    return (
        <header className="header">
            <div className="header__logo">

                <a className="header__img"><img src={logo} alt=""/></a>
                <nav className="header__nav">
                    <ul className="header__list">
                        <li className="header__list-item">
                            <a style={{fontSize:"20px"}} href="">О компании</a>
                        </li>
                        <li className="header__list-item">
                            <a style={{fontSize:"20px"}} href="">Партнёрам</a>
                        </li>
                        <li className="header__list-item">
                            <a style={{fontSize:"20px"}} href="">Требования к ПО</a>
                        </li>
                    </ul>
                </nav>

            </div>
            <div className="header__url">
                <a href="">Войти</a>
            </div>
        </header>
    )
}